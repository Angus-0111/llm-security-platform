#!/bin/bash

# AWS
set -e

echo " AWS..."

# 
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_REGION" ]; then
    echo "❌ AWS: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
    exit 1
fi

# 
AWS_REGION=${AWS_REGION:-us-east-1}
APP_NAME="llm-security-platform"
ECR_REPOSITORY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}"

echo " :"
echo "  - AWS Region: $AWS_REGION"
echo "  - App Name: $APP_NAME"
echo "  - ECR Repository: $ECR_REPOSITORY"

# ECR
echo " AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY

# 
echo "🏗️  Docker..."

# 
echo "  - ..."
docker build -t ${APP_NAME}-backend ./backend
docker tag ${APP_NAME}-backend:latest $ECR_REPOSITORY/backend:latest
docker push $ECR_REPOSITORY/backend:latest

# 
echo "  - ..."
docker build -t ${APP_NAME}-frontend ./frontend
docker tag ${APP_NAME}-frontend:latest $ECR_REPOSITORY/frontend:latest
docker push $ECR_REPOSITORY/frontend:latest

echo " !"

# ECS (ECS)
if [ "$DEPLOY_METHOD" = "ecs" ]; then
    echo " Amazon ECS..."
    aws ecs update-service --cluster ${APP_NAME}-cluster --service ${APP_NAME}-service --force-new-deployment --region $AWS_REGION
fi

echo " !"
