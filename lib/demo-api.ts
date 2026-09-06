import "server-only";

export function getDemoApiKey(): string {
  const apiKey = process.env.DEMO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "DEMO_API_KEY is not set. Add it to your environment (see .env.example) before calling getDemoApiKey().",
    );
  }

  return apiKey;
}
