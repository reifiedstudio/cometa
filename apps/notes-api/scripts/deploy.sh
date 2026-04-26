#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building notes-api for Lambda..."
cd "$APP_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify \
  --external @aws-sdk/client-s3 \
  --external @aws-sdk/s3-request-presigner \
  --external @aws-sdk/client-dynamodb \
  --external @aws-sdk/lib-dynamodb \
  --external react \
  --external react-dom \
  --external @react-email/components \
  --external @react-email/render \
  --external resend

echo "==> Installing external deps for Lambda..."
rm -rf dist/node_modules
cd dist
echo '{"type":"module","dependencies":{"react":"19.2.4","react-dom":"19.2.4","@react-email/components":"^0.0.36","@react-email/render":"^2.0.6","resend":"^4.5.0"}}' > package.json
bun install --production 2>/dev/null

echo "==> Packaging ZIP..."
zip -rq "$APP_DIR/notes-api.zip" lambda.js package.json node_modules/
cd "$APP_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/notes-api/notes-api.zip..."
aws s3 cp notes-api.zip "s3://$BUCKET/notes-api/notes-api.zip"

echo "==> Updating Lambda function code..."
aws lambda update-function-code --function-name cometa-dev-notes --s3-bucket "$BUCKET" --s3-key notes-api/notes-api.zip --query 'CodeSize' --output text

echo ""
echo "==> Deploy complete!"
echo "Notes API URL: $(cd "$INFRA_DIR" && terraform output -raw notes_api_url)"
