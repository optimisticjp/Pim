import Link from "next/link";
import { Database } from "lucide-react";

export function AdminSetupRequired() {
  return <main className="grid min-h-screen place-items-center bg-[#f5f3ee] p-5"><div className="w-full max-w-lg rounded-[1.5rem] border border-[#dfd8ce] bg-white p-6 shadow-sm"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#f3e8db] text-primary"><Database className="size-6" /></div><h1 className="mt-5 font-serif text-2xl font-bold text-primary">Backend environment જોડાણ જરૂરી</h1><p className="mt-3 text-sm leading-7 text-muted-foreground">Supabase schema તૈયાર છે. Deployment environmentમાં project URL અને publishable key સેટ થયા પછી admin portal live data સાથે શરૂ થશે.</p><div className="mt-5 rounded-xl bg-[#f8f5ef] p-4 font-mono text-xs leading-6">NEXT_PUBLIC_SUPABASE_URL<br />NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</div><Link href="/" className="mt-5 inline-flex min-h-11 items-center font-bold text-primary">વેબસાઇટ પર પાછા જાઓ</Link></div></main>;
}
