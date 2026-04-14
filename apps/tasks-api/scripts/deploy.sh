#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure"

echo "==> Building tasks-api for Lambda..."
cd "$APP_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist
zip -j "$APP_DIR/tasks-api.zip" lambda.js package.json
cd "$APP_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/tasks-api/..."
aws s3 cp tasks-api.zip "s3://$BUCKET/tasks-api/tasks-api.zip"

echo "==> Updating Lambda function code..."
cd "$INFRA_DIR"
terraform apply -target=module.departments_api_lambda -auto-approve

echo ""
echo "==> Deploy complete!"
echo "Tasks API URL: $(terraform output -raw departments_api_url)"
