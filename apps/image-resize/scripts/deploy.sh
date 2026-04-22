#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building image-resize..."
cd "$APP_DIR"
rm -rf dist image-resize.zip
bun run build

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist && zip -j "$APP_DIR/image-resize.zip" handler.js package.json
cd "$APP_DIR"

echo "==> Uploading..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket)
aws s3 cp image-resize.zip "s3://$BUCKET/image-resize/image-resize.zip"

echo "==> Updating Lambda..."
cd "$INFRA_DIR"
terraform apply -target=module.image_resize_lambda -target=aws_lambda_layer_version.sharp -auto-approve

echo ""
echo "==> Deploy complete!"
