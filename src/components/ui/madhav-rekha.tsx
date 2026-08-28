import { principles } from "@/lib/site-data";

export function MadhavRekha() {
  return (
    <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="absolute left-[8%] right-[8%] top-6 hidden h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent lg:block" />
      {principles.map((item, index) => (
        <div key={item.title} className="relative rounded-2xl border border-border bg-[#fffaf1] px-5 py-5 text-center shadow-sm">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-background font-serif text-xl font-bold text-primary shadow-[0_0_0_6px_#fbf7ef]">{index + 1}</div>
          <div className="font-serif text-xl font-bold text-primary">{item.title}</div>
          <div className="mt-1 text-[13px] leading-6 text-muted-foreground">{item.line}</div>
        </div>
      ))}
    </div>
  );
}
