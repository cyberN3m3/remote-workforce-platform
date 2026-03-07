variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "database_subnets" {
  type = list(string)
}

variable "allowed_sg_id" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_subnet_group_name" {
  type = string
}
