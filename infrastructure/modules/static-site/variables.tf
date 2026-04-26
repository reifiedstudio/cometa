variable "name_prefix" {
  description = "Project-env prefix (e.g. cometa-dev)."
  type        = string
}

variable "site_name" {
  description = "Short site identifier (e.g. admin, documents)."
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for site assets."
  type        = string
}

variable "domain" {
  description = "Custom domain for the CloudFront distribution."
  type        = string
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for DNS records."
  type        = string
}

variable "cloudfront_function_code" {
  description = "CloudFront viewer-request function code. Defaults to standard SPA rewrite."
  type        = string
  default     = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;
      // If it looks like a file (has extension), serve as-is
      if (uri.includes('.')) return request;
      // For any path, try to find the matching index.html
      // Dynamic segments (UUIDs, slugs) get rewritten to the _ placeholder
      var parts = uri.replace(/\/$/, '').split('/');
      // Walk up the path, replacing UUID-like or non-static segments with _
      for (var i = parts.length - 1; i >= 1; i--) {
        if (parts[i].match(/^[0-9a-f-]{8,}$/) || parts[i].match(/^[^_].*[0-9]/)) {
          parts[i] = '_';
        }
      }
      request.uri = parts.join('/') + '/index.html';
      return request;
    }
  EOF
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default     = {}
}
