# ── Shared ──

output "intake_bucket" {
  description = "S3 bucket for intake document storage"
  value       = module.intake_bucket.bucket_id
}

output "textract_service_role_arn" {
  description = "IAM role ARN for Textract async API to access S3"
  value       = aws_iam_role.textract_service.arn
}

output "artifacts_bucket" {
  description = "S3 bucket for Lambda deployment artifacts"
  value       = module.artifacts_bucket.bucket_id
}

# ── Gateway ──

output "gateway_url" {
  description = "Public HTTPS URL for the gateway Lambda"
  value       = module.gateway_lambda.function_url
}

output "gateway_mcp_url" {
  description = "MCP endpoint URL — paste this into Claude Cowork"
  value       = "${module.gateway_api.custom_domain_url}/mcp"
}

output "gateway_api_endpoint" {
  description = "API Gateway default endpoint URL"
  value       = module.gateway_api.api_endpoint
}

output "gateway_custom_url" {
  description = "Custom domain gateway URL"
  value       = module.gateway_api.custom_domain_url
}

# ── Messaging ──

output "processing_queue_url" {
  description = "SQS queue URL for document processing"
  value       = module.processing_queue.queue_url
}

output "processing_dlq_url" {
  description = "Dead letter queue for failed processing"
  value       = module.processing_queue.dlq_url
}

# ── Tasks ──

output "tasks_api_url" {
  description = "Tasks API Lambda URL"
  value       = module.tasks_api_lambda.function_url
}

output "tasks_site_url" {
  description = "Tasks frontend URL"
  value       = "https://${var.tasks_domain}"
}

output "tasks_site_bucket" {
  description = "S3 bucket for tasks frontend static files"
  value       = module.tasks_site.bucket_id
}

output "tasks_site_cloudfront_id" {
  description = "CloudFront distribution ID for tasks frontend"
  value       = module.tasks_site.cloudfront_id
}

# ── Notes ──

output "notes_url" {
  description = "Shareable notes URL"
  value       = "https://${var.notes_domain}"
}

output "notes_bucket" {
  description = "S3 bucket for shareable notes"
  value       = module.notes_site.bucket_id
}

output "notes_cloudfront_id" {
  description = "CloudFront distribution ID for notes"
  value       = module.notes_site.cloudfront_id
}

output "notes_content_bucket" {
  description = "S3 bucket for note HTML content (separate from frontend)"
  value       = module.notes_content_bucket.bucket_id
}

# ── Admin ──

output "admin_url" {
  description = "Admin frontend URL"
  value       = "https://${var.admin_domain}"
}

output "admin_bucket" {
  description = "S3 bucket for admin frontend static files"
  value       = module.admin_site.bucket_id
}

output "admin_cloudfront_id" {
  description = "CloudFront distribution ID for admin frontend"
  value       = module.admin_site.cloudfront_id
}

# ── Tasks Workers ──

output "task_worker_function" {
  description = "Shared task worker Lambda function name"
  value       = module.task_worker_lambda.function_name
}

# ── Drive ──

output "drive_api_url" {
  description = "Drive API Lambda function URL"
  value       = module.drive_lambda.function_url
}

output "drive_ui_url" {
  description = "Drive UI frontend URL"
  value       = "https://${var.drive_ui_domain}"
}

output "drive_ui_bucket" {
  description = "S3 bucket for drive UI static files"
  value       = module.drive_ui_site.bucket_id
}

output "drive_ui_cloudfront_id" {
  description = "CloudFront distribution ID for drive UI"
  value       = module.drive_ui_site.cloudfront_id
}

# ── Intake ──

output "intake_api_url" {
  description = "Intake API Lambda function URL"
  value       = module.intake_api_lambda.function_url
}

output "intake_frontend_url" {
  description = "Intake frontend URL"
  value       = "https://${var.intake_domain}"
}

output "intake_frontend_bucket" {
  description = "S3 bucket for intake frontend"
  value       = module.intake_site.bucket_id
}

output "intake_frontend_cloudfront_id" {
  description = "CloudFront distribution ID for intake frontend"
  value       = module.intake_site.cloudfront_id
}

# ── Signatures ──

output "signatures_api_url" {
  description = "Signatures API Lambda function URL"
  value       = module.signatures_lambda.function_url
}

output "signatures_ui_url" {
  description = "Signatures UI URL"
  value       = "https://${var.signatures_domain}"
}

output "signatures_ui_bucket" {
  description = "S3 bucket for signatures UI"
  value       = module.signatures_site.bucket_id
}

output "signatures_ui_cloudfront_id" {
  description = "CloudFront distribution ID for signatures UI"
  value       = module.signatures_site.cloudfront_id
}

# ── Utilities ──

output "utilities_api_url" {
  description = "Utilities API Lambda function URL"
  value       = module.utilities_lambda.function_url
}

# ── Gateway UI ──

output "gateway_ui_url" {
  description = "Gateway UI frontend URL"
  value       = "https://${var.gateway_ui_domain}"
}

output "gateway_ui_bucket" {
  description = "S3 bucket for gateway UI static files"
  value       = module.gateway_ui_site.bucket_id
}

output "gateway_ui_cloudfront_id" {
  description = "CloudFront distribution ID for gateway UI"
  value       = module.gateway_ui_site.cloudfront_id
}

# ── Assets CDN ──

output "assets_url" {
  description = "Public assets CDN URL"
  value       = "https://${var.assets_domain}"
}

output "assets_bucket" {
  description = "S3 bucket for public assets"
  value       = module.assets_site.bucket_id
}

output "assets_cloudfront_id" {
  description = "CloudFront distribution ID for assets CDN"
  value       = module.assets_site.cloudfront_id
}

# ── PDF Converter ──

output "pdf_converter_url" {
  description = "PDF Converter Lambda function URL"
  value       = module.pdf_converter_lambda.function_url
}

# ── Email Storybook ──

output "email_storybook_bucket" {
  description = "S3 bucket for the deployed email Storybook"
  value       = module.email_storybook_site.bucket_id
}

output "email_storybook_cloudfront_id" {
  description = "CloudFront distribution ID for email Storybook"
  value       = module.email_storybook_site.cloudfront_id
}

output "email_storybook_url" {
  description = "Email Storybook URL"
  value       = "https://${var.email_storybook_domain}"
}
