variable "name" {
  description = "Queue name."
  type        = string
}

variable "visibility_timeout_seconds" {
  description = "Message visibility timeout."
  type        = number
  default     = 300
}

variable "message_retention_seconds" {
  description = "How long messages are retained."
  type        = number
  default     = 86400 # 1 day
}

variable "receive_wait_time_seconds" {
  description = "Long polling wait time."
  type        = number
  default     = 20
}

variable "max_receive_count" {
  description = "Receive attempts before sending to DLQ."
  type        = number
  default     = 3
}

variable "dlq_retention_seconds" {
  description = "DLQ message retention."
  type        = number
  default     = 1209600 # 14 days
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default     = {}
}
