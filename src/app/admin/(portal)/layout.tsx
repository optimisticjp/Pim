import { AdminSetupRequired } from "@/components/admin/admin-setup-required";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin/data";

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  if (!session.configured) return <AdminSetupRequired />;
  return <AdminShell session={session}>{children}</AdminShell>;
}
