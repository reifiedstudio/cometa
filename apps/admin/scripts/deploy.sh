#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure"

echo "==> Building admin app..."
cd "$APP_DIR"
bun run build

echo "==> Getting bucket and distribution from Terraform..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw admin_bucket 2>/dev/null || echo "")
DIST_ID=$(cd "$INFRA_DIR" && terraform output -raw admin_cloudfront_id 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get admin_bucket from Terraform output."
  echo "Run 'terraform apply' in infrastructure/ first."
  exit 1
fi

echo "==> Syncing to s3://$BUCKET..."
aws s3 sync out/ "s3://$BUCKET" --delete

if [ -n "$DIST_ID" ]; then
  echo "==> Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" > /dev/null
fi

echo ""
echo "==> Deploy complete!"
echo "Admin URL: $(cd "$INFRA_DIR" && terraform output -raw admin_url)"
