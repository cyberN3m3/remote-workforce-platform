output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.ec2.alb_dns_name
}

output "dashboard_url" {
  description = "URL to access the admin dashboard"
  value       = "https://${module.ec2.alb_dns_name}"
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID for authentication"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = module.cognito.user_pool_client_id
  sensitive   = true
}

output "db_endpoint" {
  description = "RDS database endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "bastion_public_ip" {
  description = "Public IP of bastion host (for emergency SSH access)"
  value       = module.ec2.bastion_public_ip
}
