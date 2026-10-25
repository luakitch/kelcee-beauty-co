#!/usr/bin/env bash
# Cloudflare Workers CI deploy — branch-aware.
#
# Cloudflare Workers Builds injects WORKERS_CI_BRANCH (not CF_PAGES_BRANCH).
# https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
#
# main/master           → wrangler deploy              → kelceehairco.com
# staging / preview     → wrangler deploy --env preview → preview.kelceehairco.com
#
# Recommended Cloudflare setup (Settings → Builds):
#   Production trigger → main branch  → Deploy command: npm run deploy
#   Preview trigger    → staging branch → Deploy command: npm run deploy
#
# Do NOT use bare `npx wrangler deploy` — production needs --var for Supabase keepalive.

set -euo pipefail

normalize_branch() {
  local raw="${1:-}"
  raw="${raw#refs/heads/}"
  echo "$raw" | tr '[:upper:]' '[:lower:]'
}

RAW_BRANCH="${WORKERS_CI_BRANCH:-${CF_PAGES_BRANCH:-${GITHUB_REF_NAME:-}}}"
BRANCH="$(normalize_branch "$RAW_BRANCH")"

if [[ -z "$BRANCH" ]]; then
  BRANCH="main"
fi

echo "Deploy context:"
echo "  WORKERS_CI_BRANCH=${WORKERS_CI_BRANCH:-<unset>}"
echo "  CF_PAGES_BRANCH=${CF_PAGES_BRANCH:-<unset>}"
echo "  Resolved branch: $BRANCH"

if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo "==> Production deploy (static assets + Supabase keepalive cron)"
  url="${NEXT_PUBLIC_SUPABASE_URL:-${SUPABASE_URL:-}}"
  key="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY:-}}"
  if [[ -n "$url" && -n "$key" ]]; then
    npx wrangler deploy --env="" \
      --var "SUPABASE_URL:${url}" \
      --var "SUPABASE_ANON_KEY:${key}"
  else
    echo "WARNING: NEXT_PUBLIC_SUPABASE_* unset — keepalive cron will 503 until vars are set on deploy"
    npx wrangler deploy --env=""
  fi
  echo ""
  echo "Production: https://kelceehairco.com"
  echo "Keepalive check: https://kelceehairco.com/__keepalive/supabase"
elif [[ "$BRANCH" == "staging" || "$BRANCH" == "preview" ]]; then
  echo "==> Preview deploy"
  npx wrangler deploy --env preview
  echo ""
  echo "Preview: https://preview.kelceehairco.com"
else
  echo "==> Preview deploy (non-production branch: $BRANCH)"
  npx wrangler deploy --env preview
  echo ""
  echo "Preview: https://preview.kelceehairco.com"
fi
