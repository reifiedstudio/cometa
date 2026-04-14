output "function_name" {
  description = "Lambda function name."
  value       = aws_lambda_function.this.function_name
}

output "function_arn" {
  description = "Lambda function ARN."
  value       = aws_lambda_function.this.arn
}

output "invoke_arn" {
  description = "Lambda invoke ARN (for API Gateway integration)."
  value       = aws_lambda_function.this.invoke_arn
}

output "version" {
  description = "Published version number."
  value       = aws_lambda_function.this.version
}

output "qualified_arn" {
  description = "ARN with version qualifier."
  value       = aws_lambda_function.this.qualified_arn
}

output "execution_role_arn" {
  description = "Execution role ARN."
  value       = aws_iam_role.exec.arn
}

output "function_url" {
  description = "Function URL (empty string if create_function_url is false)."
  value       = var.create_function_url ? aws_lambda_function_url.this[0].function_url : ""
}
