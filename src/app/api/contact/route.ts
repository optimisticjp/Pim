import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ ok: false, message: "અમાન્ય વિનંતી" }, { status: 400 }); }

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const message = String(body.message ?? "").trim();
  const type = String(body.type ?? "general").trim();

  if (fullName.length < 2 || fullName.length > 120 || phone.length < 7 || phone.length > 30 || message.length < 5 || message.length > 3000) {
    return NextResponse.json({ ok: false, message: "જરૂરી માહિતી અધૂરી છે" }, { status: 422 });
  }

  const allowedTypes = new Set(["general", "seva", "event", "publication"]);
  if (!allowedTypes.has(type)) return NextResponse.json({ ok: false, message: "વિષય અમાન્ય છે" }, { status: 422 });

  return NextResponse.json({ ok: true, mode: "preview", receivedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
