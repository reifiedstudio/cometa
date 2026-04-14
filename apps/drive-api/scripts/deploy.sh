#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DRIVE_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$DRIVE_DIR/../../infrastructure"

echo "==> Building Drive API for Lambda..."
cd "$DRIVE_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify \
  --external @aws-sdk/client-dynamodb \
  --external @aws-sdk/lib-dynamodb

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist
zip -j "$DRIVE_DIR/drive-api.zip" lambda.js package.json
cd "$DRIVE_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  echo "Run 'terraform apply' in infrastructure/ first to create the bucket."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/drive-api/drive-api.zip..."
aws s3 cp drive-api.zip "s3://$BUCKET/drive-api/drive-api.zip"

echo "==> Updating Lambda function code..."
cd "$INFRA_DIR"
terraform apply -target=module.drive_lambda -auto-approve

echo ""
echo "==> Deploy complete!"
echo "Drive API URL: $(terraform output -raw drive_api_url)"
