# THE ILLUSION — Official Website

Cinematic single-book experience site for **THE ILLUSION** by Shree Hari,
published by Zero Degree Publications.

This is **Deliverable 1: the complete public website**. It runs with **zero
database setup** — just install and run. The commerce layer (login, UPI orders,
dashboards, admin) arrives in Deliverable 2.

## What's inside
- Cinematic loading screen with the book's opening line
- 3D rotating book (real cover) with automatic flat-image fallback
- Two-doors signature experience
- Full sections: About, Why It's Different, Author, Chapters (real tête-bêche
  structure), Quotes, Reviews, Gallery, FAQ, Contact
- Apple-style smooth scrolling, scroll progress, scroll-reveal animations
- Fully responsive, keyboard-accessible, reduced-motion aware
- SEO: metadata, OpenGraph, sitemap, robots, structured for search

## Run it (fresh machine)
1. Install Node.js LTS from https://nodejs.org
2. Open this folder in VS Code (the folder with `package.json`)
3. In the terminal:
   ```
   npm install
   ```
   If you see a peer-dependency ERROR (red) mentioning react or three, run:
   ```
   npm install --legacy-peer-deps
   ```
4. Start it:
   ```
   npm run dev
   ```
5. Open http://localhost:3000

## Before launch, replace placeholder content
- **Cover / photos:** add images to `/public/images`, list them in
  `src/components/sections/gallery.tsx`
- **Reviews:** edit `reviews` in `src/content/book.ts`
- **Quotes:** edit `quotes` in `src/content/book.ts`
- **About / Author text:** edit `aboutBook` / `aboutAuthor` in `src/content/book.ts`
- **Contact email / Instagram:** edit `src/config/site.ts`

## Production build test
```
npm run build
```
This must complete with no errors before deploying to Vercel.

## ─────────────────────────────────────────────
## COMMERCE LAYER (Deliverable 2) — Setup
## ─────────────────────────────────────────────

### 1. Supabase database
Run `supabase/schema.sql` in Supabase → SQL Editor. Creates orders table,
security rules, and the payment-proofs storage bucket.

### 2. Environment variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Make yourself admin
After signing up on the site with your email, run in Supabase SQL Editor:
```
insert into public.admins (email) values ('your-login-email');
```
Then visit /admin.

### 4. Turn off email confirmation (for easy testing)
Supabase → Authentication → Providers → Email → turn OFF "Confirm email".

## How ordering works
- Customer signs up / logs in (email + password) → /order
- Fills details, picks UPI (delivery) or Reserve (pickup)
- UPI: sees your real QR (₹199), pays from phone, uploads screenshot,
  clicks "Yes I've paid" → order saved as PENDING_VERIFICATION
- You (admin) check your bank, view the screenshot proof in /admin,
  and change status to PAID once confirmed
- Print management auto-counts books required vs printed

## Key files to customize
- Price / UPI ID / QR: `src/config/site.ts` (bookConfig)
- Reviews / quotes / about text: `src/content/book.ts`
