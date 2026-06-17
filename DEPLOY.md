# Riva Fitness website — deploy & Klaviyo

## Live site

- **Production:** https://riva-fitness-website.vercel.app
- **GitHub:** https://github.com/astraescapecy/riva-fitness-website

## Finish Klaviyo (one step)

Creating a **separate** list requires your Klaviyo **Private API Key** (`pk_...`):

1. Open https://www.klaviyo.com/settings/account/api-keys (Safari is already logged in)
2. Copy a private key with **Lists** write access (or create one)
3. Run:

```bash
cd website
export KLAVIYO_PRIVATE_API_KEY="pk_..."
bash scripts/setup-klaviyo-vercel.sh
```

That script will:
- Create **Riva Fitness Waitlist** on the same Klaviyo account as Jarvis
- Copy the **Public Site ID** from Jarvis
- Set Vercel env vars
- Redeploy production

## Custom domain (riva.fitness)

1. Vercel → **riva-fitness-website** → Settings → Domains
2. Add `riva.fitness` and `www.riva.fitness`
3. Point DNS to Vercel (A/CNAME records shown in dashboard)

## Local dev

```bash
cd website
cp .env.example .env.local   # add Klaviyo keys
npm install
npm run dev
```
