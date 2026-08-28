"use client";

import Link from "next/link";
import { BookOpenText, CalendarDays, ClipboardList, ExternalLink, Home, Landmark, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { BrandMark } from "@/components/ui/brand-mark";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "ડેશબોર્ડ", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "ફોર્મ ઇનબોક્સ", icon: ClipboardList },
  { href: "/admin/events", label: "કાર્યક્રમો", icon: CalendarDays },
  { href: "/admin/ashrams", label: "આશ્રમ શાખાઓ", icon: Landmark },
  { href: "/admin/publications", label: "પ્રકાશનો", icon: BookOpenText },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f0e9]">
      <div className="border-b border-[#decfbf] bg-[#fffaf3] px-4 py-2 text-center text-[11px] font-semibold text-[#765f50]">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-sacred-green" /> પૂર્વદર્શન Admin • Production પહેલાં Cloudflare Access + D1 જોડવું જરૂરી
      </div>
      <div className="flex min-h-[calc(100vh-33px)]">
        <aside className="hidden w-[270px] shrink-0 border-r border-[#decfbf] bg-[#32151b] text-[#f4e8dc] lg:block">
          <Sidebar pathname={pathname} />
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#decfbf] bg-[#fffaf3]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="tap-target grid place-items-center rounded-xl border border-border bg-white text-primary lg:hidden" aria-label="Admin menu"><Menu className="h-5 w-5" /></button>
              <div><div className="text-[11px] font-bold text-muted-foreground">કમિટી પોર્ટલ</div><div className="font-serif font-bold text-primary">શ્રી માધવાનંદ આશ્રમ</div></div>
            </div>
            <Link href="/" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-[12px] font-bold text-primary"><ExternalLink className="h-3.5 w-3.5" /> વેબસાઇટ જુઓ</Link>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] bg-black/45 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-[86%] max-w-[300px] bg-[#32151b] text-[#f4e8dc] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute left-[calc(min(86%,300px)-52px)] top-3 tap-target grid place-items-center rounded-full bg-white/10 text-white" aria-label="મેનુ બંધ કરો"><X className="h-5 w-5" /></button>
            <Sidebar pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col p-4">
      <Link href="/admin/dashboard" onClick={onNavigate} className="flex items-center gap-3 px-2 py-4"><BrandMark className="border-[#e5b15d]/40 bg-[#471a23] text-[#e5b15d]" /><div><div className="font-serif text-lg font-bold">કમિટી પોર્ટલ</div><div className="text-[10px] text-[#c7b3a6]">PREVIEW WORKSPACE</div></div></Link>
      <nav className="mt-5 grid gap-1.5" aria-label="Admin navigation">
        {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={onNavigate} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 text-[14px] font-semibold transition", pathname === href ? "bg-[#fff1de] text-primary" : "text-[#dac9bd] hover:bg-white/8 hover:text-white")}><Icon className="h-4.5 w-4.5" />{label}</Link>)}
      </nav>
      <div className="mt-auto border-t border-white/10 pt-4">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] text-[#cdb9ad] hover:bg-white/8"><Home className="h-4 w-4" /> જાહેર વેબસાઇટ</Link>
        <Link href="/admin/login" className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] text-[#cdb9ad] hover:bg-white/8"><LogOut className="h-4 w-4" /> પૂર્વદર્શન બહાર નીકળો</Link>
      </div>
    </div>
  );
}
