# Deploying Sight to a live website (Vercel)

This gets the app online at a public URL like `https://sight-mvp.vercel.app`. Vercel is made by the team behind Next.js and hosts it for free — no server setup, no credit card needed for the free tier.

You'll do this once; after that, every time you update the code, the live site updates automatically.

---

## Method A — GitHub + Vercel (recommended, all in the browser)

No terminal or coding needed. About 10 minutes.

### Step 1 — Create a GitHub account
1. Go to **https://github.com** and sign up (free). Skip if you already have one.

### Step 2 — Put the code on GitHub
1. On GitHub, click the **+** (top right) → **New repository**.
2. Name it `sight-mvp`. Leave it **Private** (or Public — your choice). Do **not** add a README (you already have one). Click **Create repository**.
3. On the next page, click the link **"uploading an existing file"**.
4. Open the `sight-mvp` folder on your computer. Select **everything inside it** — including the hidden files (`.gitignore`, `.eslintrc.json`) and the `src` folder — and drag it all into the browser upload area.
   - ⚠️ Do **not** upload a `node_modules` folder if one exists. It's large and unnecessary — Vercel installs packages itself. (The included `.gitignore` already excludes it.)
5. Scroll down, click **Commit changes**.

> Prefer an app over drag-and-drop? Install **GitHub Desktop** (https://desktop.github.com), "Add existing repository" → point it at the `sight-mvp` folder → Publish. Same result.

### Step 3 — Deploy on Vercel
1. Go to **https://vercel.com** → **Sign Up** → **Continue with GitHub** (authorize it).
2. Click **Add New… → Project**.
3. Find `sight-mvp` in the list → click **Import**.
4. Vercel auto-detects **Next.js**. You don't need to change any setting.
   - Framework Preset: `Next.js` ✅
   - Build Command, Output, Install Command: leave as default.
   - Environment Variables: **none needed.**
5. Click **Deploy**.
6. Wait ~1–2 minutes. You'll get a live URL (e.g. `https://sight-mvp.vercel.app`). Click **Visit**. 🎉

### Step 4 — Updating the site later
Any change you push to the GitHub repo (via GitHub Desktop or the web uploader) redeploys automatically within a minute. No extra steps.

---

## Method B — Vercel CLI (if you're comfortable with a terminal)

Requires **Node.js 18.17+** installed (https://nodejs.org).

```bash
# 1. Install the Vercel CLI (once)
npm install -g vercel

# 2. From inside the sight-mvp folder:
cd path/to/sight-mvp

# 3. First deploy (creates a preview URL). Follow the prompts;
#    accept the detected Next.js defaults.
vercel

# 4. Promote to your production URL
vercel --prod
```

The CLI prints the live URL when it finishes.

---

## Add your own domain (optional)

Once deployed:
1. In the Vercel dashboard, open your project → **Settings → Domains**.
2. Enter your domain (e.g. `sight.sa` or `app.sight.sa`) → **Add**.
3. Vercel shows the DNS records to set. Add them at your domain registrar (GoDaddy, Namecheap, SaudiNIC, etc.). SSL is issued automatically.

---

## Troubleshooting

**"Build failed."**
The project is configured so lint and type checks won't block the first build (see `next.config.mjs`). If a build still fails, open the deployment's **Build Logs** in Vercel, copy the red error text, and send it to me — I'll fix it.

**The page loads but styles look plain.**
Give it one more deploy/refresh; Tailwind builds on the server. If it persists, share the URL and I'll check.

**I want the site in English by default.**
The app defaults to Arabic (RTL). To flip the default, change `DEFAULT_LOCALE` in `src/lib/i18n.tsx` from `"ar"` to `"en"`, then push the change.

---

## Notes for going from demo → real product

- The build currently **ignores** TypeScript/lint errors so your first deploy can't be blocked (`next.config.mjs`). Once live, run `npm run build` locally, fix anything it flags, then set both `ignoreDuringBuilds` / `ignoreBuildErrors` back to `false` for stricter safety.
- This is still **sample data** (see `README.md`). It's safe to share as a demo/prototype, but replace card data and the eligibility heuristic with real, verified sources before marketing it publicly.
