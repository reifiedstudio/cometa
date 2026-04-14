#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building pdf-converter for Lambda..."
cd "$APP_DIR"
bun build src/handler.ts \
  --outfile dist/handler.mjs \
  --target node \
  --minify \
  --external @sparticuz/chromium

echo "==> Installing @sparticuz/chromium for Lambda packaging..."
cd dist
echo '{"type":"module"}' > package.json
npm install --omit=dev @sparticuz/chromium 2>&1 | tail -3

echo "==> Packaging ZIP..."
zip -qr "$APP_DIR/pdf-converter.zip" handler.mjs package.json node_modules/

cd "$APP_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/pdf-converter/pdf-converter.zip..."
aws s3 cp pdf-converter.zip "s3://$BUCKET/pdf-converter/pdf-converter.zip"

echo "==> Updating Lambda function code..."
cd "$INFRA_DIR"
terraform apply -target=module.pdf_converter_lambda -auto-approve

echo ""
echo "==> Deploy complete!"
echo "PDF Converter URL: $(terraform output -raw pdf_converter_url)"
