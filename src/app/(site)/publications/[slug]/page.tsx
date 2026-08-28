import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicationCard } from "@/components/publications/publication-grid";
import { SharePublication } from "@/components/publications/share-publication";
import { formatGujaratiNumber } from "@/lib/gujarati-format";
import { getPublicationBySlug, getPublications, getRelatedPublications } from "@/lib/publication-data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublications().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const publication = getPublicationBySlug((await params).slug);
  if (!publication) return {};
  const details = [publication.editionGu, publication.year && formatGujaratiNumber(publication.year)].filter(Boolean).join(" — ");
  const title = `${publication.titleGu}${details ? ` — ${details}` : ""}`;
  const description = publication.descriptionGu ?? `${publication.titleGu}નો ઉપલબ્ધ ડિજિટલ અંક વાંચો અથવા PDF ખોલો.`;
  return { title, description, openGraph: { title, description, type: "website" } };
}

export default async function PublicationPage({ params }: Props) {
  const publication = getPublicationBySlug((await params).slug);
  if (!publication) notFound();
  const related = getRelatedPublications(publication);
  const detail = [publication.monthGu, publication.year && formatGujaratiNumber(publication.year)].filter(Boolean).join(" • ");
  return (
    <main>
      <section className="border-b border-border bg-[#f2e7d7]">
        <div className="container-site py-8 sm:py-12">
          <Link href="/publications" className="inline-flex min-h-11 items-center gap-2 font-bold text-primary"><ArrowLeft className="size-4" /> ગ્રંથાલયમાં પાછા જાઓ</Link>
          <div className="mt-5 max-w-3xl">
            <p className="eyebrow">ડિજિટલ આવૃત્તિ</p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-primary-strong sm:text-5xl">{publication.titleGu}</h1>
            {detail && <p className="mt-3 text-lg font-bold text-primary">{detail}</p>}
            {publication.descriptionGu && <p className="body-large mt-4">{publication.descriptionGu}</p>}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {publication.pdfUrl && <><a href="#reader" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-white"><FileText className="size-4" /> વાંચો</a><a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 font-bold text-primary"><ExternalLink className="size-4" /> PDF નવા ટેબમાં ખોલો</a></>}
            <SharePublication title={publication.titleGu} />
          </div>
        </div>
      </section>
      {publication.pdfUrl ? <section id="reader" className="section-pad scroll-mt-24">
        <div className="container-site">
          <div className="mb-5"><h2 className="font-serif text-3xl font-bold text-primary-strong">અંક વાંચો</h2><p className="mt-2 text-[15px] leading-7 text-muted-foreground">જો અહીં PDF ન દેખાય, તો ઉપરના બટનથી તેને નવા ટેબમાં ખોલો.</p></div>
          <div className="hidden overflow-hidden rounded-[1.25rem] border border-border-strong bg-[#ece8e1] shadow-sm sm:block">
            <iframe title={`${publication.titleGu} ${publication.editionGu ?? ""}`} src={publication.pdfUrl} className="h-[72vh] min-h-[38rem] w-full" />
          </div>
          <div className="rounded-[1.25rem] border border-[#d8c4aa] bg-[#fffaf2] p-5 text-center sm:hidden">
            <p className="text-base leading-7 text-muted-foreground">મોબાઇલમાં સરળતાથી વાંચવા માટે PDF નવા ટેબમાં ખોલો.</p>
            <a href={publication.pdfUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-white"><ExternalLink className="size-4" /> PDF ખોલો</a>
          </div>
        </div>
      </section> : <section className="section-pad"><div className="container-site grid gap-6 lg:grid-cols-[.7fr_1.3fr]"><div className="aspect-[4/5] max-w-sm rounded-[1.5rem] border border-[#c9ad89] bg-[#f1e5d3] p-6 pattern-jali"><div className="flex h-full items-end rounded-xl border border-primary/15 bg-[#fffaf2]/90 p-6"><div><p className="eyebrow">આધ્યાત્મિક વાંચન</p><h2 className="mt-3 font-serif text-3xl font-bold text-primary">{publication.titleGu}</h2></div></div></div><div className="self-center"><h2 className="font-serif text-3xl font-bold text-primary-strong">વાંચનનો પરિચય</h2><p className="mt-4 text-[17px] leading-8 text-muted-foreground">{publication.descriptionGu}</p><Link href="/contact?type=publication" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-5 font-bold text-white">પ્રકાશન અંગે પૂછપરછ</Link></div></div></section>}
      {related.length > 0 && <section className="section-pad border-t border-border bg-[#f2e7d7]"><div className="container-site"><h2 className="font-serif text-3xl font-bold text-primary-strong">આ જ વર્ષના અન્ય અંકો</h2><div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{related.map((item) => <PublicationCard key={item.id} publication={item} />)}</div></div></section>}
    </main>
  );
}
