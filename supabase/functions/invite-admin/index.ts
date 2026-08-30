import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8" },
});

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("Authorization");
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) return json({ error: "Unauthorized" }, 401);

  const caller = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: userData, error: userError } = await caller.auth.getUser();
  if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

  const service = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: profile } = await service.from("admin_profiles").select("id,is_super_admin,status").eq("id", userData.user.id).maybeSingle();
  if (!profile || profile.status !== "active" || !profile.is_super_admin) return json({ error: "Super Admin required" }, 403);

  const body = await req.json().catch(() => null) as null | Record<string, unknown>;
  const email = String(body?.email ?? "").trim().toLowerCase();
  const displayName = String(body?.display_name ?? "").trim();
  const roleId = String(body?.role_id ?? "").trim() || null;
  const scopeType = ["global", "ashram", "module"].includes(String(body?.scope_type)) ? String(body?.scope_type) : "global";
  const scopeKey = String(body?.scope_key ?? "").trim() || null;
  const redirectTo = String(body?.redirect_to ?? "").trim() || undefined;
  if (!email.includes("@") || !displayName) return json({ error: "Valid email and display name are required" }, 400);

  const [{ count: activeCount }, { count: openInviteCount }] = await Promise.all([
    service.from("admin_profiles").select("id", { count: "exact", head: true }).eq("status", "active"),
    service.from("admin_invitations").select("id", { count: "exact", head: true }).in("status", ["pending", "sent"]),
  ]);
  if ((activeCount ?? 0) + (openInviteCount ?? 0) >= 10) return json({ error: "Maximum admin team size reached" }, 409);

  const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName, pim_admin_invite: true },
    ...(redirectTo ? { redirectTo } : {}),
  });
  if (inviteError || !invited.user) return json({ error: inviteError?.message ?? "Invite failed" }, 400);

  const { error: profileError } = await service.from("admin_profiles").upsert({ id: invited.user.id, display_name: displayName, is_super_admin: false, status: "invited" }, { onConflict: "id" });
  if (profileError) return json({ error: profileError.message }, 500);

  const { data: invitation, error: invitationError } = await service.from("admin_invitations").insert({ email, display_name: displayName, role_id: roleId, scope_type: scopeType, scope_key: scopeKey, status: "sent", invited_by: userData.user.id, auth_user_id: invited.user.id }).select("id,email,status,expires_at").single();
  if (invitationError) return json({ error: invitationError.message }, 500);

  if (roleId) {
    const { error: assignmentError } = await service.from("admin_role_assignments").upsert({ admin_id: invited.user.id, role_id: roleId, scope_type: scopeType, scope_key: scopeKey, assigned_by: userData.user.id }, { onConflict: "admin_id,role_id,scope_type,scope_key", ignoreDuplicates: true });
    if (assignmentError) return json({ error: assignmentError.message }, 500);
  }

  return json({ invitation, admin_id: invited.user.id });
});
