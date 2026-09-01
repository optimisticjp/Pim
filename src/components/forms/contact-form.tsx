"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const initial = { fullName: "", phone: "", city: "", type: "general", message: "" };

type SubmissionResponse = { referenceId?: string; receivedAt?: string; message?: string };

export function ContactForm() {
  const params = useSearchParams();
  const defaultType = useMemo(() => {
    const requested = params.get("type");
    return requested === "seva" || requested === "event" || requested === "publication" ? requested : "general";
  }, [params]);
  const [form, setForm] = useState({ ...initial, type: defaultType });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (form.fullName.trim().length < 2 || form.phone.trim().length < 7 || form.message.trim().length < 5) {
      setError("કૃપા કરીને નામ, સંપર્ક નંબર અને સંદેશ સંપૂર્ણ લખો.");
      return;
    }
    const turnstileToken = String(new FormData(event.currentTarget).get("cf-turnstile-response") ?? "");
    if (!turnstileToken) {
      setError("કૃપા કરીને માનવ ચકાસણી પૂર્ણ કરો.");
      return;
    }
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });
      const result = await response.json() as SubmissionResponse;
      if (!response.ok) throw new Error(result.message || "સંદેશ મોકલી શકાયો નથી.");
      if (!result.referenceId || !result.receivedAt) throw new Error("સંદેશની નોંધની પુષ્ટિ મળી નથી. ફરી પ્રયાસ કરો.");
      setForm({ ...initial, type: defaultType });
      setStatus("success");
    } catch (caught) {
      setStatus("error");
      setError(caught instanceof Error ? caught.message : "ફોર્મ મોકલવામાં અડચણ આવી. ફરી પ્રયાસ કરો.");
    }
  }

  if (status === "success") {
    return (
      <div className="card-sacred grid min-h-[380px] place-items-center p-8 text-center">
        <div>
          <CheckCircle2 className="mx-auto h-12 w-12 text-sacred-green" />
          <h2 className="mt-5 font-serif text-3xl font-bold text-primary">આપનો સંદેશ પ્રાપ્ત થયો.</h2>
          <p className="mx-auto mt-3 max-w-lg text-[14px] leading-7 text-muted-foreground">આ સંદેશ આશ્રમના એડમિન ઇનબોક્સમાં નોંધાયો છે. જરૂરી હોય તો સમિતિ આપેલી સંપર્ક વિગતો પર આપનો સંપર્ક કરશે.</p>
          <button type="button" onClick={() => setStatus("idle")} className="mt-6 min-h-11 rounded-full bg-primary px-6 font-bold text-primary-foreground">બીજો સંદેશ મોકલો</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-sacred p-5 sm:p-7">
      <div className="mb-6 rounded-2xl border border-[#d8c2a5] bg-[#fff8ec] p-4 text-[14px] leading-7 text-[#554842]"><strong className="block text-primary">ઑનલાઇન સંદેશ સેવા સક્રિય છે.</strong>આપનો સંદેશ માનવ ચકાસણી પછી આશ્રમના એડમિન ઇનબોક્સમાં નોંધાશે.</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="પૂર્ણ નામ *"><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="field" autoComplete="name" /></Field>
        <Field label="મોબાઇલ નંબર *"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" inputMode="tel" autoComplete="tel" /></Field>
        <Field label="શહેર / ગામ"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="field" autoComplete="address-level2" /></Field>
        <Field label="વિષય">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="field">
            <option value="general">સામાન્ય પૂછપરછ</option>
            <option value="seva">સેવામાં જોડાવું છે</option>
            <option value="event">કાર્યક્રમ અંગે</option>
            <option value="publication">પ્રકાશન / વેદ રહસ્ય</option>
          </select>
        </Field>
      </div>
      <Field label="આપનો સંદેશ *" className="mt-4"><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={6} className="field resize-y" /></Field>
      {error ? <p className="mt-4 rounded-xl bg-[#f9e4df] px-4 py-3 text-[13px] font-semibold text-[#8b292b]" role="alert">{error}</p> : null}
      <button type="submit" disabled={status === "loading"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 font-bold text-primary-foreground disabled:opacity-60 sm:w-auto">
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} ફોર્મ મોકલો
      </button>
      <p className="mt-4 text-[12px] leading-5 text-muted-foreground">માત્ર જરૂરી સંપર્ક વિગતો મોકલો. સંવેદનશીલ વ્યક્તિગત અથવા નાણાકીય માહિતી અહીં ન લખશો.</p>
    </form>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block text-[13px] font-bold text-[#554842] ${className}`}><span className="mb-2 block">{label}</span>{children}</label>;
}
