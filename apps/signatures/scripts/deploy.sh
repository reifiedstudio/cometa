#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building signatures app..."
cd "$APP_DIR"
bun run build

echo "==> Getting bucket and distribution from Terraform..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw signatures_ui_bucket 2>/dev/null || echo "")
DIST_ID=$(cd "$INFRA_DIR" && terraform output -raw signatures_ui_cloudfront_id 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get signatures_ui_bucket from Terraform output."
  echo "Run 'terraform apply' in infrastructure/ first."
  exit 1
fi

echo "==> Setting up dynamic route fallbacks..."
# Copy placeholder pages so CloudFront can serve them for any dynamic path.
# Next.js static export only builds /request/_/ but we need /request/*/  to work.
if [ -f out/request/_/index.html ]; then
  cp out/request/_/index.html out/request/index.html
fi

echo "==> Syncing to s3://$BUCKET..."
aws s3 sync out/ "s3://$BUCKET" --delete

if [ -n "$DIST_ID" ]; then
  echo "==> Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" > /dev/null
fi

echo ""
echo "==> Deploy complete!"
echo "Signatures URL: $(cd "$INFRA_DIR" && terraform output -raw signatures_ui_url)"
