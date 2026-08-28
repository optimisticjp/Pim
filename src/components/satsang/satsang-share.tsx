"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export function SatsangShare({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const data = { title: "સત્સંગ મંડપ", text: "ગુરુવાણી, પાઠ, કથા અને ભજન સાથે જોડાઓ.", url: window.location.href };
    if (navigator.share) {
      await navigator.share(data).catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.assign(data.url);
    }
  }

  return <button type="button" onClick={share} className={`tap-target inline-flex items-center justify-center gap-2 rounded-full border border-current px-5 text-[14px] font-bold ${className}`} aria-live="polite">{copied ? <Check className="size-4" aria-hidden="true" /> : <Share2 className="size-4" aria-hidden="true" />}{copied ? "લિંક કૉપી થઈ" : "શેર કરો"}</button>;
}
