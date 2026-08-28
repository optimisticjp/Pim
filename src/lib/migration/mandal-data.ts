import type { SourceReference } from "@/lib/types";

export interface YuvakMandalRecord { id: string; cityGu: string; ashramId?: string; detailUrl: string; source: SourceReference }
const indexUrl = "https://omshreemadhavanandji.org/yuvak_mandal_list.php";
const source: SourceReference = { sourceSite: "legacy", sourceUrl: indexUrl, sourceLabel: "Legacy Yuvak Mandal directory", status: "source-derived", reviewRequired: true };
export const yuvakMandals: YuvakMandalRecord[] = [
  ["surat", "સુરત", "surat"], ["mumbai", "મુંબઈ", "mumbai"], ["sughad", "સુઘડ", "sughad"], ["bhavnagar", "ભાવનગર", "bhavnagar"],
].map(([id, cityGu, ashramId]) => ({ id, cityGu, ashramId, detailUrl: `https://omshreemadhavanandji.org/yuvak_mandal.php?mid=${id}`, source }));
