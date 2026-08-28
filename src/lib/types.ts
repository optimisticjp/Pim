export type NavItem = { label: string; href: string };

export type AshramRegion =
  | "મુખ્ય કેન્દ્ર"
  | "મધ્ય ગુજરાત"
  | "સૌરાષ્ટ્ર"
  | "ઉત્તર ગુજરાત"
  | "ઉત્તર ભારત"
  | "મહારાષ્ટ્ર"
  | "વિદેશ";

export type AshramAmenity =
  | "ઉતારા વ્યવસ્થા"
  | "અન્નક્ષેત્ર / પ્રસાદ"
  | "ગૌશાળા"
  | "પાર્કિંગ"
  | "પુસ્તકાલય"
  | "સત્સંગ હોલ"
  | "વ્હીલચેર પ્રવેશ"
  | "યાત્રાળુ સુવિધા";

export interface Ashram {
  id: string;
  slug: string;
  nameGu: string;
  nameEn?: string;
  localityGu: string;
  region: AshramRegion;
  districtGu?: string;
  cityGu?: string;
  addressGu?: string;
  addressEn?: string;
  contactPersonGu?: string;
  phone?: string;
  whatsapp?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  amenities?: AshramAmenity[];
  verified: boolean;
  verificationDate?: string;
  featured?: boolean;
  descriptionGu?: string;
}

export interface EventItem {
  id: string;
  titleGu: string;
  eyebrowGu: string;
  descriptionGu: string;
  scheduleGu: string;
  venueGu: string;
  href: string;
  tone: "maroon" | "gold" | "green";
  live?: boolean;
}

export interface Publication {
  id: string;
  titleGu: string;
  editionGu: string;
  year: number;
  categoryGu: string;
  pdfUrl: string;
  descriptionGu: string;
}

export interface SevaActivity {
  id: string;
  titleGu: string;
  kickerGu: string;
  descriptionGu: string;
  icon: "cow" | "heart" | "book" | "utensils" | "sprout" | "users";
}

export interface InquiryRecord {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  type: "general" | "seva" | "event" | "publication";
  message: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
}
