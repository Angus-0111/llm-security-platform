#!/bin/bash

# LLM Security Platform - 快速重启脚本
# 用于重启AWS上的所有服务

echo "🚀 重启LLM Security Platform服务..."

# 配置信息
KEY_PATH="/Users/angus/Study/COMPX527-25B/my-key.pem"
PUBLIC_IP="98.87.249.41"
EC2_USER="ec2-user"
APP_DIR="/home/ec2-user/app"

echo "📡 连接到AWS实例: $PUBLIC_IP"

# 连接到EC2并重启服务
ssh -i "$KEY_PATH" "$EC2_USER@$PUBLIC_IP" << 'EOF'
cd ~/app

echo "🔄 重启Docker服务..."
docker-compose restart

echo "⏳ 等待服务启动..."
sleep 10

echo "📊 检查服务状态..."
docker-compose ps

echo "🔍 测试API连接..."
curl -s http://localhost:3000/api/health | head -1

echo "✅ 服务重启完成！"
echo "🌐 访问地址: http://98.87.249.41:3000"
EOF

echo "🎉 重启完成！您的LLM Security Platform已准备就绪！"
