import Link from "next/link";
import { Bell, FileText, Home, Inbox, LogOut, ShieldCheck, Users } from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { AdminBottomNav } from "@/components/admin/admin-bottom-nav";
import type { AdminSession } from "@/lib/admin/types";

const desktopNav = [
  ["/admin", "ડેશબોર્ડ", Home],
  ["/admin/inbox", "આવેલ અરજીઓ", Inbox],
  ["/admin/team", "એડમિન ટીમ", Users],
  ["/admin/roles", "ભૂમિકાઓ", ShieldCheck],
  ["/admin/audit", "ઓડિટ લોગ", FileText],
] as const;

export function AdminShell({ session, children }: { session: AdminSession; children: React.ReactNode }) {
  const profile = session.profile!;
  return <div className="min-h-screen bg-[#f5f3ee] text-[#302923]">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[#ded8cf] bg-[#fffdfa] p-4 md:flex md:flex-col">
      <Link href="/admin" className="rounded-2xl bg-[#571621] p-4 text-white"><p className="text-[10px] font-bold tracking-[.12em] text-[#efbd6b]">PARIVAR SEVA</p><p className="mt-1 font-serif text-xl font-bold">Admin</p></Link>
      <nav className="mt-5 space-y-1">{desktopNav.map(([href, label, Icon]) => <Link key={href} href={href} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-[#554b44] transition hover:bg-[#f3ece2] hover:text-primary"><Icon className="size-[18px]" />{label}</Link>)}</nav>
      <div className="mt-auto rounded-2xl border border-[#e4ddd3] bg-white p-3"><p className="truncate text-sm font-bold">{profile.display_name}</p><p className="mt-1 text-xs text-muted-foreground">{profile.is_super_admin ? "Super Admin" : "Committee Admin"}</p><form action={logoutAction}><button className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#f3ece8] text-sm font-bold text-primary" type="submit"><LogOut className="size-4" /> બહાર નીકળો</button></form></div>
    </aside>

    <div className="md:pl-64">
      <header className="sticky top-0 z-20 border-b border-[#dfd9d0] bg-[#f8f6f1]/92 backdrop-blur"><div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"><div><p className="text-[10px] font-bold tracking-[.12em] text-gold-deep md:hidden">PARIVAR SEVA</p><p className="text-sm font-bold text-primary md:text-base">જય સચ્ચિદાનંદ</p></div><div className="flex items-center gap-2"><Link href="/admin/notifications" aria-label="સૂચનાઓ" className="flex size-10 items-center justify-center rounded-full border border-[#ded7ce] bg-white"><Bell className="size-[18px]" /></Link><div className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-white">{profile.display_name.trim().charAt(0) || "A"}</div></div></div></header>
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-5 sm:px-6 md:pb-10 md:pt-7">{children}</main>
    </div>
    <AdminBottomNav />
  </div>;
}
