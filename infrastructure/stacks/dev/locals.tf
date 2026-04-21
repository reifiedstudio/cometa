locals {
  name_prefix = "${var.project_name}-${var.environment}"

  # Short region codes for globally unique S3 names
  region_short_map = {
    "us-east-1"  = "use1"
    "af-south-1" = "afs1"
  }

  region_short = lookup(local.region_short_map, var.aws_region, replace(var.aws_region, "-", ""))

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
    Team        = var.team_name
  }

  # Secrets sourced from terraform.tfvars (gitignored) or TF_VAR_* env vars.
  gateway_secrets = {
    DATABASE_URL                      = var.database_url
    OPENAI_API_KEY                    = var.openai_api_key
    OPENAI_MODEL                      = var.openai_model
    CLERK_SECRET_KEY                  = var.clerk_secret_key
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = var.clerk_publishable_key
  }

  intake_api_secrets = {
    DATABASE_URL     = var.database_url
    OPENAI_API_KEY   = var.openai_api_key
    OPENAI_MODEL     = var.openai_model
    CLERK_SECRET_KEY = var.clerk_secret_key
  }

  signatures_secrets = {
    DATABASE_URL     = var.database_url
    CLERK_SECRET_KEY = var.clerk_secret_key
  }
}
