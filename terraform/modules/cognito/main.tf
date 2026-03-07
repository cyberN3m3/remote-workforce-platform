# User Pool
resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}-users"
  
  # Password policy
  password_policy {
    minimum_length    = 12
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }
  
  # MFA configuration
  mfa_configuration = "OPTIONAL"
  
  software_token_mfa_configuration {
    enabled = true
  }
  
  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
  
  # User attributes
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  schema {
    name                = "name"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
  
  auto_verified_attributes = ["email"]
  
  tags = {
    Name = "${var.project_name}-${var.environment}-user-pool"
  }
}

# App Client
resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-${var.environment}-client"
  user_pool_id = aws_cognito_user_pool.main.id
  
  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]
  
  callback_urls = [
    "http://localhost:3000/callback",
    "https://${var.alb_dns_name}/callback"
  ]
  
  logout_urls = [
    "http://localhost:3000",
    "https://${var.alb_dns_name}"
  ]
  
  supported_identity_providers = ["COGNITO"]
}

# Domain for hosted UI
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project_name}-${var.environment}-${random_string.domain_suffix.result}"
  user_pool_id = aws_cognito_user_pool.main.id
}

resource "random_string" "domain_suffix" {
  length  = 8
  special = false
  upper   = false
}
