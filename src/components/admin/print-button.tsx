"use client";
import { Printer } from "lucide-react";
export function PrintButton(){return <button type="button" onClick={()=>window.print()} className="print:hidden inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white"><Printer className="size-4"/>Print / Save PDF</button>}
