# LLM Security Platform for Education

A web-based platform for simulating and visualizing attacks on educational LLM tools.

## Project Overview
This is a web platform for simulating and visualizing LLM security attacks in educational scenarios, helping educators, developers, and students understand LLM security risks.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js + Express
- **Database**: MongoDB/MySQL
- **LLM Integration**: OpenAI, Gemini, Claude APIs
- **Deployment**: AWS Cloud Platform

## Project Structure

```
COMPX576_Project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── AttackSimulation/    # Attack simulation components
│   │   │   ├── Visualization/       # Data visualization components
│   │   │   ├── OutputComparison/    # Output comparison components
│   │   │   ├── KnowledgeBase/       # Knowledge base components
│   │   │   ├── Dashboard/           # Dashboard components
│   │   │   └── RiskAssessment/      # Risk assessment components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── services/         # Business logic services
│   │   │   ├── llm/          # LLM API integration
│   │   │   ├── attacks/      # Attack simulation logic
│   │   │   ├── risk-assessment/  # Risk assessment
│   │   │   └── knowledge-base/   # Knowledge base management
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Controllers
│   │   ├── models/           # Data models
│   │   ├── middleware/       # Middleware
│   │   └── utils/            # Utility functions
│   └── config/               # Configuration files
├── data/                     # Data storage
│   ├── attack-examples/      # Attack example data
│   └── knowledge-base/       # Knowledge base data
├── database/                 # Database configuration
├── docs/                     # Project documentation
├── tests/                    # Test files
└── deployment/               # Deployment configuration
```

## Development Timeline
- Week 2: Environment setup and project architecture
- Week 3: Frontend UI prototype development
- Week 4: LLM API integration
- Week 5-7: Attack simulation features
- Week 8: Risk assessment and report generation
- Week 9: Knowledge base and visualization
- Week 10: Integration testing and optimization

## Quick Start

### Requirements
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Installation Steps
1. Clone the project
2. Install frontend dependencies: `cd frontend && npm install`
3. Install backend dependencies: `cd backend && npm install`
4. Configure environment variables
5. Start development servers

## Key Features
- 🎯 Attack Simulation: Support for multiple LLM attack types
- 📊 Data Visualization: Interactive charts and dashboards
- 🔍 Output Comparison: Original vs attacked output comparison
- 📈 Risk Assessment: Automated risk scoring and reports
- 📚 Knowledge Base: LLM security threats and case studies
- 🔒 User Management: Role-based access control

## Development Guide
Detailed development guides can be found in the `docs/` directory. 