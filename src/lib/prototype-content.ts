import type { EventItem, Publication } from "@/lib/types";

/** One deliberate boundary for all synthetic staging content. Never treat these records as verified facts. */
export const prototypeEvents: EventItem[] = [
  { id: "sharad-satsang-2026", slug: "sharad-satsang-2026", kind: "satsang", scheduleType: "dated", eyebrowGu: "વિશેષ સત્સંગ", titleGu: "શરદ પૂર્ણિમા સત્સંગ", descriptionGu: "ભજન, પાઠ અને શાંતિપૂર્ણ સામૂહિક સત્સંગનો વિશેષ સાંજનો કાર્યક્રમ.", startsAt: "2026-10-25T18:30:00+05:30", venueGu: "શ્રી માધવાનંદ આશ્રમ — સુરત", ashramId: "surat", contactUrl: "/contact?type=event", featured: true, status: "published", verified: false, prototype: true },
  { id: "ann-seva-2026", slug: "ann-seva-2026", kind: "seva", scheduleType: "dated", eyebrowGu: "સેવા કાર્યક્રમ", titleGu: "અન્ન સેવા અને સેવક મિલન", descriptionGu: "સામૂહિક સેવાભાવ સાથે અન્નસેવા અને સ્થાનિક સેવકોનું મિલન.", startsAt: "2026-11-08", venueGu: "શ્રી માધવાનંદ આશ્રમ — ચાણોદ", ashramId: "chanod", contactUrl: "/contact?type=seva", status: "published", verified: false, prototype: true },
  { id: "youth-swadhyay-2026", slug: "youth-swadhyay-2026", kind: "youth", scheduleType: "dated", eyebrowGu: "યુવા સ્વાધ્યાય", titleGu: "યુવા સંસ્કાર અને સ્વાધ્યાય દિવસ", descriptionGu: "યુવા પેઢી માટે સંવાદ, સ્વાધ્યાય અને સેવા પર કેન્દ્રિત એક દિવસીય જોડાણ.", startsAt: "2026-12-13T09:00:00+05:30", venueGu: "આંતરરાષ્ટ્રીય શ્રી માધવાનંદ આશ્રમ — સુઘડ", ashramId: "sughad", registrationUrl: "/contact?type=event", status: "published", verified: false, prototype: true },
  { id: "health-camp-2027", slug: "health-camp-2027", kind: "medical", scheduleType: "dated", eyebrowGu: "આરોગ્ય સેવા", titleGu: "નિઃશુલ્ક આરોગ્ય માર્ગદર્શન કેમ્પ", descriptionGu: "સમાજ માટે પ્રાથમિક આરોગ્ય તપાસ અને ઉપયોગી આરોગ્ય માર્ગદર્શનનો સેવાપ્રસંગ.", startsAt: "2027-01-17T08:30:00+05:30", venueGu: "શ્રી માધવાનંદ આશ્રમ — ભાવનગર", ashramId: "bhavnagar", contactUrl: "/contact?type=seva", status: "published", verified: false, prototype: true },
  { id: "guru-gita-path", slug: "guru-gita-path", kind: "satsang", scheduleType: "recurring", eyebrowGu: "નિયમિત સાધના", titleGu: "ગુરુ ગીતા પાઠ અને સત્સંગ", descriptionGu: "પાઠ, સ્મરણ અને આધ્યાત્મિક મનન માટે નિયમિત સામૂહિક જોડાણ.", recurringLabelGu: "દર રવિવારે પ્રાતઃ", venueGu: "અધિકૃત YouTube ચેનલ", livestreamUrl: "https://www.youtube.com/@SachchidanandMadhavanand/live", status: "published", verified: false, prototype: true },
  { id: "utsav-archive-2026", slug: "utsav-archive-2026", kind: "festival", scheduleType: "dated", eyebrowGu: "પ્રસંગ સ્મૃતિ", titleGu: "ગુરુપૂર્ણિમા મહોત્સવ", descriptionGu: "સામૂહિક પૂજન, સત્સંગ અને પ્રસાદ સાથે ઉજવાયેલ પરંપરાગત પ્રસંગની નોંધ.", startsAt: "2026-07-29T08:00:00+05:30", venueGu: "શ્રી માધવાનંદ આશ્રમ — સુરત", ashramId: "surat", status: "archived", verified: false, prototype: true },
  { id: "cancelled-yatra", slug: "cancelled-yatra", kind: "yatra", scheduleType: "dated", eyebrowGu: "યાત્રા સૂચના", titleGu: "ચાણોદ આધ્યાત્મિક યાત્રા", descriptionGu: "હવામાનની પરિસ્થિતિને ધ્યાનમાં રાખીને આ યાત્રા રદ કરવામાં આવી છે.", startsAt: "2026-08-16", venueGu: "શ્રી માધવાનંદ આશ્રમ — ચાણોદ", ashramId: "chanod", status: "cancelled", verified: false, prototype: true },
];

export const prototypePublications: Publication[] = [
  { id: "guru-gita-study", slug: "guru-gita-study", kind: "book", titleGu: "ગુરુ ગીતા — સ્વાધ્યાય સહાય", subtitleGu: "પાઠ સાથે મનન માટે", descriptionGu: "ગુરુતત્ત્વ, પાઠ અને દૈનિક મનન માટે ગોઠવાયેલ આધ્યાત્મિક વાંચન પરિચય.", featured: true, verified: false, prototype: true },
  { id: "seva-special", slug: "seva-special", kind: "special", titleGu: "સેવા વિશેષાંક", editionGu: "આશ્રમ પરિવારની સેવાયાત્રા", descriptionGu: "સેવા, સમાજ જોડાણ અને સ્વયંસેવક ભાવને સમજાવતો સંપાદકીય વિશેષાંક.", year: 2026, verified: false, prototype: true },
  { id: "parampara-letters", slug: "parampara-letters", kind: "letter", titleGu: "પત્ર અને સંદેશ સંગ્રહ", subtitleGu: "પરંપરાના જીવનમૂલ્યો", descriptionGu: "સાધના, સ્વાધ્યાય અને આશ્રમ જીવનના વિષયો પર ગોઠવાયેલ વાંચન સંગ્રહ.", verified: false, prototype: true },
];

export const paramparaLife = [
  ["વેદ અને ઉપનિષદ", "શ્રુતિના જ્ઞાનને જીવનના પ્રશ્નો સાથે જોડતો સ્વાધ્યાય."], ["ગુરુભક્તિ", "શ્રદ્ધા, નમ્રતા અને આચરણથી ગુરુતત્ત્વ સાથેનું જોડાણ."], ["સ્વાધ્યાય", "નિયમિત વાંચન, મનન અને સત્સંગ દ્વારા સમજનો વિસ્તાર."], ["સાધના અને સ્મરણ", "દૈનિક જીવનમાં શાંતિ, જપ અને અંતર્મુખતાનો અવકાશ."], ["સેવા", "માનવ, જીવ અને પ્રકૃતિ પ્રત્યે જવાબદારીપૂર્વક વ્યક્ત થતી ભક્તિ."], ["આશ્રમ પરિવાર", "અનેક કેન્દ્રોને એક ભાવ, એક પરંપરા અને સહભાગિતાથી જોડતો સમૂહ."],
] as const;

export const heritageModules = [
  ["ગુરુ જીવનપરિચય", "પ્રમાણિત ઐતિહાસિક આધાર સાથે પરંપરાના પ્રેરક જીવનપ્રવાહનો પરિચય.", "/parampara"], ["ઐતિહાસિક પ્રસંગ", "આશ્રમ પરિવારની સ્મૃતિમાં જીવંત રહેલા પ્રસંગોનું સંપાદકીય નિરૂપણ.", "/events"], ["પત્ર અને સંદેશ", "સાધના, સેવા અને જીવનમૂલ્યો સાથે જોડાયેલ વાંચન.", "/publications/parampara-letters"], ["પ્રકાશન", "વેદ રહસ્ય અને આધ્યાત્મિક વાંચનનો સુગમ ગ્રંથાલય પ્રવેશ.", "/publications"], ["ફોટો અભિલેખ", "આશ્રમ કેન્દ્રો અને સામૂહિક પ્રસંગોની સંદર્ભસભર દૃશ્યસ્મૃતિ.", "/ashrams"], ["સત્સંગ અને પ્રવચન", "અધિકૃત ચેનલ પર પાઠ, કથા અને સ્વાધ્યાય સાથે જોડાણ.", "/satsang"],
] as const;

export const currentGuidance = { nameGu: "પરમ પૂજ્ય શ્રી ૧૦૦૮ મહામંડલેશ્વર સ્વામી શ્રી જગદીશાનંદ સાગરજી મહારાજ", copyGu: "પરંપરાના આધ્યાત્મિક જીવનમાં સત્સંગ, સ્વાધ્યાય, ગુરુભક્તિ અને સેવાભાવને સાથે રાખતું વર્તમાન માર્ગદર્શન.", prototypeReviewRequired: true };

export const prototypeAshramHighlights: Record<string, { facilities: string[]; programmes: string[]; prototype: true }> = {
  surat: { facilities: ["સત્સંગ હોલ", "પ્રસાદ વ્યવસ્થા", "પ્રકાશન કેન્દ્ર"], programmes: ["નિયમિત પાઠ", "સામૂહિક સત્સંગ", "સેવક જોડાણ"], prototype: true },
  chanod: { facilities: ["યાત્રાળુ બેઠક", "સત્સંગ સ્થાન", "પ્રસાદ વ્યવસ્થા"], programmes: ["નર્મદા તટ સ્વાધ્યાય", "ભજન અને પાઠ", "સેવા પ્રસંગ"], prototype: true },
  sughad: { facilities: ["વિશાળ સત્સંગ હોલ", "પાર્કિંગ", "પુસ્તક વિતરણ"], programmes: ["યુવા સ્વાધ્યાય", "વિશેષ સત્સંગ", "સંસ્કાર પ્રવૃત્તિ"], prototype: true },
  bhavnagar: { facilities: ["સત્સંગ હોલ", "પ્રસાદ સ્થાન"], programmes: ["સાપ્તાહિક પાઠ", "આરોગ્ય સેવા", "યુવક મંડળ"], prototype: true },
  akru: { facilities: ["આશ્રમ પ્રાંગણ", "સામૂહિક બેઠક"], programmes: ["ભજન-સત્સંગ", "અન્ન સેવા"], prototype: true },
  haridwar: { facilities: ["યાત્રાળુ માર્ગદર્શન", "સત્સંગ સ્થાન"], programmes: ["પાઠ અને સ્મરણ", "યાત્રા સત્સંગ"], prototype: true },
};

export const prototypeSevaUpdates = [
  ["ગૌ સેવા", "ગૌશાળાની દૈનિક સંભાળમાં સેવકોનું સામૂહિક જોડાણ."], ["આરોગ્ય કેમ્પ", "પ્રાથમિક તપાસ અને આરોગ્ય જાગૃતિ માટે સ્થાનિક સેવા દિવસ."], ["અન્ન સેવા", "પ્રસંગે ભક્તો અને જરૂરિયાતમંદો માટે ભાવપૂર્વક અન્નસેવા."], ["વૃક્ષારોપણ", "આશ્રમ પરિસરમાં પ્રકૃતિ સંવર્ધન અને સ્વચ્છતા અભિયાન."], ["સંસ્કાર પ્રવૃત્તિ", "બાળકો માટે પાઠ, પ્રાર્થના અને મૂલ્યઆધારિત પ્રવૃત્તિ."], ["યુવક મંડળ સહયોગ", "કાર્યક્રમ વ્યવસ્થા અને સેવા આયોજનમાં યુવાનોની ભાગીદારી."],
] as const;
