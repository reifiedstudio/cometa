# ──────────────────────────────────────────────
# Lambda — Gateway (REST API + MCP Server)
# ──────────────────────────────────────────────

module "gateway_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-gateway"
  description   = "Cometa gateway — REST API and MCP server"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "gateway/gateway.zip"

  runtime         = "nodejs22.x"
  handler         = "lambda.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 30

  environment = merge(local.gateway_secrets, {
    NODE_ENV           = var.environment
    MCP_DOMAIN         = var.mcp_domain
    S3_BUCKET          = module.private_bucket.bucket_id
    CORS_ORIGIN        = "https://${var.root_domain}"
    DYNAMODB_TABLE     = module.services_table.name
    ANTHROPIC_API_KEY  = var.anthropic_api_key
    NAME_PREFIX        = local.name_prefix
    TASKS_API_URL      = module.tasks_api_lambda.function_url
    TASKS_MCP_URL      = "${module.tasks_api_lambda.function_url}mcp"
    AUTH_TABLE         = module.auth_table.name
    S3_PREFIX          = "intake/"
    INTAKE_API_URL     = module.intake_api_lambda.function_url
    INTAKE_MCP_URL     = "${module.intake_api_lambda.function_url}mcp"
    SIGNATURES_API_URL = module.signatures_lambda.function_url
    SIGNATURES_MCP_URL = "${module.signatures_lambda.function_url}mcp"
    UTILITIES_API_URL  = module.utilities_lambda.function_url
    UTILITIES_MCP_URL  = "${module.utilities_lambda.function_url}mcp"
    NOTES_API_URL      = module.notes_api_lambda.function_url
    NOTES_MCP_URL      = "${module.notes_api_lambda.function_url}mcp"
    MCP_AUTH_TOKEN     = var.mcp_auth_token
  })

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3DocumentAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          module.private_bucket.bucket_arn,
          "${module.private_bucket.bucket_arn}/*"
        ]
      },
      {
        Sid    = "TextractAccess"
        Effect = "Allow"
        Action = [
          "textract:StartDocumentTextDetection",
          "textract:GetDocumentTextDetection",
          "textract:DetectDocumentText"
        ]
        Resource = ["*"]
      },
      {
        Sid      = "PassTextractRole"
        Effect   = "Allow"
        Action   = ["iam:PassRole"]
        Resource = [aws_iam_role.textract_service.arn]
      },
      {
        Sid    = "DynamoDBServiceAccess"
        Effect = "Allow"
        Action = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:Query"]
        Resource = [
          module.services_table.arn,
          "${module.services_table.arn}/index/*"
        ]
      },
      {
        Sid      = "DynamoDBAuthAccess"
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:DeleteItem", "dynamodb:Query"]
        Resource = [module.auth_table.arn]
      },
      {
        Sid      = "SQSServiceSend"
        Effect   = "Allow"
        Action   = ["sqs:SendMessage"]
        Resource = ["arn:aws:sqs:*:*:${local.name_prefix}-*-service"]
      },
      {
        Sid      = "SSMServiceDiscovery"
        Effect   = "Allow"
        Action   = ["ssm:GetParameter", "ssm:GetParametersByPath"]
        Resource = ["arn:aws:ssm:*:*:parameter/${local.name_prefix}/services/*"]
      },
      {
        Sid      = "S3NotesAccess"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:GetObject"]
        Resource = [
          module.private_bucket.bucket_arn,
          "${module.private_bucket.bucket_arn}/*"
        ]
      }
    ]
  })

  create_function_url = true
  cors_enabled        = false  # CORS handled by Hono middleware in the app

  tags = local.common_tags
}

# ──────────────────────────────────────────────
# API Gateway — Custom Domain for Gateway/MCP
# ──────────────────────────────────────────────

resource "aws_acm_certificate" "mcp" {
  domain_name       = var.mcp_domain
  validation_method = "DNS"
  tags              = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "mcp_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.mcp.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.mcp_hosted_zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "mcp" {
  certificate_arn         = aws_acm_certificate.mcp.arn
  validation_record_fqdns = [for record in aws_route53_record.mcp_cert_validation : record.fqdn]
}

module "gateway_api" {
  source = "../../modules/api-gateway"

  name        = "${local.name_prefix}-gateway"
  description = "Cometa gateway — REST API and MCP server"

  lambda_invoke_arn    = module.gateway_lambda.invoke_arn
  lambda_function_name = module.gateway_lambda.function_name

  domain          = var.mcp_domain
  certificate_arn = aws_acm_certificate_validation.mcp.certificate_arn
  hosted_zone_id  = var.mcp_hosted_zone_id

  cors_enabled = false  # CORS handled by Hono middleware in the Lambda

  tags = local.common_tags
}
