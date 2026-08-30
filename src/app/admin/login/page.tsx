import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

import { loginAction } from "@/app/admin/login/actions";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "એડમિન પ્રવેશ" };

const errorMessages: Record<string, string> = {
  invalid: "ઇમેઇલ અથવા પાસવર્ડ સાચો નથી.",
  access: "આ ખાતાને એડમિન પ્રવેશ સક્રિય નથી.",
  missing: "ઇમેઇલ અને પાસવર્ડ બંને લખો.",
  configuration: "Supabase કનેક્શન હજી પર્યાવરણમાં સેટ નથી.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const configured = Boolean(getSupabaseRuntimeConfig());
  const error = params.error ? errorMessages[params.error] : null;

  return (
    <main className="min-h-screen bg-[#f4f1eb] px-4 py-8 sm:grid sm:place-items-center sm:py-12">
      <section className="mx-auto w-full max-w-md overflow-hidden rounded-[1.6rem] border border-[#ddd4c8] bg-white shadow-[0_24px_70px_rgba(52,35,26,.12)]">
        <div className="bg-[#571621] px-6 py-7 text-white">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/12"><LockKeyhole className="size-6" /></div>
          <p className="mt-5 text-xs font-bold tracking-[.12em] text-[#efbd6b]">PARIVAR SEVA ADMIN</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">જય સચ્ચિદાનંદ</h1>
          <p className="mt-2 text-sm leading-6 text-white/70">સમિતિ માટે સુરક્ષિત સંચાલન પોર્ટલ</p>
        </div>

        <div className="p-6">
          {!configured ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              <strong>Backend જોડાણ બાકી છે.</strong><br />Deployment environmentમાં <code>NEXT_PUBLIC_SUPABASE_URL</code> અને <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> ઉમેર્યા પછી પ્રવેશ ચાલુ થશે.
            </div>
          ) : (
            <form action={loginAction} className="space-y-4">
              {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}
              <label className="block text-sm font-bold text-[#463b34]">ઇમેઇલ<input className="field mt-2" name="email" type="email" autoComplete="email" required /></label>
              <label className="block text-sm font-bold text-[#463b34]">પાસવર્ડ<input className="field mt-2" name="password" type="password" autoComplete="current-password" required /></label>
              <button className="min-h-12 w-full rounded-xl bg-primary px-5 font-bold text-white transition hover:bg-primary-strong" type="submit">એડમિનમાં પ્રવેશ</button>
            </form>
          )}
          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">ફક્ત અધિકૃત સમિતિ સભ્યો માટે. <Link className="font-bold text-primary" href="/">વેબસાઇટ પર પાછા જાઓ</Link></p>
        </div>
      </section>
    </main>
  );
}
