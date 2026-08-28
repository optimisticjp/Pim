"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

export function SharePublication({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* A cancelled share needs no message. */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }
  return <button type="button" onClick={share} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 font-bold text-primary"><Share2 className="size-4" />{copied ? "લિંક કૉપી થઈ" : "શેર કરો"}</button>;
}
