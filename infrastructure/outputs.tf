# output "api_url" {
#   description = "API endpoint URL"
#   value       = "https://api.${var.root_domain}"
# }

# output "ecr_repository_url" {
#   description = "ECR repository URL for API container"
#   value       = module.ecr_api.repository_url
# }

output "documents_bucket" {
  description = "S3 bucket name for document storage"
  value       = module.documents_bucket.bucket_id
}

output "textract_service_role_arn" {
  description = "IAM role ARN for Textract async API to access S3"
  value       = aws_iam_role.textract_service.arn
}

# output "alb_dns_name" {
#   description = "ALB DNS name"
#   value       = module.alb.alb_dns_name
# }

# output "vpc_id" {
#   description = "VPC ID"
#   value       = module.vpc.vpc_id
# }
