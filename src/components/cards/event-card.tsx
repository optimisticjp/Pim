import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Radio } from "lucide-react";
import type { EventItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const toneClasses = {
  maroon: "bg-primary text-primary-foreground",
  gold: "bg-[#f5e7cf] text-[#744716]",
  green: "bg-[#e2ede7] text-[#21433d]",
};

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="card-sacred flex h-full flex-col overflow-hidden">
      <div className={cn("flex items-center justify-between gap-4 px-5 py-3 text-[12px] font-bold", toneClasses[event.tone])}>
        <span>{event.eyebrowGu}</span>
        {event.live ? <span className="inline-flex items-center gap-1.5"><Radio className="h-3.5 w-3.5" /> લાઇવ / તાજું</span> : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-serif text-[1.45rem] font-bold leading-snug text-primary-strong">{event.titleGu}</h3>
        <p className="mt-3 flex-1 text-[14px] leading-7 text-muted-foreground">{event.descriptionGu}</p>
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-[13px] text-[#5f5149]">
          <div className="flex gap-2"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />{event.scheduleGu}</div>
          <div className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />{event.venueGu}</div>
        </div>
        <Link href={event.href} className="mt-5 inline-flex min-h-11 items-center justify-between rounded-xl bg-surface-soft px-4 text-[14px] font-bold text-primary hover:bg-[#efe3d2]">
          વધુ જાણો <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
