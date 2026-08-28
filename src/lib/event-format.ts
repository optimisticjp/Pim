import { formatGujaratiNumber } from "@/lib/gujarati-format";

const monthsGu = ["જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન", "જુલાઈ", "ઑગસ્ટ", "સપ્ટેમ્બર", "ઑક્ટોબર", "નવેમ્બર", "ડિસેમ્બર"];
const dateOnlyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function getEventDateParts(value: string) {
  const dateOnly = value.match(dateOnlyPattern);
  if (dateOnly) return { day: Number(dateOnly[3]), month: Number(dateOnly[2]), year: Number(dateOnly[1]) };
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "numeric", month: "numeric", year: "numeric" }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
  return { day: part("day"), month: part("month"), year: part("year") };
}

export function formatEventDate(value: string) {
  const { day, month, year } = getEventDateParts(value);
  return `${formatGujaratiNumber(day)} ${monthsGu[month - 1]} ${formatGujaratiNumber(year)}`;
}

export function formatEventDateBlock(value: string) {
  const { day, month, year } = getEventDateParts(value);
  return { day: formatGujaratiNumber(day), month: monthsGu[month - 1], year: formatGujaratiNumber(year) };
}

export function formatEventDateTime(value: string) {
  const date = formatEventDate(value);
  if (dateOnlyPattern.test(value)) return date;
  const time = new Intl.DateTimeFormat("gu-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }).format(new Date(value));
  return `${date}, ${time}`;
}

export function isDateOnly(value: string) {
  return dateOnlyPattern.test(value);
}

export function getIndiaCalendarDate(value: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function compareEventStartToNow(startsAt: string, now: Date): number {
  if (isDateOnly(startsAt)) {
    const today = getIndiaCalendarDate(now);
    return startsAt === today ? 0 : startsAt > today ? 1 : -1;
  }
  return new Date(startsAt).getTime() - now.getTime();
}
