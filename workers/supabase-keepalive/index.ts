/**
 * Standalone cron Worker (not the static site). Pings Supabase daily on the free tier.
 * Manual check: GET https://kelcee-beauty-co-supabase-keepalive.<subdomain>.workers.dev/
 */

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
}

const KEEPALIVE_PATH = "/rest/v1/business_hours?select=day_key&limit=1";

async function pingSupabase(env: Env): Promise<Response> {
  const base = env.SUPABASE_URL?.replace(/\/$/, "");
  const key = env.SUPABASE_ANON_KEY?.trim();

  if (!base || !key) {
    return new Response("Supabase keepalive: missing SUPABASE_URL or SUPABASE_ANON_KEY", {
      status: 503,
    });
  }

  const res = await fetch(`${base}${KEEPALIVE_PATH}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  const ok = res.ok || res.status === 206;
  const body = `Supabase keepalive: HTTP ${res.status}`;

  return new Response(body, { status: ok ? 200 : 502 });
}

export default {
  async fetch(_request: Request, env: Env): Promise<Response> {
    return pingSupabase(env);
  },

  async scheduled(
    _controller: unknown,
    env: Env,
    ctx: { waitUntil(promise: Promise<unknown>): void },
  ): Promise<void> {
    ctx.waitUntil(pingSupabase(env));
  },
};
