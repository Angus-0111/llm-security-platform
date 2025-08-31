const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Import all models
const TestData = require('./models/TestData');
const AttackData = require('./models/AttackData');
const LLMResponse = require('./models/LLMResponse');
const RiskAssessment = require('./models/RiskAssessment');
const KnowledgeBase = require('./models/KnowledgeBase');
const NewsIncident = require('./models/NewsIncident');
const Report = require('./models/Report');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic MongoDB connection
const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/llm-security-platform';
    await mongoose.connect(mongoURI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LLM Security Platform API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// =================
// SIMULATION API
// =================
const { runSimulation, runSimulationFromTemplate } = require('./services/llm/simulationService');

app.post('/api/simulations/run', async (req, res) => {
  try {
    const { originalPrompt, attackPrompt, systemPrompt, options } = req.body;
    if (!originalPrompt || !attackPrompt) {
      return res.status(400).json({ status: 'error', message: 'originalPrompt and attackPrompt are required' });
    }
    const result = await runSimulation({ originalPrompt, attackPrompt, systemPrompt, options });
    return res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET - Retrieve simulation history
app.get('/api/simulations/history', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Query with pagination
    const simulations = await LLMResponse.find({})
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v')
      .lean();
    
    // Get total count
    const total = await LLMResponse.countDocuments({});
    
    res.json({
      status: 'success',
      data: {
        simulations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET - Retrieve specific simulation by ID
app.get('/api/simulations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const simulation = await LLMResponse.findById(id).lean();
    
    if (!simulation) {
      return res.status(404).json({ status: 'error', message: 'Simulation not found' });
    }
    
    res.json({
      status: 'success',
      data: simulation
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST - Run simulation from AttackData template
app.post('/api/simulations/run-from-template', async (req, res) => {
  try {
    const { attackDataId, systemPrompt, options } = req.body;
    
    if (!attackDataId) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'attackDataId is required' 
      });
    }
    
    const result = await runSimulationFromTemplate(attackDataId, {
      systemPrompt,
      ...options
    });
    
    return res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Simple database test route
app.get('/api/database-test', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      database: states[dbState] || 'unknown',
      message: dbState === 1 ? 'Database is connected' : 'Database connection issue'
    });
  } catch (error) {
    res.status(500).json({
      database: 'error',
      message: error.message
    });
  }
});

// =================
// ATTACK DATA APIs
// =================

// GET - Retrieve all attack data
app.get('/api/attack-data', async (req, res) => {
  try {
    const { 
      attackType, 
      educationScenario, 
      educationLevel, 
      limit = 50, 
      skip = 0,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { status: 'active' };
    
    if (attackType) query.attackType = attackType;
    if (educationScenario) query.educationScenario = educationScenario;
    if (educationLevel) query.educationLevel = educationLevel;
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const attackData = await AttackData.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await AttackData.countDocuments(query);
    
    res.json({
      status: 'success',
      data: attackData,
      meta: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: total > (parseInt(skip) + parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Create new attack data
app.post('/api/attack-data', async (req, res) => {
  try {
    const attackData = new AttackData(req.body);
    const savedData = await attackData.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Attack data created successfully',
      data: savedData
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: Object.values(error.errors).map(e => e.message)
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
});

// GET - Get attack data statistics
app.get('/api/attack-data/stats', async (req, res) => {
  try {
    const stats = await AttackData.getAttackTypeStats();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get attack data by education scenario
app.get('/api/attack-data/education/:scenario', async (req, res) => {
  try {
    const { scenario } = req.params;
    const attackData = await AttackData.findByEducationScenario(scenario);
    
    res.json({
      status: 'success',
      data: attackData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT - Update attack data
app.put('/api/attack-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await AttackData.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedData) {
      return res.status(404).json({
        status: 'error',
        message: 'Attack data not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Attack data updated successfully',
      data: updatedData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE - Remove attack data
app.delete('/api/attack-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await AttackData.findByIdAndDelete(id);
    
    if (!deletedData) {
      return res.status(404).json({
        status: 'error',
        message: 'Attack data not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Attack data deleted successfully',
      data: deletedData
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// LLM RESPONSE APIs
// =================

// GET - Retrieve LLM responses
app.get('/api/llm-responses', async (req, res) => {
  try {
    const { 
      attackId, 
      modelName, 
      isSuccessful,
      limit = 50, 
      skip = 0
    } = req.query;
    
    const query = {};
    
    if (attackId) query.attackId = attackId;
    if (modelName) query['modelInfo.name'] = modelName;
    if (isSuccessful !== undefined) query['attackSuccess.isSuccessful'] = isSuccessful === 'true';
    
    const responses = await LLMResponse.find(query)
      .populate('attackId', 'name attackType educationScenario')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    const total = await LLMResponse.countDocuments(query);
    
    res.json({
      status: 'success',
      data: responses,
      meta: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Create new LLM response
app.post('/api/llm-responses', async (req, res) => {
  try {
    const response = new LLMResponse(req.body);
    const savedResponse = await response.save();
    
    res.status(201).json({
      status: 'success',
      message: 'LLM response created successfully',
      data: savedResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get model success statistics
app.get('/api/llm-responses/model-stats', async (req, res) => {
  try {
    const stats = await LLMResponse.getModelSuccessStats();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get high risk responses
app.get('/api/llm-responses/high-risk', async (req, res) => {
  try {
    const { threshold = 7 } = req.query;
    const responses = await LLMResponse.findHighRiskResponses(parseFloat(threshold));
    
    res.json({
      status: 'success',
      data: responses
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// RISK ASSESSMENT APIs
// =================

// GET - Retrieve risk assessments
app.get('/api/risk-assessments', async (req, res) => {
  try {
    const { 
      attackId, 
      riskLevel, 
      assessmentType,
      limit = 50, 
      skip = 0
    } = req.query;
    
    const query = {};
    
    if (attackId) query.attackId = attackId;
    if (riskLevel) query['overallRisk.level'] = riskLevel;
    if (assessmentType) query['assessmentInfo.assessmentType'] = assessmentType;
    
    const assessments = await RiskAssessment.find(query)
      .populate('attackId', 'name attackType educationScenario')
      .populate('responseId', 'modelInfo.name attackSuccess.isSuccessful')
      .sort({ assessmentDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json({
      status: 'success',
      data: assessments
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Create new risk assessment
app.post('/api/risk-assessments', async (req, res) => {
  try {
    const assessment = new RiskAssessment(req.body);
    const savedAssessment = await assessment.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Risk assessment created successfully',
      data: savedAssessment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get risk distribution statistics
app.get('/api/risk-assessments/distribution', async (req, res) => {
  try {
    const distribution = await RiskAssessment.getRiskDistribution();
    res.json({
      status: 'success',
      data: distribution
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get high priority risks
app.get('/api/risk-assessments/high-priority', async (req, res) => {
  try {
    const risks = await RiskAssessment.getHighPriorityRisks();
    res.json({
      status: 'success',
      data: risks
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// KNOWLEDGE BASE APIs
// =================

// GET - Retrieve knowledge base items
app.get('/api/knowledge-base', async (req, res) => {
  try {
    const { 
      category, 
      targetAudience, 
      difficultyLevel,
      search,
      limit = 20, 
      skip = 0
    } = req.query;
    
    let query = { 
      status: 'published', 
      'accessControl.isPublic': true 
    };
    
    if (category) query.category = category;
    if (targetAudience) query['educationalInfo.targetAudience'] = targetAudience;
    if (difficultyLevel) query['educationalInfo.difficultyLevel'] = difficultyLevel;
    
    let items;
    
    if (search) {
      items = await KnowledgeBase.searchContent(search, query);
    } else {
      items = await KnowledgeBase.find(query)
        .sort({ 'engagement.viewCount': -1, createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    }
    
    res.json({
      status: 'success',
      data: items
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Create new knowledge base item
app.post('/api/knowledge-base', async (req, res) => {
  try {
    const item = new KnowledgeBase(req.body);
    const savedItem = await item.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Knowledge base item created successfully',
      data: savedItem
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get knowledge base category statistics
app.get('/api/knowledge-base/stats', async (req, res) => {
  try {
    const stats = await KnowledgeBase.getCategoryStats();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get knowledge base recommendations
app.get('/api/knowledge-base/recommendations', async (req, res) => {
  try {
    const { category, limit = 5 } = req.query;
    const recommendations = await KnowledgeBase.getRecommendations(
      req.user?.id, // If user authentication is implemented
      category,
      parseInt(limit)
    );
    
    res.json({
      status: 'success',
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT - Increment knowledge base item view count
app.put('/api/knowledge-base/:id/view', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await KnowledgeBase.findById(id);
    
    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Knowledge base item not found'
      });
    }
    
    await item.incrementView();
    
    res.json({
      status: 'success',
      message: 'View count updated',
      viewCount: item.engagement.viewCount
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// NEWS INCIDENT APIs
// =================

// GET - Retrieve news incidents
app.get('/api/news-incidents', async (req, res) => {
  try {
    const { 
      incidentType, 
      severity, 
      educationRelated,
      search,
      limit = 20, 
      skip = 0
    } = req.query;
    
    let query = { status: 'published' };
    
    if (incidentType) query.incidentType = incidentType;
    if (severity) query['severity.level'] = severity;
    if (educationRelated === 'true') query['educationRelevance.isEducationRelated'] = true;
    
    let incidents;
    
    if (search) {
      incidents = await NewsIncident.searchIncidents(search, query);
    } else {
      incidents = await NewsIncident.find(query)
        .sort({ 'timeline.publishDate': -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    }
    
    res.json({
      status: 'success',
      data: incidents
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Create new news incident
app.post('/api/news-incidents', async (req, res) => {
  try {
    const incident = new NewsIncident(req.body);
    const savedIncident = await incident.save();
    
    res.status(201).json({
      status: 'success',
      message: 'News incident created successfully',
      data: savedIncident
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Batch import news incidents
app.post('/api/news-incidents/batch-import', async (req, res) => {
  try {
    const { newsList } = req.body;
    
    if (!newsList || !Array.isArray(newsList)) {
      return res.status(400).json({
        status: 'error',
        message: 'newsList must be an array'
      });
    }
    
    const newsImporter = require('./utils/newsImporter');
    const results = await newsImporter.batchImportNews(newsList);
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    res.json({
      status: 'success',
      message: `Batch import completed: ${successCount} successful, ${failureCount} failed`,
      results: results
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Import example news incidents
app.post('/api/news-incidents/import-examples', async (req, res) => {
  try {
    const newsImporter = require('./utils/newsImporter');
    const results = await newsImporter.importExampleNews();
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    res.json({
      status: 'success',
      message: `Example import completed: ${successCount} successful, ${failureCount} failed`,
      results: results
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// PUT - Update news incident
app.put('/api/news-incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIncident = await NewsIncident.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedIncident) {
      return res.status(404).json({
        status: 'error',
        message: 'News incident not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'News incident updated successfully',
      data: updatedIncident
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// DELETE - Remove news incident
app.delete('/api/news-incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIncident = await NewsIncident.findByIdAndDelete(id);
    
    if (!deletedIncident) {
      return res.status(404).json({
        status: 'error',
        message: 'News incident not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'News incident deleted successfully',
      data: deletedIncident
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get education-related incidents
app.get('/api/news-incidents/education', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const incidents = await NewsIncident.getEducationRelatedIncidents();
    
    res.json({
      status: 'success',
      data: incidents.slice(0, parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get trending incidents
app.get('/api/news-incidents/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const incidents = await NewsIncident.getTrendingIncidents(parseInt(limit));
    
    res.json({
      status: 'success',
      data: incidents
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get incident statistics
app.get('/api/news-incidents/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const end = endDate ? new Date(endDate) : new Date();
    
    const stats = await NewsIncident.getIncidentStats(start, end);
    
    res.json({
      status: 'success',
      data: stats,
      period: { startDate: start, endDate: end }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// REPORT APIs
// =================

// GET - Retrieve reports
app.get('/api/reports', async (req, res) => {
  try {
    const { 
      reportType, 
      category, 
      status,
      limit = 20, 
      skip = 0
    } = req.query;
    
    let query = { 
      'access.visibility': { $in: ['public', 'internal'] }
    };
    
    if (reportType) query.reportType = reportType;
    if (category) query.category = category;
    if (status) query.status = status;
    
    const reports = await Report.find(query)
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('dataSourceRefs.attackDataIds', 'name attackType')
      .populate('dataSourceRefs.assessmentIds', 'overallRisk.level');
    
    res.json({
      status: 'success',
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Create new report
app.post('/api/reports', async (req, res) => {
  try {
    const report = new Report(req.body);
    const savedReport = await report.save();
    
    res.status(201).json({
      status: 'success',
      message: 'Report created successfully',
      data: savedReport
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get recent reports
app.get('/api/reports/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const reports = await Report.getRecentReports(parseInt(limit));
    
    res.json({
      status: 'success',
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get report statistics
app.get('/api/reports/stats', async (req, res) => {
  try {
    const stats = await Report.getReportStats();
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Search reports
app.get('/api/reports/search', async (req, res) => {
  try {
    const { q: query, ...filters } = req.query;
    
    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }
    
    const reports = await Report.searchReports(query, filters);
    
    res.json({
      status: 'success',
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// GET - Get report summary
app.get('/api/reports/:id/summary', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    
    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Report not found'
      });
    }
    
    const summary = report.generateSummary();
    
    res.json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// AUTOMATED REPORT GENERATION APIs
// =================

const { 
  generateAttackAnalysisReport, 
  generateRiskSummaryReport, 
  generateEducationalImpactReport 
} = require('./services/report-generation/reportService');

// POST - Generate attack analysis report
app.post('/api/reports/generate/attack-analysis', async (req, res) => {
  try {
    const parameters = req.body || {};
    const report = await generateAttackAnalysisReport(parameters);
    
    res.status(201).json({
      status: 'success',
      message: 'Attack analysis report generated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Generate risk summary report
app.post('/api/reports/generate/risk-summary', async (req, res) => {
  try {
    const parameters = req.body || {};
    const report = await generateRiskSummaryReport(parameters);
    
    res.status(201).json({
      status: 'success',
      message: 'Risk summary report generated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// POST - Generate educational impact report
app.post('/api/reports/generate/educational-impact', async (req, res) => {
  try {
    const parameters = req.body || {};
    const report = await generateEducationalImpactReport(parameters);
    
    res.status(201).json({
      status: 'success',
      message: 'Educational impact report generated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// =================
// TEST DATA APIs (Legacy)
// =================

// GET - Retrieve all test data
app.get('/api/test-data', async (req, res) => {
  try {
    const testDataList = await TestData.find();
    
    if (testDataList.length === 0) {
      const sampleData = new TestData({
        name: 'Sample Database Entry',
        message: 'This proves database storage is working!'
      });
      await sampleData.save();
      
      res.json({
        status: 'Created sample data',
        data: [sampleData],
        count: 1
      });
    } else {
      res.json({
        status: 'Retrieved existing data',
        data: testDataList,
        count: testDataList.length
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Database operation failed',
      message: error.message
    });
  }
});

// POST - Create new test data
app.post('/api/test-data', async (req, res) => {
  try {
    const { name, message } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name is required'
      });
    }
    
    const newTestData = new TestData({
      name: name,
      message: message || 'User created data entry'
    });
    
    const savedData = await newTestData.save();
    
    res.status(201).json({
      status: 'Data created successfully',
      data: savedData
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create data',
      message: error.message
    });
  }
});

// PUT - Update existing test data
app.put('/api/test-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, message } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name is required'
      });
    }
    
    const updatedData = await TestData.findByIdAndUpdate(
      id,
      { name, message },
      { new: true, runValidators: true }
    );
    
    if (!updatedData) {
      return res.status(404).json({
        error: 'Data not found',
        message: 'No data found with the provided ID'
      });
    }
    
    res.json({
      status: 'Data updated successfully',
      data: updatedData
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update data',
      message: error.message
    });
  }
});

// DELETE - Remove test data
app.delete('/api/test-data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedData = await TestData.findByIdAndDelete(id);
    
    if (!deletedData) {
      return res.status(404).json({
        error: 'Data not found',
        message: 'No data found with the provided ID'
      });
    }
    
    res.json({
      status: 'Data deleted successfully',
      data: deletedData
    });
    
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete data',
      message: error.message
    });
  }
});

// =================
// GENERAL APIs
// =================

// API routes overview
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to LLM Security Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      'database-test': '/api/database-test',
      'attack-data': '/api/attack-data',
      'llm-responses': '/api/llm-responses',
      'risk-assessments': '/api/risk-assessments',
      'knowledge-base': '/api/knowledge-base',
      'news-incidents': '/api/news-incidents',
      'reports': '/api/reports',
      'test-data': '/api/test-data (legacy)'
    },
    documentation: 'Full API documentation available at /api/docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} not found`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log('Available Models: AttackData, LLMResponse, RiskAssessment, KnowledgeBase, NewsIncident, Report');
}); 