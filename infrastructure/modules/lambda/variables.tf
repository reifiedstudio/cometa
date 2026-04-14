# ── Identity ──

variable "function_name" {
  description = "Lambda function name (must be unique)."
  type        = string
}

variable "description" {
  description = "Lambda function description."
  type        = string
  default     = null
}

# ── Code Artifact ──

variable "artifact_bucket_name" {
  description = "S3 bucket containing the Lambda code ZIP."
  type        = string
}

variable "code_s3_key" {
  description = "S3 object key for the Lambda code ZIP."
  type        = string
}

# ── Runtime ──

variable "runtime" {
  description = "Runtime identifier (e.g. nodejs22.x, python3.12)."
  type        = string
}

variable "handler" {
  description = "Handler entrypoint (e.g. index.handler)."
  type        = string
  default     = "handler.handler"
}

variable "architectures" {
  description = "CPU architecture."
  type        = list(string)
  default     = ["arm64"]
}

variable "layers" {
  description = "Lambda layer ARNs."
  type        = list(string)
  default     = []
}

variable "memory_mb" {
  description = "Memory in MB."
  type        = number
  default     = 256
}

variable "timeout_seconds" {
  description = "Timeout in seconds."
  type        = number
  default     = 10
}

variable "ephemeral_storage_mb" {
  description = "Ephemeral storage in MB (512-10240). Null uses AWS default (512)."
  type        = number
  default     = null
}

variable "publish" {
  description = "Publish a new version on each update."
  type        = bool
  default     = true
}

# ── Environment ──

variable "environment" {
  description = "Environment variables (values must be strings)."
  type        = map(string)
  default     = {}
}

# ── VPC (optional) ──

variable "subnet_ids" {
  description = "Private subnet IDs for VPC attachment."
  type        = list(string)
  default     = []
}

variable "security_group_ids" {
  description = "Security group IDs (required when subnet_ids is set)."
  type        = list(string)
  default     = []
}

# ── IAM ──

variable "inline_policy_json" {
  description = "Inline IAM policy JSON for least-privilege access."
  type        = string
}

variable "managed_policy_arns" {
  description = "Extra managed policy ARNs to attach."
  type        = list(string)
  default     = []
}

variable "permissions_boundary_arn" {
  description = "Permissions boundary ARN for the execution role."
  type        = string
  default     = null
}

# ── Function URL (optional) ──

variable "create_function_url" {
  description = "Create a public function URL."
  type        = bool
  default     = false
}

variable "cors_enabled" {
  description = "Enable CORS on the function URL. Set to false when the application handles CORS itself (e.g. via Hono middleware)."
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
  default     = ["GET", "POST", "PUT", "DELETE", "PATCH"]
}

variable "cors_allow_headers" {
  description = "CORS allowed headers (lowercase — AWS normalises to lowercase)."
  type        = list(string)
  default     = ["content-type", "authorization"]
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

# ── Tags ──

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default     = {}
}
