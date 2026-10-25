#!/usr/bin/env bash
# Deploy kelcee-beauty-co-supabase-keepalive (separate from the static site Worker).
set -euo pipefail

KEEPALIVE_CONFIG="workers/supabase-keepalive/wrangler.toml"

url="${NEXT_PUBLIC_SUPABASE_URL:-${SUPABASE_URL:-}}"
key="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY:-}}"

if [[ -z "$url" || -z "$key" ]]; then
  echo "==> Skipping Supabase keepalive (set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  exit 0
fi

echo "==> Deploy Supabase keepalive Worker"
npx wrangler deploy -c "$KEEPALIVE_CONFIG" \
  --var "SUPABASE_URL:${url}" \
  --var "SUPABASE_ANON_KEY:${key}"
