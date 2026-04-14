locals {
  queue_name = "${var.name_prefix}-${var.service_slug}-service"
}

# ── SQS Queues ──

resource "aws_sqs_queue" "dlq" {
  name                      = "${local.queue_name}-dlq"
  message_retention_seconds = 1209600 # 14 days
  tags                      = var.tags
}

resource "aws_sqs_queue" "service" {
  name                       = local.queue_name
  visibility_timeout_seconds = var.visibility_timeout_seconds
  message_retention_seconds  = 86400 # 1 day
  receive_wait_time_seconds  = 20    # long polling

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.max_receive_count
  })

  tags = var.tags
}

# ── Service Discovery ──

resource "aws_ssm_parameter" "queue_url" {
  name  = "/${var.name_prefix}/services/${var.service_slug}/queue-url"
  type  = "String"
  value = aws_sqs_queue.service.url
  tags  = var.tags
}

# ── Monitoring ──

resource "aws_cloudwatch_metric_alarm" "dlq_not_empty" {
  alarm_name          = "${local.queue_name}-dlq-not-empty"
  alarm_description   = "Messages in ${var.service_slug} DLQ — check for processing failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 300
  statistic           = "Maximum"
  threshold           = 0

  dimensions = { QueueName = aws_sqs_queue.dlq.name }

  tags = var.tags
}
