# Development Guide

## 🚀 How to Start the Project

### Prerequisites
- Node.js v18+ installed ✅
- npm v8+ installed ✅
- Git installed ✅

### Starting Development Servers

#### 1. Start Backend Server
```bash
cd backend
npm run dev
```
The API server will start on: http://localhost:5000

#### 2. Start Frontend Application
```bash
cd frontend
npm start
```
The React app will start on: http://localhost:3000

### 📋 Available Commands

#### Backend Commands
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

#### Frontend Commands  
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### 🔗 API Endpoints

#### Health Check
- **GET** `/api/health` - Check if API is running
- **GET** `/api` - API documentation

### 📊 Current Features

#### ✅ Completed (Week 2)
- Project structure setup
- Dependencies installed
- Basic Express server with security middleware
- React app with Material-UI interface
- Three feature cards: Attack Simulation, Visualization, Risk Assessment
- Environment configuration templates

#### 📋 Next Steps (Week 3)
- Create detailed UI wireframes
- Implement navigation routing
- Design attack simulation interface
- Add more interactive components

### 🎯 Demo Features Available Now

1. **Professional UI**: Modern Material-UI interface
2. **Responsive Design**: Works on desktop and mobile
3. **Feature Overview**: Cards showing planned functionality
4. **Development Status**: Real-time project progress
5. **Security Ready**: CORS, Helmet, and other security measures

### 🔧 Environment Setup

Create `.env` files based on templates:
- Copy `backend/config/env.template` to `backend/.env`
- Copy `frontend/config/env.template` to `frontend/.env`

### 📁 Project Structure Summary
```
frontend/         # React application
  src/
    components/   # Reusable UI components
    pages/        # Page-level components
    services/     # API communication
    
backend/          # Node.js API server
  src/
    services/     # Business logic
    routes/       # API endpoints
    controllers/  # Request handlers
```

### 🎨 UI Preview
The current interface includes:
- Clean navigation bar with security icon
- Welcome section with project description
- Three feature cards with icons and descriptions
- Development status indicator
- Professional blue and gray color scheme 