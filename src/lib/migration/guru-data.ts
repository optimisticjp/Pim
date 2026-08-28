import type { SourceReference } from "@/lib/types";

export interface GuruProfile {
  id: string;
  slug: string;
  nameGu: string;
  sourceTitleEn: string;
  qualificationGu?: string;
  portraitUrl: string;
  originalAssetUrl: string;
  localPath: string | null;
  source: SourceReference;
}

const sourceUrl = "https://omshreemadhavanandji.org/about_us.php";
const portrait = (file: string) => `https://omshreemadhavanandji.org/content/swamiji/${file}.jpg`;
const source: SourceReference = { sourceSite: "legacy", sourceUrl, sourceLabel: "Legacy About Us — Swamiji listing", status: "source-derived", reviewRequired: true };

export const guruProfiles: GuruProfile[] = [
  ["madhavanandji", "શ્રી ૧૦૦૮ સ્વામી શ્રી માધવાનંદ સાગરજી મહારાજ", "Shree 1008 Swami Shree Madhavanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["chidanandji", "શ્રી ૧૦૦૮ સ્વામી શ્રી ચિદાનંદ સાગરજી મહારાજ", "Shree 1008 Swami Shree Chidanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["shivohamji", "શ્રી ૧૦૦૮ સ્વામી શ્રી શિવોહમ સાગરજી મહારાજ", "Shree 1008 Swami Shree Shivoham Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["akhandanandji", "શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી અખંડાનંદ સાગરજી મહારાજ", "Shree 1008 Mahamandaleshwar Swami Shree Akhandanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["jagdishanandji", "શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી જગદીશાનંદ સાગરજી મહારાજ", "Shree 1008 Mahamandaleshwar Swami Shree Jagdishanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["prakashanandji", "સ્વામી શ્રી પ્રકાશાનંદ સાગરજી મહારાજ", "Swami Shree Prakashanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["hareshanandji", "બ્રહ્મચારી શ્રી હરેશાનંદજી મહારાજ", "Brahmachari Shree Hareshanandji Maharaj, Bhagwatacharya", "ભાગવતાચાર્ય"],
  ["vivekanandji", "સ્વામી શ્રી વિવેકાનંદ સાગરજી મહારાજ", "Swami Shree Vivekanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["bhumanandji", "સ્વામી શ્રી ભૂમાનંદ સાગરજી મહારાજ", "Swami Shree Bhumanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["mohananandji", "સ્વામી શ્રી મોહનાનંદ સાગરજી મહારાજ", "Swami Shree Mohananand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["sureshwaranandji", "સ્વામી શ્રી સુરેશ્વરાનંદજી મહારાજ શાસ્ત્રી", "Swami Shree Sureshwaranandji Maharaj Shastri, Vedantacharya", "વેદાંતાચાર્ય"],
  ["brahmanandji", "સ્વામી શ્રી બ્રહ્માનંદ સાગરજી મહારાજ", "Swami Shree Brahmanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["hariharanandji", "સ્વામી શ્રી હરિહરાનંદ સાગરજી મહારાજ", "Swami Shree Hariharanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["jayanandji", "બ્રહ્મચારી શ્રી જયાનંદ સાગરજી મહારાજ", "Brahmachari Shree Jayanand Sagarji Maharaj, Vedantacharya", "વેદાંતાચાર્ય"],
  ["devanandji", "સ્વામી શ્રી દેવાનંદ સાગરજી મહારાજ", "Swami Shree Devanand Sagarji Maharaj"],
  ["dayanandji", "સ્વામી શ્રી દયાનંદ સાગરજી મહારાજ", "Swami Shree Dayanand Sagarji Maharaj"],
  ["ganeshanandji", "સ્વામી શ્રી ગણેશાનંદ સાગરજી મહારાજ", "Swami Shree Ganeshanand Sagarji Maharaj"],
].map(([id, nameGu, sourceTitleEn, qualificationGu]) => {
  const originalAssetUrl = portrait(id);
  const localPath = null;
  return { id, slug: id, nameGu, sourceTitleEn, qualificationGu, portraitUrl: originalAssetUrl, originalAssetUrl, localPath, source };
});

export const featuredGuruProfiles = guruProfiles.slice(0, 6);
