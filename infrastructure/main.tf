# ──────────────────────────────────────────────
# Networking (commented out — not needed until deployment)
# ──────────────────────────────────────────────

# module "vpc" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/vpc?ref=vpc/v0.1.0"
#
#   name_prefix          = local.name_prefix
#   vpc_cidr_block       = "10.0.0.0/16"
#   az_a                 = "${var.aws_region}a"
#   az_b                 = "${var.aws_region}b"
#   public_subnet_a_cidr = "10.0.1.0/24"
#   public_subnet_b_cidr = "10.0.2.0/24"
#   private_subnet_a_cidr = "10.0.10.0/24"
#   private_subnet_b_cidr = "10.0.11.0/24"
#
#   create_nat_gateway             = true
#   create_s3_gateway_endpoint     = true
#   create_dynamodb_gateway_endpoint = false
#
#   tags = local.common_tags
# }

# ──────────────────────────────────────────────
# DNS & Certificates (commented out — not needed until deployment)
# ──────────────────────────────────────────────

# module "dns" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/dns?ref=dns/v0.1.0"
#
#   name_prefix    = local.name_prefix
#   root_domain    = var.root_domain
#   create_vpn_cert = false
#
#   alb_dns_name      = module.alb.alb_dns_name
#   alb_zone_id        = module.alb.alb_zone_id
#   subdomain_aliases  = ["api"]
# }

# ──────────────────────────────────────────────
# Load Balancer (commented out — not needed until deployment)
# ──────────────────────────────────────────────

# module "alb" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/alb?ref=alb/v0.1.0"
#
#   name_prefix       = local.name_prefix
#   vpc_id            = module.vpc.vpc_id
#   public_subnet_ids = module.vpc.public_subnet_ids
#   certificate_arn   = module.dns.root_certificate_arn
#
#   enable_deletion_protection = var.environment == "prod"
#
#   tags = local.common_tags
# }

# module "alb_target_api" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/alb_target?ref=alb_target/v0.1.0"
#
#   name_prefix       = local.name_prefix
#   service_name      = "api"
#   vpc_id            = module.vpc.vpc_id
#   port              = var.api_port
#   protocol          = "HTTP"
#   health_check_path = "/health"
#
#   tags = local.common_tags
# }

# module "alb_rule_api" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/alb_rule?ref=alb_rule/v0.1.0"
#
#   name_prefix      = local.name_prefix
#   listener_arn     = module.alb.https_listener_arn
#   target_group_arn = module.alb_target_api.arn
#   priority         = 100
#   hostnames        = ["api.${var.root_domain}"]
#
#   tags = local.common_tags
# }

# ──────────────────────────────────────────────
# S3 — Document Storage
# ──────────────────────────────────────────────

module "documents_bucket" {
  source = "github.com/reifiedstudio/terraform-modules//modules/s3?ref=s3/v0.1.0"

  bucket_name        = "${local.name_prefix}-documents"
  versioning_enabled = true

  cors_rules = [
    {
      allowed_methods = ["PUT", "POST", "GET"]
      allowed_origins = ["http://localhost:3000", "https://${var.root_domain}"]
      allowed_headers = ["*"]
      max_age_seconds = 3600
    }
  ]

  tags = local.common_tags
}

# ──────────────────────────────────────────────
# Textract — IAM Service Role for async API
# ──────────────────────────────────────────────

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
    sid     = "AllowS3Read"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      "${module.documents_bucket.bucket_arn}/*",
    ]
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

# ──────────────────────────────────────────────
# ECR — Container Registry (commented out — not needed until deployment)
# ──────────────────────────────────────────────

# module "ecr_api" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/ecr?ref=ecr/v0.1.0"
#
#   name = "${var.project_name}/api"
#
#   tags = local.common_tags
# }

# ──────────────────────────────────────────────
# ECS — Compute (commented out — not needed until deployment)
# ──────────────────────────────────────────────

# module "ecs_cluster" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/ecs_cluster?ref=ecs_cluster/v0.1.0"
#
#   name_prefix              = local.name_prefix
#   enable_container_insights = var.environment == "prod"
#   enable_exec               = true
# }

# module "log_group_api" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/cloudwatch_log?ref=cloudwatch_log/v0.1.0"
#
#   name_prefix      = local.name_prefix
#   name             = "/ecs/${local.name_prefix}-api"
#   retention_in_days = 30
# }

# resource "aws_security_group" "api" {
#   name_prefix = "${local.name_prefix}-api-"
#   vpc_id      = module.vpc.vpc_id
#
#   ingress {
#     from_port       = var.api_port
#     to_port         = var.api_port
#     protocol        = "tcp"
#     security_groups = [module.alb.alb_sg_id]
#   }
#
#   egress {
#     from_port   = 0
#     to_port     = 0
#     protocol    = "-1"
#     cidr_blocks = ["0.0.0.0/0"]
#   }
#
#   tags = merge(local.common_tags, { Name = "${local.name_prefix}-api" })
# }

# module "ecs_service_api" {
#   source = "github.com/reifiedstudio/terraform-modules//modules/ecs_service?ref=ecs_service/v0.1.0"
#
#   name_prefix        = local.name_prefix
#   service_prefix     = "${local.name_prefix}-api"
#   cluster_arn        = module.ecs_cluster.cluster_arn
#   subnet_ids         = module.vpc.private_subnet_ids
#   security_group_ids = [aws_security_group.api.id]
#   log_group_name     = module.log_group_api.log_group_name
#
#   container = {
#     image  = "${module.ecr_api.repository_url}:latest"
#     port   = var.api_port
#     cpu    = 512
#     memory = 1024
#     environment = {
#       PORT              = tostring(var.api_port)
#       NODE_ENV          = var.environment
#       S3_BUCKET         = module.documents_bucket.bucket_id
#       AWS_REGION        = var.aws_region
#       DATABASE_URL      = var.database_url
#       OPENAI_API_KEY    = var.openai_api_key
#       CORS_ORIGIN       = "https://${var.root_domain}"
#     }
#   }
#
#   load_balancer = {
#     target_group_arn = module.alb_target_api.arn
#     container_port   = var.api_port
#   }
#
#   task_inline_policy_json = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Sid    = "S3DocumentAccess"
#         Effect = "Allow"
#         Action = [
#           "s3:PutObject",
#           "s3:GetObject",
#           "s3:DeleteObject",
#           "s3:ListBucket"
#         ]
#         Resource = [
#           module.documents_bucket.bucket_arn,
#           "${module.documents_bucket.bucket_arn}/*"
#         ]
#       },
#       {
#         Sid    = "TextractAccess"
#         Effect = "Allow"
#         Action = [
#           "textract:StartDocumentTextDetection",
#           "textract:GetDocumentTextDetection",
#           "textract:DetectDocumentText"
#         ]
#         Resource = ["*"]
#       },
#       {
#         Sid    = "PassTextractRole"
#         Effect = "Allow"
#         Action = ["iam:PassRole"]
#         Resource = [aws_iam_role.textract_service.arn]
#       }
#     ]
#   })
#
#   desired_count = 1
#
#   tags = local.common_tags
# }
