"use client";

import Link from "next/link";
import { Home, Inbox, Menu, PlusCircle, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "હોમ", icon: Home },
  { href: "/admin/inbox", label: "ઇનબોક્સ", icon: Inbox },
  { href: "/admin/quick-add", label: "ઉમેરો", icon: PlusCircle, primary: true },
  { href: "/admin/team", label: "ટીમ", icon: Users },
  { href: "/admin/more", label: "વધુ", icon: Menu },
] as const;

export function AdminBottomNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd7ce] bg-white/95 px-2 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur md:hidden"><div className="mx-auto grid max-w-lg grid-cols-5">{items.map(({ href, label, icon: Icon, primary }) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
    return <Link key={href} href={href} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold ${active ? "text-primary" : "text-[#776e67]"}`}><span className={primary ? "-mt-4 flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20" : "flex size-7 items-center justify-center"}><Icon className={primary ? "size-5" : "size-[19px]"} /></span><span>{label}</span></Link>;
  })}</div></nav>;
}
