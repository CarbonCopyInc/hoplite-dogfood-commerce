// Runs the Next dev server and the mock inventory API together, forwarding
// signals so stopping the preview stops both (a `sh -c a & b` wrapper orphans them).
import { spawn } from "node:child_process";

const children = [
  spawn("node", ["scripts/inventory-api.mjs"], { stdio: "inherit" }),
  spawn("pnpm", ["exec", "next", "dev", "--turbopack"], { stdio: "inherit" }),
];

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 500).unref();
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => shutdown(0));
}

for (const child of children) {
  child.on("exit", (code) => shutdown(code ?? 1));
}
