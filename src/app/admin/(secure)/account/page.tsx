import { KeyRound, Mail, ShieldCheck } from "lucide-react";

import { changePasswordAction } from "@/app/admin/account-actions";
import { requireAdminSession } from "@/lib/admin/data";

const errors: Record<string, string> = {
  missing: "બધી વિગતો લખો.",
  length: "નવો પાસવર્ડ ૧૦ થી ૧૨૮ અક્ષર વચ્ચે હોવો જોઈએ.",
  match: "નવો પાસવર્ડ અને ફરી લખેલો પાસવર્ડ સરખા નથી.",
  same: "નવો પાસવર્ડ જૂના પાસવર્ડથી અલગ રાખો.",
  current: "હાલનો પાસવર્ડ સાચો નથી.",
  update: "પાસવર્ડ બદલાઈ શક્યો નથી. વધુ મજબૂત પાસવર્ડ અજમાવો.",
};

export default async function AdminAccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const error = params.error ? errors[params.error] : null;

  return (
    <div>
      <p className="text-xs font-bold text-gold-deep">MY ACCOUNT</p>
      <h1 className="mt-1 font-serif text-2xl font-bold text-primary sm:text-3xl">મારું ખાતું</h1>
      <p className="mt-1 text-sm text-muted-foreground">તમારી લૉગિન સુરક્ષા તમે જ સંભાળો. પાસવર્ડ મુખ્ય એડમિનને દેખાતો નથી.</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-2xl border border-[#ded6ca] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary"><ShieldCheck className="size-5" /><h2 className="font-bold">ખાતા વિગતો</h2></div>
          <p className="mt-4 text-lg font-bold">{session.profile?.display_name}</p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Mail className="size-4" />{session.user?.email ?? "—"}</p>
          <span className="mt-4 inline-block rounded-full bg-[#f5f1eb] px-3 py-1 text-xs font-bold text-primary">{session.profile?.is_super_admin ? "Super Admin" : "Approved Staff"}</span>
        </section>

        <section className="rounded-2xl border border-[#ded6ca] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary"><KeyRound className="size-5" /><h2 className="font-bold">પાસવર્ડ બદલો</h2></div>
          <form action={changePasswordAction} className="mt-4 space-y-4">
            {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</p> : null}
            <label className="block text-sm font-bold">હાલનો પાસવર્ડ<input className="field mt-2" name="current_password" type="password" autoComplete="current-password" required /></label>
            <label className="block text-sm font-bold">નવો પાસવર્ડ<input className="field mt-2" name="password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /></label>
            <label className="block text-sm font-bold">નવો પાસવર્ડ ફરી લખો<input className="field mt-2" name="confirm_password" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /></label>
            <p className="text-xs leading-5 text-muted-foreground">ઓછામાં ઓછા ૧૦ અક્ષર રાખો. પાસવર્ડ બદલ્યા પછી સુરક્ષા માટે ફરી લૉગિન કરવું પડશે.</p>
            <button className="min-h-11 rounded-xl bg-primary px-5 text-sm font-bold text-white" type="submit">પાસવર્ડ બદલો</button>
          </form>
        </section>
      </div>
    </div>
  );
}
