#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GATEWAY_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$GATEWAY_DIR/../../infrastructure/stacks/dev"

echo "==> Building gateway for Lambda..."
cd "$GATEWAY_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify \
  --external @aws-sdk/client-dynamodb \
  --external @aws-sdk/lib-dynamodb \
  --external @aws-sdk/client-s3 \
  --external @aws-sdk/s3-request-presigner

echo "==> Packaging ZIP..."
cd dist
zip -j "$GATEWAY_DIR/gateway.zip" lambda.js
cd "$GATEWAY_DIR"

echo "==> Getting artifacts bucket name..."
BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket 2>/dev/null || echo "")

if [ -z "$BUCKET" ]; then
  echo "ERROR: Could not get artifacts_bucket from Terraform output."
  echo "Run 'terraform apply' in infrastructure/ first to create the bucket."
  exit 1
fi

echo "==> Uploading to s3://$BUCKET/gateway/gateway.zip..."
aws s3 cp gateway.zip "s3://$BUCKET/gateway/gateway.zip"

echo "==> Updating Lambda function code..."
FUNCTION_NAME=$(cd "$INFRA_DIR" && terraform output -raw gateway_url 2>/dev/null | sed 's|https://||;s|\.lambda-url.*||' || echo "${PROJECT_NAME:-cometa}-${ENVIRONMENT:-dev}-gateway")

# Use Terraform to update (ensures state is consistent)
cd "$INFRA_DIR"
terraform apply -target=module.gateway_lambda -auto-approve

echo ""
echo "==> Deploy complete!"
echo "Gateway URL: $(terraform output -raw gateway_url)"
echo "MCP URL:     $(terraform output -raw gateway_mcp_url)"
echo ""
echo "Paste the MCP URL into Claude Cowork to connect."
