#!/bin/bash

# LLM Security Platform - 数据备份脚本
# 用于备份MongoDB数据

echo "💾 开始备份LLM Security Platform数据..."

# 配置信息
KEY_PATH="/Users/angus/Study/COMPX527-25B/my-key.pem"
PUBLIC_IP="98.87.249.41"
EC2_USER="ec2-user"
APP_DIR="/home/ec2-user/app"
BACKUP_DIR="~/backups/$(date +%Y%m%d_%H%M%S)"

echo "📡 连接到AWS实例: $PUBLIC_IP"

# 连接到EC2并备份数据
ssh -i "$KEY_PATH" "$EC2_USER@$PUBLIC_IP" << EOF
cd ~/app

echo "📁 创建备份目录..."
mkdir -p $BACKUP_DIR

echo "🗄️ 备份MongoDB数据..."
docker exec llm-security-mongodb mongodump --db llm-security-platform --out /tmp/backup

echo "📦 压缩备份文件..."
docker cp llm-security-mongodb:/tmp/backup $BACKUP_DIR/
cd $BACKUP_DIR
tar -czf llm-security-backup.tar.gz backup/

echo "🧹 清理临时文件..."
rm -rf backup/

echo "✅ 备份完成！"
echo "📂 备份位置: $BACKUP_DIR/llm-security-backup.tar.gz"
EOF

echo "🎉 数据备份完成！"
