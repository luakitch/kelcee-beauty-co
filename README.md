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
| **Deploy command** | `npm run deploy` (or leave empty) — **not** `npx wrangler deploy` |
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

5. Under **Settings → Builds**, set **Production branch** to `main`.

That's it — **every push to `main` automatically triggers a Cloudflare build and deploy.** No GitHub Actions or extra CI setup required.

### Deploy troubleshooting

If the build succeeds but deploy fails:

- Cloudflare may auto-fill `npx wrangler deploy` — **change it to `npm run deploy`**
- Or leave the deploy command **empty** so Cloudflare publishes `out/` after the build
- `wrangler.toml` includes an `[assets]` fallback if `npx wrangler deploy` cannot be removed yet
- Set build output directory to `out` (not `.next`)
- Do **not** use OpenNext / `@opennextjs/cloudflare` — this repo uses static export only

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
