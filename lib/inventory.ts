import "server-only";

const NEXT_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

// Reads stock through the app's own /api/inventory proxy route.
export async function getStock(handle: string): Promise<number | null> {
  try {
    const res = await fetch(
      `${NEXT_ORIGIN}/api/inventory?handle=${encodeURIComponent(handle)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { stock?: unknown };
    return typeof data.stock === "number" ? data.stock : null;
  } catch {
    return null;
  }
}
