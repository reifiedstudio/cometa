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

variable "api_port" {
  description = "Port the API container listens on"
  type        = number
  default     = 3001
}
