# ══════════════════════════════════════════════
# Public Assets CDN (S3 + CloudFront)
# ══════════════════════════════════════════════

module "assets_site" {
  source = "../../modules/static-site"

  name_prefix    = local.name_prefix
  site_name      = "assets"
  bucket_name    = "${local.name_prefix}-${local.region_short}-assets"
  domain         = var.assets_domain
  hosted_zone_id = var.mcp_hosted_zone_id
  tags           = local.common_tags

  # No SPA rewrite needed — just serve files as-is
  cloudfront_function_code = <<-EOF
    function handler(event) {
      return event.request;
    }
  EOF
}
