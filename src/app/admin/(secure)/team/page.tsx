import { CheckCircle2, Clock3, MailPlus, ShieldAlert, UserCog, Users, X } from "lucide-react";

import { assignAdminRoleAction, removeAdminRoleAction, setAdminStatusAction } from "@/app/admin/actions";
import { inviteAdminAction } from "@/app/admin/team-actions";
import { DeleteStaffButton } from "@/components/admin/delete-staff-button";
import { getAdminAssignments, getAdminProfiles, getRoles, requireAdminSession } from "@/lib/admin/data";
import type { AdminProfile } from "@/lib/admin/types";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

type Invitation = {
  id: string;
  email: string;
  display_name: string;
  status: string;
  expires_at: string;
  auth_user_id: string | null;
  scope_type: string;
  scope_key: string | null;
  created_at: string;
};
type AshramOption = { slug: string; name_gu: string; city_gu: string };

function lifecycle(admin: AdminProfile) {
  if (admin.is_super_admin) return { label: "મુખ્ય એડમિન", tone: "bg-primary text-white", icon: CheckCircle2 };
  if (admin.status === "invited" && !admin.password_set_at) return { label: "પાસવર્ડ સેટ કરવાની રાહ", tone: "bg-amber-50 text-amber-900", icon: Clock3 };
  if (admin.status === "invited") return { label: "મુખ્ય એડમિનની મંજૂરી બાકી", tone: "bg-blue-50 text-blue-900", icon: ShieldAlert };
  if (admin.status === "suspended") return { label: "સસ્પેન્ડ", tone: "bg-red-50 text-red-800", icon: UserCog };
  return { label: "સક્રિય", tone: "bg-emerald-50 text-emerald-900", icon: CheckCircle2 };
}

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const params = await searchParams;
  const session = await requireAdminSession();
  const notice = params.notice === "reinvited"
    ? "આ સ્ટાફ સભ્યને ફરી આમંત્રિત કરવામાં આવ્યો છે. નવો સેટઅપ ઇમેઇલ મોકલાયો છે."
    : params.notice === "invited"
      ? "નવું સ્ટાફ આમંત્રણ મોકલાયું છે."
      : null;
  const error = params.error === "exists"
    ? "આ સ્ટાફ સભ્ય પહેલેથી ટીમમાં છે. તેની હાલની કાર્ડમાંથી સ્થિતિ અથવા role બદલો."
    : params.error === "limit"
      ? "સ્ટાફ ટીમની મહત્તમ મર્યાદા પહોંચી ગઈ છે."
      : params.error === "invalid"
        ? "આમંત્રણની વિગતો માન્ય નથી. Role અને scope ફરી તપાસો."
        : params.error === "invite"
          ? "આમંત્રણ મોકલી શકાયું નથી. ફરી પ્રયત્ન કરો."
          : null;
  const [admins, roles, assignments] = await Promise.all([
    getAdminProfiles(session),
    getRoles(session),
    getAdminAssignments(session),
  ]);
  const token = await getAdminAccessToken();

  const [invitations, ashrams] = session.profile?.is_super_admin && token
    ? await Promise.all([
      supabaseRest<Invitation[]>("admin_invitations?select=id,email,display_name,status,expires_at,auth_user_id,scope_type,scope_key,created_at&order=created_at.desc&limit=50", token).catch(() => []),
      supabaseRest<AshramOption[]>("ashram_profiles?select=slug,name_gu,city_gu&archived_at=is.null&order=name_gu.asc", token).catch(() => []),
    ])
    : [[], []];

  const roleName = new Map(roles.map((role) => [role.id, role.name_gu]));
  const ashramName = new Map(ashrams.map((ashram) => [ashram.slug, ashram.name_gu]));
  const latestInvite = new Map<string, Invitation>();
  for (const invitation of invitations) {
    if (invitation.auth_user_id && !latestInvite.has(invitation.auth_user_id)) latestInvite.set(invitation.auth_user_id, invitation);
  }

  return (
    <div>
      <p className="text-xs font-bold text-gold-deep">COMMITTEE TEAM</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">સ્ટાફ અને અધિકારો</h1>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">મુખ્ય એડમિન સ્ટાફને આમંત્રિત કરે છે, role/scope આપે છે અને અંતિમ મંજૂરી આપે છે. સ્ટાફ પોતાનો પાસવર્ડ પોતે બનાવે છે.</p>
      {notice ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{notice}</p> : null}
      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">{error}</p> : null}

      {session.profile?.is_super_admin ? (
        <section className="mt-5 rounded-2xl border border-[#ded6ca] bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><MailPlus className="size-5 text-primary" /><h2 className="font-bold">નવો સ્ટાફ આમંત્રિત કરો</h2></div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">આમંત્રણ ઇમેઇલમાંથી સ્ટાફ વેબસાઇટ પર પાસવર્ડ સેટ કરશે. ત્યારબાદ અહીંથી મંજૂરી આપો. મંજૂરી પહેલાં Admin access મળતો નથી.</p>
          <form action={inviteAdminAction} className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input className="field" name="display_name" placeholder="નામ" required />
            <input className="field" type="email" name="email" placeholder="ઇમેઇલ" required />
            <select className="field" name="role_id"><option value="">Role પછી આપશો</option>{roles.map((role) => <option value={role.id} key={role.id}>{role.name_gu}</option>)}</select>
            <select className="field" name="scope_type"><option value="global">Global</option><option value="ashram">ચોક્કસ આશ્રમ</option></select>
            <div className="flex gap-2">
              <select className="field min-w-0" name="scope_key"><option value="">Global / આશ્રમ</option>{ashrams.map((ashram) => <option key={ashram.slug} value={ashram.slug}>{ashram.name_gu}</option>)}</select>
              <button className="min-h-11 shrink-0 rounded-xl bg-primary px-4 text-sm font-bold text-white">Invite</button>
            </div>
          </form>

          {invitations.length ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {invitations.slice(0, 6).map((invitation) => (
                <div className="rounded-xl bg-[#f8f5f0] p-3 text-xs" key={invitation.id}>
                  <div className="font-bold">{invitation.display_name}</div>
                  <div className="mt-1 truncate text-muted-foreground">{invitation.email}</div>
                  <span className="mt-2 inline-block rounded-full bg-white px-2 py-1 font-bold">{invitation.status}{invitation.scope_key ? " • " + (ashramName.get(invitation.scope_key) ?? invitation.scope_key) : " • Global"}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <div className="mt-5 space-y-3">
        {admins.map((admin) => {
          const assigned = assignments.filter((assignment) => assignment.admin_id === admin.id);
          const state = lifecycle(admin);
          const StateIcon = state.icon;
          const invitation = latestInvite.get(admin.id);
          return (
            <article key={admin.id} className="rounded-2xl border border-[#dfd9d0] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f0e6dc] font-bold text-primary">{admin.display_name.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold">{admin.display_name}</h2>
                    <span className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold " + state.tone}><StateIcon className="size-3" />{state.label}</span>
                  </div>
                  {invitation?.email ? <p className="mt-1 truncate text-xs text-muted-foreground">{invitation.email}</p> : null}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {assigned.length ? assigned.map((assignment) => (
                      <form action={removeAdminRoleAction} key={assignment.id} className="inline-flex items-center rounded-full bg-[#f5f1eb] pl-2.5 text-[11px] font-bold text-primary">
                        <span>{roleName.get(assignment.role_id) ?? assignment.role_id} • {assignment.scope_type === "global" ? "Global" : ashramName.get(assignment.scope_key ?? "") ?? assignment.scope_key}</span>
                        {session.profile?.is_super_admin && !admin.is_super_admin ? (
                          <>
                            <input type="hidden" name="assignment_id" value={assignment.id} />
                            <button className="ml-1 grid size-7 place-items-center rounded-full hover:bg-red-50 hover:text-red-700" aria-label="Role remove"><X className="size-3" /></button>
                          </>
                        ) : null}
                      </form>
                    )) : <span className="text-xs text-muted-foreground">હજુ કોઈ role નથી</span>}
                  </div>
                </div>
                <Users className="size-5 shrink-0 text-[#ae9d8d]" />
              </div>

              {session.profile?.is_super_admin && !admin.is_super_admin ? (
                <div className="mt-4 space-y-3 border-t border-[#eee9e2] pt-3">
                  <form action={assignAdminRoleAction} className="grid gap-2 sm:grid-cols-[1fr_130px_1fr_auto]">
                    <input type="hidden" name="admin_id" value={admin.id} />
                    <select name="role_id" className="field !min-h-10 text-xs" required><option value="">Role</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name_gu}</option>)}</select>
                    <select name="scope_type" className="field !min-h-10 text-xs"><option value="global">Global</option><option value="ashram">Ashram</option></select>
                    <select name="scope_key" className="field !min-h-10 text-xs"><option value="">Global / આશ્રમ</option>{ashrams.map((ashram) => <option key={ashram.slug} value={ashram.slug}>{ashram.name_gu}</option>)}</select>
                    <button className="rounded-xl bg-[#eee7de] px-3 text-xs font-bold text-primary">Role આપો</button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    {admin.status === "invited" && !admin.password_set_at ? (
                      <span className="flex min-h-10 items-center rounded-xl bg-amber-50 px-3 text-xs font-bold text-amber-900">સ્ટાફના પાસવર્ડની રાહ</span>
                    ) : (
                      <form action={setAdminStatusAction}>
                        <input type="hidden" name="admin_id" value={admin.id} />
                        <input type="hidden" name="status" value={admin.status === "active" ? "suspended" : "active"} />
                        <button className="flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold">
                          <UserCog className="size-3.5" />
                          {admin.status === "active" ? "Suspend" : admin.status === "invited" ? "મંજૂર કરો" : "ફરી સક્રિય કરો"}
                        </button>
                      </form>
                    )}
                    <DeleteStaffButton adminId={admin.id} displayName={admin.display_name} />
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
