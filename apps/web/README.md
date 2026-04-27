# بنها بتقول إيه؟ — Web app

React + Vite + Tailwind frontend for the Benha citizen-feedback survey, backed
by a local PocketBase instance.

## Run locally

### 1) PocketBase backend
```bash
cd apps/pocketbase
# First run only — seed credentials through env vars (use strong values):
#   bash:
#     PB_SUPERUSER_EMAIL=<email> PB_SUPERUSER_PASSWORD=<strong-pass> \
#     PB_ADMIN_EMAIL=<email> PB_ADMIN_PASSWORD=<strong-pass> npm run dev
#   PowerShell:
#     $env:PB_SUPERUSER_EMAIL='<email>'; $env:PB_SUPERUSER_PASSWORD='<strong-pass>';
#     $env:PB_ADMIN_EMAIL='<email>'; $env:PB_ADMIN_PASSWORD='<strong-pass>'; npm run dev
# Subsequent runs (data already exists):
npm run dev   # serves http://127.0.0.1:8090
```

The `npm run dev` script auto-selects `pocketbase.exe` on Windows and `./pocketbase`
on macOS/Linux.

### 2) Web app
```bash
cd apps/web
cp .env.example .env   # default VITE_POCKETBASE_URL=http://127.0.0.1:8090
npm install
npm run dev            # http://localhost:3000
```

Build / lint:
```bash
npm run build
npm run lint
```

From the monorepo root, `npm install` then `npm run dev` runs both concurrently.

## Where submissions live

1. **Primary:** PocketBase `surveys` collection at `${VITE_POCKETBASE_URL}/api/collections/surveys`.
   - Flat columns: `name`, `email`, `phone` (mirrored from reporter for easy filtering).
   - JSON column `answers` holds the structured payload:
     ```jsonc
     {
       "reporter":  { "fullName", "phone", "ageGroup", "optionalContact" },
       "answers":   { "q1": "...", "q2": "...", "...": "..." },   // up to q20
       "metadata":  { "submittedAt", "userAgent", "source": "web" }
     }
     ```
2. **Fallback:** if PocketBase is unreachable, submissions are queued in
   `localStorage.benha_pending_submissions` and auto-flushed on the next page
   load that succeeds in reaching the backend.

## Admin

- `/admin/login` — auth against the `admin_users` collection.
- Bootstrap admin seed uses `PB_ADMIN_EMAIL` / `PB_ADMIN_PASSWORD` when provided.
- For production, always use strong non-default credentials and rotate them.
- `/admin` — overview, results table (search by name or phone, view dialog
  with all 20 answers), analytics, export (CSV / JSON / PDF), settings.

## Hero image

Placed at `apps/web/public/benha-hero.jpg`. Replace with any aspect-ratio
photo — the hero card is `4:5` and uses `object-cover`, so the image is
centered and cropped to fit. Keep filename as `benha-hero.jpg` or update the
`<img src>` in `src/components/sections/HeroSection.jsx`.

## Still needs real backend setup later

- Server-side IP capture (currently a placeholder string).
- Average completion-time metric (no timing fields persisted yet — UI shows `—`).
- Email notifications on submit.
- Production PocketBase deployment + credential rotation policy.
