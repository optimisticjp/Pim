import { InquiryTable } from "@/components/admin/inquiry-table";
export const metadata = { title: "Form Inbox" };
export default function InquiriesPage() { return <div className="mx-auto max-w-7xl"><div><div className="text-[12px] font-bold text-gold-deep">FORM INBOX</div><h1 className="mt-1 font-serif text-3xl font-bold text-primary">આવતી પૂછપરછ અને સેવા નોંધણી</h1><p className="mt-2 text-[13px] text-muted-foreground">Previewમાં data browser localStorageમાં રહે છે. જાહેર contact form submit કરીને workflow અજમાવો.</p></div><div className="mt-7"><InquiryTable /></div></div>; }
