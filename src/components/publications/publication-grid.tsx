"use client";

import { BookOpenText, Download, Eye } from "lucide-react";
import { useState } from "react";

import { PdfViewerModal } from "@/components/publications/pdf-viewer-modal";
import { publications } from "@/lib/site-data";
import type { Publication } from "@/lib/types";

export function PublicationGrid() {
  const [selected, setSelected] = useState<Publication | null>(null);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {publications.map((publication, index) => (
          <article key={publication.id} className="card-sacred overflow-hidden">
            <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-[#efe2cf] p-8">
              <div className="absolute inset-0 pattern-jali opacity-40" />
              <div className={`relative flex h-full w-[62%] min-w-[150px] max-w-[210px] flex-col justify-between rounded-r-xl border-l-[7px] border-[#51202a] bg-primary p-5 text-primary-foreground shadow-[0_20px_35px_rgba(70,30,30,.18)] ${index % 2 ? "rotate-[1.2deg]" : "-rotate-[1deg]"}`}>
                <div className="text-[10px] font-bold tracking-[.12em] text-[#f1bd67]">॥ ૐ શ્રી સચ્ચિદાનંદ ॥</div>
                <div>
                  <BookOpenText className="mb-3 h-7 w-7 text-[#f1bd67]" />
                  <div className="font-serif text-2xl font-bold">વેદ રહસ્ય</div>
                  <div className="mt-2 text-[12px] text-[#ead8cd]">{publication.editionGu}</div>
                </div>
                <div className="border-t border-white/15 pt-3 text-[10px] text-[#d9c3b6]">શ્રી સચ્ચિદાનંદ સેવક મંડળ</div>
              </div>
            </div>
            <div className="p-5">
              <div className="text-[11px] font-bold text-gold-deep">{publication.categoryGu} • {publication.year}</div>
              <h3 className="mt-2 font-serif text-xl font-bold text-primary-strong">{publication.titleGu} — {publication.editionGu}</h3>
              <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{publication.descriptionGu}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setSelected(publication)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground"><Eye className="h-4 w-4" /> વાંચો</button>
                <a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border font-bold text-primary hover:bg-surface-soft"><Download className="h-4 w-4" /> PDF</a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <PdfViewerModal publication={selected} onClose={() => setSelected(null)} />
    </>
  );
}
