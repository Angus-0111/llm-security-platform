#!/bin/bash

# LLM Security Platform - Data Backup Script
# Backs up MongoDB data

echo "Starting backup..."

# Config
KEY_PATH="/Users/angus/Study/COMPX527-25B/my-key.pem"
PUBLIC_IP="98.87.249.41"
EC2_USER="ec2-user"
APP_DIR="/home/ec2-user/app"
BACKUP_DIR="~/backups/$(date +%Y%m%d_%H%M%S)"

echo "Connecting to AWS instance: $PUBLIC_IP"

# Connect and backup
ssh -i "$KEY_PATH" "$EC2_USER@$PUBLIC_IP" << EOF
cd ~/app

echo "Creating backup directory..."
mkdir -p $BACKUP_DIR

echo "Backing up MongoDB..."
docker exec llm-security-mongodb mongodump --db llm-security-platform --out /tmp/backup

echo "Compressing files..."
docker cp llm-security-mongodb:/tmp/backup $BACKUP_DIR/
cd $BACKUP_DIR
tar -czf llm-security-backup.tar.gz backup/

echo "Cleaning up..."
rm -rf backup/

echo "Backup done"
echo "Location: $BACKUP_DIR/llm-security-backup.tar.gz"
EOF

echo "Backup complete"
