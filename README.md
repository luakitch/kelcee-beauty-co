# Kelcee Beauty Co.

A pink pastel marketing site for Kelcee Beauty Co. — built with Next.js, styled with Tailwind CSS, and designed to deploy free on Cloudflare Pages with Supabase for gallery photos.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile link for booking |

The site works without Supabase configured — the gallery shows styled placeholders until you connect it.

### 3. Set up Supabase (optional for v1)

1. Create a free project at [supabase.com](https://supabase.com)
2. In **Storage**, create a public bucket named `gallery`
3. In **SQL Editor**, run the schema in [`supabase/schema.sql`](supabase/schema.sql)
4. Upload test photos to the `gallery` bucket
5. Insert rows into `gallery_images` with the storage path and optional caption

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
```

Static files are output to the `out/` directory.

## Deploy to Cloudflare Pages

This site is a **static export** (`output: "export"` → `out/`). Use **Cloudflare Pages**, not Workers/OpenNext.

1. Push this repo to GitHub
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Configure build settings:

| Setting | Value |
|---|---|
| Framework preset | None (or Next.js Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| **Deploy command** | `npm run pages:deploy` (or leave empty if Cloudflare auto-publishes `out/`) |
| Node version | `22` (matches `.node-version`; or set env var `NODE_VERSION=22`) |

4. Add environment variables in **Settings → Environment variables** (Production):

| Variable | Production value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key (`sb_publishable_...`) |
| `NEXT_PUBLIC_SUPABASE_GALLERY_BUCKET` | `gallery` |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Comma-separated admin emails |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram profile URL |
| `NODE_VERSION` | `22` |

5. Under **Settings → Builds**, set **Production branch** to `main` — every push to `main` triggers a new build and deploy.

### Auto deploy on push to `main`

You can use **either** (or both) of these:

**Option A — Cloudflare Git integration (simplest)**  
Once the repo is connected and production branch is `main`, Cloudflare builds and deploys automatically on every push. No GitHub Actions secrets required.

**Option B — GitHub Actions (recommended if Cloudflare auto-detects Workers/OpenNext)**  
This repo includes [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and runs:

```bash
wrangler pages deploy out --project-name=kelcee-beauty-co
```

Add these **GitHub repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token → **Edit Cloudflare Workers** template (includes Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard URL or **Workers & Pages** overview |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable key |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Admin email list |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram URL |

If using GitHub Actions to deploy, disable Cloudflare’s automatic Git builds to avoid double deploys (**Settings → Builds → disconnect** or pause Git integration).

[`.github/workflows/build.yml`](.github/workflows/build.yml) also runs a build check on every push and pull request to `main`.

### Deploy troubleshooting

If the build succeeds but deploy fails with `opennextjs-cloudflare` or `pages-manifest.json` missing:

- Your project is trying to deploy as a **Worker** instead of static **Pages**
- **Replace** `npx wrangler deploy` with `npm run pages:deploy` (or clear the deploy command entirely)
- Set build output directory to `out` (not `.next`)
- Do **not** use the OpenNext / `@opennextjs/cloudflare` adapter — this repo does not need it

The repo includes `wrangler.toml` with `pages_build_output_dir = "out"` to guide Cloudflare Pages.

## Project Structure

```
app/              Pages (Home, Services, Gallery, About, Contact)
components/       Reusable UI components
lib/              Site config and Supabase client
supabase/         Database schema SQL
public/           Static assets
```

## Customization

Edit [`lib/site-config.ts`](lib/site-config.ts) to update site name, tagline, contact info, hours, and services.

## Roadmap

- **Phase 2:** Admin CMS at `/admin` — Kelcee logs in and manages gallery photos
- **Phase 3:** Online booking and payments
