#!/bin/bash

# LLM Security Platform - Service Restart Script
# Restarts all services on AWS

echo "Restarting services..."

# Config
KEY_PATH="/Users/angus/Study/COMPX527-25B/my-key.pem"
PUBLIC_IP="98.87.249.41"
EC2_USER="ec2-user"
APP_DIR="/home/ec2-user/app"

echo "Connecting to AWS: $PUBLIC_IP"

# Connect and restart
ssh -i "$KEY_PATH" "$EC2_USER@$PUBLIC_IP" << 'EOF'
cd ~/app

echo "Restarting Docker services..."
docker-compose restart

echo "Waiting for startup..."
sleep 10

echo "Checking status..."
docker-compose ps

echo "Testing API..."
curl -s http://localhost:3000/api/health | head -1

echo "Restart done"
echo "URL: http://98.87.249.41:3000"
EOF

echo "Services restarted"
