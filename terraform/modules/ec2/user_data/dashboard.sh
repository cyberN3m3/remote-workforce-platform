#!/bin/bash
set -e

# Update system
apt-get update
apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Create application directory
mkdir -p /opt/dashboard
cd /opt/dashboard

# Create package.json
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

# Create environment file
cat > .env << ENV
DB_HOST=${db_endpoint}
DB_NAME=${db_name}
COGNITO_USER_POOL_ID=${cognito_user_pool_id}
COGNITO_CLIENT_ID=${cognito_client_id}
AWS_REGION=${region}
ENV

# Create server with CORS - using printf to avoid quote issues
printf '%s\n' \
"const express = require('express');" \
"const cors = require('cors');" \
"require('dotenv').config();" \
"" \
"const app = express();" \
"const port = 3000;" \
"" \
"const corsOptions = {" \
"  origin: function(origin, callback) {" \
"    const allowedOrigins = [" \
"      'http://localhost:3000'," \
"      'http://localhost:5173'," \
"      'http://localhost:5174'" \
"    ];" \
"    if (!origin || allowedOrigins.indexOf(origin) !== -1 || /vercel\.app$/.test(origin) || /netlify\.app$/.test(origin)) {" \
"      callback(null, true);" \
"    } else {" \
"      callback(null, true);" \
"    }" \
"  }," \
"  credentials: true" \
"};" \
"" \
"app.use(cors(corsOptions));" \
"app.use(express.json());" \
"" \
"app.get('/health', (req, res) => {" \
"  res.json({ status: 'healthy', timestamp: new Date().toISOString() });" \
"});" \
"" \
"app.get('/api/status', (req, res) => {" \
"  res.json({ status: 'online', database: process.env.DB_HOST });" \
"});" \
"" \
"app.get('/api/test', (req, res) => {" \
"  res.json({ message: 'Backend connection successful', cors: 'enabled' });" \
"});" \
"" \
"app.listen(port, '0.0.0.0', () => {" \
"  console.log('Dashboard running on port ' + port);" \
"});" \
> server.js

# Install dependencies
npm install

# Create systemd service
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

# Start service
systemctl daemon-reload
systemctl enable dashboard
systemctl start dashboard

echo "Dashboard installation complete!"