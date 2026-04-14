output "name" {
  description = "Table name."
  value       = aws_dynamodb_table.this.name
}

output "arn" {
  description = "Table ARN."
  value       = aws_dynamodb_table.this.arn
}

output "stream_arn" {
  description = "DynamoDB stream ARN (empty if streams disabled)."
  value       = var.stream_enabled ? aws_dynamodb_table.this.stream_arn : ""
}
