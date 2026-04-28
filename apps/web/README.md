# Benha Survey Web App

React + Vite + Tailwind frontend for the public survey and admin dashboard.

Production data/auth now run on **Supabase**.
PocketBase files remain in the monorepo only as a legacy local backup path.

## Environment

Copy env template and set values:

```bash
cd apps/web
cp .env.example .env
```

Required:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional legacy local fallback only:

- `VITE_POCKETBASE_URL`

## Local run

```bash
cd apps/web
npm install
npm run dev
```

Default app URL: `http://localhost:3000`

## Build / lint

```bash
npm run lint
npm run build
```

## Data model (Supabase)

- `public.surveys` for survey submissions
- `public.app_settings` for title/subtitle + survey open/closed state
- `public.admin_profiles` linked to `auth.users`
- `public.analytics_events` for page/form analytics

## Admin capabilities

- `/admin/login` uses Supabase Auth (email/password)
- admin list/add/delete uses `admin_profiles`
- self email/password updates use Supabase Auth + profile sync

## Hero image

Image path:

`apps/web/public/benha-hero.jpg`

If replaced, keep the filename or update:

`apps/web/src/components/sections/HeroSection.jsx`
