import { invocation } from "@/lib/site-data";

export function SacredTopline() {
  return (
    <div className="border-b border-white/10 bg-primary px-3 py-2 text-center text-[12px] font-semibold tracking-[0.08em] text-primary-foreground sm:text-[13px]">
      {invocation}
    </div>
  );
}
