import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { PublicationGrid } from "@/components/publications/publication-grid";
import { getPublicationYears, getPublications } from "@/lib/publication-data";

export const metadata: Metadata = {
  title: "ડિજિટલ ગ્રંથાલય",
  description: "વેદ રહસ્ય, ગ્રંથો, પત્રો અને ઉપલબ્ધ આધ્યાત્મિક પ્રકાશનો શોધો અને વાંચો.",
};

export default function PublicationsPage() {
  const issues = getPublications();
  return (
    <>
      <section className="border-b border-border bg-[#f2e7d7]">
        <div className="container-site py-10 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <div className="eyebrow">ડિજિટલ ગ્રંથાલય</div>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.25] text-primary-strong sm:text-5xl">વાંચન, સ્વાધ્યાય અને વારસાનો સંગ્રહ</h1>
            <p className="body-large mt-4 max-w-2xl">વેદ રહસ્યના અંકો સાથે ગ્રંથ, પત્ર અને વિશેષ પ્રકાશનોને શીર્ષક, પ્રકાર અને વર્ષ પ્રમાણે શોધો.</p>
          </div>
        </div>
      </section>
      <main className="section-pad">
        <div className="container-site">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">વેદ રહસ્ય અને આધ્યાત્મિક વાંચન</p><h2 className="mt-3 font-serif text-3xl font-bold text-primary-strong">પસંદ કરેલો પ્રકાશન સંગ્રહ</h2></div>
            <Link href="/contact?type=publication" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong bg-surface px-5 font-bold text-primary"><BookOpenText className="size-4" /> પ્રકાશન અંગે પૂછપરછ</Link>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-surface p-4"><dt className="text-sm text-muted-foreground">વેદ રહસ્ય અંક</dt><dd className="mt-1 font-serif text-3xl font-bold text-primary">૪૬</dd></div><div className="rounded-2xl border border-border bg-surface p-4"><dt className="text-sm text-muted-foreground">સંગ્રહ વર્ષ</dt><dd className="mt-1 font-serif text-3xl font-bold text-primary">૫</dd></div><div className="col-span-2 rounded-2xl border border-border bg-surface p-4 sm:col-span-1"><dt className="text-sm text-muted-foreground">સમયગાળો</dt><dd className="mt-1 font-serif text-lg font-bold text-primary">જુલાઈ ૨૦૧૪—એપ્રિલ ૨૦૧૮</dd></div></dl>
          <div className="mt-7"><PublicationGrid publications={issues} years={getPublicationYears()} /></div>
        </div>
      </main>
    </>
  );
}
