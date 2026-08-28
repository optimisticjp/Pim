"use client";

import { Play } from "lucide-react";
import { useState } from "react";

import { YouTubeMark } from "@/components/icons/youtube-mark";
import { cn } from "@/lib/utils";

type YouTubeFacadeProps = {
  playlistId: string;
  title: string;
  eyebrow?: string;
  compact?: boolean;
};

export function YouTubeFacade({ playlistId, title, eyebrow = "અધિકૃત YouTube સત્સંગ", compact = false }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-[1.4rem] border border-white/15 bg-[#250d12]", compact ? "shadow-none" : "shadow-[0_24px_65px_rgba(0,0,0,.28)]")}>
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-3 px-5 text-center text-white" aria-label={`${title} ચલાવો`}>
          <span className="absolute inset-0 pattern-jali opacity-20" aria-hidden="true" />
          <span className="relative grid size-14 place-items-center rounded-full border border-[#efbd6b]/60 bg-[#fff8ec] text-primary transition group-hover:scale-105 sm:size-16">
            <Play className="ml-1 size-6 fill-current" aria-hidden="true" />
          </span>
          <span className="relative mt-1 text-[12px] font-bold tracking-[.06em] text-[#efbd6b]">{eyebrow}</span>
          <span className="relative max-w-md font-serif text-xl font-bold leading-snug sm:text-2xl">{title}</span>
          <span className="relative inline-flex items-center gap-2 text-[13px] text-[#dccbc0]"><YouTubeMark className="size-4" />ચાલુ કરવા અહીં સ્પર્શ કરો</span>
        </button>
      )}
    </div>
  );
}
