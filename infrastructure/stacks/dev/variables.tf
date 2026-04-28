variable "project_name" {
  description = "Project name used for tagging and resource naming"
  type        = string
  default     = "cometa"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "team_name" {
  description = "Team name for tagging"
  type        = string
  default     = "reifiedstudio"
}

variable "root_domain" {
  description = "Root domain for DNS and certificates"
  type        = string
  default     = "cometa.co"
}

variable "inbound_email_domain" {
  description = "Domain for inbound document intake via SES (catch-all)"
  type        = string
  default     = "daniellourie.me"
}

variable "mcp_domain" {
  description = "Custom domain for the MCP/gateway endpoint"
  type        = string
  default     = "mcp.daniellourie.me"
}

variable "mcp_hosted_zone_id" {
  description = "Route53 hosted zone ID for the MCP domain"
  type        = string
  default     = "Z04807263TJCM2DMNPRY1"
}

# ── Secrets (provided via terraform.tfvars or TF_VAR_*) ──

variable "database_url" {
  description = "Neon Postgres connection string"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key for document classification"
  type        = string
  sensitive   = true
}

variable "openai_model" {
  description = "OpenAI model for classification/extraction"
  type        = string
  default     = "gpt-5-nano"
}

variable "clerk_secret_key" {
  description = "Clerk backend API secret"
  type        = string
  sensitive   = true
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key (frontend-safe but kept here for parity)"
  type        = string
  sensitive   = true
}

variable "anthropic_api_key" {
  description = "Anthropic API key for Claude (task service agents)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "mcp_auth_token" {
  description = "Shared bearer token between MCP-bearing Lambdas and Anthropic-managed agents (Authorization: Bearer ...)"
  type        = string
  sensitive   = true
  default     = ""
}

variable "tasks_domain" {
  description = "Custom domain for the tasks frontend"
  type        = string
  default     = "tasks.daniellourie.me"
}

variable "notes_domain" {
  description = "Custom domain for shareable notes"
  type        = string
  default     = "notes.daniellourie.me"
}

variable "admin_domain" {
  description = "Custom domain for the admin frontend"
  type        = string
  default     = "admin.daniellourie.me"
}

variable "intake_domain" {
  description = "Custom domain for the documents frontend"
  type        = string
  default     = "intake.daniellourie.me"
}

variable "signatures_domain" {
  description = "Custom domain for the signatures API"
  type        = string
  default     = "sign.daniellourie.me"
}

variable "email_storybook_domain" {
  description = "Custom domain for the deployed email Storybook"
  type        = string
  default     = "emails.daniellourie.me"
}

variable "assets_domain" {
  description = "Custom domain for the public assets CDN"
  type        = string
  default     = "assets.daniellourie.me"
}

variable "images_domain" {
  description = "Custom domain for the image resize service"
  type        = string
  default     = "images.daniellourie.me"
}

variable "gateway_ui_domain" {
  description = "Custom domain for the gateway UI frontend"
  type        = string
  default     = "gateway.daniellourie.me"
}

variable "resend_api_key" {
  description = "Resend API key for sending transactional emails"
  type        = string
  sensitive   = true
}

variable "email_from" {
  description = "Default sender email address"
  type        = string
  default     = "Cometa <docs@daniellourie.me>"
}
