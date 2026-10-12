"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, LoaderCircle } from "lucide-react";

type SetupState = "loading" | "ready" | "saving" | "done" | "error";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function InviteSetupForm() {
  const [state, setState] = useState<SetupState>("loading");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function resolveInviteSession() {
      if (!supabaseUrl || !publishableKey) {
        setMessage("સિસ્ટમ કનેક્શન ઉપલબ્ધ નથી.");
        setState("error");
        return;
      }

      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const query = new URLSearchParams(window.location.search);
      const hashError = hash.get("error_description");
      if (hashError) {
        setMessage(decodeURIComponent(hashError.replace(/\+/g, " ")));
        setState("error");
        return;
      }

      let accessToken = hash.get("access_token") ?? query.get("access_token") ?? "";
      const tokenHash = query.get("token_hash") ?? hash.get("token_hash") ?? "";
      const flowType = hash.get("type") ?? query.get("type") ?? "invite";
      const supportedFlow = flowType === "invite" || flowType === "recovery";
      if (!supportedFlow) throw new Error("આ સ્ટાફ સેટઅપ લિંક માન્ય નથી.");

      if (!accessToken && tokenHash) {
        const verifyResponse = await fetch(supabaseUrl + "/auth/v1/verify", {
          method: "POST",
          headers: {
            apikey: publishableKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({ token_hash: tokenHash, type: flowType }),
        });
        const verifyPayload = await verifyResponse.json().catch(() => ({})) as {
          access_token?: string;
          message?: string;
          msg?: string;
        };
        if (!verifyResponse.ok || !verifyPayload.access_token) {
          throw new Error(verifyPayload.message ?? verifyPayload.msg ?? "આમંત્રણ માન્ય નથી અથવા સમય પૂરો થયો છે.");
        }
        accessToken = verifyPayload.access_token;
      }

      if (!accessToken) throw new Error("આમંત્રણ લિંક અધૂરી છે. મુખ્ય એડમિન પાસેથી નવું આમંત્રણ મેળવો.");

      if (!cancelled) {
        setToken(accessToken);
        setState("ready");
        window.history.replaceState({}, "", "/admin/setup");
      }
    }

    resolveInviteSession().catch((error: unknown) => {
      if (!cancelled) {
        setMessage(error instanceof Error ? error.message : "આમંત્રણ ખોલવામાં મુશ્કેલી આવી.");
        setState("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm_password") ?? "");

    if (password.length < 10) {
      setMessage("પાસવર્ડ ઓછામાં ઓછા ૧૦ અક્ષરનો હોવો જોઈએ.");
      return;
    }
    if (password !== confirm) {
      setMessage("બન્ને પાસવર્ડ સરખા નથી.");
      return;
    }

    setState("saving");
    setMessage("");

    try {
      const response = await fetch(supabaseUrl + "/functions/v1/admin-team", {
        method: "POST",
        headers: {
          apikey: publishableKey,
          Authorization: "Bearer " + token,
          "content-type": "application/json",
        },
        body: JSON.stringify({ action: "complete_invite", password }),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "પાસવર્ડ સેટ થઈ શક્યો નથી.");

      await fetch(supabaseUrl + "/auth/v1/logout", {
        method: "POST",
        headers: {
          apikey: publishableKey,
          Authorization: "Bearer " + token,
        },
      }).catch(() => undefined);

      setToken("");
      setState("done");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "પાસવર્ડ સેટ થઈ શક્યો નથી.");
      setState("ready");
    }
  }

  if (state === "loading") {
    return <div className="flex items-center gap-3 rounded-2xl bg-[#f8f5f0] p-4 text-sm font-semibold"><LoaderCircle className="size-5 animate-spin text-primary" /> આમંત્રણ ચકાસી રહ્યા છીએ…</div>;
  }

  if (state === "error") {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">{message}</div>;
  }

  if (state === "done") {
    return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"><CheckCircle2 className="size-7" /><h2 className="mt-3 font-bold">પાસવર્ડ સેટ થઈ ગયો.</h2><p className="mt-2 text-sm leading-6">હવે મુખ્ય એડમિન તમારી મંજૂરી આપશે. મંજૂરી પછી તમે એડમિન પોર્ટલમાં પ્રવેશ કરી શકશો.</p></div>;
  }

  return (
    <form action={submit} className="space-y-4">
      {message ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">{message}</p> : null}
      <div className="flex items-center gap-2 text-primary"><KeyRound className="size-5" /><p className="text-sm font-bold">તમારો પોતાનો પાસવર્ડ બનાવો</p></div>
      <label className="block text-sm font-bold text-[#463b34]">નવો પાસવર્ડ<input className="field mt-2" name="password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /></label>
      <label className="block text-sm font-bold text-[#463b34]">પાસવર્ડ ફરી લખો<input className="field mt-2" name="confirm_password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /></label>
      <p className="text-xs leading-5 text-muted-foreground">ઓછામાં ઓછા ૧૦ અક્ષર. પાસવર્ડ કોઈને આપશો નહીં—મુખ્ય એડમિનને પણ નહીં.</p>
      <button disabled={state === "saving"} className="min-h-12 w-full rounded-xl bg-primary px-5 font-bold text-white disabled:opacity-60" type="submit">{state === "saving" ? "સેટ થઈ રહ્યો છે…" : "પાસવર્ડ સેટ કરો"}</button>
    </form>
  );
}
