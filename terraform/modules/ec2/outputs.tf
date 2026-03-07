output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "alb_arn_suffix" {
  value = aws_lb.main.arn_suffix
}

output "dashboard_asg_name" {
  value = aws_autoscaling_group.dashboard.name
}

output "bastion_public_ip" {
  value = "N/A - Using AWS SSM Session Manager instead"
}
