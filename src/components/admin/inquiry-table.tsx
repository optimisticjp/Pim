"use client";

import { Download, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { getPreviewInquiries, updateInquiryStatus } from "@/lib/demo-store";
import type { InquiryRecord } from "@/lib/types";

const statusLabels = { new: "નવું", in_progress: "પ્રક્રિયામાં", resolved: "પૂર્ણ" };
const typeLabels = { general: "સામાન્ય", seva: "સેવા", event: "કાર્યક્રમ", publication: "પ્રકાશન" };

export function InquiryTable() {
  const [rows, setRows] = useState<InquiryRecord[]>([]);
  useEffect(() => setRows(getPreviewInquiries()), []);

  function change(id: string, status: InquiryRecord["status"]) { setRows(updateInquiryStatus(id, status)); }
  function exportCsv() {
    const header = ["name", "phone", "city", "type", "status", "message", "created_at"];
    const lines = rows.map((r) => [r.fullName, r.phone, r.city, r.type, r.status, r.message, r.createdAt].map((v) => `"${String(v).replaceAll('"','""')}"`).join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download="madhavanand-inquiries.csv"; a.click(); URL.revokeObjectURL(url);
  }
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2"><button onClick={() => setRows(getPreviewInquiries())} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-white px-4 text-[12px] font-bold text-primary"><RotateCcw className="h-3.5 w-3.5" /> ફરી લોડ</button><button onClick={exportCsv} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-4 text-[12px] font-bold text-primary-foreground"><Download className="h-3.5 w-3.5" /> CSV Export</button></div>
      <div className="overflow-x-auto rounded-2xl border border-[#decfbf] bg-[#fffaf3]"><table className="w-full min-w-[850px] text-left text-[13px]"><thead className="bg-[#efe5d8] text-[11px] font-bold text-[#69594f]"><tr><th className="px-4 py-3">ભક્ત</th><th className="px-4 py-3">પ્રકાર</th><th className="px-4 py-3">સંદેશ</th><th className="px-4 py-3">પ્રાપ્ત</th><th className="px-4 py-3">સ્થિતિ</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id} className="border-t border-[#e7dbcd] align-top"><td className="px-4 py-4"><strong className="text-primary">{row.fullName}</strong><div className="mt-1 text-[11px] text-muted-foreground">{row.phone} • {row.city || "—"}</div></td><td className="px-4 py-4 font-semibold">{typeLabels[row.type]}</td><td className="max-w-md px-4 py-4 leading-6 text-muted-foreground">{row.message}</td><td className="px-4 py-4 whitespace-nowrap text-[11px] text-muted-foreground">{new Intl.DateTimeFormat("gu-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(row.createdAt))}</td><td className="px-4 py-4"><select value={row.status} onChange={(e) => change(row.id, e.target.value as InquiryRecord["status"])} className="min-h-9 rounded-lg border border-border bg-white px-2 text-[12px] font-bold text-primary"><option value="new">નવું</option><option value="in_progress">પ્રક્રિયામાં</option><option value="resolved">પૂર્ણ</option></select><div className="mt-1 text-[10px] text-muted-foreground">{statusLabels[row.status]}</div></td></tr>)}</tbody></table></div>
    </div>
  );
}
