const mongoose = require('mongoose');

// Report Schema - Automated report generation storage
const ReportSchema = new mongoose.Schema({
  // Report basic information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  
  subtitle: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Report type and classification
  reportType: {
    type: String,
    required: true,
    enum: [
      'attack_analysis',         // Attack analysis report
      'risk_assessment',         // Risk assessment report
      'incident_summary',        // Incident summary report
      'security_audit',          // Security audit report
      'educational_impact',      // Educational impact report
      'compliance_report',       // Compliance report
      'trend_analysis',          // Trend analysis report
      'comparative_study',       // Comparative study report
      'mitigation_guide',        // Mitigation guide report
      'executive_summary'        // Executive summary report
    ]
  },
  
  category: {
    type: String,
    required: true,
    enum: [
      'operational',            // Operational report
      'strategic',             // Strategic report
      'tactical',              // Tactical report
      'compliance',            // Compliance report
      'research',              // Research report
      'educational',           // Educational report
      'technical'              // Technical report
    ]
  },
  
  scope: {
    type: String,
    enum: ['single_attack', 'multiple_attacks', 'time_period', 'risk_category', 'education_focused', 'comprehensive'],
    default: 'single_attack'
  },
  
  // Data source associations
  dataSourceRefs: {
    // Associated attack data
    attackDataIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttackData'
    }],
    
    // Associated LLM responses
    responseIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LLMResponse'
    }],
    
    // Associated risk assessments
    assessmentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RiskAssessment'
    }],
    
    // Associated news incidents
    incidentIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsIncident'
    }],
    
    // Associated knowledge base entries
    knowledgeIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeBase'
    }]
  },
  
  // Report content structure
  content: {
    // Executive summary
    executiveSummary: {
      overview: {
        type: String,
        maxlength: 2000
      },
      keyFindings: [String],
      criticalIssues: [String],
      recommendations: [String],
      conclusion: {
        type: String,
        maxlength: 1000
      }
    },
    
    // Detailed analysis
    detailedAnalysis: {
      methodology: String,
      
      attackAnalysis: {
        totalAttacks: Number,
        successfulAttacks: Number,
        attackTypes: [{
          type: String,
          count: Number,
          successRate: Number,
          riskLevel: String
        }],
        trends: [String],
        patterns: [String]
      },
      
      riskAnalysis: {
        overallRiskScore: Number,
        riskDistribution: [{
          level: String,
          count: Number,
          percentage: Number
        }],
        criticalRisks: [String],
        emergingThreats: [String]
      },
      
      impactAnalysis: {
        affectedUsers: Number,
        affectedSystems: [String],
        educationalImpact: {
          studentsAffected: Number,
          institutionsAffected: Number,
          learningDisruption: String
        },
        financialImpact: Number,
        reputationalImpact: String
      }
    },
    
    // Data visualization
    visualizations: [{
      type: {
        type: String,
        enum: ['chart', 'graph', 'table', 'diagram', 'heatmap', 'timeline']
      },
      title: String,
      description: String,
      data: mongoose.Schema.Types.Mixed,
      config: mongoose.Schema.Types.Mixed
    }],
    
    // Recommendations and action plan
    recommendations: {
      immediate: [{
        priority: {
          type: String,
          enum: ['critical', 'high', 'medium', 'low']
        },
        action: String,
        description: String,
        timeline: String,
        responsibility: String,
        resources: String,
        expectedOutcome: String
      }],
      
      shortTerm: [{
        priority: String,
        action: String,
        description: String,
        timeline: String,
        resources: String,
        kpis: [String]
      }],
      
      longTerm: [{
        priority: String,
        strategy: String,
        description: String,
        timeline: String,
        investment: String,
        sustainabilityPlan: String
      }]
    },
    
    // Appendices and supplementary materials
    appendices: [{
      title: String,
      type: {
        type: String,
        enum: ['data_table', 'technical_details', 'methodology', 'references', 'glossary']
      },
      content: String,
      data: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Report parameters and configuration
  parameters: {
    // Time range
    timeRange: {
      startDate: Date,
      endDate: Date,
      period: String
    },
    
    // Filter conditions
    filters: {
      attackTypes: [String],
      riskLevels: [String],
      educationLevels: [String],
      regions: [String],
      technologies: [String]
    },
    
    // Analysis configuration
    analysisConfig: {
      includeStatistics: Boolean,
      includeTrends: Boolean,
      includeComparisons: Boolean,
      includeForecasts: Boolean,
      confidenceThreshold: Number
    },
    
    // Report format
    formatOptions: {
      language: {
        type: String,
        default: 'en'
      },
      template: String,
      includeCharts: Boolean,
      includeExecutiveSummary: Boolean,
      includeDetailedAnalysis: Boolean,
      includeAppendices: Boolean
    }
  },
  
  // Report quality and verification
  quality: {
    // Data quality score
    dataQuality: {
      completeness: {
        type: Number,
        min: 0,
        max: 100
      },
      accuracy: {
        type: Number,
        min: 0,
        max: 100
      },
      consistency: {
        type: Number,
        min: 0,
        max: 100
      },
      timeliness: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    
    // Analysis quality
    analysisQuality: {
      depth: {
        type: String,
        enum: ['surface', 'moderate', 'comprehensive', 'expert']
      },
      reliability: {
        type: Number,
        min: 0,
        max: 10
      },
      objectivity: {
        type: Number,
        min: 0,
        max: 10
      }
    },
    
    // Review status
    reviewStatus: {
      status: {
        type: String,
        enum: ['draft', 'under_review', 'reviewed', 'approved', 'published'],
        default: 'draft'
      },
      reviewer: String,
      reviewDate: Date,
      reviewNotes: String,
      approver: String,
      approvalDate: Date
    }
  },
  
  // Generation information
  generation: {
    // Generation method
    method: {
      type: String,
      enum: ['automated', 'semi_automated', 'manual', 'ai_assisted'],
      default: 'automated'
    },
    
    // Generator information
    generator: {
      system: String,
      version: String,
      model: String,
      confidence: Number
    },
    
    // Generation parameters
    processingTime: Number,        // Generation time (seconds)
    iterations: Number,            // Number of iterations
    
    // Data statistics
    dataStats: {
      totalRecordsProcessed: Number,
      attacksAnalyzed: Number,
      incidentsReviewed: Number,
      risksAssessed: Number
    }
  },
  
  // Statistical information
  statistics: {
    // Attack statistics
    attackStats: {
      totalAttacks: Number,
      uniqueAttackTypes: Number,
      averageSuccessRate: Number,
      mostCommonAttack: String,
      riskiestAttack: String
    },
    
    // Risk statistics
    riskStats: {
      averageRiskScore: Number,
      criticalRisks: Number,
      riskTrends: String,
      riskDistribution: mongoose.Schema.Types.Mixed
    },
    
    // Educational statistics
    educationStats: {
      educationRelatedIncidents: Number,
      affectedEducationLevels: [String],
      commonEducationThreats: [String],
      educationRiskScore: Number
    }
  },
  
  // Access control and sharing
  access: {
    // Visibility
    visibility: {
      type: String,
      enum: ['private', 'internal', 'public', 'restricted'],
      default: 'internal'
    },
    
    // Access permissions
    permissions: [{
      role: {
        type: String,
        enum: ['owner', 'editor', 'viewer', 'commenter']
      },
      user: String,
      granted: Date,
      expires: Date
    }],
    
    // Sharing options
    sharing: {
      isShareable: Boolean,
      shareUrl: String,
      downloadable: Boolean,
      printable: Boolean,
      embedable: Boolean
    }
  },
  
  // Distribution and notifications
  distribution: {
    // Auto-distribution
    autoDistribution: [{
      recipient: String,
      method: {
        type: String,
        enum: ['email', 'notification', 'api', 'webhook']
      },
      schedule: String,
      lastSent: Date
    }],
    
    // Subscribers
    subscribers: [{
      user: String,
      preferences: mongoose.Schema.Types.Mixed,
      subscribedAt: Date
    }]
  },
  
  // Version control
  version: {
    major: {
      type: Number,
      default: 1
    },
    minor: {
      type: Number,
      default: 0
    },
    patch: {
      type: Number,
      default: 0
    },
    changelog: [String],
    previousVersions: [{
      version: String,
      date: Date,
      changes: [String]
    }]
  },
  
  // Tags and metadata
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  keywords: [String],
  
  // Status management
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'archived'],
    default: 'generating'
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
  
  publishedAt: Date,
  
  generatedAt: Date
});

// Index design
ReportSchema.index({ reportType: 1, category: 1 });
ReportSchema.index({ status: 1, 'quality.reviewStatus.status': 1 });
ReportSchema.index({ 'access.visibility': 1, createdAt: -1 });
ReportSchema.index({ tags: 1 });
ReportSchema.index({ 'generation.generatedAt': -1 });
ReportSchema.index({ 'dataSourceRefs.attackDataIds': 1 });

// Virtual field - Version string
ReportSchema.virtual('versionString').get(function() {
  return `${this.version.major}.${this.version.minor}.${this.version.patch}`;
});

// Virtual field - Overall quality score
ReportSchema.virtual('qualityScore').get(function() {
  const dataQuality = this.quality.dataQuality;
  const avgDataQuality = (
    (dataQuality.completeness || 0) +
    (dataQuality.accuracy || 0) +
    (dataQuality.consistency || 0) +
    (dataQuality.timeliness || 0)
  ) / 4;
  
  const analysisQuality = this.quality.analysisQuality;
  const avgAnalysisQuality = (
    ((analysisQuality.reliability || 0) * 10) +
    ((analysisQuality.objectivity || 0) * 10)
  ) / 2;
  
  return Math.round((avgDataQuality + avgAnalysisQuality) / 2);
});

// Virtual field - Report complexity
ReportSchema.virtual('complexity').get(function() {
  let score = 0;
  
  // Based on data source count
  const totalSources = 
    (this.dataSourceRefs.attackDataIds?.length || 0) +
    (this.dataSourceRefs.responseIds?.length || 0) +
    (this.dataSourceRefs.assessmentIds?.length || 0) +
    (this.dataSourceRefs.incidentIds?.length || 0);
  
  if (totalSources > 100) score += 3;
  else if (totalSources > 50) score += 2;
  else if (totalSources > 10) score += 1;
  
  // Based on content complexity
  const hasDetailedAnalysis = this.content.detailedAnalysis && 
    Object.keys(this.content.detailedAnalysis).length > 0;
  const hasVisualizations = this.content.visualizations?.length > 0;
  const hasRecommendations = this.content.recommendations && 
    (this.content.recommendations.immediate?.length > 0 || 
     this.content.recommendations.shortTerm?.length > 0);
  
  if (hasDetailedAnalysis) score += 2;
  if (hasVisualizations) score += 1;
  if (hasRecommendations) score += 1;
  
  if (score <= 2) return 'simple';
  if (score <= 4) return 'moderate';
  if (score <= 6) return 'complex';
  return 'highly_complex';
});

// Middleware - Pre-save processing
ReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set generation time
  if (this.status === 'completed' && !this.generatedAt) {
    this.generatedAt = Date.now();
  }
  
  // Auto-set publication time
  if (this.quality.reviewStatus.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  // Auto-generate sharing URL
  if (this.access.sharing.isShareable && !this.access.sharing.shareUrl) {
    this.access.sharing.shareUrl = `/reports/share/${this._id}`;
  }
  
  next();
});

// Static method - Get report statistics
ReportSchema.statics.getReportStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$reportType',
        count: { $sum: 1 },
        avgQualityScore: { $avg: '$qualityScore' },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method - Get recent reports
ReportSchema.statics.getRecentReports = function(limit = 10, filters = {}) {
  return this.find({
    status: 'completed',
    'access.visibility': { $in: ['public', 'internal'] },
    ...filters
  })
  .sort({ generatedAt: -1 })
  .limit(limit)
  .populate('dataSourceRefs.attackDataIds', 'name attackType')
  .populate('dataSourceRefs.assessmentIds', 'overallRisk.level');
};

// Static method - Search reports
ReportSchema.statics.searchReports = function(query, filters = {}) {
  const searchCriteria = {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { 'content.executiveSummary.overview': { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ],
    status: 'completed',
    ...filters
  };
  
  return this.find(searchCriteria)
    .sort({ generatedAt: -1 })
    .populate('dataSourceRefs.attackDataIds', 'name attackType');
};

// Instance method - Generate summary
ReportSchema.methods.generateSummary = function() {
  const stats = this.statistics;
  const quality = this.qualityScore;
  
  return {
    title: this.title,
    type: this.reportType,
    generatedAt: this.generatedAt,
    quality: quality,
    complexity: this.complexity,
    keyMetrics: {
      attacksAnalyzed: stats.attackStats?.totalAttacks || 0,
      averageRisk: stats.riskStats?.averageRiskScore || 0,
      criticalIssues: this.content.executiveSummary?.criticalIssues?.length || 0
    },
    status: this.status
  };
};

// Instance method - Add data source
ReportSchema.methods.addDataSource = function(sourceType, sourceId) {
  const validTypes = ['attackDataIds', 'responseIds', 'assessmentIds', 'incidentIds', 'knowledgeIds'];
  
  if (!validTypes.includes(sourceType)) {
    throw new Error('Invalid source type');
  }
  
  if (!this.dataSourceRefs[sourceType].includes(sourceId)) {
    this.dataSourceRefs[sourceType].push(sourceId);
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method - Update version
ReportSchema.methods.updateVersion = function(changeType = 'patch', changeDescription = '') {
  // Save current version to history
  this.version.previousVersions.push({
    version: this.versionString,
    date: this.updatedAt,
    changes: this.version.changelog.slice(-5) // Recent 5 changes
  });
  
  // Update version number
  if (changeType === 'major') {
    this.version.major += 1;
    this.version.minor = 0;
    this.version.patch = 0;
  } else if (changeType === 'minor') {
    this.version.minor += 1;
    this.version.patch = 0;
  } else {
    this.version.patch += 1;
  }
  
  // Add change record
  if (changeDescription) {
    this.version.changelog.push(changeDescription);
  }
  
  return this.save();
};

module.exports = mongoose.model('Report', ReportSchema); 