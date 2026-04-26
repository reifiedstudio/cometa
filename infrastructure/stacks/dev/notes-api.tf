# ──────────────────────────────────────────────
# Lambda — Notes API (note creation, storage, MCP tools)
# ──────────────────────────────────────────────

module "notes_api_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-notes"
  description   = "Cometa notes — note creation, storage, and MCP tools"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "notes-api/notes-api.zip"

  runtime         = "nodejs22.x"
  handler         = "lambda.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 30

  environment = {
    NODE_ENV         = var.environment
    S3_BUCKET        = module.private_bucket.bucket_id
    NOTES_PREFIX     = "notes/"
    DYNAMODB_TABLE   = module.services_table.name
    NOTES_DOMAIN     = var.notes_domain
    CLERK_SECRET_KEY = var.clerk_secret_key
    RESEND_API_KEY   = var.resend_api_key
    EMAIL_FROM       = var.email_from
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3NotesAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = [
          module.private_bucket.bucket_arn,
          "${module.private_bucket.bucket_arn}/notes/*"
        ]
      },
      {
        Sid    = "DynamoDBNotesAccess"
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query"
        ]
        Resource = [
          module.services_table.arn,
          "${module.services_table.arn}/index/*"
        ]
      }
    ]
  })

  create_function_url = true
  cors_enabled        = false

  tags = local.common_tags
}
