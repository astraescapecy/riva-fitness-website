#!/usr/bin/env bash
# Free stock fitness/gym video for landing background (Pexels license — free for commercial use)
# Same clip as Muscle Factory 24 app: https://www.pexels.com/video/gym-workout-3253990/
# Saves to website/public/fitness-bg.mp4 for self-hosted playback on Vercel.

set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/fitness-bg.mp4"
mkdir -p "$(dirname "$OUT")"

echo "Downloading cinematic fitness background…"
curl -fsSL -A "Mozilla/5.0" -L \
  "https://videos.pexels.com/video-files/3253990/3253990-uhd_2560_1440_24fps.mp4" \
  -o "$OUT" || {
  echo "Auto-download failed. Download manually from:"
  echo "  https://www.pexels.com/search/videos/gym/"
  echo "  Save as: $OUT"
  exit 1
}

echo "Saved to $OUT ($(du -h "$OUT" | cut -f1))"
