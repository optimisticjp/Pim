import { BookOpen, HeartPulse, Leaf, Soup, UsersRound } from "lucide-react";
import type { SevaActivity } from "@/lib/types";

function CowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9c-2-1-3-3-3-5 3 0 5 1 6 3m11 2c2-1 3-3 3-5-3 0-5 1-6 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v6c0 4-2 7-6 7s-6-3-6-7V8Z" />
      <path d="M9 14h.01M15 14h.01M10 18c1 .6 3 .6 4 0" />
    </svg>
  );
}

const icons = {
  cow: CowIcon,
  heart: HeartPulse,
  book: BookOpen,
  utensils: Soup,
  sprout: Leaf,
  users: UsersRound,
};

export function SevaCard({ activity }: { activity: SevaActivity }) {
  const Icon = icons[activity.icon];
  return (
    <article className="group rounded-[1.25rem] border border-border bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/35 hover:shadow-[0_18px_45px_rgba(72,45,28,.1)]">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/8 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"><Icon /></div>
      <div className="mt-5 text-[11px] font-bold tracking-[.06em] text-gold-deep">{activity.kickerGu}</div>
      <h3 className="mt-2 font-serif text-[1.35rem] font-bold text-primary-strong">{activity.titleGu}</h3>
      <p className="mt-3 text-[14px] leading-7 text-muted-foreground">{activity.descriptionGu}</p>
    </article>
  );
}
