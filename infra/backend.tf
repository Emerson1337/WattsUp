provider "aws" {
  region = var.aws_region
  // This profile must be set in your AWS CLI configuration file: ~/.aws/config
  profile = "wattsup-terraform-cli"

  default_tags {
      tags = {
        Project     = var.project_name
        ManagedBy   = "terraform"
      }
    }
}

terraform {
  backend "s3" {
    bucket = "wattsup-terraform-infra-state"
    key    = "wattsup-infra.tfstate"
    region = "sa-east-1"
    profile = "wattsup-terraform-cli"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
