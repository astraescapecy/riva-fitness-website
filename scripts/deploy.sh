#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npx vercel link --project riva-fitness-website --yes >/dev/null 2>&1 || true
npx vercel --prod --yes
