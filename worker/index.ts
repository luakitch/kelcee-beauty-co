/**
 * Serves static assets and runs a nightly Supabase keepalive (free-tier inactivity).
 * Manual check: GET https://kelceehairco.com/__keepalive/supabase
 */

interface Env {
  ASSETS: Fetcher;
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
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/__keepalive/supabase") {
      return pingSupabase(env);
    }
    return env.ASSETS.fetch(request);
  },

  async scheduled(
    _controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<void> {
    ctx.waitUntil(pingSupabase(env));
  },
};
