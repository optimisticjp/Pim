import { NextResponse } from "next/server";
import { ashrams } from "@/lib/site-data";
import type { ParticipationTrack, SevaInterest } from "@/lib/types";
import { PublicFormGatewayError, submitProtectedPublicForm } from "@/lib/public-form-gateway";

const tracks = new Set<ParticipationTrack>(["seva", "youth", "both", "information"]);
const interests = new Set<SevaInterest>(["gau-seva", "health", "food", "environment", "sanskar", "event-support", "youth-mandal", "media-digital", "other"]);
const availability = new Set(["", "પ્રસંગોપાત", "સપ્તાહાંત / રજા દરમિયાન", "જરૂર મુજબ સંપર્ક કરી શકાય", "હજુ નક્કી નથી"]);
const ashramIds = new Set(ashrams.map((ashram) => ashram.id));

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return NextResponse.json({ ok: false, message: "અમાન્ય વિનંતી" }, { status: 400 }); }
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const track = typeof body.track === "string" ? body.track : "";
  const selectedInterests = Array.isArray(body.interests) ? body.interests : [];
  const selectedAvailability = typeof body.availability === "string" ? body.availability : "";
  const ashramId = typeof body.ashramId === "string" ? body.ashramId : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken.trim() : "";

  if (fullName.length < 2 || fullName.length > 120 || phone.length < 7 || phone.length > 30 || city.length < 2 || city.length > 120 || message.length > 1500) return NextResponse.json({ ok: false, message: "કૃપા કરીને જરૂરી માહિતી યોગ્ય રીતે લખો." }, { status: 422 });
  if (!tracks.has(track as ParticipationTrack)) return NextResponse.json({ ok: false, message: "જોડાવાનો પ્રકાર અમાન્ય છે." }, { status: 422 });
  if (selectedInterests.length > 9 || selectedInterests.some((item) => typeof item !== "string" || !interests.has(item as SevaInterest))) return NextResponse.json({ ok: false, message: "રસનું ક્ષેત્ર અમાન્ય છે." }, { status: 422 });
  if (new Set(selectedInterests).size !== selectedInterests.length || !availability.has(selectedAvailability) || (ashramId && !ashramIds.has(ashramId))) return NextResponse.json({ ok: false, message: "પસંદ કરેલી માહિતી અમાન્ય છે." }, { status: 422 });
  if (!turnstileToken || turnstileToken.length > 2048) return NextResponse.json({ ok: false, message: "માનવ ચકાસણી જરૂરી છે." }, { status: 400 });

  const payload = { fullName, phone, city, track, interests: selectedInterests, availability: selectedAvailability, ashramId, message };
  try {
    const result = await submitProtectedPublicForm<{ mode: "preview"; receivedAt: string }>("participation_preview", payload, turnstileToken);
    return NextResponse.json({ ok: true, ...result }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const status = error instanceof PublicFormGatewayError ? error.status : 503;
    const messageGu = status === 429 ? "ઘણા પ્રયાસ થયા છે. થોડા સમય પછી ફરી પ્રયાસ કરો." : status === 403 ? "માનવ ચકાસણી નિષ્ફળ ગઈ. ફરી પ્રયાસ કરો." : "ફોર્મ ચકાસી શકાયું નથી. ફરી પ્રયાસ કરો.";
    return NextResponse.json({ ok: false, message: messageGu }, { status: Math.min(599, Math.max(400, status)), headers: { "cache-control": "no-store" } });
  }
}
