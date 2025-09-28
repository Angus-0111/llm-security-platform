#!/bin/bash

# 
yum update -y

# Docker
yum install -y docker git
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# 
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

#  (GitHubURL)
# git clone https://github.com/your-username/llm-security-platform.git .

# 
cat > .env << EOF
# MongoDB
MONGO_ROOT_PASSWORD=securepassword123

# OpenAI API ()
OPENAI_API_KEY=your_openai_api_key_here

# 
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
EOF

# Docker Compose
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: llm-security-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: securepassword123
      MONGO_INITDB_DATABASE: llm-security-platform
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - llm-network

  backend:
    image: node:18-alpine
    container_name: llm-security-backend
    restart: unless-stopped
    working_dir: /app
    command: sh -c "npm install && npm start"
    environment:
      NODE_ENV: production
      PORT: 3001
      MONGODB_URI: mongodb://admin:securepassword123@mongodb:27017/llm-security-platform?authSource=admin
      OPENAI_API_KEY: your_openai_api_key_here
      OPENAI_API_BASE: https://api.openai.com/v1
      OPENAI_MODEL: gpt-4o-mini
      FRONTEND_URL: http://localhost:3000
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
    depends_on:
      - mongodb
    networks:
      - llm-network

  frontend:
    image: node:18-alpine
    container_name: llm-security-frontend
    restart: unless-stopped
    working_dir: /app
    command: sh -c "npm install && npm run build && npx serve -s build -l 3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
    depends_on:
      - backend
    networks:
      - llm-network

volumes:
  mongodb_data:
    driver: local

networks:
  llm-network:
    driver: bridge
EOF

# 
chown -R ec2-user:ec2-user /home/ec2-user/app

# serve
npm install -g serve

echo "Setup completed. Ready for deployment!"
