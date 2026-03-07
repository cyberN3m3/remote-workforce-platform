output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  value = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  value = aws_subnet.database[*].id
}

output "public_sg_id" {
  value = aws_security_group.public.id
}

output "private_sg_id" {
  value = aws_security_group.private.id
}

output "database_sg_id" {
  value = aws_security_group.database.id
}

output "db_subnet_group_name" {
  value = aws_db_subnet_group.main.name
}
