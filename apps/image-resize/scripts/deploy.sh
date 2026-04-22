#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building image-resize..."
cd "$APP_DIR"
bun run build

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist
zip -j "$APP_DIR/image-resize.zip" handler.js package.json
cd "$APP_DIR"

echo "==> Getting artifacts bucket..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/image-resize/..."
aws s3 cp image-resize.zip "s3://$BUCKET/image-resize/image-resize.zip"

echo "==> Updating Lambda..."
aws lambda update-function-code \
  --function-name cometa-dev-image-resize \
  --s3-bucket "$BUCKET" \
  --s3-key image-resize/image-resize.zip \
  --query 'CodeSize' --output text

echo ""
echo "==> Deploy complete!"
