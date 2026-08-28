import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";
import { cn } from "@/lib/utils";

export function HomeIdentityCard({ variant = "hero", className }: { variant?: "hero" | "compact"; className?: string }) {
  const compact = variant === "compact";
  return <div className={cn(compact ? "rounded-[1.4rem]" : "sacred-arch", "relative overflow-hidden border border-primary/15 bg-primary text-primary-foreground shadow-[0_20px_55px_rgba(79,37,31,.17)]", className)}>
    <div className="absolute inset-0 opacity-25 pattern-jali" aria-hidden="true" />
    <div className={cn("relative text-center", compact ? "flex items-center gap-4 p-5 text-left" : "px-5 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-24")}>
      <BrandMark className={cn("shrink-0 border-[#efbd6b]/50 bg-[#681c29] text-[#efbd6b]", compact ? "h-12 w-12" : "mx-auto h-14 w-14")} />
      <div className={cn(!compact && "mt-6")}><p className="text-[11px] font-bold tracking-[.08em] text-[#efbd6b]">શ્રી સચ્ચિદાનંદ માધવાનંદ સદ્‌ગુરુ પરંપરા</p><h2 className={cn("font-serif font-bold leading-snug text-white", compact ? "mt-1 text-lg" : "mt-4 text-[1.9rem]")}>શાંતિ • પરંપરા • જ્ઞાન • સેવા</h2>{!compact && <><p className="mt-4 text-[15px] leading-7 text-[#eadbd0]">ગુરુપરંપરા, સત્સંગ, આશ્રમ અને સેવાપ્રવૃત્તિઓનો વિશ્વસનીય પ્રવેશ.</p><Link href="/parampara" className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-[#fff8ec] px-4 font-bold text-primary">ગુરુપરંપરા જાણો <ArrowRight className="h-4 w-4" /></Link></>}</div>
    </div>
  </div>;
}
