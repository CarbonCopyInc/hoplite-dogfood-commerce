// Tiny standalone mock inventory API. No dependencies; run with `node scripts/inventory-api.mjs`.
import { createServer } from "node:http";

const PORT = Number(process.env.INVENTORY_API_PORT ?? 4000);

// Stock levels keyed by demo catalog product handle (see lib/shopify/demo.ts).
const STOCK = {
  "aurora-desk-lamp": 42,
  "cedar-notebook": 120,
  "halo-wireless-speaker": 8,
  "nimbus-backpack": 17,
  "pebble-mug": 64,
  "solstice-sunglasses": 0,
  "tide-runner-sneakers": 23,
  "vela-throw-blanket": 11,
  "zephyr-desk-organizer": 35,
};

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (req.method !== "GET")
    return json(res, 405, { error: "method not allowed" });

  // `/` must return 200 so preview readiness probes succeed.
  if (url.pathname === "/" || url.pathname === "/health") {
    return json(res, 200, {
      ok: true,
      service: "inventory-api",
      routes: ["/health", "/inventory", "/inventory/:handle"],
    });
  }

  if (url.pathname === "/inventory") {
    return json(res, 200, {
      items: Object.entries(STOCK).map(([handle, stock]) => ({
        handle,
        stock,
      })),
    });
  }

  const match = url.pathname.match(/^\/inventory\/([^/]+)$/);
  if (match) {
    const handle = decodeURIComponent(match[1]);
    if (!(handle in STOCK))
      return json(res, 404, { error: "unknown product", handle });
    return json(res, 200, { handle, stock: STOCK[handle] });
  }

  return json(res, 404, { error: "not found" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`inventory-api listening on http://localhost:${PORT}`);
});
