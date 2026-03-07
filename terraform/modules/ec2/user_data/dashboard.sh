#!/bin/bash
# Exit on any error
set -e

# 1. ADD SWAP FILE (Essential for t3.micro to prevent memory crashes during npm install)
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# 2. Update system
apt-get update
apt-get upgrade -y

# 3. Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs wget

# 4. Install CloudWatch Agent (Ubuntu fix: Download .deb directly)
wget https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i -E ./amazon-cloudwatch-agent.deb
rm amazon-cloudwatch-agent.deb

# 5. Create application directory
mkdir -p /opt/dashboard
cd /opt/dashboard

# 6. Create package.json
cat > package.json << 'PACKAGE'
{
  "name": "remote-workforce-dashboard",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
PACKAGE

# 7. Create environment file
cat > .env << ENV
DB_HOST=${db_endpoint}
DB_NAME=${db_name}
COGNITO_USER_POOL_ID=${cognito_user_pool_id}
COGNITO_CLIENT_ID=${cognito_client_id}
AWS_REGION=${region}
ENV

# 8. Create server.js (Includes root route and health check)
cat > server.js << 'SERVER'
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route - No more "Cannot GET /"
app.get('/', (req, res) => {
  res.send('<h1>Remote Workforce Platform</h1><p>Infrastructure is successfully deployed and connected!</p>');
});

// Health check for ALB
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    instanceId: 'remote-workforce-dashboard'
  });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'online', database: process.env.DB_HOST });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Dashboard running on port ${port}`);
});
SERVER

# 9. Install dependencies
npm install

# 10. Configure CloudWatch Agent
cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json << 'CW'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/syslog",
            "log_group_name": "/aws/remote-workforce/prod/application",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
CW

# Start the agent
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# 11. Create systemd service
cat > /etc/systemd/system/dashboard.service << 'SERVICE'
[Unit]
Description=Remote Workforce Dashboard
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/dashboard
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
SERVICE

# 12. Start service
systemctl daemon-reload
systemctl enable dashboard
systemctl start dashboard

echo "Dashboard installation complete!"