const mongoose = require('mongoose');

// Simple test data schema
const TestDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: 'Test data created successfully'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestData', TestDataSchema); 