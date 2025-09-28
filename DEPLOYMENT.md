# LLM Security Platform - AWS Deployment Guide

## Before Deployment

### Requirements
- Docker 20.10 or higher
- Docker Compose 2.0 or higher
- AWS CLI 2.0 or higher
- Node.js 18 or higher for local development

### AWS Account Setup
- AWS account with access keys
- Choose deployment region (recommended: us-east-1 or us-west-2)
- Optional: domain name for production

## Local Docker Testing

### Environment Setup
```bash
# Copy template file
cp env.example .env

# Edit variables
nano .env
```

Required variables:
```bash
OPENAI_API_KEY=your_openai_api_key_here
MONGO_ROOT_PASSWORD=securepassword123
```

### Local Testing
```bash
# Build and start services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Check Deployment
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/api/health

## AWS Deployment Options

### Option A: EC2 with Docker Compose (Easiest)

#### Create EC2 Instance
```bash
# Using AWS CLI
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-groups your-security-group \
  --subnet-id your-subnet-id \
  --user-data file://deploy/user-data.sh
```

#### Deploy Application
```bash
# Upload code to EC2
scp -i your-key.pem -r . ec2-user@your-ec2-ip:/home/ec2-user/app

# Connect via SSH
ssh -i your-key.pem ec2-user@your-ec2-ip

# Start application
cd /home/ec2-user/app
docker-compose up -d
```

### Option B: ECS with Fargate (Production)

#### Create ECR Repository
```bash
# Backend repository
aws ecr create-repository --repository-name llm-security-backend

# Frontend repository
aws ecr create-repository --repository-name llm-security-frontend
```

#### Push Images
```bash
# Set variables
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# Run deploy script
chmod +x deploy/aws-deploy.sh
./deploy/aws-deploy.sh
```

#### Create ECS Service
```bash
# Create cluster
aws ecs create-cluster --cluster-name llm-security-cluster
```

### Option C: Elastic Beanstalk (Simplest)

#### Prepare Package
```bash
# Create zip file
zip -r llm-security-platform.zip . -x "*.git*" "node_modules/*" "*.log"
```

#### Upload to Beanstalk
- Log in to AWS console
- Create new Elastic Beanstalk application
- Upload package
- Set environment variables

## Database Options

### MongoDB Atlas (Recommended)
```bash
# In .env file
AWS_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/llm-security-platform
```

### AWS DocumentDB
```bash
# Create cluster
aws docdb create-db-cluster \
  --db-cluster-identifier llm-security-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password your-password
```

### Self Hosted MongoDB (Docker)
```yaml
# Already in docker-compose.yml
mongodb:
  image: mongo:6.0
```

## Security Setup

### SSL Certificate (Production)
```bash
# Use AWS Certificate Manager
aws acm request-certificate \
  --domain-name your-domain.com \
  --validation-method DNS
```

### Security Group
```bash
# Allow only needed ports
- HTTP: 80
- HTTPS: 443
- SSH: 22 (management only)
```

### Environment Security
```bash
# Use AWS Systems Manager
aws ssm put-parameter \
  --name "/llm-security/openai-api-key" \
  --value "your-api-key" \
  --type "SecureString"
```

## Monitoring

### CloudWatch
```bash
# Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name "LLM-Security-Platform" \
  --dashboard-body file://monitoring/dashboard.json
```

### Logs
```bash
# Create log group
aws logs create-log-group \
  --log-group-name "/aws/ecs/llm-security-platform"
```

## Best Practices

### Auto Scaling
- Set up ECS Auto Scaling
- Define CPU and memory thresholds
- Add load balancer

### Backup
- Regular MongoDB backups
- Store backups in S3
- Test recovery process

### Updates
```bash
# Update without downtime
docker-compose up -d --no-deps frontend
docker-compose up -d --no-deps backend
```

## Troubleshooting

### Common Problems
1. Port conflicts: Check security group settings
2. Database connection fails: Check MongoDB URI and network
3. OpenAI API errors: Verify API key and quota
4. Out of memory: Upgrade instance or optimize app

### View Logs
```bash
# Docker logs
docker-compose logs backend
docker-compose logs frontend

# CloudWatch logs
aws logs describe-log-groups
aws logs get-log-events --log-group-name "/aws/ecs/llm-security-platform"
```

## Support

Check these resources:
1. AWS documentation
2. Docker and Docker Compose docs
3. Project GitHub Issues

---

After deployment, your platform runs on AWS.
