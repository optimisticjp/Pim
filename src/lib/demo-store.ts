"use client";

import type { EventItem, InquiryRecord, ParticipationInquiry } from "@/lib/types";
import { events as seedEvents } from "@/lib/site-data";

const inquiryKey = "madhavanand-preview-inquiries";
const eventsKey = "madhavanand-preview-events";
const participationKey = "madhavanand-preview-participation";

const seedInquiries: InquiryRecord[] = [
  {
    id: "inq-demo-1",
    fullName: "કિરણભાઈ પટેલ",
    phone: "+91 98••• ••210",
    city: "સુરત",
    type: "seva",
    message: "આગામી મહોત્સવમાં પરિવાર સાથે સેવા માટે જોડાવું છે.",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
  {
    id: "inq-demo-2",
    fullName: "હેતલબેન શાહ",
    phone: "+91 97••• ••845",
    city: "અમદાવાદ",
    type: "publication",
    message: "વેદ રહસ્યના જૂના અંકો અંગે માહિતી જોઈએ છે.",
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getPreviewInquiries(): InquiryRecord[] {
  if (!canUseStorage()) return seedInquiries;
  const raw = localStorage.getItem(inquiryKey);
  if (!raw) {
    localStorage.setItem(inquiryKey, JSON.stringify(seedInquiries));
    return seedInquiries;
  }
  try {
    return JSON.parse(raw) as InquiryRecord[];
  } catch {
    return seedInquiries;
  }
}

export function addPreviewInquiry(record: InquiryRecord) {
  const rows = getPreviewInquiries();
  const next = [record, ...rows];
  if (canUseStorage()) localStorage.setItem(inquiryKey, JSON.stringify(next));
  return next;
}

export function updateInquiryStatus(id: string, status: InquiryRecord["status"]) {
  const next = getPreviewInquiries().map((row) => (row.id === id ? { ...row, status } : row));
  if (canUseStorage()) localStorage.setItem(inquiryKey, JSON.stringify(next));
  return next;
}

export function getPreviewParticipation(): ParticipationInquiry[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(participationKey);
  if (!raw) return [];
  try { return JSON.parse(raw) as ParticipationInquiry[]; } catch { return []; }
}

export function addPreviewParticipation(record: ParticipationInquiry) {
  const next = [record, ...getPreviewParticipation()];
  if (canUseStorage()) localStorage.setItem(participationKey, JSON.stringify(next));
  return next;
}

export function updateParticipationStatus(id: string, status: ParticipationInquiry["status"]) {
  const next = getPreviewParticipation().map((row) => row.id === id ? { ...row, status } : row);
  if (canUseStorage()) localStorage.setItem(participationKey, JSON.stringify(next));
  return next;
}

export function getPreviewEvents(): EventItem[] {
  if (!canUseStorage()) return seedEvents;
  const raw = localStorage.getItem(eventsKey);
  if (!raw) {
    localStorage.setItem(eventsKey, JSON.stringify(seedEvents));
    return seedEvents;
  }
  try {
    return JSON.parse(raw) as EventItem[];
  } catch {
    return seedEvents;
  }
}

export function savePreviewEvents(rows: EventItem[]) {
  if (canUseStorage()) localStorage.setItem(eventsKey, JSON.stringify(rows));
  return rows;
}
