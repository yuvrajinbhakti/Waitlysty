# Waitlyst — Setup Guide

## Prerequisites
- Node.js 18+
- pnpm (`npm i -g pnpm`)
- A Supabase account (free)
- A Resend account (free)

---

## Step 1 — Clone & install

```bash
git clone https://github.com/yourname/waitlyst
cd waitlyst
pnpm install
```

## Step 2 — Create Supabase project

1. Go to supabase.com → New project
2. Copy the **Connection String** from Settings → Database
3. Paste into `apps/web/.env.local` as `DATABASE_URL`

## Step 3 — Set environment variables

```bash
cd apps/web
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 4 — Push database schema

```bash
cd apps/web
npx prisma db push        # creates all tables
npx prisma generate       # generates the Prisma client
```

## Step 5 — Run the dev server

```bash
cd waitlyst
pnpm dev
```

Open http://localhost:3000

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Create account |
| POST | `/api/auth/signin` | ❌ | NextAuth signin |
| GET | `/api/waitlists` | ✅ | List your waitlists |
| POST | `/api/waitlists` | ✅ | Create waitlist |
| POST | `/api/waitlists/:slug/join` | ❌ | Join (widget calls this) |
| GET | `/api/waitlists/:slug/confirm` | ❌ | Confirm email |
| GET | `/api/waitlists/:slug/subscribers` | ✅ | List subscribers |
| GET | `/api/waitlists/:slug/subscribers?format=csv` | ✅ | Export CSV |

---

## Widget usage

```html
<!-- Paste before </body> on any site -->
<script
  src="https://waitlyst.co/widget.js"
  data-waitlist-id="your-slug"
  data-theme="light">
</script>
```

---

## Deploying to Vercel

```bash
vercel --prod
# Add all .env.local variables in Vercel dashboard → Settings → Environment Variables
# Then run: npx prisma migrate deploy
```