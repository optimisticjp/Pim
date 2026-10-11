"use client";

import Link from "next/link";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type RecoveryState = {
  accessToken: string | null;
  error: string | null;
};

function readRecoveryState(): RecoveryState {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  const type = hash.get("type");
  const errorDescription = hash.get("error_description");

  if (errorDescription) {
    return { accessToken: null, error: decodeURIComponent(errorDescription.replace(/\+/g, " ")) };
  }
  if (!accessToken || (type && type !== "recovery")) {
    return {
      accessToken: null,
      error: "આ પાસવર્ડ રીસેટ લિંક માન્ય નથી અથવા તેની સમયમર્યાદા પૂર્ણ થઈ ગઈ છે.",
    };
  }
  return { accessToken, error: null };
}

export function PasswordResetForm() {
  const [recovery, setRecovery] = useState<RecoveryState>({ accessToken: null, error: null });
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = readRecoveryState();
      setRecovery(next);
      setReady(true);

      // Recovery credentials arrive in the URL fragment. Remove them from the
      // visible address immediately; fragments are not sent to the server.
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!recovery.accessToken || status === "saving") return;

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    setMessage(null);

    if (password.length < 12) {
      setMessage("નવો પાસવર્ડ ઓછામાં ઓછા 12 અક્ષરનો રાખો.");
      return;
    }
    if (password !== confirmation) {
      setMessage("બંને પાસવર્ડ સરખા નથી.");
      return;
    }

    setStatus("saving");
    try {
      const response = await fetch("/api/admin/password-reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ accessToken: recovery.accessToken, password }),
        cache: "no-store",
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setMessage(
          result.error ??
            "પાસવર્ડ બદલાઈ શક્યો નથી. નવી રીસેટ લિંક મેળવી ફરી પ્રયાસ કરો.",
        );
        setStatus("idle");
        return;
      }

      setStatus("done");
      setRecovery({ accessToken: null, error: null });
    } catch {
      setMessage("નેટવર્ક સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.");
      setStatus("idle");
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        સુરક્ષિત લિંક તપાસી રહ્યા છીએ…
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950">
          <CheckCircle2 className="size-6" />
          <h2 className="mt-3 font-serif text-xl font-bold">પાસવર્ડ સફળતાપૂર્વક બદલાયો</h2>
          <p className="mt-2 text-sm leading-6">
            સુરક્ષા માટે હવે તમારા નવા પાસવર્ડથી ફરી એડમિન પ્રવેશ કરો.
          </p>
        </div>
        <Link
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-primary-strong"
          href="/admin/login"
        >
          એડમિન પ્રવેશ
        </Link>
      </div>
    );
  }

  if (recovery.error || !recovery.accessToken) {
    return (
      <div className="space-y-4">
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
          {recovery.error ?? "રીસેટ લિંક માન્ય નથી."}
        </p>
        <Link
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-primary-strong"
          href="/admin/forgot-password"
        >
          નવી રીસેટ લિંક મેળવો
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {message}
        </p>
      ) : null}

      <label className="block text-sm font-bold text-[#463b34]">
        નવો પાસવર્ડ
        <span className="relative mt-2 block">
          <KeyRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="field pl-11"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
          />
        </span>
      </label>

      <label className="block text-sm font-bold text-[#463b34]">
        નવો પાસવર્ડ ફરી લખો
        <input
          className="field mt-2"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
        />
      </label>

      <p className="text-xs leading-5 text-muted-foreground">
        ઓછામાં ઓછા 12 અક્ષરનો અનોખો પાસવર્ડ રાખો. અન્ય વેબસાઇટ પર વપરાતો પાસવર્ડ અહીં ન વાપરો.
      </p>

      <button
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            પાસવર્ડ બદલી રહ્યા છીએ…
          </>
        ) : (
          "નવો પાસવર્ડ સેટ કરો"
        )}
      </button>
    </form>
  );
}
