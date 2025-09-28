#!/bin/bash

# AWS部署脚本
set -e

echo "🚀 开始AWS部署..."

# 检查必要的环境变量
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ]; then
    echo "❌ 请设置AWS环境变量: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
    exit 1
fi

# 设置变量
AWS_REGION=${AWS_REGION:-us-east-1}
APP_NAME="llm-security-platform"
ECR_REPOSITORY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}"

echo "📋 部署配置:"
echo "  - AWS Region: $AWS_REGION"
echo "  - App Name: $APP_NAME"
echo "  - ECR Repository: $ECR_REPOSITORY"

# 登录ECR
echo "🔐 登录到AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY

# 构建和推送镜像
echo "🏗️  构建Docker镜像..."

# 构建后端镜像
echo "  - 构建后端镜像..."
docker build -t ${APP_NAME}-backend ./backend
docker tag ${APP_NAME}-backend:latest $ECR_REPOSITORY/backend:latest
docker push $ECR_REPOSITORY/backend:latest

# 构建前端镜像
echo "  - 构建前端镜像..."
docker build -t ${APP_NAME}-frontend ./frontend
docker tag ${APP_NAME}-frontend:latest $ECR_REPOSITORY/frontend:latest
docker push $ECR_REPOSITORY/frontend:latest

echo "✅ 镜像推送完成!"

# 部署到ECS (如果使用ECS)
if [ "$DEPLOY_METHOD" = "ecs" ]; then
    echo "🚀 部署到Amazon ECS..."
    aws ecs update-service --cluster ${APP_NAME}-cluster --service ${APP_NAME}-service --force-new-deployment --region $AWS_REGION
fi

echo "🎉 部署完成!"
