import { NextResponse } from "next/server";

import { getPublicTithiProgrammes } from "@/lib/operations/public-data";

export async function GET() {
  const items = await getPublicTithiProgrammes();
  return NextResponse.json(
    { items },
    { headers: { "cache-control": "public, max-age=60" } },
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Public event creation is disabled. Use the authenticated Admin programme manager.",
    },
    {
      status: 405,
      headers: { Allow: "GET" },
    },
  );
}
