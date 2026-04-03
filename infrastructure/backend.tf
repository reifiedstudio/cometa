terraform {
  backend "s3" {
    bucket         = "reifiedstudio-terraform-state"
    key            = "cometa/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "reifiedstudio-terraform-locks"
    encrypt        = true
  }
}
