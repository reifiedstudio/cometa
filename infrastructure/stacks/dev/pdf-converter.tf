# ──────────────────────────────────────────────
# Lambda — PDF Converter (HTML → PDF via Chromium)
# ──────────────────────────────────────────────

module "pdf_converter_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-pdf-converter"
  description   = "Converts HTML to PDF using headless Chromium"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "pdf-converter/pdf-converter.zip"

  runtime         = "nodejs22.x"
  handler         = "handler.handler"
  architectures   = ["x86_64"]
  memory_mb       = 2048
  timeout_seconds = 60

  # Chromium needs /tmp space for the browser binary
  ephemeral_storage_mb = 1024

  # @sparticuz/chromium bundles its own binary — no layer needed

  create_function_url = true

  environment = {
    NODE_ENV = var.environment
  }

  # Minimal policy — only CloudWatch Logs (handled by basic execution role)
  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "AllowCloudWatchLogs"
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = ["arn:aws:logs:*:*:*"]
      }
    ]
  })

  tags = local.common_tags
}
