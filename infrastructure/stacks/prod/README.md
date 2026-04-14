# Cometa — Production Stack

Not yet provisioned. To set up:

1. Copy all `.tf` files from `../dev/` (except `backend.tf`)
2. Update `variables.tf` defaults for production domains
3. Create `terraform.tfvars` with production secrets
4. Run `terraform init && terraform plan`
