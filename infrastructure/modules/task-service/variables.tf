variable "name_prefix" {
  description = "Project-env prefix (e.g. cometa-dev)."
  type        = string
}

variable "service_slug" {
  description = "Task service identifier (e.g. accounting, legal)."
  type        = string
}

variable "max_receive_count" {
  description = "SQS receive attempts before sending to DLQ."
  type        = number
  default     = 3
}

variable "visibility_timeout_seconds" {
  description = "SQS message visibility timeout."
  type        = number
  default     = 300
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default     = {}
}
