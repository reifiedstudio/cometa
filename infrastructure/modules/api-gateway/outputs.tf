output "api_id" {
  description = "API Gateway ID."
  value       = aws_apigatewayv2_api.this.id
}

output "api_endpoint" {
  description = "API Gateway default endpoint URL."
  value       = aws_apigatewayv2_api.this.api_endpoint
}

output "execution_arn" {
  description = "API Gateway execution ARN."
  value       = aws_apigatewayv2_api.this.execution_arn
}

output "custom_domain_url" {
  description = "Custom domain URL (if configured)."
  value       = var.domain != null ? "https://${var.domain}" : null
}
