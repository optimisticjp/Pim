import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    ...corsHeaders,
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  },
});

const validPassword = (value: string) =>
  value.length >= 10 && value.length <= 128 && /\S/.test(value);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authorization = req.headers.get("Authorization");
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !authorization) {
    return json({ error: "Unauthorized" }, 401);
  }

  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: userData, error: userError } = await caller.auth.getUser();
  if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

  const service = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const body = await req.json().catch(() => null) as null | Record<string, unknown>;
  const action = String(body?.action ?? "");

  if (action === "complete_invite") {
    const password = String(body?.password ?? "");
    if (!validPassword(password)) {
      return json({ error: "Password must be between 10 and 128 characters" }, 400);
    }

    const { data: profile, error: profileError } = await service
      .from("admin_profiles")
      .select("id,is_super_admin,status,password_set_at,deleted_at")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError) return json({ error: profileError.message }, 500);
    if (!profile || profile.is_super_admin || profile.deleted_at) {
      return json({ error: "This staff invitation is not active" }, 403);
    }
    if (profile.status !== "invited") {
      return json({ error: profile.status === "active" ? "Account is already active" : "Account is not eligible for setup" }, 409);
    }

    const { data: invitation, error: invitationError } = await service
      .from("admin_invitations")
      .select("id,status,expires_at")
      .eq("auth_user_id", userData.user.id)
      .in("status", ["pending", "sent"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (invitationError) return json({ error: invitationError.message }, 500);
    if (!invitation) {
      if (profile.password_set_at) return json({ ok: true, pending_approval: true });
      return json({ error: "Invitation is not available" }, 410);
    }
    if (new Date(invitation.expires_at).getTime() < Date.now()) {
      await service.from("admin_invitations").update({ status: "expired" }).eq("id", invitation.id);
      return json({ error: "Invitation has expired. Ask the main admin to invite you again." }, 410);
    }

    const { error: passwordError } = await service.auth.admin.updateUserById(
      userData.user.id,
      { password },
    );
    if (passwordError) return json({ error: passwordError.message }, 400);

    const now = new Date().toISOString();
    const { error: updateProfileError } = await service
      .from("admin_profiles")
      .update({ password_set_at: now })
      .eq("id", userData.user.id);
    if (updateProfileError) return json({ error: updateProfileError.message }, 500);

    const { error: acceptError } = await service
      .from("admin_invitations")
      .update({ status: "accepted", accepted_at: now, error_message: null })
      .eq("id", invitation.id);
    if (acceptError) return json({ error: acceptError.message }, 500);

    await service.from("audit_logs").insert({
      actor_user_id: userData.user.id,
      action: "staff.password_set",
      entity_type: "admin_profile",
      entity_id: userData.user.id,
      metadata: { invitation_id: invitation.id, pending_approval: true },
    });

    return json({ ok: true, pending_approval: true });
  }

  if (action === "delete_staff") {
    const { data: callerProfile } = await service
      .from("admin_profiles")
      .select("id,is_super_admin,status,deleted_at")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (!callerProfile || callerProfile.status !== "active" || callerProfile.deleted_at || !callerProfile.is_super_admin) {
      return json({ error: "Super Admin required" }, 403);
    }

    const targetId = String(body?.target_id ?? "").trim();
    if (!targetId || targetId === userData.user.id) {
      return json({ error: "Invalid staff account" }, 400);
    }

    const { data: target, error: targetError } = await service
      .from("admin_profiles")
      .select("id,display_name,is_super_admin,status,deleted_at")
      .eq("id", targetId)
      .maybeSingle();

    if (targetError) return json({ error: targetError.message }, 500);
    if (!target || target.deleted_at) return json({ error: "Staff account not found" }, 404);
    if (target.is_super_admin) return json({ error: "The Super Admin cannot be deleted" }, 409);

    const now = new Date().toISOString();
    const { error: tombstoneError } = await service
      .from("admin_profiles")
      .update({
        status: "suspended",
        deleted_at: now,
        deleted_by: userData.user.id,
      })
      .eq("id", targetId);
    if (tombstoneError) return json({ error: tombstoneError.message }, 500);

    await service.from("admin_role_assignments").delete().eq("admin_id", targetId);
    await service
      .from("admin_invitations")
      .update({ status: "revoked", error_message: "Staff account removed by Super Admin" })
      .eq("auth_user_id", targetId)
      .in("status", ["pending", "sent", "accepted"]);

    const { error: banError } = await service.auth.admin.updateUserById(targetId, {
      ban_duration: "876000h",
    });

    await service.from("audit_logs").insert({
      actor_user_id: userData.user.id,
      action: banError ? "staff.delete_auth_ban_failed" : "staff.delete",
      entity_type: "admin_profile",
      entity_id: targetId,
      old_data: { display_name: target.display_name, status: target.status },
      new_data: { status: "suspended", deleted_at: now },
      metadata: {
        auth_identity_retained_for_history: true,
        auth_user_banned: !banError,
        auth_ban_error: banError?.message ?? null,
      },
    });

    return json({
      ok: true,
      access_revoked: true,
      auth_user_banned: !banError,
    });
  }

  return json({ error: "Unsupported action" }, 400);
});
