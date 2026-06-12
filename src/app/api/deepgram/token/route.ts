import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ accessToken: env.deepgramApiKey });
}
