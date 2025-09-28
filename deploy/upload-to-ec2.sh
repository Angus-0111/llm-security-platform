#!/bin/bash

# EC2
set -e

# 
EC2_IP="98.87.249.41"
KEY_PATH="~/.ssh/my-key.pem"  # 
APP_DIR="/home/ec2-user/app"

echo " EC2..."

# 
echo " EC2..."
sleep 30

# 
echo " ..."
tar -czf llm-security-platform.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='build' \
  backend/ frontend/ database/ docker-compose.yml env.example

# EC2
echo "📤 EC2..."
scp -i $KEY_PATH llm-security-platform.tar.gz ec2-user@$EC2_IP:~/

# SSHEC2
echo "🔧 EC2..."
ssh -i $KEY_PATH ec2-user@$EC2_IP << 'EOF'
  # 
  cd /home/ec2-user/app
  
  # 
  tar -xzf ~/llm-security-platform.tar.gz
  
  # 
  cp env.example .env
  
  # 
  chown -R ec2-user:ec2-user /home/ec2-user/app
  
  # Docker
  docker-compose down
  docker-compose up --build -d
  
  # 
  docker-compose ps
  
  echo " !"
EOF

echo " ! : http://$EC2_IP:3000"
