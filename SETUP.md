# Water Scarcity Intelligence — Setup Guide

This guide walks you through going from zero to a live, working tool in about 20 minutes.
No code to write. Just follow the steps.

---

## What you need before you start

| Account      | Status       | URL                         |
|------------- |------------- |----------------------------|
| GitHub       | ✅ You have this | github.com/Meh-MehYRACTIS  |
| Netlify      | ✅ You have this | netlify.com                |
| **Supabase** | **🔲 Create this** | supabase.com            |

---

## Step 1 — Create your Supabase account (5 minutes)

1. Go to **https://supabase.com**
2. Click **Start your project**
3. Click **Continue with GitHub** — this signs you in with your existing GitHub account
4. Once logged in, click **New project**
5. Fill in:
   - **Name:** `water-scarcity-intelligence`
   - **Database password:** Pick something strong and save it (you won't need it often)
   - **Region:** Pick whichever is closest to you
6. Click **Create new project** and wait about 60 seconds for it to spin up

---

## Step 2 — Create the database tables (2 minutes)

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from this repo and copy its entire contents
4. Paste into the SQL Editor
5. Click **Run**
6. You should see: `Success. No rows returned`

---

## Step 3 — Load the Iran assessment data (2 minutes)

1. Still in the SQL Editor, click **New query** again
2. Open the file `supabase/seeds/iran.sql` from this repo and copy its entire contents
3. Paste into the SQL Editor
4. Click **Run**
5. You should see: `Success. 1 row affected`

Iran is now in your database. The tool will render it automatically.

---

## Step 4 — Connect your Supabase credentials (3 minutes)

1. In Supabase, click **Settings** (gear icon) in the left sidebar
2. Click **API**
3. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefghij.supabase.co`
   - **anon public** key — a long string starting with `eyJ`
4. Open the file `config.js` in this repo
5. Replace `YOUR_SUPABASE_URL` with your Project URL
6. Replace `YOUR_SUPABASE_ANON_KEY` with your anon public key
7. Save the file

Your `config.js` should now look like:
```js
var SUPABASE_URL      = 'https://abcdefghij.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Step 5 — Push to GitHub (2 minutes)

Commit and push the updated `config.js` (and all other new files) to GitHub:

```bash
git add .
git commit -m "Wire up Supabase and deploy frontend"
git push
```

If you're not comfortable with git commands, you can also edit `config.js` directly in the GitHub web interface: go to the file, click the pencil icon, make the change, and click **Commit changes**.

---

## Step 6 — Deploy to Netlify (5 minutes)

1. Go to **https://netlify.com** and log in
2. Click **Add new site** → **Import an existing project**
3. Click **GitHub**
4. Authorize Netlify to access your repositories if prompted
5. Find and select `Meh-MehYRACTIS/water-scarcity-intelligence`
6. On the build settings screen:
   - **Branch to deploy:** `main` (or whatever your default branch is)
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
7. Click **Deploy site**
8. Netlify will give you a URL like `https://amazing-name-123.netlify.app`

Your tool is live.

---

## Step 7 — Test it

Open your Netlify URL. You should see:
- The site loads with a spinner
- Iran's assessment renders with the risk score, all five layers, and the sources
- The country selector dropdown appears in the header

If you see an error instead, check:
- Is `config.js` saved with the correct URL and key?
- Did you run both SQL files (schema then seed)?
- Is the Netlify deploy finished? (check the Deploys tab)

---

## How to add a new country

Adding Mexico, India, or any other country is just data — no code changes needed.

1. Open `supabase/seeds/country-template.sql`
2. Fill in every `<<FILL IN>>` placeholder with real data
3. Paste the completed SQL into the Supabase SQL Editor and click Run
4. The country immediately appears in the dropdown on your live site

**Tip:** Ask Claude to research and fill in the template for any country. Just say:
> "Fill in country-template.sql for [country name] using data from WRI Aqueduct, NASA GRACE, FAO AQUASTAT, and BIS research."

---

## File reference

| File | Purpose |
|------|---------|
| `index.html` | The single-page application shell |
| `style.css` | All visual styles |
| `app.js` | Rendering engine — turns database data into pages |
| `config.js` | Your Supabase credentials (you fill this in) |
| `netlify.toml` | Netlify deployment settings |
| `supabase/schema.sql` | Database table definitions — run once |
| `supabase/seeds/iran.sql` | Iran assessment data — run once |
| `supabase/seeds/country-template.sql` | Template for adding new countries |

---

## Architecture overview

```
Browser
  ↕ (static files)
Netlify
  index.html + style.css + app.js + config.js

Browser
  ↕ (REST API calls with anon key)
Supabase
  PostgreSQL database (countries table)
```

No server-side code. No build step. No framework. Just a static site talking directly to Supabase. Free tier limits are generous enough that this costs nothing at any realistic scale.

---

## Troubleshooting

**"Supabase is not configured"** — You haven't filled in `config.js` yet, or the changes haven't been deployed. Re-check Step 4 and Step 5.

**"Failed to connect to Supabase"** — The URL or key in `config.js` is wrong. Copy them again directly from Supabase → Settings → API.

**"Database is empty"** — You need to run `iran.sql` in the Supabase SQL Editor (Step 3).

**The site shows a white/blank page** — Open browser DevTools (F12), check the Console tab for error messages, and report what you see.

**Country selector doesn't appear** — This is normal when only one country exists. The selector shows but auto-selects the only country. Add a second country to see the full dropdown behavior.
