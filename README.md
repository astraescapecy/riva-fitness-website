# Riva Fitness — early access website

Single-page waitlist site (Jarvis-style) with a cinematic **Pexels fitness video** background — same free clip as the Muscle Factory 24 app.

## Stack

- Next.js 14 (App Router)
- Klaviyo waitlist API (same pattern as Jarvis)
- Deploy on Vercel → `riva.fitness`

## Local dev

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000

## Background video

Uses Pexels video **3253990** (free for commercial use):

- Streams from Pexels CDN by default
- Optional self-hosted copy for production:

```bash
bash scripts/download-fitness-video.sh
```

Saves `public/fitness-bg.mp4` (~40MB). The page prefers the local file when present.

Source: https://www.pexels.com/video/gym-workout-3253990/

## Klaviyo waitlist

1. Create a list in [Klaviyo](https://www.klaviyo.com)
2. Copy `.env.example` → `.env.local`
3. Add keys:

```
KLAVIYO_PRIVATE_API_KEY=pk_...
KLAVIYO_LIST_ID=XXXXXX
```

Or use `KLAVIYO_PUBLIC_API_KEY` / `NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY` instead of the private key.

## Deploy (Vercel)

```bash
cd website
npx vercel --prod
```

Add the same Klaviyo env vars in the Vercel project settings.

Point `riva.fitness` DNS to Vercel when ready.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Early access signup |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
