# Generate random password
resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Store password in Secrets Manager
resource "aws_secretsmanager_secret" "db_password" {
  name                    = "${var.project_name}-${var.environment}-db-password"
  description             = "RDS PostgreSQL master password"
  recovery_window_in_days = 0  # Immediate deletion for portfolio cleanup
  
  tags = {
    Name = "${var.project_name}-${var.environment}-db-password"
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-${var.environment}-postgres"
  engine         = "postgres"
  engine_version = "15"
  
  instance_class    = "db.t3.micro"  # Free tier eligible
  allocated_storage = 20              # Free tier: 20GB
  storage_type      = "gp2"
  storage_encrypted = true
  
  db_name  = "workforcedb"
  username = var.db_username
  password = random_password.db_password.result
  
  vpc_security_group_ids = [var.allowed_sg_id]
  db_subnet_group_name   = var.db_subnet_group_name
  
  # Backup settings
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  # High availability (disabled for cost savings)
  multi_az               = false
  publicly_accessible    = false
  
  # Performance Insights (free tier)
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  # Deletion protection (disabled for easy cleanup)
  deletion_protection = false
  skip_final_snapshot = true
  
  tags = {
    Name = "${var.project_name}-${var.environment}-postgres"
  }
}
