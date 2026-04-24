#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$APP_DIR/../../infrastructure/stacks/dev"

echo "==> Building gateway for Lambda..."
cd "$APP_DIR"
bun build src/lambda.ts \
  --outfile dist/lambda.js \
  --target node \
  --minify \
  --external @aws-sdk/client-dynamodb \
  --external @aws-sdk/lib-dynamodb \
  --external @aws-sdk/client-s3 \
  --external @aws-sdk/s3-request-presigner

echo "==> Packaging ZIP..."
echo '{"type":"module"}' > dist/package.json
cd dist && zip -j "$APP_DIR/gateway.zip" lambda.js package.json
cd "$APP_DIR"

BUCKET=$(cd "$INFRA_DIR" && terraform output -raw artifacts_bucket)
echo "==> Uploading to s3://$BUCKET/gateway/..."
aws s3 cp gateway.zip "s3://$BUCKET/gateway/gateway.zip"

echo "==> Updating Lambda function code..."
aws lambda update-function-code \
  --function-name cometa-dev-gateway \
  --s3-bucket "$BUCKET" \
  --s3-key gateway/gateway.zip \
  --query 'CodeSize' --output text

echo ""
echo "==> Deploy complete!"
echo "Gateway URL: $(cd "$INFRA_DIR" && terraform output -raw gateway_url)"
echo "MCP URL:     $(cd "$INFRA_DIR" && terraform output -raw gateway_mcp_url)"
echo ""
echo "Paste the MCP URL into Claude Cowork to connect."
