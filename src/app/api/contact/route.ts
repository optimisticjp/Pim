import { NextResponse } from "next/server";

import { PublicFormGatewayError, submitProtectedPublicForm } from "@/lib/public-form-gateway";

type SubmissionResult = { referenceId: string; receivedAt: string };

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ ok: false, message: "અમાન્ય વિનંતી" }, { status: 400 }); }

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const city = String(body.city ?? "").trim();
  const message = String(body.message ?? "").trim();
  const type = String(body.type ?? "general").trim();
  const turnstileToken = String(body.turnstileToken ?? "").trim();

  if (fullName.length < 2 || fullName.length > 120 || phone.length < 7 || phone.length > 30 || city.length > 120 || message.length < 5 || message.length > 3000) {
    return NextResponse.json({ ok: false, message: "જરૂરી માહિતી અધૂરી છે" }, { status: 422 });
  }

  const allowedTypes = new Set(["general", "seva", "event", "publication"]);
  if (!allowedTypes.has(type)) return NextResponse.json({ ok: false, message: "વિષય અમાન્ય છે" }, { status: 422 });
  if (!turnstileToken || turnstileToken.length > 2048) return NextResponse.json({ ok: false, message: "માનવ ચકાસણી જરૂરી છે" }, { status: 400 });

  try {
    const result = await submitProtectedPublicForm<SubmissionResult>("contact_preview", { fullName, phone, city, message, type, delivery: "inbox_v1" }, turnstileToken);
    return NextResponse.json({ ok: true, ...result }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const status = error instanceof PublicFormGatewayError ? error.status : 503;
    const messageGu = status === 429
      ? "ઘણા પ્રયાસ થયા છે. થોડા સમય પછી ફરી પ્રયાસ કરો."
      : status === 403
        ? "માનવ ચકાસણી નિષ્ફળ ગઈ. ફરી પ્રયાસ કરો."
        : status === 422
          ? "ફોર્મની માહિતી ચકાસીને ફરી મોકલો."
          : "ફોર્મ મોકલી શકાયું નથી. ફરી પ્રયાસ કરો.";
    return NextResponse.json({ ok: false, message: messageGu }, { status: Math.min(599, Math.max(400, status)), headers: { "cache-control": "no-store" } });
  }
}
