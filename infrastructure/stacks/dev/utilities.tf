# ──────────────────────────────────────────────
# Lambda — Utilities API (document generation, PDF conversion, link unfurling)
# ──────────────────────────────────────────────

module "utilities_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-utilities"
  description   = "Cometa utilities — document generation, PDF conversion, link unfurling"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "utilities-api/utilities-api.zip"

  runtime         = "nodejs22.x"
  handler         = "lambda.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 30

  environment = {
    NODE_ENV          = var.environment
    PDF_CONVERTER_URL = module.pdf_converter_lambda.function_url
    UTILITIES_BUCKET  = module.notes_content_bucket.bucket_id
    CLERK_SECRET_KEY  = var.clerk_secret_key
    ASSETS_CDN_URL    = "https://${var.assets_domain}"
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3UtilitiesAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = [
          module.notes_content_bucket.bucket_arn,
          "${module.notes_content_bucket.bucket_arn}/*"
        ]
      }
    ]
  })

  create_function_url = true
  cors_enabled        = false

  tags = local.common_tags
}
