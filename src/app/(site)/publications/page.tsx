import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { PublicationGrid } from "@/components/publications/publication-grid";
import { getPublicationYears, getVedaRahasyaIssues } from "@/lib/publication-data";

export const metadata: Metadata = {
  title: "વેદ રહસ્ય ડિજિટલ ગ્રંથાલય",
  description: "વેદ રહસ્યના ઉપલબ્ધ અંકો વર્ષ પ્રમાણે શોધો, વાંચો અને PDF ખોલો.",
};

export default function PublicationsPage() {
  const issues = getVedaRahasyaIssues();
  return (
    <>
      <section className="border-b border-border bg-[#f2e7d7]">
        <div className="container-site py-10 sm:py-14 lg:py-16">
          <div className="max-w-3xl">
            <div className="eyebrow">ડિજિટલ ગ્રંથાલય</div>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.25] text-primary-strong sm:text-5xl">વેદ રહસ્યના અંકો એક જ સ્થાન પર</h1>
            <p className="body-large mt-4 max-w-2xl">વાંચન, મનન અને સ્વાધ્યાય માટે ઉપલબ્ધ અંકો વર્ષ પ્રમાણે શોધો અને સીધા વાંચો.</p>
          </div>
        </div>
      </section>
      <main className="section-pad">
        <div className="container-site">
          <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="eyebrow">વેદ રહસ્ય</p><h2 className="mt-3 font-serif text-3xl font-bold text-primary-strong">ઉપલબ્ધ અંકો</h2></div>
            <Link href="/contact?type=publication" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong bg-surface px-5 font-bold text-primary"><BookOpenText className="size-4" /> પ્રકાશન અંગે પૂછપરછ</Link>
          </div>
          <div className="mt-7"><PublicationGrid publications={issues} years={getPublicationYears()} /></div>
        </div>
      </main>
    </>
  );
}
