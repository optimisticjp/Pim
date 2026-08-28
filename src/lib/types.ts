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

export type SatsangCategory =
  | "nitya-karma"
  | "guru-gita"
  | "katha"
  | "bhajan"
  | "chaturmas"
  | "pravachan"
  | "festival"
  | "other";

export type SatsangMediaType = "video" | "audio";

export interface SatsangLiveStatus {
  isLive: boolean;
  videoId?: string;
  titleGu?: string;
  startedAt?: string;
}

export interface SatsangSeries {
  id: string;
  slug: string;
  titleGu: string;
  descriptionGu?: string;
  category: SatsangCategory;
  youtubePlaylistId?: string;
  youtubeUrl?: string;
  coverImage?: string;
  featured?: boolean;
  verified: boolean;
}

export interface SatsangVideo {
  id: string;
  youtubeVideoId: string;
  titleGu: string;
  seriesId?: string;
  speakerId?: string;
  eventId?: string;
  publishedAt?: string;
  mediaType: SatsangMediaType;
  audioUrl?: string;
  durationSeconds?: number;
  featured?: boolean;
  verified: boolean;
  verificationDate?: string;
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

export type PublicationKind = "veda-rahasya" | "book" | "letter" | "special" | "other";

export interface Publication {
  id: string;
  slug: string;
  kind: PublicationKind;
  titleGu: string;
  subtitleGu?: string;
  editionGu?: string;
  monthGu?: string;
  year?: number;
  descriptionGu?: string;
  pdfUrl: string;
  coverImageUrl?: string;
  authorGu?: string;
  publishedAt?: string;
  pageCount?: number;
  featured?: boolean;
  verified: boolean;
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
