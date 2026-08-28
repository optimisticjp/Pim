import { cn } from "@/lib/utils";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/50 bg-[#fff8ea] text-primary shadow-[inset_0_0_0_5px_rgba(199,129,43,.08)]",
        className,
      )}
    >
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
        <circle cx="24" cy="24" r="15.5" stroke="currentColor" strokeWidth="1.4" opacity=".55" />
        <path d="M24 8.5c2.8 4.3 6.3 7.6 10.8 10.4-4.4 2.7-8 6.3-10.8 10.7-2.8-4.4-6.4-8-10.8-10.7C17.7 16.1 21.2 12.8 24 8.5Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13.2 28.8c4.3 1.4 8 3.9 10.8 7.7 2.8-3.8 6.5-6.3 10.8-7.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="24" cy="20" r="2.2" fill="currentColor" />
      </svg>
    </span>
  );
}
