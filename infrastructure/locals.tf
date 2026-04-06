locals {
  name_prefix = "${var.project_name}-${var.environment}"

  # Short region codes for globally unique S3 names
  region_short_map = {
    "us-east-1"    = "use1"
    "us-east-2"    = "use2"
    "us-west-1"    = "usw1"
    "us-west-2"    = "usw2"
    "eu-west-1"    = "euw1"
    "eu-central-1" = "euc1"
    "af-south-1"   = "afs1"
    "ap-southeast-1" = "apse1"
  }
  region_short = lookup(local.region_short_map, var.aws_region, replace(var.aws_region, "-", ""))

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Team        = var.team_name
  }

  # TODO: move to tfvars / secrets manager for prod
  gateway_secrets = {
    DATABASE_URL                     = "REDACTED_SECRET_1"
    OPENAI_API_KEY                   = "REDACTED_SECRET_2"
    OPENAI_MODEL                     = "gpt-5-nano"
    CLERK_SECRET_KEY                 = "REDACTED_SECRET_3"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "REDACTED_SECRET_4"
  }
}
