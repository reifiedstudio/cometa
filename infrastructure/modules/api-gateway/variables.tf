variable "name" {
  description = "Name for the API Gateway."
  type        = string
}

variable "description" {
  description = "Description of the API."
  type        = string
  default     = ""
}

variable "lambda_invoke_arn" {
  description = "Lambda function invoke ARN for the integration."
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name (for permission)."
  type        = string
}

# ── Custom Domain ──

variable "domain" {
  description = "Custom domain name. Set to null to skip domain setup."
  type        = string
  default     = null
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the custom domain."
  type        = string
  default     = null
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for DNS records."
  type        = string
  default     = null
}

# ── CORS ──

variable "cors_enabled" {
  description = "Whether to configure CORS at the API Gateway level. Disable if the Lambda handles CORS."
  type        = bool
  default     = true
}

variable "cors_allow_origins" {
  description = "CORS allowed origins."
  type        = list(string)
  default     = ["*"]
}

variable "cors_allow_methods" {
  description = "CORS allowed methods."
  type        = list(string)
  default     = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}

variable "cors_allow_headers" {
  description = "CORS allowed headers."
  type        = list(string)
  default     = ["Content-Type", "Authorization"]
}

variable "cors_expose_headers" {
  description = "CORS exposed headers."
  type        = list(string)
  default     = []
}

variable "cors_max_age" {
  description = "CORS preflight cache duration in seconds."
  type        = number
  default     = 86400
}

variable "cors_allow_credentials" {
  description = "Whether to allow credentials in CORS requests."
  type        = bool
  default     = false
}

# ── Tags ──

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
  default     = {}
}
