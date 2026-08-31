"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { DocumentUploadForm } from "@/app/(site)/stay/documents/document-upload-form";

type Context = {
  request_number: string;
  expires_at: string;
  remaining_uploads: number;
  people: Array<{ guest_id: string | null; full_name: string; uploaded_count: number }>;
};

type UploadState = {
  token: string;
  context: Context | null;
  error: string;
};

export function DocumentUploadPage() {
  const [state, setState] = useState<UploadState>({ token: "", context: null, error: "" });

  useEffect(() => {
    const raw = window.location.hash.replace(/^#token=/, "").trim();
    if (raw.length !== 64) {
      queueMicrotask(() => setState({ token: "", context: null, error: "આ સુરક્ષિત અપલોડ કડી માન્ય નથી." }));
      return;
    }

    const controller = new AbortController();
    void fetch("/api/stay/documents/context", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: raw }),
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Invalid link");
        return body as Context;
      })
      .then((context) => setState({ token: raw, context, error: "" }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({ token: "", context: null, error: "આ અપલોડ કડી અમાન્ય છે અથવા તેની સમયમર્યાદા પૂર્ણ થઈ ગઈ છે." });
      });

    return () => controller.abort();
  }, []);

  if (state.error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center font-bold text-red-900">{state.error}</div>;
  }
  if (!state.context) {
    return <div className="rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">સુરક્ષિત કડી ચકાસી રહ્યા છીએ…</div>;
  }

  return <div>
    <div className="mb-5 rounded-2xl border border-[#cbdad1] bg-[#edf4ef] p-4 text-sm leading-7 text-[#34564f]">
      <div className="flex items-center gap-2 font-bold"><ShieldCheck className="size-5" /> ખાનગી દસ્તાવેજ અપલોડ</div>
      <p className="mt-1">અરજી: <strong>{state.context.request_number}</strong>. ફાઇલો જાહેર gallery/media માં ક્યારેય દેખાશે નહીં. દરેક ફાઇલ મહત્તમ 5 MB.</p>
    </div>
    <DocumentUploadForm token={state.token} people={state.context.people} />
  </div>;
}
