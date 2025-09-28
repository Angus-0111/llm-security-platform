#!/bin/bash

# 部署应用到EC2的脚本
set -e

# 配置变量
EC2_IP="98.87.249.41"
KEY_PATH="~/.ssh/my-key.pem"  # 需要您提供密钥文件路径
APP_DIR="/home/ec2-user/app"

echo "🚀 开始部署应用到EC2..."

# 等待实例完全启动
echo "⏳ 等待EC2实例启动..."
sleep 30

# 创建部署包
echo "📦 创建部署包..."
tar -czf llm-security-platform.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='build' \
  backend/ frontend/ database/ docker-compose.yml env.example

# 上传到EC2
echo "📤 上传代码到EC2..."
scp -i $KEY_PATH llm-security-platform.tar.gz ec2-user@$EC2_IP:~/

# SSH到EC2并部署
echo "🔧 在EC2上部署应用..."
ssh -i $KEY_PATH ec2-user@$EC2_IP << 'EOF'
  # 进入应用目录
  cd /home/ec2-user/app
  
  # 解压代码
  tar -xzf ~/llm-security-platform.tar.gz
  
  # 创建环境变量文件
  cp env.example .env
  
  # 设置权限
  chown -R ec2-user:ec2-user /home/ec2-user/app
  
  # 启动Docker服务
  docker-compose down
  docker-compose up --build -d
  
  # 检查服务状态
  docker-compose ps
  
  echo "✅ 部署完成!"
EOF

echo "🎉 部署完成! 应用地址: http://$EC2_IP:3000"
