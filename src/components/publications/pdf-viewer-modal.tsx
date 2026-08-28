"use client";

import { ExternalLink, X } from "lucide-react";
import { useEffect } from "react";
import type { Publication } from "@/lib/types";

export function PdfViewerModal({ publication, onClose }: { publication: Publication | null; onClose: () => void }) {
  useEffect(() => {
    if (!publication) return;
    const handler = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [publication, onClose]);

  if (!publication) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/65 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`${publication.titleGu} વાંચો`}>
      <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <div className="truncate font-serif font-bold text-primary">{publication.titleGu} • {publication.editionGu}</div>
            <div className="text-[11px] text-muted-foreground">હાલ ઉપલબ્ધ ડિજિટલ PDF</div>
          </div>
          <div className="flex gap-2">
            <a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="tap-target grid place-items-center rounded-full border border-border text-primary" aria-label="નવા ટેબમાં ખોલો"><ExternalLink className="h-4 w-4" /></a>
            <button type="button" onClick={onClose} className="tap-target grid place-items-center rounded-full bg-primary text-primary-foreground" aria-label="બંધ કરો"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <iframe title={`${publication.titleGu} ${publication.editionGu}`} src={publication.pdfUrl} className="min-h-0 flex-1 bg-[#ece8e1]" />
      </div>
    </div>
  );
}
