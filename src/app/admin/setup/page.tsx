import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { InviteSetupForm } from "@/components/admin/invite-setup-form";

export const metadata: Metadata = { title: "સ્ટાફ આમંત્રણ પૂર્ણ કરો" };

export default function AdminSetupPage() {
  return (
    <main className="min-h-screen bg-[#f4f1eb] px-4 py-8 sm:grid sm:place-items-center sm:py-12">
      <section className="mx-auto w-full max-w-md overflow-hidden rounded-[1.6rem] border border-[#ddd4c8] bg-white shadow-[0_24px_70px_rgba(52,35,26,.12)]">
        <div className="bg-[#571621] px-6 py-7 text-white">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/12"><ShieldCheck className="size-6" /></div>
          <p className="mt-5 text-xs font-bold tracking-[.12em] text-[#efbd6b]">PARIVAR SEVA STAFF</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">આમંત્રણ પૂર્ણ કરો</h1>
          <p className="mt-2 text-sm leading-6 text-white/70">તમારો પાસવર્ડ તમે જ બનાવશો. પછી મુખ્ય એડમિનની મંજૂરી જરૂરી રહેશે.</p>
        </div>
        <div className="p-6">
          <InviteSetupForm />
          <p className="mt-6 text-center text-xs text-muted-foreground"><Link className="font-bold text-primary" href="/admin/login">એડમિન પ્રવેશ પર પાછા જાઓ</Link></p>
        </div>
      </section>
    </main>
  );
}
