#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building intake-api for Lambda..."
cd "$APP_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify \
  --external @aws-sdk/client-s3 \
  --external @aws-sdk/client-sqs \
  --external @aws-sdk/client-textract \
  --external @aws-sdk/s3-request-presigner

echo "==> Building SQS handler for Lambda..."
bun build src/sqs-handler.ts \
  --outfile dist/sqs-handler.js \
  --target node \
  --minify \
  --external @aws-sdk/client-s3 \
  --external @aws-sdk/client-sqs \
  --external @aws-sdk/client-textract \
  --external @aws-sdk/s3-request-presigner

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist
zip -j "$APP_DIR/intake-api.zip" lambda.js package.json
zip -j "$APP_DIR/intake-sqs.zip" sqs-handler.js package.json
cd "$APP_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(echo "==> Updating Lambda..." && cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/intake-api/..."
aws s3 cp intake-api.zip "s3://$BUCKET/intake-api/intake-api.zip"
aws s3 cp intake-sqs.zip "s3://$BUCKET/intake-api/intake-sqs.zip"

echo "==> Updating Lambda function code..."
aws lambda update-function-code --function-name cometa-dev-intake-api --s3-bucket "$BUCKET" --s3-key intake-api/intake-api.zip --query 'CodeSize' --output text
aws lambda update-function-code --function-name cometa-dev-intake-sqs --s3-bucket "$BUCKET" --s3-key intake-api/intake-sqs.zip --query 'CodeSize' --output text

echo ""
echo "==> Deploy complete!"
echo "Intake API URL: $(cd "$INFRA_DIR" && terraform output -raw intake_api_url)"
