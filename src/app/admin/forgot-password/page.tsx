import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, Mail } from "lucide-react";

import { forgotPasswordAction } from "@/app/admin/login/actions";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "સ્ટાફ પાસવર્ડ ફરી સેટ કરો" };

const errorMessages: Record<string, string> = {
  missing: "કૃપા કરીને તમારું સ્ટાફ ઇમેઇલ લખો.",
  rate: "ઘણા પ્રયત્નો થયા છે. થોડો સમય રાહ જોઈ ફરી પ્રયાસ કરો.",
  send: "રીસેટ ઇમેઇલ મોકલી શકાયો નથી. થોડા સમય પછી ફરી પ્રયાસ કરો.",
  configuration: "Supabase કનેક્શન હજી પર્યાવરણમાં સેટ નથી.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const configured = Boolean(getSupabaseRuntimeConfig());
  const error = params.error ? errorMessages[params.error] : null;
  const sent = params.sent === "1";

  return (
    <main className="min-h-screen bg-[#f4f1eb] px-4 py-8 sm:grid sm:place-items-center sm:py-12">
      <section className="mx-auto w-full max-w-md overflow-hidden rounded-[1.6rem] border border-[#ddd4c8] bg-white shadow-[0_24px_70px_rgba(52,35,26,.12)]">
        <div className="bg-[#571621] px-6 py-7 text-white">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/12">
            <KeyRound className="size-6" />
          </div>
          <p className="mt-5 text-xs font-bold tracking-[.12em] text-[#efbd6b]">STAFF PASSWORD RECOVERY</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">પાસવર્ડ ફરી સેટ કરો</h1>
          <p className="mt-2 text-sm leading-6 text-white/70">
            તમારા સ્ટાફ ઇમેઇલ પર સુરક્ષિત પાસવર્ડ રીસેટ લિંક મોકલવામાં આવશે.
          </p>
        </div>

        <div className="p-6">
          {!configured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              Backend જોડાણ હજી સેટ નથી.
            </div>
          ) : sent ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                <strong>ઇમેઇલ તપાસો.</strong>
                <br />
                જો આ ઇમેઇલ માટે સ્ટાફ ખાતું ઉપલબ્ધ હશે તો પાસવર્ડ બદલવાની સુરક્ષિત લિંક મોકલાઈ છે.
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                લિંક ન મળે તો Spam/Junk folder પણ તપાસો. થોડા સમય પછી જરૂર હોય તો ફરી વિનંતી કરી શકો.
              </p>
              <Link
                className="flex min-h-12 w-full items-center justify-center rounded-xl border border-[#d9cfc3] px-5 font-bold text-primary transition hover:bg-[#faf7f2]"
                href="/admin/login"
              >
                એડમિન પ્રવેશ પર પાછા જાઓ
              </Link>
            </div>
          ) : (
            <form action={forgotPasswordAction} className="space-y-4">
              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  {error}
                </p>
              ) : null}
              <label className="block text-sm font-bold text-[#463b34]">
                સ્ટાફ ઇમેઇલ
                <span className="relative mt-2 block">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    className="field pl-11"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    required
                  />
                </span>
              </label>
              <button
                className="min-h-12 w-full rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-primary-strong"
                type="submit"
              >
                રીસેટ લિંક મોકલો
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            <Link className="font-bold text-primary" href="/admin/login">
              ← એડમિન પ્રવેશ પર પાછા જાઓ
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
