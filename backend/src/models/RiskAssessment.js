const mongoose = require('mongoose');

// RiskAssessment Schema - Risk assessment results storage
const RiskAssessmentSchema = new mongoose.Schema({
  // Associated data
  attackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttackData',
    required: true,
    index: true
  },
  
  responseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LLMResponse',
    index: true
  },
  
  // Assessment basic information
  assessmentInfo: {
    assessmentType: {
      type: String,
      enum: ['automated', 'manual', 'hybrid', 'peer_review'],
      default: 'automated'
    },
    version: {
      type: String,
      default: '1.0'
    },
    assessor: String, // Assessor ID or system name
    methodology: String,
    confidenceLevel: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    }
  },
  
  // Overall risk assessment
  overallRisk: {
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    level: {
      type: String,
      required: true,
      enum: ['minimal', 'low', 'medium', 'high', 'critical']
    },
    category: {
      type: String,
      enum: ['security', 'privacy', 'safety', 'ethics', 'compliance', 'educational']
    },
    description: String
  },
  
  // Detailed risk analysis
  riskFactors: {
    // Security risks
    security: {
      promptInjectionRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        indicators: [String],
        evidence: [String]
      },
      
      jailbreakRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        bypassMethods: [String],
        successProbability: Number
      },
      
      adversarialRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        manipulationTechniques: [String],
        robustnessScore: Number
      }
    },
    
    // Privacy risks
    privacy: {
      dataLeakageRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        dataTypes: [String],
        exposureLevel: String
      },
      
      personalInfoRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        infoTypes: [{
          type: String,
          enum: ['pii', 'financial', 'medical', 'educational', 'behavioral', 'biometric']
        }],
        complianceIssues: [String]
      },
      
      inferenceRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        inferableAttributes: [String],
        linkabilityRisk: Number
      }
    },
    
    // Content risks
    content: {
      harmfulContentRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        harmTypes: [{
          type: String,
          enum: ['violence', 'hate', 'harassment', 'sexual', 'illegal', 'self-harm']
        }],
        targetAudience: String
      },
      
      misinformationRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        accuracy: Number,
        factualErrors: [String],
        bias: [String]
      },
      
      qualityRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        coherence: Number,
        relevance: Number,
        completeness: Number
      }
    },
    
    // Education-specific risks
    educational: {
      academicIntegrityRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        cheatingPotential: Number,
        plagiarismRisk: Number,
        assessmentValidity: Number
      },
      
      learningImpactRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        skillDevelopment: Number,
        criticalThinking: Number,
        dependencyRisk: Number
      },
      
      ageAppropriatenessRisk: {
        score: { type: Number, min: 0, max: 10, default: 0 },
        severity: { type: String, enum: ['none', 'low', 'medium', 'high', 'critical'] },
        targetAge: String,
        contentRating: String,
        parentalGuidance: Boolean
      }
    }
  },
  
  // Impact assessment
  impact: {
    // Impact scope
    scope: {
      affectedUsers: {
        estimated: Number,
        demographics: [String]
      },
      affectedSystems: [String],
      geographicScope: String,
      institutionalScope: [String]
    },
    
    // Impact severity
    severity: {
      immediate: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'major', 'catastrophic']
      },
      longTerm: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'major', 'catastrophic']
      },
      financial: Number, // Estimated loss
      reputational: {
        type: String,
        enum: ['none', 'minor', 'moderate', 'major', 'severe']
      }
    },
    
    // Impact probability
    probability: {
      occurrence: {
        type: Number,
        min: 0,
        max: 1
      },
      detection: {
        type: Number,
        min: 0,
        max: 1
      },
      exploitation: {
        type: Number,
        min: 0,
        max: 1
      }
    }
  },
  
  // Mitigation strategies and recommendations
  mitigation: {
    // Immediate actions
    immediateActions: [{
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      action: String,
      timeline: String,
      responsibility: String,
      cost: String
    }],
    
    // Short-term measures
    shortTermMeasures: [{
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      measure: String,
      timeline: String,
      resources: String,
      expectedImpact: String
    }],
    
    // Long-term strategies
    longTermStrategies: [{
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      strategy: String,
      timeline: String,
      investment: String,
      sustainabilityPlan: String
    }],
    
    // Technical recommendations
    technicalRecommendations: [{
      category: {
        type: String,
        enum: ['detection', 'prevention', 'monitoring', 'response', 'recovery']
      },
      recommendation: String,
      implementation: String,
      effectiveness: Number
    }],
    
    // Policy recommendations
    policyRecommendations: [{
      type: {
        type: String,
        enum: ['institutional', 'regulatory', 'industry', 'educational']
      },
      recommendation: String,
      stakeholders: [String],
      timeline: String
    }]
  },
  
  // Monitoring and tracking
  monitoring: {
    kpis: [{
      metric: String,
      target: String,
      frequency: String,
      responsible: String
    }],
    alertThresholds: [{
      parameter: String,
      threshold: Number,
      action: String
    }],
    reviewSchedule: {
      frequency: String,
      nextReview: Date,
      reviewers: [String]
    }
  },
  
  // Compliance assessment
  compliance: {
    regulations: [{
      name: String,
      applicability: String,
      complianceStatus: {
        type: String,
        enum: ['compliant', 'non_compliant', 'partial', 'not_applicable']
      },
      requirements: [String],
      gaps: [String]
    }],
    standards: [{
      name: String,
      version: String,
      adherence: Number,
      deviations: [String]
    }]
  },
  
  // Assessment summary
  summary: {
    executiveSummary: {
      type: String,
      maxlength: 1000
    },
    keyFindings: [String],
    criticalRisks: [String],
    priorityActions: [String],
    conclusion: String
  },
  
  // Metadata
  metadata: {
    assessmentDuration: Number, // Assessment time (minutes)
    toolsUsed: [String],
    dataQuality: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    },
    limitations: [String],
    assumptions: [String],
    reviewStatus: {
      type: String,
      enum: ['draft', 'under_review', 'approved', 'rejected'],
      default: 'draft'
    },
    approver: String,
    approvalDate: Date
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
  
  assessmentDate: {
    type: Date,
    default: Date.now
  }
});

// Index design
RiskAssessmentSchema.index({ attackId: 1, assessmentDate: -1 });
RiskAssessmentSchema.index({ 'overallRisk.level': 1, 'overallRisk.score': -1 });
RiskAssessmentSchema.index({ responseId: 1 });
RiskAssessmentSchema.index({ 'metadata.reviewStatus': 1 });
RiskAssessmentSchema.index({ 'riskFactors.security.promptInjectionRisk.severity': 1 });

// Virtual field - Risk matrix position
RiskAssessmentSchema.virtual('riskMatrix').get(function() {
  const score = this.overallRisk.score;
  const probability = this.impact.probability.occurrence || 0.5;
  
  // Simple risk matrix calculation
  return {
    impact: score <= 3 ? 'low' : score <= 6 ? 'medium' : 'high',
    probability: probability <= 0.3 ? 'low' : probability <= 0.7 ? 'medium' : 'high',
    position: `${probability <= 0.3 ? 'low' : probability <= 0.7 ? 'medium' : 'high'}-impact-${score <= 3 ? 'low' : score <= 6 ? 'medium' : 'high'}-probability`
  };
});

// Virtual field - Action urgency
RiskAssessmentSchema.virtual('urgency').get(function() {
  const riskScore = this.overallRisk.score;
  const criticalCount = this.mitigation.immediateActions.filter(a => a.priority === 'critical').length;
  
  if (riskScore >= 8 || criticalCount > 0) return 'immediate';
  if (riskScore >= 6) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
});

// Middleware - Pre-save processing
RiskAssessmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-determine risk level
  const score = this.overallRisk.score;
  if (score <= 2) this.overallRisk.level = 'minimal';
  else if (score <= 4) this.overallRisk.level = 'low';
  else if (score <= 6) this.overallRisk.level = 'medium';
  else if (score <= 8) this.overallRisk.level = 'high';
  else this.overallRisk.level = 'critical';
  
  next();
});

// Static method - Risk distribution statistics
RiskAssessmentSchema.statics.getRiskDistribution = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$overallRisk.level',
        count: { $sum: 1 },
        avgScore: { $avg: '$overallRisk.score' },
        maxScore: { $max: '$overallRisk.score' }
      }
    },
    { $sort: { avgScore: -1 } }
  ]);
};

// Static method - Get high priority risks
RiskAssessmentSchema.statics.getHighPriorityRisks = function() {
  return this.find({
    $or: [
      { 'overallRisk.level': { $in: ['high', 'critical'] } },
      { 'mitigation.immediateActions.priority': 'critical' }
    ]
  }).populate('attackId responseId');
};

// Instance method - Generate risk report summary
RiskAssessmentSchema.methods.generateSummary = function() {
  const riskLevel = this.overallRisk.level;
  const score = this.overallRisk.score;
  const criticalActions = this.mitigation.immediateActions.filter(a => a.priority === 'critical').length;
  
  return {
    riskLevel,
    score,
    urgency: this.urgency,
    criticalActions,
    summary: this.summary.executiveSummary || `Risk assessment completed with ${riskLevel} risk level (${score}/10).`
  };
};

module.exports = mongoose.model('RiskAssessment', RiskAssessmentSchema); 