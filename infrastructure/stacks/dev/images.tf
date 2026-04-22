# ══════════════════════════════════════════════
# Image Resize Service
# CloudFront + signed URLs + Lambda resize
# ══════════════════════════════════════════════

# ── CloudFront Key Pair for signed URLs ──

resource "tls_private_key" "images" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_cloudfront_public_key" "images" {
  name        = "${local.name_prefix}-images-pubkey"
  encoded_key = tls_private_key.images.public_key_pem
}

resource "aws_cloudfront_key_group" "images" {
  name  = "${local.name_prefix}-images-keygroup"
  items = [aws_cloudfront_public_key.images.id]
}

# ── Sharp Lambda Layer (committed to repo, never changes) ──

resource "aws_lambda_layer_version" "sharp" {
  layer_name               = "${local.name_prefix}-sharp-arm64"
  filename                 = "${path.module}/../../layers/sharp-arm64.zip"
  source_code_hash         = filebase64sha256("${path.module}/../../layers/sharp-arm64.zip")
  compatible_runtimes      = ["nodejs22.x"]
  compatible_architectures = ["arm64"]
}

# ── Resize Lambda ──

module "image_resize_lambda" {
  source = "../../modules/lambda"

  function_name = "${local.name_prefix}-image-resize"
  description   = "On-demand image resizing with caching"

  artifact_bucket_name = module.artifacts_bucket.bucket_id
  code_s3_key          = "image-resize/image-resize.zip"

  runtime         = "nodejs22.x"
  handler         = "handler.handler"
  architectures   = ["arm64"]
  memory_mb       = 1024
  timeout_seconds = 30
  layers          = [aws_lambda_layer_version.sharp.arn]

  environment = {
    S3_BUCKET = module.private_bucket.bucket_id
  }

  inline_policy_json = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3ReadWrite"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:HeadObject"
        ]
        Resource = ["${module.private_bucket.bucket_arn}/*"]
      }
    ]
  })

  create_function_url = true

  tags = local.common_tags
}

# ── CloudFront Distribution ──

resource "aws_acm_certificate" "images" {
  domain_name       = var.images_domain
  validation_method = "DNS"
  tags              = local.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "images_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.images.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id         = var.mcp_hosted_zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "images" {
  certificate_arn         = aws_acm_certificate.images.arn
  validation_record_fqdns = [for r in aws_route53_record.images_cert_validation : r.fqdn]
}

resource "aws_cloudfront_distribution" "images" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "Cometa image resize service"
  aliases         = [var.images_domain]
  price_class     = "PriceClass_100"
  tags            = local.common_tags

  origin {
    domain_name = replace(
      replace(module.image_resize_lambda.function_url, "https://", ""),
      "/", ""
    )
    origin_id = "resize-lambda"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "resize-lambda"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    trusted_key_groups = [aws_cloudfront_key_group.images.id]

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 2592000
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.images.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "images" {
  zone_id = var.mcp_hosted_zone_id
  name    = var.images_domain
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.images.domain_name
    zone_id                = aws_cloudfront_distribution.images.hosted_zone_id
    evaluate_target_health = false
  }
}
