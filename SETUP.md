# Quick fix — app blank / nothing in Supabase

## Problem 1: Opening `index.html` directly

**Do not** double-click `index.html`. That only shows an empty page.

Run the dev server instead:

```powershell
cd "C:\Users\LUBHANSH PERSONAL\Desktop\ipuvault"
npm install
npm run dev
```

Open **http://localhost:8080** in your browser (not the file path).

---

## Problem 2: Supabase has no tables

Migrations were never applied (Supabase CLI is not required).

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/sdflcuulikrzvwtwsdcb/sql/new)
2. Open the file `supabase/setup-all.sql` in this project
3. Copy **all** of it → paste into SQL Editor → click **Run**
4. In **Table Editor**, you should see: `papers`, `profiles`, `subjects`, `datesheets`, etc.

Also enable **Email** auth: Authentication → Providers → Email → Enable.

### Extra features (`setup-features.sql`)

Run `supabase/setup-features.sql` for:

- Public **feedback** form (no login)
- **Anonymous paper uploads** (no login on Upload page)

### Admin account

Run `supabase/setup-admin.sql` in the SQL Editor (after `setup-all.sql`).

Then sign in at `/auth`:

- **Email:** `taanush029905@gmail.com`
- **Password:** `123456systemh`

You will see **Approvals** and **Subjects** in the nav (admin only).

---

## Problem 3: `vite` is not recognized / PostCSS error

If `npm run dev` fails, reinstall dependencies:

```powershell
cd "C:\Users\LUBHANSH PERSONAL\Desktop\ipuvault"
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

---

## Checklist

| Step | Done? |
|------|-------|
| `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` | |
| Ran `supabase/setup-all.sql` in Supabase SQL Editor | |
| Ran `npm install` then `npm run dev` | |
| Opened http://localhost:8080 | |
| Signed up at `/auth` in the app | |

After signup, check Supabase → **Authentication** → Users and **Table Editor** → `profiles`.
