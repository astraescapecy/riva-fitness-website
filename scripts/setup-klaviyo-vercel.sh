#!/usr/bin/env bash
# Provision Riva Fitness Klaviyo list + Vercel env + production deploy.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="${VERCEL_PROJECT:-riva-fitness-website}"
EXPORT_TOKEN="${SETUP_EXPORT_TOKEN:-riva-setup-$(date +%s)}"

cd "$ROOT"

echo "→ Riva Fitness waitlist setup (Klaviyo + Vercel)"

# 1) Try to borrow Jarvis Klaviyo public key from live Vercel (same account)
JARVIS_DIR="${JARVIS_WEBSITE_DIR:-$HOME/Desktop/Jarvis/website}"
PUBLIC_KEY="${KLAVIYO_PUBLIC_API_KEY:-}"
PRIVATE_KEY="${KLAVIYO_PRIVATE_API_KEY:-}"
LIST_ID="${KLAVIYO_LIST_ID:-}"

if [[ -z "$PUBLIC_KEY" && -d "$JARVIS_DIR" ]]; then
  echo "→ Exporting Klaviyo keys from jarvis-website (temporary internal route)…"
  (
    cd "$JARVIS_DIR"
    npx vercel link --project jarvis-website --yes >/dev/null 2>&1 || true
    printf '%s\n' "$EXPORT_TOKEN" | npx vercel env add SETUP_EXPORT_TOKEN production --yes --force >/dev/null 2>&1 || true
    npx vercel --prod --yes >/dev/null
  )
  sleep 8
  JARVIS_URL="${JARVIS_URL:-https://jarvis-website-khaki.vercel.app}"
  EXPORT_JSON="$(curl -fsSL "$JARVIS_URL/api/internal/setup-export" \
    -H "Authorization: Bearer $EXPORT_TOKEN" || true)"
  PUBLIC_KEY="$(node -e "try{const j=JSON.parse(process.argv[1]);process.stdout.write(j.publicApiKey||'')}catch(e){}" "$EXPORT_JSON")"
  PRIVATE_KEY="$(node -e "try{const j=JSON.parse(process.argv[1]);process.stdout.write(j.privateApiKey||'')}catch(e){}" "$EXPORT_JSON")"
  (
    cd "$JARVIS_DIR"
    npx vercel env rm SETUP_EXPORT_TOKEN production --yes >/dev/null 2>&1 || true
  )
fi

if [[ -z "$PUBLIC_KEY" ]]; then
  echo "Could not auto-detect Klaviyo Public API Key."
  echo "Paste it from https://www.klaviyo.com/settings/account/api-keys"
  read -r -p "Klaviyo Public API Key (Site ID): " PUBLIC_KEY
fi

PUBLIC_KEY="$(echo "$PUBLIC_KEY" | tr -d '[:space:]')"

# 2) Create dedicated Riva list (needs private key)
if [[ -z "$LIST_ID" ]]; then
  if [[ -n "$PRIVATE_KEY" ]]; then
    echo "→ Creating Klaviyo list: Riva Fitness Waitlist…"
    LIST_JSON="$(KLAVIYO_PRIVATE_API_KEY="$PRIVATE_KEY" KLAVIYO_PUBLIC_API_KEY="$PUBLIC_KEY" \
      node "$ROOT/scripts/create-klaviyo-list.mjs")"
    LIST_ID="$(node -e "const j=JSON.parse(process.argv[1]);process.stdout.write(j.listId||'')" "$LIST_JSON")"
    PUBLIC_FROM_LIST="$(node -e "const j=JSON.parse(process.argv[1]);process.stdout.write(j.publicApiKey||'')" "$LIST_JSON")"
    if [[ -n "$PUBLIC_FROM_LIST" ]]; then PUBLIC_KEY="$PUBLIC_FROM_LIST"; fi
  else
    echo ""
    echo "To create a separate Riva list, set KLAVIYO_PRIVATE_API_KEY and re-run."
    echo "Or create list manually: https://www.klaviyo.com/lists → Riva Fitness Waitlist"
    read -r -p "Klaviyo List ID for Riva Fitness Waitlist: " LIST_ID
    LIST_ID="$(echo "$LIST_ID" | tr -d '[:space:]')"
  fi
fi

if [[ -z "$LIST_ID" || -z "$PUBLIC_KEY" ]]; then
  echo "Error: missing list ID or public key."
  exit 1
fi

echo "→ Using list $LIST_ID"

# 3) Vercel env for riva-fitness-website
npx vercel link --project "$PROJECT" --yes >/dev/null 2>&1 || true

add_env() {
  local name="$1"
  local value="$2"
  npx vercel env rm "$name" production --yes >/dev/null 2>&1 || true
  printf '%s\n' "$value" | npx vercel env add "$name" production --yes --force
}

echo "→ Setting Vercel environment variables…"
add_env KLAVIYO_PUBLIC_API_KEY "$PUBLIC_KEY"
add_env NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY "$PUBLIC_KEY"
add_env KLAVIYO_LIST_ID "$LIST_ID"
add_env NEXT_PUBLIC_KLAVIYO_LIST_ID "$LIST_ID"
if [[ -n "$PRIVATE_KEY" ]]; then
  add_env KLAVIYO_PRIVATE_API_KEY "$PRIVATE_KEY"
fi

echo "→ Deploying production…"
npx vercel --prod --yes

echo ""
echo "Done."
echo "  List ID: $LIST_ID"
echo "  Test signup on your Vercel URL."
