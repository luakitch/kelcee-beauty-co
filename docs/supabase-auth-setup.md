# Supabase admin auth setup

## Fix localhost redirects in invite emails

If invite links send people to `http://localhost:3000`, update Supabase:

1. **Authentication → URL Configuration**
2. **Site URL** — set to your live admin invite page:
   ```
   https://YOUR-PRODUCTION-DOMAIN/admin/accept-invite
   ```
   Example (Cloudflare Pages):
   ```
   https://kelcee-beauty-co.pages.dev/admin/accept-invite
   ```
3. **Redirect URLs** — add all allowed origins (one per line or as configured):
   ```
   http://localhost:3000/**
   https://kelcee-beauty-co.pages.dev/**
   https://YOUR-CUSTOM-DOMAIN.com/**
   ```

Save, then **send a new invite** — old emails still point at the previous Site URL.

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` and Cloudflare to match production (no trailing slash):

```bash
NEXT_PUBLIC_SITE_URL=https://kelcee-beauty-co.pages.dev
```

---

## Customize invite emails

In **Authentication → Email Templates → Invite user**:

- Edit subject and body (HTML supported)
- Use variables like `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`
- Match Kelcee’s brand voice in the copy

For fully custom sender/from address, configure **Project Settings → Authentication → SMTP** (optional).

---

## Invite an admin

1. Add their email to `NEXT_PUBLIC_ADMIN_EMAILS` and `is_gallery_admin()` in `supabase/schema.sql`
2. **Authentication → Users → Invite user**
3. Enter email → send invite
4. They open the email → land on `/admin/accept-invite` → set password → `/admin/dashboard`

Alternatively create a user with a temporary password and **Auto confirm user** checked — they can sign in at `/admin` immediately.

---

## What the app handles

| Route | Purpose |
|---|---|
| `/admin` | Sign in for existing admins |
| `/admin/forgot-password` | Request a reset email (admin emails only) |
| `/admin/change-password` | Change password while signed in (dashboard header link) |
| `/admin/accept-invite` | Branded set-password page for invite & reset links |
| `/admin/dashboard` | Gallery CMS (requires login) |

The set-password page uses your site styling (logo, blush theme) — not Supabase’s generic hosted page.
