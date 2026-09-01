import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Download, FileText } from "lucide-react";

import { getPublicVedaIssues } from "@/lib/veda/public-data";

export const metadata: Metadata = {
  title: "ડિજિટલ ગ્રંથાલય",
  description: "સમિતિ દ્વારા જાહેર કરાયેલા વેદ રહસ્યના ડિજિટલ અંકો અને અન્ય આધ્યાત્મિક વાંચન માર્ગો.",
};

const guMonths = ["", "જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"];
const guNumber = (value: number) => new Intl.NumberFormat("gu-IN").format(value);

export default async function PublicationsPage() {
  const issues = await getPublicVedaIssues();
  const years = Array.from(new Set(issues.map(issue => issue.issue_year))).sort((a, b) => b - a);
  const newest = issues[0];
  const oldest = issues.at(-1);

  return <>
    <section className="border-b border-border bg-[#f2e7d7]">
      <div className="container-site py-10 sm:py-14 lg:py-16">
        <div className="max-w-3xl">
          <div className="eyebrow">ડિજિટલ ગ્રંથાલય</div>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.25] text-primary-strong sm:text-5xl">વાંચન, સ્વાધ્યાય અને વારસાનો સંગ્રહ</h1>
          <p className="body-large mt-4 max-w-2xl">સમિતિ દ્વારા ચકાસીને જાહેર કરાયેલા વેદ રહસ્યના ઉપલબ્ધ ડિજિટલ અંકો અહીં વાંચી શકાય છે.</p>
        </div>
      </div>
    </section>

    <main className="section-pad">
      <div className="container-site">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">વેદ રહસ્ય</p><h2 className="mt-3 font-serif text-3xl font-bold text-primary-strong">ઉપલબ્ધ ડિજિટલ અંકો</h2></div>
          <Link href="/veda-rahasya" className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-border-strong bg-surface px-5 font-bold text-primary"><BookOpenText className="size-4" /> વેદ રહસ્ય વિભાગ</Link>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface p-4"><dt className="text-sm text-muted-foreground">ઉપલબ્ધ અંક</dt><dd className="mt-1 font-serif text-3xl font-bold text-primary">{guNumber(issues.length)}</dd></div>
          <div className="rounded-2xl border border-border bg-surface p-4"><dt className="text-sm text-muted-foreground">સંગ્રહ વર્ષ</dt><dd className="mt-1 font-serif text-3xl font-bold text-primary">{guNumber(years.length)}</dd></div>
          <div className="col-span-2 rounded-2xl border border-border bg-surface p-4 sm:col-span-1"><dt className="text-sm text-muted-foreground">સમયગાળો</dt><dd className="mt-1 font-serif text-lg font-bold text-primary">{oldest && newest ? `${guMonths[oldest.issue_month]} ${guNumber(oldest.issue_year)} — ${guMonths[newest.issue_month]} ${guNumber(newest.issue_year)}` : "હાલ અંક ઉપલબ્ધ નથી"}</dd></div>
        </dl>

        {issues.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{issues.map(issue => <article key={issue.id} className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-bold text-gold-deep">{guNumber(issue.issue_year)}</p>
          <h3 className="mt-2 font-serif text-xl font-bold text-primary-strong">{issue.title_gu}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{guMonths[issue.issue_month]} {guNumber(issue.issue_year)}</p>
          {issue.pdf_url ? <a className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white" href={issue.pdf_url} target="_blank" rel="noreferrer"><Download className="size-4" /> PDF વાંચો</a> : <p className="mt-5 text-xs text-muted-foreground">PDF હાલમાં ઉપલબ્ધ નથી.</p>}
        </article>)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-border bg-surface p-7 text-sm text-muted-foreground">હાલ જાહેર વાંચન માટે કોઈ ડિજિટલ અંક ઉપલબ્ધ નથી.</div>}

        <section className="mt-12 grid gap-4 md:grid-cols-2">
          <Link href="/downloads" className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/30"><FileText className="size-5 text-gold-deep" /><h2 className="mt-3 font-serif text-xl font-bold text-primary">ડિજિટલ પ્રસાદ</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">ભજન, આરતી, ગ્રંથ PDF અને અન્ય ઉપલબ્ધ ડિજિટલ સામગ્રી જુઓ.</p></Link>
          <Link href="/heritage" className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/30"><BookOpenText className="size-5 text-sacred-green" /><h2 className="mt-3 font-serif text-xl font-bold text-primary">વારસા અને ઐતિહાસિક દસ્તાવેજ</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">ઐતિહાસિક પત્રો, દસ્તાવેજો અને સંરક્ષિત આધ્યાત્મિક વારસો વાંચો.</p></Link>
        </section>
      </div>
    </main>
  </>;
}
