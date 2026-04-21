# ══════════════════════════════════════════════
# S3 Buckets
# ══════════════════════════════════════════════

module "intake_bucket" {
  source = "../../modules/s3"

  bucket_name        = "${local.name_prefix}-${local.region_short}-intake"
  versioning_enabled = true

  cors_rules = [
    {
      allowed_methods = ["PUT", "POST", "GET"]
      allowed_origins = ["http://localhost:3000", "https://${var.root_domain}"]
      allowed_headers = ["*"]
      max_age_seconds = 3600
    }
  ]

  bucket_policy_json = data.aws_iam_policy_document.intake_bucket_policy.json

  tags = local.common_tags
}

data "aws_iam_policy_document" "intake_bucket_policy" {
  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions = ["s3:*"]
    resources = [
      "arn:aws:s3:::${local.name_prefix}-${local.region_short}-intake",
      "arn:aws:s3:::${local.name_prefix}-${local.region_short}-intake/*",
    ]
    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }

  statement {
    sid    = "AllowSESPuts"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ses.amazonaws.com"]
    }
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${local.name_prefix}-${local.region_short}-intake/emails/*"]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

module "artifacts_bucket" {
  source = "../../modules/s3"

  bucket_name        = "${local.name_prefix}-${local.region_short}-artifacts"
  versioning_enabled = true
  tags               = local.common_tags
}

module "signatures_bucket" {
  source = "../../modules/s3"

  bucket_name        = "${local.name_prefix}-${local.region_short}-signatures"
  versioning_enabled = true
  tags               = local.common_tags
}

module "notes_content_bucket" {
  source = "../../modules/s3"

  bucket_name    = "${local.name_prefix}-${local.region_short}-notes-content"
  expire_days    = 30
  tags           = local.common_tags
}

# ══════════════════════════════════════════════
# DynamoDB Tables
# ══════════════════════════════════════════════

module "auth_table" {
  source = "../../modules/dynamodb"

  name      = "${local.name_prefix}-auth"
  hash_key  = "PK"
  range_key = "SK"

  attributes = [
    { name = "PK", type = "S" },
    { name = "SK", type = "S" },
  ]

  ttl_attribute = "expiresAt"

  tags = local.common_tags
}

module "services_table" {
  source = "../../modules/dynamodb"

  name      = "${local.name_prefix}-services"
  hash_key  = "PK"
  range_key = "SK"

  attributes = [
    { name = "PK", type = "S" },
    { name = "SK", type = "S" },
    { name = "GSI1PK", type = "S" },
    { name = "GSI1SK", type = "S" },
    { name = "GSI2PK", type = "S" },
    { name = "GSI2SK", type = "S" },
  ]

  global_secondary_indexes = [
    { name = "GSI1", hash_key = "GSI1PK", range_key = "GSI1SK" },
    { name = "GSI2", hash_key = "GSI2PK", range_key = "GSI2SK" },
  ]

  point_in_time_recovery = true
  stream_enabled         = true
  stream_view_type       = "NEW_IMAGE"

  tags = local.common_tags
}

# ══════════════════════════════════════════════
# SQS Queues
# ══════════════════════════════════════════════

module "processing_queue" {
  source = "../../modules/sqs"

  name                       = "${local.name_prefix}-processing"
  visibility_timeout_seconds = 300   # 5 min — enough for Textract + OpenAI
  message_retention_seconds  = 86400 # 1 day
  tags                       = local.common_tags
}

# ══════════════════════════════════════════════
# IAM — Textract Service Role
# ══════════════════════════════════════════════

data "aws_iam_policy_document" "textract_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["textract.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_iam_role" "textract_service" {
  name               = "${local.name_prefix}-textract-service-role"
  assume_role_policy = data.aws_iam_policy_document.textract_assume_role.json
  tags               = local.common_tags
}

data "aws_iam_policy_document" "textract_s3_access" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.intake_bucket.bucket_arn}/*"]
  }
}

resource "aws_iam_policy" "textract_s3_access" {
  name   = "${local.name_prefix}-textract-s3-access"
  policy = data.aws_iam_policy_document.textract_s3_access.json
}

resource "aws_iam_role_policy_attachment" "textract_s3" {
  role       = aws_iam_role.textract_service.name
  policy_arn = aws_iam_policy.textract_s3_access.arn
}

# ══════════════════════════════════════════════
# Lambda — Intake API
# ══════════════════════════════════════════════

module "intake_api_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-intake-api"
  description   = "Intake REST API — document verification and approval"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "intake-api/intake-api.zip"

  runtime         = "nodejs22.x"
  handler         = "lambda.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 30

  environment = merge(local.intake_api_secrets, {
    S3_BUCKET         = module.intake_bucket.bucket_id
    AWS_SQS_QUEUE_URL = module.processing_queue.queue_url
    CORS_ORIGIN       = "https://${var.intake_domain}"
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
          module.intake_bucket.bucket_arn,
          "${module.intake_bucket.bucket_arn}/*"
        ]
      },
      {
        Sid      = "SQSSend"
        Effect   = "Allow"
        Action   = ["sqs:SendMessage"]
        Resource = [module.processing_queue.queue_arn]
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
      }
    ]
  })

  create_function_url = true

  tags = local.common_tags
}

# ══════════════════════════════════════════════
# Lambda — Intake SQS Worker
# ══════════════════════════════════════════════

module "intake_sqs_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-intake-sqs"
  description   = "Intake SQS worker — processes document queue items"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "intake-api/intake-sqs.zip"

  runtime         = "nodejs22.x"
  handler         = "sqs-handler.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 300

  environment = merge(local.intake_api_secrets, {
    S3_BUCKET = module.intake_bucket.bucket_id
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
          module.intake_bucket.bucket_arn,
          "${module.intake_bucket.bucket_arn}/*"
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
        Sid    = "SQSAccess"
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = [module.processing_queue.queue_arn]
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_lambda_event_source_mapping" "intake_sqs" {
  event_source_arn = module.processing_queue.queue_arn
  function_name    = module.intake_sqs_lambda.function_arn
  batch_size       = 5
  enabled          = true
}

# ══════════════════════════════════════════════
# Lambda — Signatures API
# ══════════════════════════════════════════════

module "signatures_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-signatures"
  description   = "E-signatures REST API and MCP server"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "signatures-api/signatures-api.zip"

  runtime         = "nodejs22.x"
  handler         = "lambda.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 30

  environment = merge(local.signatures_secrets, {
    SIGNATURES_S3_BUCKET = module.signatures_bucket.bucket_id
    CORS_ORIGIN          = "https://${var.intake_domain}"
  })

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3SignaturesAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          module.signatures_bucket.bucket_arn,
          "${module.signatures_bucket.bucket_arn}/*"
        ]
      }
    ]
  })

  create_function_url = true
  cors_allow_headers  = ["content-type", "authorization", "mcp-session-id"]
  cors_expose_headers = ["mcp-session-id"]

  tags = local.common_tags
}

# ══════════════════════════════════════════════
# Lambda — Tasks API (REST + MCP)
# ══════════════════════════════════════════════

module "tasks_api_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-tasks-api"
  description   = "Tasks REST API and MCP server"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "tasks-api/tasks-api.zip"

  runtime         = "nodejs22.x"
  handler         = "lambda.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 30

  environment = {
    NODE_ENV          = var.environment
    DYNAMODB_TABLE    = module.services_table.name
    ANTHROPIC_API_KEY = var.anthropic_api_key
    NAME_PREFIX       = local.name_prefix
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
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
      }
    ]
  })

  create_function_url = true
  cors_enabled        = false  # CORS handled by Hono middleware in the app

  tags = local.common_tags
}

# ══════════════════════════════════════════════
# Lambda — Stream Router (DynamoDB → SQS)
# ══════════════════════════════════════════════

module "stream_router_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-stream-router"
  description   = "Routes DynamoDB stream events to task SQS queues"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "stream-router/stream-router.zip"

  runtime         = "nodejs22.x"
  handler         = "index.handler"
  architectures   = ["arm64"]
  memory_mb       = 128
  timeout_seconds = 30

  environment = {
    NODE_ENV    = var.environment
    NAME_PREFIX = local.name_prefix
    QUEUE_URLS = jsonencode({
      accounting = module.accounting_service.queue_url
      legal      = module.legal_service.queue_url
    })
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "DynamoDBStreamRead"
        Effect = "Allow"
        Action = [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream",
          "dynamodb:ListStreams"
        ]
        Resource = [
          module.services_table.arn,
          "${module.services_table.arn}/stream/*"
        ]
      },
      {
        Sid    = "SQSSendToTasks"
        Effect = "Allow"
        Action = ["sqs:SendMessage"]
        Resource = [
          module.accounting_service.queue_arn,
          module.legal_service.queue_arn,
        ]
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_lambda_event_source_mapping" "dynamodb_to_router" {
  event_source_arn  = module.services_table.stream_arn
  function_name     = module.stream_router_lambda.function_arn
  starting_position = "LATEST"
  batch_size        = 10

  function_response_types = ["ReportBatchItemFailures"]
  enabled                 = true
}

# ══════════════════════════════════════════════
# Lambda — Shared Task Worker
# ══════════════════════════════════════════════

module "task_worker_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-task-worker"
  description   = "Shared worker — processes tasks from all task SQS queues"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "task-worker/task-worker.zip"

  runtime         = "nodejs22.x"
  handler         = "index.handler"
  architectures   = ["arm64"]
  memory_mb       = 512
  timeout_seconds = 120

  environment = {
    NODE_ENV          = var.environment
    DYNAMODB_TABLE    = module.services_table.name
    ANTHROPIC_API_KEY = var.anthropic_api_key
    NAME_PREFIX       = local.name_prefix
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "SQSConsumeAllTasks"
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ]
        Resource = [
          module.accounting_service.queue_arn,
          module.legal_service.queue_arn,
        ]
      },
      {
        Sid      = "SQSSendCrossTask"
        Effect   = "Allow"
        Action   = ["sqs:SendMessage"]
        Resource = ["arn:aws:sqs:*:*:${local.name_prefix}-*-service"]
      },
      {
        Sid    = "DynamoDBAccess"
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
      },
      {
        Sid      = "S3DocumentRead"
        Effect   = "Allow"
        Action   = ["s3:GetObject"]
        Resource = ["${module.intake_bucket.bucket_arn}/*"]
      },
      {
        Sid    = "SSMServiceDiscovery"
        Effect = "Allow"
        Action = ["ssm:GetParameter", "ssm:GetParametersByPath"]
        Resource = [
          "arn:aws:ssm:*:*:parameter/${local.name_prefix}/services/*",
          "arn:aws:ssm:*:*:parameter/${local.name_prefix}/agents/*"
        ]
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_lambda_event_source_mapping" "accounting_to_worker" {
  event_source_arn        = module.accounting_service.queue_arn
  function_name           = module.task_worker_lambda.function_arn
  batch_size              = 5
  function_response_types = ["ReportBatchItemFailures"]
  enabled                 = true
}

resource "aws_lambda_event_source_mapping" "legal_to_worker" {
  event_source_arn        = module.legal_service.queue_arn
  function_name           = module.task_worker_lambda.function_arn
  batch_size              = 5
  function_response_types = ["ReportBatchItemFailures"]
  enabled                 = true
}

# ══════════════════════════════════════════════
# Lambda — Email Ingest
# ══════════════════════════════════════════════

module "email_ingest_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-email-ingest"
  description   = "Parses inbound emails and queues attachments for processing"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "email-ingest/email-ingest.zip"

  runtime         = "nodejs22.x"
  handler         = "handler.handler"
  architectures   = ["arm64"]
  memory_mb       = 256
  timeout_seconds = 60

  environment = {
    NODE_ENV          = var.environment
    S3_BUCKET         = module.intake_bucket.bucket_id
    AWS_SQS_QUEUE_URL = module.processing_queue.queue_url
    DATABASE_URL      = local.gateway_secrets.DATABASE_URL
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "S3Access"
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject"]
        Resource = ["${module.intake_bucket.bucket_arn}/*"]
      },
      {
        Sid      = "SQSSend"
        Effect   = "Allow"
        Action   = ["sqs:SendMessage"]
        Resource = [module.processing_queue.queue_arn]
      }
    ]
  })

  tags = local.common_tags
}

# ══════════════════════════════════════════════
# Task Services (SQS queues per task service)
# ══════════════════════════════════════════════

module "accounting_service" {
  source = "../../modules/task-service"

  name_prefix  = local.name_prefix
  service_slug = "accounting"
  tags         = local.common_tags
}

module "legal_service" {
  source = "../../modules/task-service"

  name_prefix  = local.name_prefix
  service_slug = "legal"
  tags         = local.common_tags
}

# ══════════════════════════════════════════════
# SES — Inbound Email
# ══════════════════════════════════════════════

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "${local.name_prefix}-inbound"
}

resource "aws_ses_active_receipt_rule_set" "main" {
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
}

resource "aws_ses_receipt_rule" "inbound_docs" {
  name          = "${local.name_prefix}-inbound-docs"
  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
  enabled       = true
  recipients    = [var.inbound_email_domain]

  s3_action {
    bucket_name       = module.intake_bucket.bucket_id
    object_key_prefix = "emails/"
    position          = 1
  }

  lambda_action {
    function_arn    = module.email_ingest_lambda.function_arn
    invocation_type = "Event"
    position        = 2
  }
}

resource "aws_lambda_permission" "ses_invoke_email_ingest" {
  statement_id   = "AllowSESInvoke"
  action         = "lambda:InvokeFunction"
  function_name  = module.email_ingest_lambda.function_name
  principal      = "ses.amazonaws.com"
  source_account = data.aws_caller_identity.current.account_id
}

# ══════════════════════════════════════════════
# Static Sites (S3 + CloudFront + ACM + DNS)
# ══════════════════════════════════════════════

module "admin_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "admin"
  bucket_name    = "${local.name_prefix}-${local.region_short}-admin"
  domain         = var.admin_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags
}

module "intake_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "intake"
  bucket_name    = "${local.name_prefix}-${local.region_short}-intake-frontend"
  domain         = var.intake_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags
}

module "email_storybook_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "email-storybook"
  bucket_name    = "${local.name_prefix}-${local.region_short}-email-storybook"
  domain         = var.email_storybook_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags
}

module "signatures_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "signatures"
  bucket_name    = "${local.name_prefix}-${local.region_short}-signatures-ui"
  domain         = var.signatures_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags
}

module "gateway_ui_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "gateway-ui"
  bucket_name    = "${local.name_prefix}-${local.region_short}-gateway-ui"
  domain         = var.gateway_ui_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags
}

module "tasks_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "tasks"
  bucket_name    = "${local.name_prefix}-${local.region_short}-tasks"
  domain         = var.tasks_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags

  cloudfront_function_code = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Rewrite dynamic task routes to the static placeholder page
      // /accounting/tasks/abc-123/ → /accounting/tasks/_/index.html
      var taskMatch = uri.match(/^\/([^\/]+)\/tasks\/([^\/]+)/);
      if (taskMatch && taskMatch[2] !== '_') {
        uri = '/' + taskMatch[1] + '/tasks/_/';
      }

      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      } else if (!uri.includes('.')) {
        request.uri = uri + '/index.html';
      } else {
        request.uri = uri;
      }
      return request;
    }
  EOF
}

module "notes_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "notes"
  bucket_name    = "${local.name_prefix}-${local.region_short}-notes"
  domain         = var.notes_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags

  cloudfront_function_code = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Rewrite /view/<any-id>/ → /view/_/index.html
      var viewMatch = uri.match(/^\/view\/([^\/]+)/);
      if (viewMatch && viewMatch[1] !== '_') {
        uri = '/view/_/';
      }

      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      } else if (!uri.includes('.')) {
        request.uri = uri + '/index.html';
      } else {
        request.uri = uri;
      }
      return request;
    }
  EOF
}

