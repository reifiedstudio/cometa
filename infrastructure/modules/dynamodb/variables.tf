variable "name" {
  description = "Table name."
  type        = string
}

variable "billing_mode" {
  description = "Billing mode (PAY_PER_REQUEST or PROVISIONED)."
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "hash_key" {
  description = "Hash (partition) key name."
  type        = string
}

variable "range_key" {
  description = "Range (sort) key name."
  type        = string
  default     = null
}

variable "attributes" {
  description = "Attribute definitions for keys and indexes."
  type = list(object({
    name = string
    type = string # S, N, or B
  }))
}

variable "global_secondary_indexes" {
  description = "GSI definitions."
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = optional(string)
    projection_type = optional(string, "ALL")
  }))
  default = []
}

variable "ttl_attribute" {
  description = "Attribute name for TTL. Null disables TTL."
  type        = string
  default     = null
}

variable "point_in_time_recovery" {
  description = "Enable point-in-time recovery."
  type        = bool
  default     = false
}

variable "stream_enabled" {
  description = "Enable DynamoDB Streams."
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Stream view type (NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES, KEYS_ONLY)."
  type        = string
  default     = "NEW_IMAGE"
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default     = {}
}
