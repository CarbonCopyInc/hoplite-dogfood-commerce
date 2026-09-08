import { NextRequest, NextResponse } from "next/server";

const INVENTORY_API_URL =
  process.env.INVENTORY_API_URL ?? "http://localhost:4000";

// Proxies GET /api/inventory[?handle=...] to the mock inventory API.
export async function GET(req: NextRequest): Promise<NextResponse> {
  const handle = req.nextUrl.searchParams.get("handle");
  const upstream = handle
    ? `${INVENTORY_API_URL}/inventory/${encodeURIComponent(handle)}`
    : `${INVENTORY_API_URL}/inventory`;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    const body = await res.json();
    return NextResponse.json(body, {
      status: res.status,
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "inventory API unavailable",
        upstream,
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}
