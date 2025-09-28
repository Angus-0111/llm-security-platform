# 🚀 LLM Security Platform - AWS部署指南

## 📋 部署前准备

### 1. 环境要求
- Docker 20.10+
- Docker Compose 2.0+
- AWS CLI 2.0+
- Node.js 18+ (本地开发)

### 2. AWS账户准备
- AWS账户和访问密钥
- 选择部署区域 (推荐: us-east-1, us-west-2)
- 准备域名 (可选，用于生产环境)

## 🐳 Docker本地测试

### 1. 环境变量配置
```bash
# 复制环境变量模板
cp env.example .env

# 编辑环境变量
nano .env
```

**必需的环境变量:**
```bash
OPENAI_API_KEY=your_openai_api_key_here
MONGO_ROOT_PASSWORD=securepassword123
```

### 2. 本地Docker测试
```bash
# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 验证部署
- 前端: http://localhost:3000
- 后端API: http://localhost:3001
- 健康检查: http://localhost:3001/api/health

## ☁️ AWS部署方案

### 方案A: EC2 + Docker Compose (推荐新手)

#### 1. 创建EC2实例
```bash
# 使用AWS CLI创建实例
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-groups your-security-group \
  --subnet-id your-subnet-id \
  --user-data file://deploy/user-data.sh
```

#### 2. 部署应用
```bash
# 上传代码到EC2
scp -i your-key.pem -r . ec2-user@your-ec2-ip:/home/ec2-user/app

# SSH连接到EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# 在EC2上启动应用
cd /home/ec2-user/app
docker-compose up -d
```

### 方案B: ECS + Fargate (推荐生产环境)

#### 1. 创建ECR仓库
```bash
# 创建后端仓库
aws ecr create-repository --repository-name llm-security-backend

# 创建前端仓库
aws ecr create-repository --repository-name llm-security-frontend
```

#### 2. 推送镜像
```bash
# 设置环境变量
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1

# 运行部署脚本
chmod +x deploy/aws-deploy.sh
./deploy/aws-deploy.sh
```

#### 3. 创建ECS服务
```bash
# 使用AWS控制台或CLI创建ECS集群和服务
aws ecs create-cluster --cluster-name llm-security-cluster
```

### 方案C: Elastic Beanstalk (最简单)

#### 1. 准备部署包
```bash
# 创建部署包
zip -r llm-security-platform.zip . -x "*.git*" "node_modules/*" "*.log"
```

#### 2. 上传到Elastic Beanstalk
- 登录AWS控制台
- 创建新的Elastic Beanstalk应用
- 上传部署包
- 配置环境变量

## 🗄️ 数据库选项

### 选项1: MongoDB Atlas (推荐)
```bash
# 在.env中配置
AWS_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/llm-security-platform
```

### 选项2: AWS DocumentDB
```bash
# 创建DocumentDB集群
aws docdb create-db-cluster \
  --db-cluster-identifier llm-security-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password your-password
```

### 选项3: 自托管MongoDB (Docker)
```yaml
# 在docker-compose.yml中已配置
mongodb:
  image: mongo:6.0
  # ... 配置
```

## 🔒 安全配置

### 1. SSL证书 (生产环境)
```bash
# 使用AWS Certificate Manager
aws acm request-certificate \
  --domain-name your-domain.com \
  --validation-method DNS
```

### 2. 安全组配置
```bash
# 只允许必要端口
- HTTP: 80
- HTTPS: 443
- SSH: 22 (仅管理用)
```

### 3. 环境变量安全
```bash
# 使用AWS Systems Manager Parameter Store
aws ssm put-parameter \
  --name "/llm-security/openai-api-key" \
  --value "your-api-key" \
  --type "SecureString"
```

## 📊 监控和日志

### 1. CloudWatch监控
```bash
# 创建CloudWatch仪表板
aws cloudwatch put-dashboard \
  --dashboard-name "LLM-Security-Platform" \
  --dashboard-body file://monitoring/dashboard.json
```

### 2. 日志收集
```bash
# 配置CloudWatch日志组
aws logs create-log-group \
  --log-group-name "/aws/ecs/llm-security-platform"
```

## 🚀 生产环境最佳实践

### 1. 自动扩缩容
- 配置ECS Auto Scaling
- 设置CPU/内存阈值
- 配置负载均衡器

### 2. 备份策略
- 定期备份MongoDB数据
- 配置S3存储备份
- 测试恢复流程

### 3. 更新部署
```bash
# 零停机更新
docker-compose up -d --no-deps frontend
docker-compose up -d --no-deps backend
```

## 🔧 故障排除

### 常见问题
1. **端口冲突**: 检查安全组和端口配置
2. **数据库连接失败**: 验证MongoDB URI和网络配置
3. **OpenAI API错误**: 检查API密钥和配额
4. **内存不足**: 升级实例类型或优化应用

### 日志查看
```bash
# Docker日志
docker-compose logs backend
docker-compose logs frontend

# AWS CloudWatch日志
aws logs describe-log-groups
aws logs get-log-events --log-group-name "/aws/ecs/llm-security-platform"
```

## 📞 支持

如有问题，请检查：
1. AWS文档和最佳实践
2. Docker和Docker Compose文档
3. 项目GitHub Issues

---

**部署成功后，您的LLM Security Platform将在AWS上运行！** 🎉
