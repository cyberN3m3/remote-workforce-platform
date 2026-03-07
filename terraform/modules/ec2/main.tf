# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.public_sg_id]
  subnets            = var.public_subnet_ids
  
  enable_deletion_protection = false
  
  tags = {
    Name = "${var.project_name}-${var.environment}-alb"
  }
}

# Target Groups
resource "aws_lb_target_group" "dashboard" {
  name = "rwf-${var.environment}-dashboard-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path                = "/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
  }
}

resource "aws_lb_target_group" "guacamole" {
  name = "rwf-${var.environment}-guacamole-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = var.vpc_id
  
  health_check {
    path = "/guacamole"
  }
}

# ALB Listeners
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"
  
  default_action {
    type = "redirect"
    redirect {
      protocol    = "HTTPS"
      port        = "443"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.main.arn
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.dashboard.arn
  }
}

# Routing rules
resource "aws_lb_listener_rule" "guacamole" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100
  
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.guacamole.arn
  }
  
  condition {
    path_pattern {
      values = ["/guacamole/*"]
    }
  }
}

# Self-signed certificate (for demo - use ACM + Route53 for production)
resource "tls_private_key" "main" {
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "tls_self_signed_cert" "main" {
  private_key_pem = tls_private_key.main.private_key_pem
  
  subject {
    common_name  = aws_lb.main.dns_name
    organization = var.project_name
  }
  
  validity_period_hours = 8760  # 1 year
  
  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

resource "aws_acm_certificate" "main" {
  private_key      = tls_private_key.main.private_key_pem
  certificate_body = tls_self_signed_cert.main.cert_pem
  
  tags = {
    Name = "${var.project_name}-${var.environment}-cert"
  }
}

# Launch Template for Dashboard
resource "aws_launch_template" "dashboard" {
  name_prefix   = "${var.project_name}-dashboard-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  
  vpc_security_group_ids = [var.private_sg_id]
  
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_profile.name
  }
  
  user_data = base64encode(templatefile("${path.module}/user_data/dashboard.sh", {
    db_endpoint          = var.db_endpoint
    db_name              = var.db_name
    cognito_user_pool_id = var.cognito_user_pool_id
    cognito_client_id    = var.cognito_client_id
    region               = data.aws_region.current.name
     port                 = 3000 
  }))
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "${var.project_name}-dashboard"
    }
  }
}

# Auto Scaling Group (for self-healing)
resource "aws_autoscaling_group" "dashboard" {
  name                = "${var.project_name}-dashboard-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.dashboard.arn]
  
  min_size         = 1
  max_size         = 2
  desired_capacity = 1
  
  launch_template {
    id      = aws_launch_template.dashboard.id
    version = "$Latest"
  }
  
  health_check_type         = "ELB"
  health_check_grace_period = 300
  
  tag {
    key                 = "Name"
    value               = "${var.project_name}-dashboard"
    propagate_at_launch = true
  }
}

# IAM Role for EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-${var.environment}-ec2-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy" "ec2_secrets" {
  name = "${var.project_name}-ec2-secrets-policy"
  role = aws_iam_role.ec2_role.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}

# Data sources
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]  # Canonical
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_region" "current" {}
