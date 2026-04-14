output "queue_url" {
  description = "Queue URL."
  value       = aws_sqs_queue.this.url
}

output "queue_arn" {
  description = "Queue ARN."
  value       = aws_sqs_queue.this.arn
}

output "dlq_url" {
  description = "Dead letter queue URL."
  value       = aws_sqs_queue.dlq.url
}

output "dlq_arn" {
  description = "Dead letter queue ARN."
  value       = aws_sqs_queue.dlq.arn
}
