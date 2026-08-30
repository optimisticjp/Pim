import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Users } from "lucide-react";

import { submitMembershipApplicationAction } from "@/app/(site)/membership/actions";

export const metadata: Metadata = {
  title: "પરિવાર સભ્યપદ નોંધણી",
  description: "શ્રી માધવાનંદ આશ્રમ પરિવાર માટે સભ્યપદ અને પરિવાર વિગતો નોંધાવવાનું સુરક્ષિત ફોર્મ.",
};

const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const genders = [["", "પસંદ કરો"], ["male", "પુરૂષ"], ["female", "સ્ત્રી"], ["other", "અન્ય"], ["prefer_not_to_say", "જણાવવું નથી"]] as const;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-semibold text-[#594d46]">{children}</label>;
}

export default async function MembershipPage({ searchParams }: { searchParams: Promise<{ submitted?: string; error?: string }> }) {
  const params = await searchParams;
  return <>
    <section className="border-b border-border bg-[#f4eee5]"><div className="container-site py-12 sm:py-16"><div className="max-w-3xl"><div className="eyebrow">પરિવાર નોંધણી</div><h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-primary sm:text-5xl">સભ્યપદ માટે જરૂરી વિગતો</h1><p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">આ અરજી સત્તાવાર સભ્યપદ તરત બનાવતી નથી. સમિતિ અરજી તપાસ્યા પછી મંજૂરી આપે ત્યારે અધિકૃત સભ્ય રેકોર્ડ બને છે.</p></div></div></section>

    <section className="py-10 sm:py-14"><div className="container-site max-w-4xl">
      {params.submitted ? <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><div><p className="font-bold">આપની અરજી સફળતાપૂર્વક મળી ગઈ.</p><p className="mt-1 text-sm">અરજી નંબર: <strong>{params.submitted}</strong>. કૃપા કરીને આ નંબર સાચવી રાખશો.</p></div></div></div> : null}
      {params.error ? <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-900">અરજી મોકલી શકાઈ નથી. જરૂરી વિગતો તપાસીને ફરી પ્રયાસ કરશો.</div> : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[#ded6ca] bg-white p-4"><Users className="size-5 text-primary" /><p className="mt-2 font-bold">એક પરિવાર, એક અરજી</p><p className="mt-1 text-sm leading-6 text-muted-foreground">મુખ્ય અરજદાર સાથે વધુમાં વધુ પાંચ પરિવાર સભ્યો અહીં ઉમેરો.</p></div><div className="rounded-2xl border border-[#ded6ca] bg-white p-4"><ShieldCheck className="size-5 text-sacred-green" /><p className="mt-2 font-bold">મર્યાદિત માહિતી</p><p className="mt-1 text-sm leading-6 text-muted-foreground">આ ફોર્મમાં આધાર, PAN અથવા બેંક માહિતી માંગવામાં આવતી નથી.</p></div></div>

      <form action={submitMembershipApplicationAction} className="space-y-6">
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <section className="rounded-3xl border border-[#ded6ca] bg-white p-5 shadow-sm sm:p-7"><h2 className="font-serif text-2xl font-bold text-primary">૧. મુખ્ય અરજદાર</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FieldLabel>નામ *<input className="field" name="first_name" required maxLength={120} /></FieldLabel>
          <FieldLabel>પિતાનું નામ<input className="field" name="father_name" maxLength={120} /></FieldLabel>
          <FieldLabel>અટક<input className="field" name="surname" maxLength={120} /></FieldLabel>
          <FieldLabel>મોબાઇલ નંબર *<input className="field" name="mobile" type="tel" inputMode="tel" required maxLength={24} /></FieldLabel>
          <FieldLabel>અભ્યાસ<input className="field" name="education" maxLength={160} /></FieldLabel>
          <FieldLabel>વ્યવસાયની વિગત<input className="field" name="occupation" maxLength={160} /></FieldLabel>
          <FieldLabel>ગામ / મૂળ વતન *<input className="field" name="native_village" required maxLength={160} /></FieldLabel>
          <FieldLabel>બ્લડ ગ્રુપ<select className="field" name="blood_group">{bloodGroups.map((group) => <option key={group || "none"} value={group}>{group || "પસંદ કરો"}</option>)}</select></FieldLabel>
          <FieldLabel>સ્ત્રી / પુરૂષ *<select className="field" name="gender" required>{genders.map(([value,label]) => <option key={value || "none"} value={value}>{label}</option>)}</select></FieldLabel>
          <FieldLabel>ઉંમર *<input className="field" name="age" type="number" inputMode="numeric" min={0} max={120} required /></FieldLabel>
          <label className="grid gap-1.5 text-sm font-semibold text-[#594d46] sm:col-span-2">પૂર્ણ એડ્રેસ *<textarea className="field min-h-28 resize-y" name="full_address" required maxLength={1000} /></label>
        </div></section>

        <section className="rounded-3xl border border-[#ded6ca] bg-white p-5 shadow-sm sm:p-7"><h2 className="font-serif text-2xl font-bold text-primary">૨. પરિવારના સભ્યો</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">જે સભ્ય ઉમેરવો હોય તે વિભાગ ખોલીને નામ લખો. ખાલી વિભાગ મોકલાશે નહીં.</p><div className="mt-5 space-y-3">
          {Array.from({ length: 5 }, (_, index) => <details key={index} className="group rounded-2xl border border-[#e3dbd1] bg-[#fcfaf6]"><summary className="cursor-pointer list-none px-4 py-4 font-bold text-primary">પરિવાર સભ્ય {index + 1} <span className="text-xs font-medium text-muted-foreground">(વૈકલ્પિક)</span></summary><div className="grid gap-4 border-t border-[#e8e1d8] p-4 sm:grid-cols-2">
            <FieldLabel>સંબંધ<input className="field" name={`family_${index}_relationship`} maxLength={80} placeholder="જેમ કે પત્ની, પુત્ર, પુત્રી" /></FieldLabel>
            <FieldLabel>નામ<input className="field" name={`family_${index}_first_name`} maxLength={120} /></FieldLabel>
            <FieldLabel>પિતાનું નામ<input className="field" name={`family_${index}_father_name`} maxLength={120} /></FieldLabel>
            <FieldLabel>અટક<input className="field" name={`family_${index}_surname`} maxLength={120} /></FieldLabel>
            <FieldLabel>ઉંમર<input className="field" name={`family_${index}_age`} type="number" inputMode="numeric" min={0} max={120} /></FieldLabel>
            <FieldLabel>લિંગ<select className="field" name={`family_${index}_gender`}>{genders.map(([value,label]) => <option key={value || "none"} value={value}>{label}</option>)}</select></FieldLabel>
            <FieldLabel>મોબાઇલ<input className="field" name={`family_${index}_mobile`} type="tel" maxLength={24} /></FieldLabel>
            <FieldLabel>બ્લડ ગ્રુપ<select className="field" name={`family_${index}_blood_group`}>{bloodGroups.map((group) => <option key={group || "none"} value={group}>{group || "પસંદ કરો"}</option>)}</select></FieldLabel>
            <FieldLabel>અભ્યાસ<input className="field" name={`family_${index}_education`} maxLength={160} /></FieldLabel>
            <FieldLabel>વ્યવસાય<input className="field" name={`family_${index}_occupation`} maxLength={160} /></FieldLabel>
            <FieldLabel>મૂળ વતન<input className="field" name={`family_${index}_native_village`} maxLength={160} /></FieldLabel>
          </div></details>)}
        </div></section>

        <div className="rounded-2xl bg-primary p-5 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:gap-5"><div><p className="font-bold">વિગતો ચકાસીને અરજી મોકલો</p><p className="mt-1 text-sm text-primary-foreground/75">સમિતિ તપાસ્યા પછી જરૂરી હોય તો આપનો સંપર્ક કરશે.</p></div><button type="submit" className="mt-4 min-h-12 w-full rounded-xl bg-white px-6 font-bold text-primary sm:mt-0 sm:w-auto">સભ્યપદ અરજી મોકલો</button></div>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">અન્ય પ્રશ્ન માટે <Link className="font-bold text-primary underline underline-offset-4" href="/contact">સંપર્ક કરો</Link>.</p>
    </div></section>
  </>;
}
