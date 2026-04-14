#!/usr/bin/env bash
set -euo pipefail

# Upload card images to the public assets CDN bucket
# Usage: ./scripts/deploy-cdn.sh [bucket-name]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/../src/cards/images"

BUCKET="${1:-$(cd "$SCRIPT_DIR/../../../infrastructure/stacks/dev" && terraform output -raw assets_bucket 2>/dev/null || echo "")}"

if [ -z "$BUCKET" ]; then
  echo "Usage: $0 <bucket-name>"
  echo "Or run 'terraform output assets_bucket' in infrastructure/stacks/dev"
  exit 1
fi

echo "Uploading card images to s3://$BUCKET/cards/ ..."

aws s3 sync "$IMAGES_DIR" "s3://$BUCKET/cards/" \
  --content-type "image/png" \
  --cache-control "public, max-age=31536000, immutable" \
  --delete

echo "Done. Files available at https://assets.daniellourie.me/cards/"

# Invalidate CloudFront cache if distribution ID is available
CF_ID="${2:-$(cd "$SCRIPT_DIR/../../../infrastructure/stacks/dev" && terraform output -raw assets_cloudfront_id 2>/dev/null || echo "")}"
if [ -n "$CF_ID" ]; then
  echo "Invalidating CloudFront cache ($CF_ID) ..."
  aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/cards/*" --no-cli-pager
fi
