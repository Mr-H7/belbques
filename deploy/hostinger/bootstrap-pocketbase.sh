#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   sudo bash deploy/hostinger/bootstrap-pocketbase.sh
#
# Required env vars:
#   GITHUB_REPO_URL       e.g. https://github.com/<org>/<repo>.git
#   DOMAIN_API            e.g. api.yourdomain.com
#   PB_ENCRYPTION_KEY     32+ chars
#   PB_SUPERUSER_EMAIL
#   PB_SUPERUSER_PASSWORD

APP_DIR="/var/www/belbques"
PB_DIR="$APP_DIR/apps/pocketbase"
ENV_DIR="/etc/belbques"
ENV_FILE="$ENV_DIR/pocketbase.env"
SERVICE_FILE="/etc/systemd/system/pocketbase.service"
NGINX_FILE="/etc/nginx/sites-available/pocketbase-api"

: "${GITHUB_REPO_URL:?Missing GITHUB_REPO_URL}"
: "${DOMAIN_API:?Missing DOMAIN_API}"
: "${PB_ENCRYPTION_KEY:?Missing PB_ENCRYPTION_KEY}"
: "${PB_SUPERUSER_EMAIL:?Missing PB_SUPERUSER_EMAIL}"
: "${PB_SUPERUSER_PASSWORD:?Missing PB_SUPERUSER_PASSWORD}"

apt update
apt install -y git curl unzip nginx certbot python3-certbot-nginx

mkdir -p "$APP_DIR"
if [[ -d "$APP_DIR/.git" ]]; then
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" reset --hard origin/main
else
  git clone "$GITHUB_REPO_URL" "$APP_DIR"
fi

cd "$PB_DIR"

PB_VERSION="$(cat .pocketbase-version)"
if [[ ! -x "$PB_DIR/pocketbase" ]]; then
  curl -fsSL -o pocketbase.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip"
  unzip -o pocketbase.zip
  rm -f pocketbase.zip
  chmod +x pocketbase
fi

mkdir -p "$ENV_DIR"
cat > "$ENV_FILE" <<EOF
PB_ENCRYPTION_KEY=$PB_ENCRYPTION_KEY
EOF
chmod 600 "$ENV_FILE"

./pocketbase migrate up \
  --dir="$PB_DIR/pb_data" \
  --migrationsDir="$PB_DIR/pb_migrations" \
  --hooksDir="$PB_DIR/pb_hooks" \
  --hooksWatch=false \
  --encryptionEnv=PB_ENCRYPTION_KEY

./pocketbase superuser upsert "$PB_SUPERUSER_EMAIL" "$PB_SUPERUSER_PASSWORD" \
  --dir="$PB_DIR/pb_data" \
  --migrationsDir="$PB_DIR/pb_migrations" \
  --hooksDir="$PB_DIR/pb_hooks" \
  --hooksWatch=false \
  --encryptionEnv=PB_ENCRYPTION_KEY

install -m 644 "$APP_DIR/deploy/hostinger/pocketbase.service" "$SERVICE_FILE"
sed -i "s|/var/www/belbques|$APP_DIR|g" "$SERVICE_FILE"

systemctl daemon-reload
systemctl enable pocketbase
systemctl restart pocketbase

install -m 644 "$APP_DIR/deploy/hostinger/nginx-api.conf" "$NGINX_FILE"
sed -i "s|api.yourdomain.com|$DOMAIN_API|g" "$NGINX_FILE"
ln -sf "$NGINX_FILE" /etc/nginx/sites-enabled/pocketbase-api
nginx -t
systemctl reload nginx

certbot --nginx -d "$DOMAIN_API" --redirect --non-interactive --agree-tos -m "$PB_SUPERUSER_EMAIL"

echo "PocketBase bootstrap done."
echo "Next: open https://$DOMAIN_API/_ and create one admin_users record with strong credentials."
