#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure"

echo "==> Building email-ingest for Lambda..."
cd "$APP_DIR"
bun build src/handler.ts \
  --outfile dist/handler.mjs \
  --target node \
  --minify

echo "==> Packaging ZIP..."
cd dist
zip -j "$APP_DIR/email-ingest.zip" handler.mjs
cd "$APP_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/email-ingest/email-ingest.zip..."
aws s3 cp email-ingest.zip "s3://$BUCKET/email-ingest/email-ingest.zip"

echo "==> Updating Lambda function code..."
cd "$INFRA_DIR"
terraform apply -target=module.email_ingest_lambda -auto-approve

echo ""
echo "==> Deploy complete!"
