#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building utilities-api for Lambda..."
cd "$APP_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify \
  --external @aws-sdk/client-s3 \
  --external @aws-sdk/s3-request-presigner

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist
zip -j "$APP_DIR/utilities-api.zip" lambda.js package.json
cd "$APP_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/utilities-api/utilities-api.zip..."
aws s3 cp utilities-api.zip "s3://$BUCKET/utilities-api/utilities-api.zip"

echo "==> Updating Lambda function code..."
aws lambda update-function-code --function-name cometa-dev-utilities --s3-bucket "$BUCKET" --s3-key utilities-api/utilities-api.zip --query 'CodeSize' --output text

echo ""
echo "==> Deploy complete!"
echo "Utilities API URL: $(cd "$INFRA_DIR" && terraform output -raw utilities_api_url)"
