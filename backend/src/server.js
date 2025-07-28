const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const TestData = require('./models/TestData');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Basic MongoDB connection
const connectDatabase = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/llm-security-platform';
    await mongoose.connect(mongoURI);
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
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

// Test data routes - demonstrates actual database operations

// GET - Retrieve all test data
app.get('/api/test-data', async (req, res) => {
  try {
    // Get all test data from database
    const testDataList = await TestData.find();
    
    // If no data exists, create a sample record
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
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name is required'
      });
    }
    
    // Create new test data
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
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Name is required'
      });
    }
    
    // Update the data
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

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to LLM Security Platform API',
    endpoints: {
      health: '/api/health',
      'database-test': '/api/database-test',
      'test-data': '/api/test-data',
      attacks: '/api/attacks',
      llm: '/api/llm',
      assessment: '/api/assessment',
      knowledge: '/api/knowledge'
    }
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
}); 