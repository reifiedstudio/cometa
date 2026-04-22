#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building handler..."
cd "$APP_DIR"
bun build src/handler.ts \
  --outfile dist/handler.js \
  --target node \
  --minify \
  --external @aws-sdk \
  --external sharp

echo "==> Installing sharp for linux-arm64..."
cd dist
# Install sharp specifically for Lambda's platform
npm init -y --silent > /dev/null 2>&1
npm install --os=linux --cpu=arm64 --libc=glibc sharp@0.34.5 --no-save 2>&1 | tail -3

echo '{"type":"module"}' > package.json

echo "==> Packaging ZIP..."
zip -r "$APP_DIR/image-resize.zip" handler.js package.json node_modules/ -q

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
cd "$INFRA_DIR"
terraform apply -target=module.image_resize_lambda -auto-approve

echo ""
echo "==> Deploy complete!"
echo "Image Resize URL: $(terraform output -raw image_resize_url 2>/dev/null || echo "unknown")"
