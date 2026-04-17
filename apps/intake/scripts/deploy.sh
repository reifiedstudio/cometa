#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building intake frontend..."
cd "$APP_DIR"
bun next build

echo "==> Getting S3 bucket and CloudFront ID..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw intake_frontend_bucket 2>/dev/null || echo "")
CF_ID=$(cd "$INFRA_DIR" && terraform output -raw intake_frontend_cloudfront_id 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get intake_frontend_bucket from Terraform output."
  exit 1
fi

echo "==> Syncing to s3://$BUCKET..."
aws s3 sync out/ "s3://$BUCKET" --delete

if [ -n "$CF_ID" ]; then
  echo "==> Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*"
fi

echo ""
echo "==> Deploy complete!"
echo "Intake URL: $(cd "$INFRA_DIR" && terraform output -raw intake_frontend_url 2>/dev/null || echo "unknown")"
