# ── Execution Role ──

data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "exec" {
  name                 = "${var.function_name}-exec-role"
  assume_role_policy   = data.aws_iam_policy_document.assume.json
  permissions_boundary = var.permissions_boundary_arn
  tags                 = var.tags
}

resource "aws_iam_role_policy_attachment" "basic_logging" {
  role       = aws_iam_role.exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "vpc_access" {
  count      = length(var.subnet_ids) > 0 ? 1 : 0
  role       = aws_iam_role.exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Per-Lambda inline policy (least privilege)
resource "aws_iam_policy" "inline" {
  name   = "${var.function_name}-exec-inline"
  policy = var.inline_policy_json
}

resource "aws_iam_role_policy_attachment" "inline" {
  role       = aws_iam_role.exec.name
  policy_arn = aws_iam_policy.inline.arn
}

resource "aws_iam_role_policy_attachment" "managed" {
  for_each   = toset(var.managed_policy_arns)
  role       = aws_iam_role.exec.name
  policy_arn = each.value
}

# ── Lambda Function ──

resource "aws_lambda_function" "this" {
  function_name = var.function_name
  description   = var.description

  runtime       = var.runtime
  handler       = var.handler
  role          = aws_iam_role.exec.arn
  architectures = var.architectures
  layers        = var.layers
  memory_size   = var.memory_mb
  timeout       = var.timeout_seconds
  publish       = var.publish

  s3_bucket = var.artifact_bucket_name
  s3_key    = var.code_s3_key

  dynamic "vpc_config" {
    for_each = length(var.subnet_ids) > 0 ? [1] : []
    content {
      subnet_ids         = var.subnet_ids
      security_group_ids = var.security_group_ids
    }
  }

  dynamic "ephemeral_storage" {
    for_each = var.ephemeral_storage_mb != null ? [1] : []
    content { size = var.ephemeral_storage_mb }
  }

  environment { variables = var.environment }

  tags = var.tags

  lifecycle {
    precondition {
      condition     = length(var.subnet_ids) == 0 || length(var.security_group_ids) > 0
      error_message = "security_group_ids required when subnet_ids are provided."
    }

    # Prevent Terraform from reverting code changes made by deploy scripts
    ignore_changes = [s3_key, s3_object_version]
  }
}

# ── Function URL (optional) ──

resource "aws_lambda_function_url" "this" {
  count              = var.create_function_url ? 1 : 0
  function_name      = aws_lambda_function.this.function_name
  authorization_type = "NONE"

  dynamic "cors" {
    for_each = var.cors_enabled ? [1] : []
    content {
      allow_origins     = var.cors_allow_origins
      allow_methods     = var.cors_allow_methods
      allow_headers     = var.cors_allow_headers
      expose_headers    = var.cors_expose_headers
      max_age           = var.cors_max_age
      allow_credentials = false
    }
  }
}

resource "aws_lambda_permission" "url_invoke" {
  count                  = var.create_function_url ? 1 : 0
  statement_id           = "AllowPublicFunctionUrl"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.this.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

resource "aws_lambda_permission" "public_invoke" {
  count         = var.create_function_url ? 1 : 0
  statement_id  = "AllowPublicInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "*"
}
