#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building notes app..."
cd "$APP_DIR"
bun next build

echo "==> Getting S3 bucket and CloudFront distribution..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw notes_bucket 2>/dev/null || echo "")
CF_ID=$(cd "$INFRA_DIR" && terraform output -raw notes_cloudfront_id 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get notes_bucket from Terraform output."
  echo "Run 'terraform apply' in infrastructure/stacks/dev first."
  exit 1
fi

echo "==> Syncing to s3://$BUCKET..."
aws s3 sync out/ "s3://$BUCKET" --delete

if [ -n "$CF_ID" ]; then
  echo "==> Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*" > /dev/null
fi

echo ""
echo "==> Deploy complete!"
echo "Notes URL: $(cd "$INFRA_DIR" && terraform output -raw notes_url 2>/dev/null || echo 'https://notes.daniellourie.me')"
