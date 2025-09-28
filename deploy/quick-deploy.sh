#!/bin/bash

#  - EC2
echo " ..."

# 1. Docker
sudo yum update -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# 2. 
mkdir -p ~/app
cd ~/app

# 3. docker-compose.yml
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
      OPENAI_API_KEY: REPLACE_WITH_API_KEY
      OPENAI_API_BASE: https://api.openai.com/v1
      OPENAI_MODEL: gpt-4o-mini
      FRONTEND_URL: http://98.87.249.41:3000
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
      REACT_APP_API_URL: http://98.87.249.41:3001
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

# 4. 
mkdir -p backend/src
cat > backend/package.json << 'EOF'
{
  "name": "llm-security-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "mongoose": "^6.9.1",
    "openai": "^5.12.2",
    "dotenv": "^16.6.1"
  }
}
EOF

# 5. 
mkdir -p frontend/src frontend/public
cat > frontend/package.json << 'EOF'
{
  "name": "llm-security-frontend",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "serve": "^14.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}
EOF

echo " !"
echo " :"
echo "1. "
echo "2. OpenAI API"
echo "3. "
EOF
