import type { SourceReference } from "@/lib/types";
export interface HistoricalVideoCollection { id: string; titleGu: string; sourceTitleEn: string; contextGu?: string; videoCount: number; sourceUrl: string; relatedGuruId?: string; relatedEventSlug?: string; source: SourceReference }
const gallery = "https://omshreemadhavanandji.org/video_gallery.php";
const source: SourceReference = { sourceSite: "legacy", sourceUrl: gallery, sourceLabel: "Legacy video gallery", status: "source-derived", reviewRequired: true };
export const historicalVideoCollections: HistoricalVideoCollection[] = [
  { id: "bhagwat-pipaliya-2010", titleGu: "શ્રીમદ્ ભાગવત સપ્તાહ જ્ઞાનયજ્ઞ", sourceTitleEn: "Shreemad Bhagwat Saptah Gyan Yagna", contextGu: "પીપળીયા • એપ્રિલ ૨૦૧૦", videoCount: 26, sourceUrl: "https://omshreemadhavanandji.org/video_list.php?vgid=4", relatedEventSlug: "bhagwat-pipaliya-2010", source },
  { id: "akhandanandji-tithi-2011", titleGu: "શ્રી અખંડાનંદ સાગરજી મહારાજની તિથિ", sourceTitleEn: "Shree Akhandanand Sagarji Maharaj's Tithi", contextGu: "સુરત • ૨૦૧૧", videoCount: 7, sourceUrl: "https://omshreemadhavanandji.org/video_list.php?vgid=3", relatedGuruId: "akhandanandji", source },
  { id: "jagdishanandji-videsh-yatra-2011", titleGu: "શ્રી જગદીશાનંદ સાગરજી મહારાજની વિદેશ યાત્રા", sourceTitleEn: "Shree Jagdishanand Sagarji Maharaj's Videsh Yatra", contextGu: "૨૦૧૧", videoCount: 6, sourceUrl: "https://omshreemadhavanandji.org/video_list.php?vgid=2", relatedGuruId: "jagdishanandji", source },
  { id: "with-swami-shree", titleGu: "સ્વામી શ્રી સાથે", sourceTitleEn: "With Swami Shree", videoCount: 3, sourceUrl: "https://omshreemadhavanandji.org/video_list.php?vgid=1", source },
];
