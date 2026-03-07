
#  Zero-Trust Remote Workforce Platform

```mermaid
graph TB
    subgraph "Public Internet"
        User[Remote Workers<br/>VAs/Paralegals]
        Admin[Law Firm Admin]
    end
    
    subgraph "AWS VPC - 10.0.0.0/16"
        subgraph "Public Subnet - 10.0.1.0/24"
            ALB[Application Load Balancer<br/>HTTPS:443]
            Bastion[Bastion Host<br/>t3.micro]
        end
        
        subgraph "Private Subnet - 10.0.2.0/24"
            Dashboard[Admin Dashboard<br/>React + Node.js<br/>t3.micro]
            Guacamole[Apache Guacamole<br/>Remote Desktop Gateway<br/>t3.micro]
            Bitwarden[Bitwarden Vault<br/>Password Manager<br/>t3.micro]
            Monitor[Prometheus + Grafana<br/>Monitoring Stack<br/>t3.micro]
        end
        
        subgraph "Database Subnet - 10.0.3.0/24"
            RDS[(PostgreSQL RDS<br/>db.t3.micro<br/>Free Tier)]
        end
    end
    
    subgraph "AWS Services"
        Cognito[AWS Cognito<br/>MFA + SSO]
        S3[S3 Bucket<br/>Logs + Backups]
        Secrets[Secrets Manager<br/>Credentials]
        CloudWatch[CloudWatch<br/>Alerting]
    end
    
    User -->|HTTPS| ALB
    Admin -->|HTTPS| ALB
    ALB -->|TLS| Dashboard
    ALB -->|TLS| Guacamole
    Dashboard -->|Auth| Cognito
    Guacamole -->|Auth| Cognito
    Dashboard --> Bitwarden
    Dashboard --> Monitor
    Guacamole --> RDS
    Bitwarden --> RDS
    Monitor --> S3
    Dashboard --> CloudWatch
    Bastion -.->|SSH Tunnel<br/>Emergency Only| Dashboard
    
    style User fill:#4A90E2
    style Admin fill:#E24A4A
    style ALB fill:#FF9900
    style Cognito fill:#FF9900
    style RDS fill:#3B48CC
    style S3 fill:#569A31
```

# 🔐 Zero-Trust Remote Workforce Platform

A full-stack cloud infrastructure and monitoring solution designed for secure, distributed team management. This project demonstrates how to deploy a **Zero-Trust environment** on AWS while staying within the **Free Tier ($1.30/month)**.

## 🎯 The Problem

Law firms and small businesses hiring remote VAs often struggle with security. Giving a remote worker full VPN access is risky, and enterprise solutions are expensive.

**The Solution:** A self-hosted, cloud-native gateway that isolates client data in private subnets, costs less than a cup of coffee per month, and requires zero software installation for the end-user.

## 🚀 Technical Highlights

* **Infrastructure as Code (IaC):** 100% automated provisioning using modular **Terraform 1.6**.
* **Security Architecture:** Implemented a 3-tier VPC with strict Security Group hardening and **AWS Cognito MFA**.
* **Cost Engineering:** Optimized for the AWS Free Tier, achieving a **96% cost reduction** compared to standard enterprise deployments (avoided $35/mo NAT Gateway fees).
* **Observability:** Integrated **Prometheus and Grafana** for real-time system health and session monitoring.

---

## 🏗️ Architecture & Security

This platform follows the **AWS Well-Architected Framework**:

1. **Isolation:** The database and application servers sit in private subnets, inaccessible from the public internet.
2. **Least Privilege:** EC2 instances use IAM Instance Profiles to pull credentials from **Secrets Manager** at runtime—no hardcoded keys.
3. **Clientless Access:** Leverages Apache Guacamole as a browser-based gateway to prevent data exfiltration.

---

## 🛠️ Tech Stack

| Category | Tools Used |
| --- | --- |
| **Cloud** | AWS (VPC, EC2, RDS, ALB, Cognito, Secrets Manager) |
| **DevOps** | Terraform, GitHub Actions, CloudWatch |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Database** | PostgreSQL 15 |
| **Monitoring** | Prometheus, Grafana |

---

## 💰 Budget Engineering (Monthly Breakdown)

| Service | Cost | Optimization Strategy |
| --- | --- | --- |
| **EC2 / RDS** | $0.00 | 12-Month Free Tier (t3.micro) |
| **Load Balancer** | $0.50 | Shared ALB with host-based routing |
| **Secrets Manager** | $0.80 | Automated credential rotation |
| **Frontend** | $0.00 | Edge hosting via Vercel |
| **Total** | **$1.30** |  |

---

## 🧠 Engineering Challenges & Solutions

### 1. The "Forbidden Character" RDS Bug

* **Challenge:** Terraform's `random_password` was generating symbols like `@` and `/`, which caused the AWS RDS API to reject database creation.
* **Solution:** Implemented `override_special` in the Terraform module to restrict the character set to RDS-compliant symbols, ensuring 100% deployment reliability.

### 2. Git History Desync

* **Challenge:** Encountered `src refspec main` errors during initial deployment due to empty local commits.
* **Solution:** Standardized the workflow by forcing a branch rename to `main` and performing a `--rebase` pull to align local and remote histories.

---

## 🤝 Connect

**[Anyasi Chineme]** – Cloud & DevOps Engineer

[LinkedIn](https://www.google.com/search?q=YOUR_LINKEDIN_URL) | [Portfolio](https://www.google.com/search?q=YOUR_PORTFOLIO_URL) | [Email](mailto:your.email@example.com)

---
