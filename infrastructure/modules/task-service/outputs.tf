output "queue_url" {
  description = "SQS queue URL for the task service"
  value       = aws_sqs_queue.service.url
}

output "queue_arn" {
  description = "SQS queue ARN for the task service"
  value       = aws_sqs_queue.service.arn
}

output "dlq_url" {
  description = "Dead letter queue URL"
  value       = aws_sqs_queue.dlq.url
}

output "dlq_arn" {
  description = "Dead letter queue ARN"
  value       = aws_sqs_queue.dlq.arn
}

output "ssm_parameter_arn" {
  description = "SSM parameter ARN storing the queue URL"
  value       = aws_ssm_parameter.queue_url.arn
}
