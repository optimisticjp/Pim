import { events } from "@/lib/site-data";
import { prototypeEvents } from "@/lib/prototype-content";
import { compareEventStartToNow } from "@/lib/event-format";
import type { EventItem, EventKind } from "@/lib/types";

function isPublic(event: EventItem) {
  return (event.verified || event.prototype) && (event.status === "published" || event.status === "cancelled" || event.status === "archived");
}

const publicSeed = [...events, ...prototypeEvents];

function eventTime(event: EventItem) {
  return event.startsAt ? new Date(event.startsAt).getTime() : Number.NaN;
}

export function getEvents(): EventItem[] {
  return publicSeed;
}

export function getPublishedEvents(): EventItem[] {
  return publicSeed.filter(isPublic);
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return getPublishedEvents().find((event) => event.slug === slug);
}

export function getUpcomingEvents(now = new Date()): EventItem[] {
  return getPublishedEvents()
    .filter((event) => event.status === "published" && event.scheduleType === "dated" && event.startsAt && compareEventStartToNow(event.startsAt, now) >= 0)
    .sort((a, b) => eventTime(a) - eventTime(b));
}

export function getRecurringProgrammes(): EventItem[] {
  return getPublishedEvents().filter((event) => event.status === "published" && event.scheduleType === "recurring" && event.recurringLabelGu);
}

export function getArchivedEvents(now = new Date()): EventItem[] {
  return getPublishedEvents()
    .filter((event) => event.scheduleType === "dated" && event.startsAt && compareEventStartToNow(event.startsAt, now) < 0)
    .sort((a, b) => eventTime(b) - eventTime(a));
}

export function getFeaturedEvents(): EventItem[] {
  return getPublishedEvents().filter((event) => event.status === "published" && event.featured);
}

export function getEventsByAshram(ashramId: string): EventItem[] {
  return getPublishedEvents().filter((event) => event.ashramId === ashramId);
}

export function getEventKinds(): EventKind[] {
  return Array.from(new Set(getPublishedEvents().map((event) => event.kind)));
}
