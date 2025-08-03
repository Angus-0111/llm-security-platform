# Development Guide

## How to Start the Project

### Prerequisites:
- Node.js v18+ installed 
- npm v8+ installed 
- Git installed 

### Installation Steps:

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   cd COMPX576_Project
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
```bash
   cd ../backend
   npm install
```

### Available Commands

**Frontend:**
```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Run linting
```

**Backend:**
```bash
cd backend
npm start          # Start development server
npm run dev        # Start with nodemon
npm test           # Run tests
```

### Current Features

#### Completed (Week 2)
- Basic project structure
- Development environment setup
- Frontend: React app with Material-UI
- Backend: Express server with basic routing
- UI prototypes and wireframes
- Initial component structure

#### Next Steps (Week 3)
- Database integration
- API endpoint development
- LLM service integration
- Attack simulation logic
- Risk assessment algorithms

### Demo Features Available Now
- Frontend UI prototype
- Backend API server
- Basic React components
- Material-UI theme and layout
- Initial routing structure
- Development environment with hot reload

### Environment Setup

Create `.env` files in both frontend and backend directories:

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:3001
```

**Backend `.env`:**
```
PORT=3001
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/llm-security-platform
```

For any questions or issues, refer to the weekly completion reports in the `docs/` directory. 