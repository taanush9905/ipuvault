# PYQ Vault (ipuvault)

Student-built vault for BTech previous-year papers, datesheets, and repeated questions — backed by [Supabase](https://supabase.com).

## Stack

- **Frontend:** React, Vite, TypeScript, Tailwind, shadcn/ui
- **Backend:** Supabase (Auth, Postgres, Storage, RLS)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

This app uses **Vite** (not Next.js). Use `VITE_` env vars in `.env`, not `NEXT_PUBLIC_` in `.env.local`.

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` — Project URL (Settings → API)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` — publishable or anon key

The Supabase dashboard “Next.js” snippet (`@supabase/ssr` + middleware) does not apply here; the browser client lives in `src/integrations/supabase/client.ts`.

### 3. Run database migrations

Apply all SQL files in `supabase/migrations/` to your Supabase project:

- **Supabase CLI:** `npx supabase link` then `npx supabase db push`
- **Dashboard:** SQL Editor → run each migration file in order

Migrations create tables (`papers`, `profiles`, `datesheets`, `subjects`, etc.), RLS policies, storage bucket `papers`, and vote tables (`paper_upvotes`, `paper_stars`).

### 4. Auth (optional)

- Enable **Email** and/or **Google** under Authentication → Providers.
- For Google via Lovable Cloud Auth, configure OAuth in your Lovable/Supabase project as needed.

### 5. Start the app

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Features (Supabase-backed)

| Feature | Tables / services |
|--------|-------------------|
| Sign up / sign in | `auth.users`, `profiles`, `user_roles` |
| Browse & upload papers | `papers`, storage bucket `papers` |
| Upvotes & stars | `paper_upvotes`, `paper_stars` |
| Admin approvals | `papers.approved`, admin role |
| Datesheets | `datesheets` |
| Subjects (admin) | `subjects` |
| Repeated questions | `repeated_questions`, `repeated_question_votes` |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm test` — run tests
