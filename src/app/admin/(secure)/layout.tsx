import { AdminSetupRequired } from "@/components/admin/admin-setup-required";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin/data";
import { getAdminAccessToken, supabaseRest } from "@/lib/supabase/server";

export default async function SecureAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  if (!session.configured) return <AdminSetupRequired />;
  const token = await getAdminAccessToken();
  const unreadNotifications = token
    ? (await supabaseRest<Array<{ id: string }>>("notifications?select=id&status=eq.unread&limit=99", token)).length
    : 0;
  return <AdminShell session={session} unreadNotifications={unreadNotifications}>{children}</AdminShell>;
}
