import { NextResponse } from "next/server";
import { getPublishedEvents } from "@/lib/event-data";

export async function GET() {
  return NextResponse.json({ items: getPublishedEvents() }, { headers: { "cache-control": "public, max-age=60" } });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || String(body.titleGu ?? "").trim().length < 3) return NextResponse.json({ ok: false }, { status: 422 });
  return NextResponse.json({ ok: true, mode: "preview", id: `evt-${Date.now()}` }, { status: 201 });
}
