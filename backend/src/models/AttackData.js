const mongoose = require('mongoose');

// AttackData Schema - Attack scenarios and results data
const AttackDataSchema = new mongoose.Schema({
  // Basic identification information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Attack type classification
  attackType: {
    type: String,
    required: true,
    enum: [
      'prompt_injection',      // Prompt injection
      'adversarial_input',     // Adversarial input  
      'data_leakage',         // Data leakage
      'jailbreak',            // Jailbreak attack
      'backdoor',             // Backdoor attack
      'poisoning',            // Data poisoning
      'extraction',           // Data extraction
      'evasion'               // Evasion attack
    ]
  },
  
  // Educational scenario classification
  educationScenario: {
    type: String,
    required: true,
    enum: [
      'essay_grading',        // Essay grading
      'tutoring_chatbot',     // Tutoring chatbot
      'content_generation',   // Content generation
      'academic_integrity',   // Academic integrity check
      'student_assessment',   // Student assessment
      'curriculum_planning',  // Curriculum planning
      'research_assistance',  // Research assistance
      'language_learning',    // Language learning
      'code_teaching',        // Code teaching
      'general_qa'           // General Q&A
    ]
  },
  
  // Education level
  educationLevel: {
    type: String,
    enum: ['k12', 'higher_education', 'professional', 'general'],
    default: 'general'
  },
  
  // Input data
  originalPrompt: {
    type: String,
    required: true,
    maxlength: 5000
  },
  
  maliciousPrompt: {
    type: String,
    required: true,
    maxlength: 5000
  },
  
  // Attack parameters configuration
  attackParameters: {
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    technique: String,
    payload: String,
    context: String,
    customParams: mongoose.Schema.Types.Mixed
  },
  
  // Target LLM information
  targetModels: [{
    type: String,
    enum: ['gpt-4', 'gpt-3.5', 'claude-3', 'claude-2', 'gemini-pro', 'llama-2', 'other']
  }],
  
  // Attack result statistics
  results: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    successfulAttempts: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    averageResponseTime: Number, // Average response time(ms)
    impactLevel: {
      type: String,
      enum: ['minimal', 'low', 'medium', 'high', 'critical'],
      default: 'low'
    }
  },
  
  // Detection and analysis
  detection: {
    isDetected: {
      type: Boolean,
      default: false
    },
    detectionMethod: String,
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1
    },
    falsePositiveRate: Number
  },
  
  // Educational impact assessment
  educationalImpact: {
    affectedStudents: Number,
    potentialHarm: {
      type: String,
      enum: ['none', 'minimal', 'moderate', 'significant', 'severe']
    },
    learningDisruption: {
      type: String,
      enum: ['none', 'minor', 'moderate', 'major', 'critical']
    },
    privacyRisk: {
      type: String,
      enum: ['none', 'low', 'medium', 'high', 'critical']
    }
  },
  
  // Metadata
  description: {
    type: String,
    maxlength: 1000
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  isPublic: {
    type: Boolean,
    default: true
  },
  
  source: {
    type: String,
    enum: ['research', 'real_world', 'synthetic', 'community', 'automated'],
    default: 'synthetic'
  },
  
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  
  // Version and status
  version: {
    type: String,
    default: '1.0'
  },
  
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'deprecated'],
    default: 'active'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastTestedAt: Date
});

// Index design
AttackDataSchema.index({ attackType: 1, educationScenario: 1 });
AttackDataSchema.index({ 'results.successRate': -1 });
AttackDataSchema.index({ createdAt: -1 });
AttackDataSchema.index({ tags: 1 });
AttackDataSchema.index({ status: 1, isPublic: 1 });

// Virtual field - Calculate attack severity
AttackDataSchema.virtual('severityScore').get(function() {
  const weights = {
    'results.successRate': 0.3,
    'educationalImpact.potentialHarm': 0.25,
    'educationalImpact.privacyRisk': 0.25,
    'results.impactLevel': 0.2
  };
  
  // Simplified calculation logic, can be more complex in practice
  return Math.min(10, (this.results.successRate || 0) / 10);
});

// Middleware - Update timestamp
AttackDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-calculate success rate
  if (this.results.totalAttempts > 0) {
    this.results.successRate = Math.round(
      (this.results.successfulAttempts / this.results.totalAttempts) * 100
    );
  }
  
  next();
});

// Static method - Query by education scenario
AttackDataSchema.statics.findByEducationScenario = function(scenario) {
  return this.find({ 
    educationScenario: scenario, 
    status: 'active', 
    isPublic: true 
  }).sort({ 'results.successRate': -1 });
};

// Static method - Attack type statistics
AttackDataSchema.statics.getAttackTypeStats = function() {
  return this.aggregate([
    { $match: { status: 'active' } },
    { 
      $group: {
        _id: '$attackType',
        count: { $sum: 1 },
        avgSuccessRate: { $avg: '$results.successRate' },
        maxImpact: { $max: '$results.impactLevel' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('AttackData', AttackDataSchema); 