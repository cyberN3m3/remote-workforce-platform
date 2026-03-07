terraform {
  required_version = ">= 1.6"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "RemoteWorkforcePlatform"
      Environment = "Production"
      ManagedBy   = "Terraform"
      CostCenter  = "Portfolio"
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"
  
  project_name = var.project_name
  environment  = var.environment
  vpc_cidr     = var.vpc_cidr
}

# Cognito Module (for MFA/SSO)
module "cognito" {
  source = "../../modules/cognito"
  
  project_name = var.project_name
  environment  = var.environment
}

# RDS Module
module "rds" {
  source = "../../modules/rds"
  
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  database_subnets   = module.vpc.database_subnet_ids
  allowed_sg_id      = module.vpc.private_sg_id
  db_username        = var.db_username
 db_subnet_group_name  = module.vpc.db_subnet_group_name  # ← ADD THIS
}

# EC2 Module (Dashboard, Guacamole, Bitwarden, Monitoring)
module "ec2" {
  source = "../../modules/ec2"
  
  project_name         = var.project_name
  environment          = var.environment
  vpc_id               = module.vpc.vpc_id
  public_subnet_ids    = module.vpc.public_subnet_ids
  private_subnet_ids   = module.vpc.private_subnet_ids
  public_sg_id         = module.vpc.public_sg_id
  private_sg_id        = module.vpc.private_sg_id
  db_endpoint          = module.rds.db_endpoint
  db_name              = module.rds.db_name
  cognito_user_pool_id = module.cognito.user_pool_id
  cognito_client_id    = module.cognito.user_pool_client_id
}

# Monitoring Module
module "monitoring" {
  source = "../../modules/monitoring"
  
  project_name     = var.project_name
  environment      = var.environment
  alb_arn_suffix   = module.ec2.alb_arn_suffix
  dashboard_asg_name = module.ec2.dashboard_asg_name
}
