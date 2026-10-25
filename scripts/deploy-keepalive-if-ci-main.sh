#!/usr/bin/env bash
# After production build on Cloudflare Workers CI, deploy keepalive even when deploy is only `wrangler deploy`.
set -euo pipefail

branch="${WORKERS_CI_BRANCH:-}"
branch="${branch#refs/heads/}"
branch="$(echo "$branch" | tr '[:upper:]' '[:lower:]')"

if [[ -z "$branch" ]]; then
  exit 0
fi

if [[ "$branch" != "main" && "$branch" != "master" ]]; then
  exit 0
fi

bash scripts/deploy-keepalive.sh
