#!/usr/bin/env bash
# Cloudflare Workers CI deploy — branch-aware.
#
# main/master           → wrangler deploy              → kelceehairco.com
# staging / preview     → wrangler deploy --env preview → preview.kelceehairco.com
# other branches        → wrangler versions upload --preview-alias preview (workers.dev fallback)
#
# Docs: https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/

set -euo pipefail

BRANCH="${CF_PAGES_BRANCH:-${GITHUB_REF_NAME:-main}}"

if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo "==> Production deploy (branch: $BRANCH)"
  npx wrangler deploy
  echo ""
  echo "Production: https://kelceehairco.com"
elif [[ "$BRANCH" == "staging" || "$BRANCH" == "preview" ]]; then
  echo "==> Preview deploy (branch: $BRANCH)"
  npx wrangler deploy --env preview
  echo ""
  echo "Preview: https://preview.kelceehairco.com"
else
  echo "==> Version preview upload (branch: $BRANCH)"
  npx wrangler versions upload --preview-alias preview
  echo ""
  echo "Preview URL: https://preview-kelcee-beauty-co.kitchel301.workers.dev"
  echo "(Use the staging or preview branch for preview.kelceehairco.com)"
fi
