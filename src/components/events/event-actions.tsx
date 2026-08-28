"use client";

import { CalendarPlus, Share2 } from "lucide-react";
import { useState } from "react";

import { isDateOnly } from "@/lib/event-format";
import type { EventItem } from "@/lib/types";

const siteUrl = "https://sachchidanandmadhavanand.org";

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function calendarDate(value: string) {
  if (isDateOnly(value)) return value.replaceAll("-", "");
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function calendarFile(event: EventItem) {
  const allDay = isDateOnly(event.startsAt!);
  const start = `DTSTART${allDay ? ";VALUE=DATE" : ""}:${calendarDate(event.startsAt!)}`;
  const end = event.endsAt ? `\r\nDTEND${isDateOnly(event.endsAt) ? ";VALUE=DATE" : ""}:${calendarDate(event.endsAt)}` : "";
  const location = event.venueGu ? `\r\nLOCATION:${escapeIcs(event.venueGu)}` : "";
  const url = `${siteUrl}/events/${event.slug}`;
  return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Shree Madhavanand Ashram//Karyakram Panchika//GU\r\nCALSCALE:GREGORIAN\r\nBEGIN:VEVENT\r\nUID:${escapeIcs(`${event.id}@sachchidanandmadhavanand.org`)}\r\nDTSTAMP:${calendarDate(new Date().toISOString())}\r\n${start}${end}\r\nSUMMARY:${escapeIcs(event.titleGu)}${location}\r\nURL:${url}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
}

export function EventActions({ event }: { event: EventItem }) {
  const [copied, setCopied] = useState(false);
  function addToCalendar() {
    const blob = new Blob([calendarFile(event)], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${event.slug}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  async function share() {
    const url = `${window.location.origin}/events/${event.slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: event.titleGu, url }); } catch { /* Closing the share sheet needs no feedback. */ }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }
  return <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
    {event.startsAt && event.status !== "cancelled" && <button type="button" onClick={addToCalendar} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-bold text-white"><CalendarPlus className="size-4" /> કેલેન્ડરમાં ઉમેરો</button>}
    <button type="button" onClick={share} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border-strong bg-surface px-5 font-bold text-primary"><Share2 className="size-4" /> {copied ? "લિંક કૉપી થઈ" : "શેર કરો"}</button>
  </div>;
}
