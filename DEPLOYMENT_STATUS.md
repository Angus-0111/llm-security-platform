# LLM Security Platform - Deployment Status

## Deployment Info

**Date**: September 28, 2025  
**URL**: http://98.87.249.41:3000  
**AWS Instance**: t3.medium in us-east-1a  

## Service Status

| Service | Status | Port | Container |
|---------|--------|------|-----------|
| Frontend | Running | 3000:80 | temp-nginx |
| Backend | Running | 3001:3001 | llm-security-backend |
| Database | Running | 27017:27017 | llm-security-mongodb |

## Key Fixes

### Frontend API Config
- Problem: Hardcoded localhost:3001 failed in production
- Solution: Changed to relative path /api/
- Files affected: All component fetch calls

### Backend API Parameters
- Problem: Missing attackType and educationScenario parameters
- Solution: Added parameter support in /api/simulations/run
- Files affected: server.js, simulationService.js

### nginx Proxy Config
- Problem: Missing API proxy blocked frontend to backend
- Solution: Added location /api/ proxy config
- Files affected: nginx config

## Function Check

### Working Features
- Custom attack simulation
- Template attack simulation
- Attack success analysis
- Risk assessment generation
- Data visualization
- Real incident display
- Learn page examples

### Core Features
- 8 Attack Templates covering all major LLM attack types
- Smart Attack Detection with context based analysis
- Automatic Risk Assessment for each simulation
- Educational Content with complete learn page and real cases
- Data Visualization showing attack statistics

## Security

- OpenAI API: Working
- MongoDB: Production config with data persistence
- Network: Docker internal isolation
- Ports: Only expose needed ports (80, 3001, 27017)

## Access

**Main App**: http://98.87.249.41:3000  
**API Health**: http://98.87.249.41:3000/api/health  
**Backend API**: http://98.87.249.41:3001/api  

## Maintenance

### Restart Services
```bash
ssh -i /Users/angus/Study/COMPX527-25B/my-key.pem ec2-user@98.87.249.41
cd ~/app
docker-compose restart
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Backup Data
```bash
docker exec llm-security-mongodb mongodump --out /backup
```

## Status

Platform deployed to AWS with all functions working:
- Complete LLM security education platform
- Real attack simulation and detection
- Rich educational content and cases
- Professional data visualization
- Production level deployment

**Status**: FULLY WORKING  
**Functions**: ALL NORMAL  
**Feedback**: GOOD
