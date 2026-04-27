# Production Deployment Guide (GitHub + Vercel + Hostinger VPS)

This project deploys in split mode:
- Frontend (`apps/web`) -> Vercel
- PocketBase backend (`apps/pocketbase`) -> Hostinger VPS

Do not deploy PocketBase to Vercel.

## 1) Git and Repository Hygiene

This repo now ignores sensitive/local artifacts via root `.gitignore`, including:
- `.env` files
- `apps/pocketbase/pb_data`
- `node_modules`
- build `dist`
- logs
- local PocketBase binaries

Committed by design:
- `apps/pocketbase/pb_migrations/*`
- source code and deploy templates

### Initialize and push to GitHub (if repo is not initialized yet)

```bash
cd C:\Users\Dell\belbques
git init
git add .
git commit -m "chore: production-ready deployment setup"
git branch -M main
git remote add origin https://github.com/<YOUR_ORG_OR_USER>/<YOUR_REPO>.git
git push -u origin main
```

## 2) Frontend Production Env (Vercel)

`apps/web/.env.example` is set for production shape:

```env
VITE_POCKETBASE_URL=https://api.yourdomain.com
```

In Vercel Project Settings:
- Root Directory: `apps/web`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Optional config file already added:
- `apps/web/vercel.json`

## 3) PocketBase on Hostinger VPS (Linux amd64)

Templates/scripts added:
- `deploy/hostinger/bootstrap-pocketbase.sh`
- `deploy/hostinger/pocketbase.service`
- `deploy/hostinger/nginx-api.conf`
- `apps/pocketbase/.env.production.example`

### Fast bootstrap (recommended)

On VPS (Ubuntu/Debian):

```bash
sudo -i
export GITHUB_REPO_URL="https://github.com/<YOUR_ORG_OR_USER>/<YOUR_REPO>.git"
export DOMAIN_API="api.yourdomain.com"
export PB_ENCRYPTION_KEY="<RANDOM_32_PLUS_CHAR_SECRET>"
export PB_SUPERUSER_EMAIL="owner@yourdomain.com"
export PB_SUPERUSER_PASSWORD="<STRONG_SUPERUSER_PASSWORD>"

# copy repo first (or clone), then:
cd /var/www/belbques
sudo bash deploy/hostinger/bootstrap-pocketbase.sh
```

The script will:
- install system packages (`nginx`, `certbot`, etc.)
- pull/clone repository
- download Linux PocketBase binary from `.pocketbase-version`
- run migrations
- create/update superuser with strong credentials
- install/restart systemd service
- configure nginx reverse proxy
- issue SSL certificate

### Manual equivalent (if you prefer step-by-step)

1. Upload/clone `apps/pocketbase` on VPS.
2. Download Linux PocketBase binary (`linux_amd64`) and `chmod +x pocketbase`.
3. Run migrations:
   ```bash
   ./pocketbase migrate up --dir=./pb_data --migrationsDir=./pb_migrations --hooksDir=./pb_hooks --hooksWatch=false --encryptionEnv=PB_ENCRYPTION_KEY
   ```
4. Create production superuser:
   ```bash
   ./pocketbase superuser upsert "<SUPERUSER_EMAIL>" "<SUPERUSER_PASSWORD>" --dir=./pb_data --migrationsDir=./pb_migrations --hooksDir=./pb_hooks --hooksWatch=false --encryptionEnv=PB_ENCRYPTION_KEY
   ```
5. Install `deploy/hostinger/pocketbase.service` to `/etc/systemd/system/pocketbase.service`.
6. `sudo systemctl daemon-reload && sudo systemctl enable --now pocketbase`.

## 4) Reverse Proxy + SSL (Nginx)

Use `deploy/hostinger/nginx-api.conf` and replace `api.yourdomain.com`.

Backend reverse proxy target:
- `http://127.0.0.1:8090`

Enable TLS:
```bash
sudo certbot --nginx -d api.yourdomain.com --redirect
```

## 5) PocketBase Security Checklist

### Collection rules

`admin_users` is hardened (see migration `1777293200_006_admin_users_rules_hardening.js`):
- list/view/create/update/manage: authenticated `admin_users` with role `admin`
- delete: same + cannot delete own record (`id != @request.auth.id`)

`app_settings`:
- public read (`listRule` / `viewRule` empty)
- write restricted to `admin_users`

`surveys`:
- public create allowed
- read/update/delete restricted to authenticated admin users

### Credentials

Before going live:
1. Open PocketBase dashboard: `https://api.yourdomain.com/_`
2. In `admin_users` collection, create your real production admin user.
3. Remove or rotate any demo/local credentials (especially `admin@benha-survey.com` if present).
4. Never use `Admin@123456` in production.

## 6) Vercel Deployment (Manual Click Steps)

1. In Vercel: **Add New Project** -> import GitHub repo.
2. Set Root Directory to `apps/web`.
3. Set Environment Variable:
   - `VITE_POCKETBASE_URL=https://api.yourdomain.com`
4. Deploy.
5. Optional: add custom domain for frontend.

## 7) Production Validation Checklist

- Homepage loads
- Hero image loads
- Survey submit works
- Survey closed state works
- Admin login works
- Admin settings works
- Add/delete admin works
- Export CSV works
- Export PDF works and card layout is readable
- Mobile responsiveness looks correct

## 8) Useful Ops Commands

```bash
# service status / logs
sudo systemctl status pocketbase
sudo journalctl -u pocketbase -f

# nginx check/reload
sudo nginx -t
sudo systemctl reload nginx
```
