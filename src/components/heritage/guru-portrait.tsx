"use client";

import Image from "next/image";
import { useState } from "react";

import { BrandMark } from "@/components/ui/brand-mark";
import type { GuruProfile } from "@/lib/migration/guru-data";
import { cn } from "@/lib/utils";

export function GuruPortrait({ profile, className, priority = false }: { profile: GuruProfile; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className={cn("relative overflow-hidden bg-[#eadcc8]", className)}>
    {failed ? <div className="pattern-jali absolute inset-0 grid place-items-center"><BrandMark className="size-16 bg-surface text-gold-deep" /></div> : <Image src={profile.portraitUrl} alt={profile.nameGu} fill sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 24vw" className="object-contain object-bottom" priority={priority} onError={() => setFailed(true)} />}
  </div>;
}
