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

1. Push this repo to GitHub
2. In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → connect your repo
3. Configure build settings:

| Setting | Value |
|---|---|
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 20 |

4. Add environment variables in Cloudflare Pages settings (same as `.env.local`)
5. Deploy — Cloudflare redeploys automatically on every push to `main`

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
