import { AshramDirectory } from "@/components/ashrams/ashram-directory";
import { SectionHeading } from "@/components/ui/section-heading";
import { ashrams } from "@/lib/site-data";

export const metadata = { title: "આશ્રમ શાખાઓ" };

export default function AshramsPage() {
  const verified = ashrams.filter((item) => item.verified).length;
  return (
    <>
      <section className="border-b border-border bg-[#f3e7d6]">
        <div className="container-site section-pad">
          <div className="max-w-4xl">
            <div className="eyebrow">આશ્રમ પરિવાર</div>
            <h1 className="display-title mt-5 text-primary-strong">નજીકનો આશ્રમ શોધવો હવે બે ક્લિકનું કામ.</h1>
            <p className="body-large mt-6 max-w-3xl">હાલના આશ્રમ સંગ્રહમાંથી {ashrams.length} શાખા નામો ગોઠવ્યા છે. {verified} મુખ્ય કેન્દ્રોની સરનામા અને ફોન વિગતો ઉપલબ્ધ સત્તાવાર સ્રોત પરથી જોડવામાં આવી છે; બાકીની વિગતો ચકાસણી સાથે ધીમે ધીમે પૂર્ણ કરી શકાય.</p>
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-site">
          <SectionHeading eyebrow="શોધ અને દિશા" title="આશ્રમ ડિરેક્ટરી" description="મોબાઇલ પર શહેર લખો, પ્રદેશ પસંદ કરો અને સીધો ફોન અથવા Google Maps દિશા મેળવો." />
          <div className="mt-8"><AshramDirectory /></div>
        </div>
      </section>
    </>
  );
}
