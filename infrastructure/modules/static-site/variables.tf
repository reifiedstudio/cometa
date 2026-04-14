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
      if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
      } else if (!uri.includes('.')) {
        request.uri = uri + '/index.html';
      }
      return request;
    }
  EOF
}

variable "tags" {
  description = "Tags applied to all resources."
  type        = map(string)
  default     = {}
}
