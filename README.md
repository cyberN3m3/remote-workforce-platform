
# Zero-Trust Remote Workforce Platform

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

A full-stack cloud infrastructure and monitoring dashboard designed for secure, distributed team management. This project demonstrates the integration of **Infrastructure as Code (Terraform)** with a **High-Performance React Frontend** to manage AWS resources efficiently.

## 🚀 The Highlights

* **Infrastructure as Code:** 100% automated AWS provisioning using modular Terraform.
* **Security First:** Implemented Zero-Trust principles via Private Subnets, Cognito MFA, and IAM least-privilege.
* **Cost Efficiency:** Engineered specifically to run on the **AWS Free Tier**, costing only **$1.30/month** by leveraging Secrets Manager and a single Load Balancer.
* **Modern UX:** Responsive glassmorphism dashboard built with TypeScript and Framer Motion.

---

## 🛠 Tech Stack

### Cloud & DevOps (AWS)

* **Networking:** VPC with 3-tier architecture (Public/Private/Data subnets), NAT Gateways, and ALB.
* **Compute:** EC2 Auto Scaling Groups (t3.micro) for high availability.
* **Database:** RDS PostgreSQL with encrypted storage.
* **Identity:** AWS Cognito for SSO and Multi-Factor Authentication.
* **Tools:** Terraform, GitHub Actions (CI/CD), AWS Secrets Manager.

### Frontend Engineering

* **Core:** React 18.2 + TypeScript (Strict Mode).
* **Styling:** Tailwind CSS + Framer Motion (60fps animations).
* **Visualization:** Recharts for real-time telemetry display.

---

## 📐 Architecture & Security

This platform follows the **Well-Architected Framework**:

1. **Isolation:** The database and application servers sit in private subnets, inaccessible from the public internet.
2. **Encryption:** Data is encrypted at rest using AES-256 (RDS) and in transit via TLS 1.2.
3. **Authentication:** Leverages AWS Cognito for secure token-based session management.

---

## 💰 Budget Engineering

One of the primary goals was to build a robust system without a massive bill.

| Service | Monthly Cost | Optimization Strategy |
| --- | --- | --- |
| **EC2 / RDS** | $0.00 | Leveraged AWS 12-month Free Tier |
| **ALB** | $0.50 | Shared Application Load Balancer |
| **Secrets Manager** | $0.80 | Automated rotation of DB credentials |
| **Frontend** | $0.00 | Static hosting via Vercel Edge |
| **Total** | **$1.30** |  |

---

## 🧠 Engineering Challenges Overcome

* **The "Unrelated Histories" Git Conflict:** Resolved complex repository merges during the initial cloud-to-local sync.
* **RDS Character Constraints:** Debugged AWS API credential errors by implementing custom `random_password` logic in Terraform to filter out illegal characters.
* **Strict Typing:** Achieved 100% TypeScript coverage to eliminate runtime errors in the telemetry dashboard.

---

## 📂 Project Structure

```bash
├── terraform/          # Modular IaC
│   ├── modules/        # Reusable components (VPC, RDS, EC2)
│   └── environments/   # Environment-specific configs (Prod)
├── frontend/           # React + TypeScript App
│   ├── src/components/ # Recharts & UI logic
│   └── src/hooks/      # Custom AWS data fetching hooks
└── docs/               # System diagrams & Architecture notes

```

---

## 🛠️ Local Setup

1. **Infrastructure:**
```bash
cd terraform/environments/prod
terraform init && terraform apply

```


2. **Frontend:**
```bash
cd frontend
npm install && npm run dev

```



---

## 🤝 Connect

**[Your Name]** - Cloud & Full-Stack Engineer

[LinkedIn](https://linkedin.com/in/yourprofile) | [Portfolio](https://yourportfolio.com)

---

### Pro-Tip for your Readme:

**Replace the placeholder `[Image of...]` tags** with actual screenshots of your dashboard or your AWS Architecture diagram. Recruiters love seeing a visual representation of the VPC before they dive into the code.

**Would you like me to help you write a "Technical Summary" for your LinkedIn profile that matches this project?**
