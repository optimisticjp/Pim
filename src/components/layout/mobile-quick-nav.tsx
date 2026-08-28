"use client";

import Link from "next/link";
import { CalendarDays, Home, MapPin, MessageCircle, Radio } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "મુખપૃષ્ઠ", icon: Home },
  { href: "/events", label: "કાર્યક્રમ", icon: CalendarDays },
  { href: "/satsang", label: "સત્સંગ", icon: Radio },
  { href: "/ashrams", label: "આશ્રમ", icon: MapPin },
  { href: "/contact", label: "સંપર્ક", icon: MessageCircle },
];

export function MobileQuickNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-2 bottom-2 z-50 grid grid-cols-5 rounded-2xl border border-border/90 bg-[#fffdf8]/96 p-1.5 shadow-[0_15px_50px_rgba(46,37,32,.18)] backdrop-blur-xl md:hidden" aria-label="ઝડપી નેવિગેશન">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link key={href} href={href} className={cn("flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold", active ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
