import { Archive, BookOpenCheck } from "lucide-react";
import { PublicationGrid } from "@/components/publications/publication-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata = { title: "પ્રકાશન અને વેદ રહસ્ય" };

export default function PublicationsPage() {
  return (
    <>
      <section className="border-b border-border bg-[#f2e7d7]">
        <div className="container-site section-pad grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div><div className="eyebrow">ડિજિટલ ગ્રંથાલય</div><h1 className="display-title mt-5 text-primary-strong">વેદ રહસ્ય અને આશ્રમના ગ્રંથોને ફરી વાંચવા યોગ્ય બનાવીએ.</h1><p className="body-large mt-6">જૂના PDFને માત્ર download links તરીકે નહીં, વર્ષ, અંક, વિષય અને સંબંધિત સત્સંગ સાથે ગોઠવાયેલ ડિજિટલ વારસો બનાવવાનો આધાર.</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#d7c0a1] bg-[#fff9ef] p-5"><BookOpenCheck className="h-6 w-6 text-gold-deep" /><div className="mt-4 font-serif text-xl font-bold text-primary">ઓનલાઇન વાંચન</div><p className="mt-2 text-[13px] leading-6 text-muted-foreground">PDF modal અને નવા ટેબ બંને વિકલ્પ.</p></div>
            <div className="rounded-2xl border border-[#d7c0a1] bg-[#fff9ef] p-5"><Archive className="h-6 w-6 text-gold-deep" /><div className="mt-4 font-serif text-xl font-bold text-primary">વર્ષવાર archive</div><p className="mt-2 text-[13px] leading-6 text-muted-foreground">R2 migration પછી સતત વધતો સંગ્રહ.</p></div>
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-site"><SectionHeading eyebrow="વેદ રહસ્ય" title="પ્રારંભિક ડિજિટલ અંકો" description="હાલ ઉપલબ્ધ public PDFsથી readerનો અનુભવ તૈયાર છે. મૂળ files એકત્ર થતાં તેમને નિયંત્રિત ડિજિટલ archiveમાં સ્થાનાંતરિત કરી શકાય." /><div className="mt-9"><PublicationGrid /></div></div>
      </section>
    </>
  );
}
