#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building gateway-ui app..."
cd "$APP_DIR"
bun run build

echo "==> Getting bucket and distribution from Terraform..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw gateway_ui_bucket 2>/dev/null || echo "")
DIST_ID=$(cd "$INFRA_DIR" && terraform output -raw gateway_ui_cloudfront_id 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get gateway_ui_bucket from Terraform output."
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
echo "Gateway UI URL: $(cd "$INFRA_DIR" && terraform output -raw gateway_ui_url)"
