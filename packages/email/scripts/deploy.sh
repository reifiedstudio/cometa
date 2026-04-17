#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$PKG_DIR/../../infrastructure/stacks/dev"

echo "==> Building email Storybook..."
cd "$PKG_DIR"
bun run build-storybook

echo "==> Getting S3 bucket and CloudFront ID..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw email_storybook_bucket 2>/dev/null || echo "")
CF_ID=$(cd "$INFRA_DIR" && terraform output -raw email_storybook_cloudfront_id 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get email_storybook_bucket from Terraform output."
  echo "Run 'terraform apply' in $INFRA_DIR first to provision the bucket."
  exit 1
fi

echo "==> Syncing to s3://$BUCKET..."
aws s3 sync storybook-static/ "s3://$BUCKET" --delete

if [ -n "$CF_ID" ]; then
  echo "==> Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*"
fi

echo ""
echo "==> Deploy complete!"
echo "Email Storybook URL: $(cd "$INFRA_DIR" && terraform output -raw email_storybook_url 2>/dev/null || echo "unknown")"
