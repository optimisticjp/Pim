import type { GuruProfile } from "@/lib/migration/guru-data";
import { GuruPortrait } from "@/components/heritage/guru-portrait";

export function GuruCard({ profile, compact = false }: { profile: GuruProfile; compact?: boolean }) {
  return <article className="overflow-hidden rounded-[1.25rem] border border-[#d8c4aa] bg-surface shadow-card">
    <GuruPortrait profile={profile} className={compact ? "aspect-[4/3]" : "aspect-[4/5]"} />
    <div className="p-4 sm:p-5"><h3 className="font-serif text-lg font-bold leading-snug text-primary-strong">{profile.nameGu}</h3>{profile.qualificationGu ? <p className="mt-2 text-xs font-bold text-gold-deep">{profile.qualificationGu}</p> : null}</div>
  </article>;
}
