"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { addPreviewParticipation } from "@/lib/demo-store";
import type { Ashram, ParticipationInquiry, ParticipationTrack, SevaInterest } from "@/lib/types";

const tracks: { value: ParticipationTrack; label: string }[] = [
  { value: "seva", label: "સેવા માટે જોડાવું છે" }, { value: "youth", label: "યુવક / યુવા જોડાણ" },
  { value: "both", label: "સેવા અને યુવા જોડાણ — બંને" }, { value: "information", label: "માત્ર માહિતી જોઈએ" },
];
const interests: { value: SevaInterest; label: string }[] = [
  { value: "gau-seva", label: "ગૌ સેવા" }, { value: "health", label: "આરોગ્ય સેવા" },
  { value: "food", label: "અન્ન સેવા" }, { value: "environment", label: "પર્યાવરણ" },
  { value: "sanskar", label: "ગુરુકુળ / સંસ્કાર" }, { value: "event-support", label: "કાર્યક્રમ સહયોગ" },
  { value: "youth-mandal", label: "યુવક મંડળ" }, { value: "media-digital", label: "મીડિયા / ડિજિટલ કુશળતા સહયોગ" },
  { value: "other", label: "અન્ય" },
];
const availabilityOptions = ["પ્રસંગોપાત", "સપ્તાહાંત / રજા દરમિયાન", "જરૂર મુજબ સંપર્ક કરી શકાય", "હજુ નક્કી નથી"];
const blank = { fullName: "", phone: "", city: "", interests: [] as SevaInterest[], availability: "", ashramId: "", message: "" };

export function ParticipationForm({ ashrams }: { ashrams: Pick<Ashram, "id" | "nameGu" | "localityGu">[] }) {
  const params = useSearchParams();
  const requestedTrack: ParticipationTrack = params.get("track") === "youth" ? "youth" : "seva";
  return <ParticipationFormFields key={requestedTrack} ashrams={ashrams} initialTrack={requestedTrack} />;
}

function ParticipationFormFields({ ashrams, initialTrack }: { ashrams: Pick<Ashram, "id" | "nameGu" | "localityGu">[]; initialTrack: ParticipationTrack }) {
  const [form, setForm] = useState({ ...blank, track: initialTrack });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  function toggleInterest(value: SevaInterest) {
    setForm((current) => ({ ...current, interests: current.interests.includes(value) ? current.interests.filter((item) => item !== value) : [...current.interests, value] }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (form.fullName.trim().length < 2 || form.phone.trim().length < 7 || form.city.trim().length < 2) {
      setError("કૃપા કરીને પૂર્ણ નામ, મોબાઇલ નંબર અને શહેર / ગામ લખો."); return;
    }
    const turnstileToken = String(new FormData(event.currentTarget).get("cf-turnstile-response") ?? "");
    if (!turnstileToken) {
      setError("કૃપા કરીને માનવ ચકાસણી પૂર્ણ કરો."); return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/participation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, turnstileToken }) });
      const result = await response.json() as { message?: string; mode?: "preview" };
      if (!response.ok) throw new Error(result.message || "વિનંતી સ્વીકારી શકાઈ નથી.");
      if (result.mode !== "preview") throw new Error("હાલ ઑનલાઇન રસ નોંધણી ઉપલબ્ધ નથી. કૃપા કરીને મુખ્ય આશ્રમનો ફોન દ્વારા સંપર્ક કરો.");
      const record: ParticipationInquiry = { id: `part-${Date.now()}`, ...form, fullName: form.fullName.trim(), phone: form.phone.trim(), city: form.city.trim(), message: form.message.trim() || undefined, availability: form.availability || undefined, ashramId: form.ashramId || undefined, status: "new", createdAt: new Date().toISOString() };
      addPreviewParticipation(record); setForm({ ...blank, track: initialTrack }); setStatus("success");
    } catch (caught) { setStatus("idle"); setError(caught instanceof Error ? caught.message : "ફોર્મ મોકલવામાં અડચણ આવી. ફરી પ્રયાસ કરો."); }
  }

  if (status === "success") return <div className="card-sacred grid min-h-[360px] place-items-center p-6 text-center sm:p-9"><div><CheckCircle2 className="mx-auto h-12 w-12 text-sacred-green" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl font-bold text-primary sm:text-3xl">ફોર્મનું પૂર્વદર્શન પૂર્ણ થયું.</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">આ માહિતી આશ્રમ સમિતિ સુધી પહોંચી નથી અને માત્ર આ ઉપકરણ પરના પૂર્વદર્શન માટે રહે છે. સત્તાવાર રીતે સેવા માટે જોડાવા ચકાસેલી સંપર્ક વિગતો દ્વારા મુખ્ય આશ્રમનો ફોન પર સંપર્ક કરો.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/ashrams" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 font-bold text-white">આશ્રમ શોધો</Link><Link href="/satsang" className="inline-flex min-h-12 items-center justify-center rounded-full border border-border-strong px-5 font-bold text-primary">સત્સંગ જુઓ</Link></div></div></div>;

  return <form onSubmit={submit} className="card-sacred p-5 sm:p-7" noValidate>
    <div className="mb-6 rounded-2xl border border-[#d8c2a5] bg-[#fff8ec] p-4 text-[14px] leading-7 text-[#554842]"><strong className="block text-primary">હાલ આ ફોર્મ પૂર્વદર્શન માટે છે.</strong>અહીં આપેલી વિગતો આશ્રમ સમિતિ સુધી મોકલાતી નથી અને માત્ર આ ઉપકરણ પર રહે છે. સત્તાવાર સેવા જોડાણ માટે મુખ્ય આશ્રમનો ફોન દ્વારા સંપર્ક કરો.</div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="પૂર્ણ નામ *" htmlFor="participation-name"><input id="participation-name" required minLength={2} maxLength={120} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="field" autoComplete="name" /></Field>
      <Field label="મોબાઇલ નંબર *" htmlFor="participation-phone"><input id="participation-phone" required minLength={7} maxLength={30} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" inputMode="tel" autoComplete="tel" /></Field>
      <Field label="શહેર / ગામ *" htmlFor="participation-city"><input id="participation-city" required minLength={2} maxLength={120} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="field" autoComplete="address-level2" /></Field>
      <Field label="જોડાવાનો પ્રકાર *" htmlFor="participation-track"><select id="participation-track" value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value as ParticipationTrack })} className="field">{tracks.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select></Field>
    </div>
    <fieldset className="mt-6"><legend className="text-[14px] font-bold text-[#554842]">રસના ક્ષેત્રો <span className="font-normal text-muted-foreground">(એકથી વધુ પસંદ કરી શકો)</span></legend><p className="mt-1 text-[13px] leading-6 text-muted-foreground">આ પસંદગી આપ કઈ રીતે સહયોગ આપવા ઇચ્છો છો તે સમજવામાં મદદ કરે છે; સેવા ફાળવણીની ખાતરી આપતી નથી.</p><div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">{interests.map((item) => <label key={item.value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-soft px-3 py-2.5 text-[14px] font-semibold"><input type="checkbox" checked={form.interests.includes(item.value)} onChange={() => toggleInterest(item.value)} className="h-5 w-5 accent-primary" /><span>{item.label}</span></label>)}</div></fieldset>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <Field label="ઉપલબ્ધતા" htmlFor="participation-availability"><select id="participation-availability" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="field"><option value="">પસંદ કરવું જરૂરી નથી</option>{availabilityOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
      <Field label="નજીકનો / પસંદગીનો આશ્રમ" htmlFor="participation-ashram"><select id="participation-ashram" value={form.ashramId} onChange={(e) => setForm({ ...form, ashramId: e.target.value })} className="field"><option value="">કોઈ પસંદગી નથી</option>{ashrams.map((ashram) => <option key={ashram.id} value={ashram.id}>{ashram.nameGu} — {ashram.localityGu}</option>)}</select></Field>
    </div>
    <Field label="સંદેશ (વૈકલ્પિક)" htmlFor="participation-message" className="mt-4"><textarea id="participation-message" maxLength={1500} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="field resize-y" placeholder="આપ કેવી રીતે સહયોગ આપવા ઇચ્છો છો તેની ટૂંકી માહિતી" /></Field>
    {error ? <p role="alert" className="mt-4 rounded-xl bg-[#f9e4df] px-4 py-3 text-[13px] font-semibold text-[#8b292b]">{error}</p> : null}
    <button type="submit" disabled={status === "loading"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-white disabled:opacity-60 sm:w-auto">{status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />} રસ નોંધાવો</button>
    <p className="mt-4 text-[12px] leading-5 text-muted-foreground">માત્ર જરૂરી વિગતો મોકલો. સંવેદનશીલ વ્યક્તિગત અથવા નાણાકીય માહિતી અહીં ન લખશો.</p>
  </form>;
}

function Field({ label, htmlFor, children, className = "" }: { label: string; htmlFor: string; children: React.ReactNode; className?: string }) { return <div className={className}><label htmlFor={htmlFor} className="mb-2 block text-[13px] font-bold text-[#554842]">{label}</label>{children}</div>; }
