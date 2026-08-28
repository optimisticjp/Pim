"use client";

import Link from "next/link";
import { Menu, Radio, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/ui/brand-mark";
import { navItems, siteName } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[#fbf7ef]/94 backdrop-blur-xl">
      <div className="container-site flex h-[76px] items-center justify-between gap-4">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label={`${siteName} મુખપૃષ્ઠ`}>
          <BrandMark />
          <div className="min-w-0">
            <div className="truncate font-serif text-[1.08rem] font-bold leading-tight text-primary sm:text-[1.2rem]">{siteName}</div>
            <div className="mt-0.5 hidden text-[11px] font-semibold tracking-[.07em] text-muted-foreground sm:block">જય સચ્ચિદાનંદ • ૐ નમો નારાયણ</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="મુખ્ય નેવિગેશન">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[14px] font-semibold transition hover:bg-primary/7 hover:text-primary",
                  active ? "bg-primary/9 text-primary" : "text-[#5d514a]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/satsang"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-primary px-4 text-[14px] font-bold text-primary-foreground shadow-sm transition hover:bg-primary-strong md:flex"
          >
            <Radio className="h-4 w-4" /> સત્સંગ જુઓ
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="tap-target grid place-items-center rounded-full border border-border bg-surface text-primary xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "મેનુ બંધ કરો" : "મેનુ ખોલો"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-border bg-[#fbf7ef] px-3 pb-5 pt-3 xl:hidden">
          <nav className="container-site grid gap-1" aria-label="મોબાઇલ નેવિગેશન">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-xl px-4 text-[16px] font-semibold",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-surface-soft",
                )}
              >
                {item.label}
                <span aria-hidden="true" className="text-gold">›</span>
              </Link>
            ))}
            <Link href="/satsang" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground">
              <Radio className="h-4 w-4" /> અધિકૃત સત્સંગ ચેનલ
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
