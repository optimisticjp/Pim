import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const DEFAULT_SETUP_URL = "https://pim.essanciaonline.workers.dev/admin/setup";

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
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
  const { data: profile } = await service
    .from("admin_profiles")
    .select("id,is_super_admin,status,deleted_at")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (!profile || profile.status !== "active" || profile.deleted_at || !profile.is_super_admin) {
    return json({ error: "Super Admin required" }, 403);
  }

  const body = await req.json().catch(() => null) as null | Record<string, unknown>;
  const email = String(body?.email ?? "").trim().toLowerCase();
  const displayName = String(body?.display_name ?? "").trim();
  const roleId = String(body?.role_id ?? "").trim() || null;
  const requestedScope = String(body?.scope_type ?? "global");
  const scopeType = requestedScope === "ashram" ? "ashram" : requestedScope === "global" ? "global" : null;
  let scopeKey = String(body?.scope_key ?? "").trim() || null;
  const redirectTo = String(body?.redirect_to ?? "").trim() || DEFAULT_SETUP_URL;

  if (!email.includes("@") || !displayName) return json({ error: "Valid email and display name are required", code: "invalid_input" }, 400);
  if (!scopeType) return json({ error: "Only global or Ashram scope is supported", code: "invalid_scope" }, 400);
  if (scopeType === "global") scopeKey = null;

  if (scopeType === "ashram") {
    if (!scopeKey) return json({ error: "Ashram scope requires an Ashram", code: "invalid_scope" }, 400);
    const { data: ashram } = await service
      .from("ashram_profiles")
      .select("slug")
      .eq("slug", scopeKey)
      .is("archived_at", null)
      .maybeSingle();
    if (!ashram) return json({ error: "Invalid Ashram scope", code: "invalid_scope" }, 400);
  }

  if (roleId) {
    const { data: role } = await service.from("roles").select("id,is_archived").eq("id", roleId).maybeSingle();
    if (!role || role.is_archived) return json({ error: "Invalid role", code: "invalid_role" }, 400);
  }

  const [{ count: activeCount }, { count: openInviteCount }] = await Promise.all([
    service.from("admin_profiles").select("id", { count: "exact", head: true }).eq("status", "active").is("deleted_at", null),
    service.from("admin_invitations").select("id", { count: "exact", head: true }).in("status", ["pending", "sent"]),
  ]);
  if ((activeCount ?? 0) + (openInviteCount ?? 0) >= 10) {
    return json({ error: "Maximum admin team size reached", code: "team_limit" }, 409);
  }

  const { data: usersPage, error: usersError } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) return json({ error: usersError.message, code: "user_lookup_failed" }, 500);
  const existingUser = usersPage.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;

  if (existingUser) {
    const { data: existingProfile, error: existingProfileError } = await service
      .from("admin_profiles")
      .select("id,display_name,is_super_admin,status,password_set_at,approved_at,approved_by,deleted_at,deleted_by")
      .eq("id", existingUser.id)
      .maybeSingle();

    if (existingProfileError) return json({ error: existingProfileError.message, code: "profile_lookup_failed" }, 500);
    if (!existingProfile) {
      return json({ error: "This email already belongs to a non-staff account", code: "account_conflict" }, 409);
    }
    if (existingProfile.is_super_admin) {
      return json({ error: "The Super Admin account cannot be invited as staff", code: "staff_exists" }, 409);
    }
    if (!existingProfile.deleted_at && existingProfile.status !== "suspended") {
      return json({ error: "This staff member already exists", code: "staff_exists" }, 409);
    }

    let delivery: "email" | "manual" = "email";
    let setupLink: string | null = null;
    const { error: recoveryError } = await service.auth.resetPasswordForEmail(email, { redirectTo });
    if (recoveryError) {
      const isEmailRateLimit =
        recoveryError.code === "over_email_send_rate_limit"
        || /email rate limit|rate limit exceeded/i.test(recoveryError.message);

      if (!isEmailRateLimit) {
        return json({ error: recoveryError.message, code: "reinvite_email_failed" }, 400);
      }

      const { data: generated, error: generateError } = await service.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo },
      });
      setupLink = generated?.properties?.action_link ?? null;
      if (generateError || !setupLink) {
        return json({
          error: generateError?.message ?? "Supabase email rate limit reached and setup link generation failed",
          code: "email_rate_limit",
        }, 429);
      }
      delivery = "manual";
    }

    await service
      .from("admin_invitations")
      .update({ status: "revoked", error_message: "Replaced by a newer staff invitation" })
      .eq("auth_user_id", existingUser.id)
      .in("status", ["pending", "sent", "accepted"]);

    const { error: profileError } = await service
      .from("admin_profiles")
      .update({
        display_name: displayName,
        status: "invited",
        password_set_at: null,
        approved_at: null,
        approved_by: null,
        deleted_at: null,
        deleted_by: null,
      })
      .eq("id", existingUser.id);
    if (profileError) return json({ error: profileError.message, code: "profile_restore_failed" }, 500);

    const { error: clearRolesError } = await service.from("admin_role_assignments").delete().eq("admin_id", existingUser.id);
    if (clearRolesError) return json({ error: clearRolesError.message, code: "role_reset_failed" }, 500);

    const { data: invitation, error: invitationError } = await service.from("admin_invitations").insert({
      email,
      display_name: displayName,
      role_id: roleId,
      scope_type: scopeType,
      scope_key: scopeKey,
      status: "sent",
      invited_by: userData.user.id,
      auth_user_id: existingUser.id,
    }).select("id,email,status,expires_at").single();
    if (invitationError) return json({ error: invitationError.message, code: "invite_record_failed" }, 500);

    if (roleId) {
      const { error: assignmentError } = await service.from("admin_role_assignments").insert({
        admin_id: existingUser.id,
        role_id: roleId,
        scope_type: scopeType,
        scope_key: scopeKey,
        assigned_by: userData.user.id,
      });
      if (assignmentError) return json({ error: assignmentError.message, code: "role_assignment_failed" }, 500);
    }

    await service.from("audit_logs").insert({
      actor_user_id: userData.user.id,
      action: "staff.reinvite",
      entity_type: "admin_profile",
      entity_id: existingUser.id,
      new_data: { display_name: displayName, status: "invited" },
      metadata: { invitation_id: invitation.id, scope_type: scopeType, scope_key: scopeKey, role_id: roleId, delivery },
    });

    return json({
      invitation,
      admin_id: existingUser.id,
      reactivated: true,
      delivery,
      ...(setupLink ? { setup_link: setupLink } : {}),
    });
  }

  let delivery: "email" | "manual" = "email";
  let setupLink: string | null = null;
  let invitedUser = null;

  const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(email, {
    data: { display_name: displayName, pim_admin_invite: true },
    redirectTo,
  });

  if (!inviteError && invited.user) {
    invitedUser = invited.user;
  } else {
    const isEmailRateLimit =
      inviteError?.code === "over_email_send_rate_limit"
      || /email rate limit|rate limit exceeded/i.test(inviteError?.message ?? "");

    if (!isEmailRateLimit) {
      return json({ error: inviteError?.message ?? "Invite failed", code: "invite_failed" }, 400);
    }

    const { data: generated, error: generateError } = await service.auth.admin.generateLink({
      type: "invite",
      email,
      options: {
        redirectTo,
        data: { display_name: displayName, pim_admin_invite: true },
      },
    });

    setupLink = generated?.properties?.action_link ?? null;
    invitedUser = generated?.user ?? null;
    if (generateError || !setupLink || !invitedUser) {
      return json({
        error: generateError?.message ?? "Supabase email rate limit reached and setup link generation failed",
        code: "email_rate_limit",
      }, 429);
    }
    delivery = "manual";
  }

  const { error: profileError } = await service.from("admin_profiles").upsert({
    id: invitedUser.id,
    display_name: displayName,
    is_super_admin: false,
    status: "invited",
    password_set_at: null,
    approved_at: null,
    approved_by: null,
    deleted_at: null,
    deleted_by: null,
  }, { onConflict: "id" });
  if (profileError) return json({ error: profileError.message, code: "profile_create_failed" }, 500);

  const { data: invitation, error: invitationError } = await service.from("admin_invitations").insert({
    email,
    display_name: displayName,
    role_id: roleId,
    scope_type: scopeType,
    scope_key: scopeKey,
    status: "sent",
    invited_by: userData.user.id,
    auth_user_id: invitedUser.id,
  }).select("id,email,status,expires_at").single();
  if (invitationError) return json({ error: invitationError.message, code: "invite_record_failed" }, 500);

  if (roleId) {
    const { error: assignmentError } = await service.from("admin_role_assignments").insert({
      admin_id: invitedUser.id,
      role_id: roleId,
      scope_type: scopeType,
      scope_key: scopeKey,
      assigned_by: userData.user.id,
    });
    if (assignmentError) return json({ error: assignmentError.message, code: "role_assignment_failed" }, 500);
  }

  await service.from("audit_logs").insert({
    actor_user_id: userData.user.id,
    action: "staff.invite",
    entity_type: "admin_profile",
    entity_id: invitedUser.id,
    new_data: { display_name: displayName, status: "invited" },
    metadata: { invitation_id: invitation.id, scope_type: scopeType, scope_key: scopeKey, role_id: roleId, delivery },
  });

  return json({
    invitation,
    admin_id: invitedUser.id,
    reactivated: false,
    delivery,
    ...(setupLink ? { setup_link: setupLink } : {}),
  });
});
