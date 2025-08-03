const mongoose = require('mongoose');

// NewsIncident Schema - News incident aggregation storage
const NewsIncidentSchema = new mongoose.Schema({
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
    index: true
  },
  
  headline: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Content information
  content: {
    summary: {
      type: String,
      required: true,
      maxlength: 2000
    },
    
    fullContent: {
      type: String,
      maxlength: 50000
    },
    
    excerpt: {
      type: String,
      maxlength: 500
    },
    
    keyPoints: [String],
    
    quotes: [{
      text: String,
      speaker: String,
      context: String
    }]
  },
  
  // Event classification
  incidentType: {
    type: String,
    required: true,
    enum: [
      'security_breach',        // Security breach
      'data_leak',             // Data leakage
      'prompt_injection',      // Prompt injection
      'jailbreak_incident',    // Jailbreak incident
      'misinformation',        // Misinformation
      'privacy_violation',     // Privacy violation
      'bias_discrimination',   // Bias and discrimination
      'harmful_content',       // Harmful content
      'system_failure',        // System failure
      'research_finding',      // Research finding
      'policy_update',         // Policy update
      'legal_case',           // Legal case
      'industry_news',        // Industry news
      'educational_incident'   // Educational incident
    ]
  },
  
  category: {
    type: String,
    required: true,
    enum: [
      'incident_report',       // Incident report
      'vulnerability',         // Vulnerability discovery
      'attack_case',          // Attack case
      'defense_success',      // Defense success
      'research_paper',       // Research paper
      'policy_news',          // Policy news
      'industry_update',      // Industry update
      'court_case',           // Court case
      'awareness_campaign'    // Awareness campaign
    ]
  },
  
  subcategory: {
    type: String,
    enum: [
      'llm_security', 'ai_safety', 'privacy', 'ethics', 'governance',
      'education', 'healthcare', 'finance', 'legal', 'government',
      'enterprise', 'research', 'consumer', 'student_impact'
    ]
  },
  
  // Severity assessment
  severity: {
    level: {
      type: String,
      enum: ['informational', 'low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 5
    },
    
    impactScope: {
      type: String,
      enum: ['individual', 'organization', 'industry', 'national', 'global']
    },
    
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'immediate']
    }
  },
  
  // Educational relevance
  educationRelevance: {
    isEducationRelated: {
      type: Boolean,
      required: true,
      default: false,
      index: true
    },
    
    educationContext: {
      type: String,
      maxlength: 1000
    },
    
    educationLevel: [{
      type: String,
      enum: ['k12', 'higher_education', 'professional_training', 'public_education']
    }],
    
    affectedInstitutions: [String],
    
    studentImpact: {
      estimated: Number,
      severity: {
        type: String,
        enum: ['minimal', 'low', 'moderate', 'high', 'severe']
      },
      description: String
    },
    
    teachingImplications: [String],
    
    curriculumRelevance: [String]
  },
  
  // Source information
  sourceInfo: {
    // Primary source
    primarySource: {
      name: String,
      type: {
        type: String,
        enum: ['news_outlet', 'research_org', 'government', 'company', 'individual', 'academic', 'blog']
      },
      url: String,
      credibility: {
        type: String,
        enum: ['high', 'medium', 'low', 'unverified']
      }
    },
    
    // Original source
    originalSource: {
      url: String,
      date: Date
    },
    
    // Additional sources
    additionalSources: [{
      name: String,
      url: String,
      type: String,
      relevance: String
    }],
    
    // Reporter information
    reporters: [{
      name: String,
      affiliation: String,
      expertise: String
    }]
  },
  
  // Timeline information
  timeline: {
    incidentDate: {
      type: Date,
      index: true
    },
    
    discoveryDate: Date,
    
    reportDate: {
      type: Date,
      required: true
    },
    
    publishDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    
    lastUpdateDate: Date,
    
    timelineEvents: [{
      date: Date,
      event: String,
      source: String
    }]
  },
  
  // Geographic and scope information
  geographic: {
    countries: [String],
    
    regions: [String],
    
    cities: [String],
    
    scope: {
      type: String,
      enum: ['local', 'regional', 'national', 'international', 'global']
    }
  },
  
  // Involved entities
  entities: {
    // Affected organizations
    affectedOrganizations: [{
      name: String,
      type: {
        type: String,
        enum: ['company', 'university', 'government', 'ngo', 'school_district', 'hospital']
      },
      role: String,
      impact: String
    }],
    
    // Involved technologies/products
    technologies: [{
      name: String,
      type: {
        type: String,
        enum: ['llm_model', 'ai_system', 'platform', 'api', 'application']
      },
      vendor: String,
      version: String
    }],
    
    // Involved individuals
    individuals: [{
      name: String,
      role: String,
      affiliation: String,
      involvement: String
    }]
  },
  
  // Technical details
  technicalDetails: {
    // Involved LLMs
    llmModels: [{
      name: String,
      provider: String,
      version: String,
      vulnerability: String
    }],
    
    // Attack vectors
    attackVectors: [String],
    
    // Vulnerability information
    vulnerabilities: [{
      cveId: String,
      description: String,
      severity: String,
      affected: String
    }],
    
    // Technical description
    technicalDescription: String,
    
    // Exploitation method
    exploitMethod: String,
    
    // Fix status
    fixStatus: {
      type: String,
      enum: ['not_started', 'in_progress', 'partial', 'complete', 'not_applicable']
    }
  },
  
  // Impact analysis
  impact: {
    // Direct impact
    immediate: {
      usersAffected: Number,
      dataCompromised: String,
      servicesDisrupted: [String],
      financialLoss: Number
    },
    
    // Long-term impact
    longTerm: {
      reputationDamage: String,
      regulatoryChanges: [String],
      industryImpact: String,
      trustImpact: String
    },
    
    // Educational impact
    educational: {
      studentsAffected: Number,
      institutionsAffected: Number,
      learningDisruption: String,
      policyChanges: [String]
    }
  },
  
  // Response and mitigation
  response: {
    // Official response
    officialResponse: [{
      organization: String,
      statement: String,
      date: Date,
      actions: [String]
    }],
    
    // Mitigation actions
    mitigationActions: [{
      action: String,
      implementer: String,
      timeline: String,
      effectiveness: String
    }],
    
    // Regulatory response
    regulatoryResponse: [{
      authority: String,
      action: String,
      date: Date,
      requirements: [String]
    }]
  },
  
  // Verification and credibility
  verification: {
    verificationStatus: {
      type: String,
      enum: ['unverified', 'partially_verified', 'verified', 'disputed'],
      default: 'unverified'
    },
    
    verifiedBy: [String],
    
    verificationDate: Date,
    
    credibilityScore: {
      type: Number,
      min: 0,
      max: 10
    },
    
    factCheckResults: [{
      checker: String,
      result: String,
      url: String,
      date: Date
    }],
    
    disputedClaims: [String]
  },
  
  // Relevance and associations
  relationships: {
    // Related incidents
    relatedIncidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsIncident'
    }],
    
    // Related attack data
    relatedAttacks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttackData'
    }],
    
    // Related knowledge base entries
    relatedKnowledge: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeBase'
    }],
    
    // Parent-child incident relationships
    parentIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsIncident'
    },
    
    childIncidents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewsIncident'
    }]
  },
  
  // Tags and metadata
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  keywords: [String],
  
  // Media content
  media: {
    images: [{
      url: String,
      caption: String,
      credit: String
    }],
    
    videos: [{
      url: String,
      title: String,
      duration: Number
    }],
    
    documents: [{
      title: String,
      url: String,
      type: String,
      description: String
    }]
  },
  
  // Statistics and analytics
  analytics: {
    viewCount: {
      type: Number,
      default: 0
    },
    
    shareCount: {
      type: Number,
      default: 0
    },
    
    commentCount: {
      type: Number,
      default: 0
    },
    
    sentiment: {
      type: String,
      enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive']
    },
    
    trending: {
      type: Boolean,
      default: false
    }
  },
  
  // Status management
  status: {
    type: String,
    enum: ['draft', 'under_review', 'published', 'updated', 'archived'],
    default: 'draft'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index design
NewsIncidentSchema.index({ incidentType: 1, category: 1 });
NewsIncidentSchema.index({ 'educationRelevance.isEducationRelated': 1, 'timeline.publishDate': -1 });
NewsIncidentSchema.index({ 'severity.level': 1, 'severity.score': -1 });
NewsIncidentSchema.index({ 'timeline.incidentDate': -1 });
NewsIncidentSchema.index({ status: 1, 'analytics.trending': -1 });
NewsIncidentSchema.index({ tags: 1 });
NewsIncidentSchema.index({ title: 'text', 'content.summary': 'text', tags: 'text' });

// Virtual field - Time relevance
NewsIncidentSchema.virtual('timeRelevance').get(function() {
  const now = new Date();
  const incidentDate = this.timeline.incidentDate || this.timeline.publishDate;
  const daysDiff = (now - incidentDate) / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= 7) return 'breaking';
  if (daysDiff <= 30) return 'recent';
  if (daysDiff <= 90) return 'current';
  if (daysDiff <= 365) return 'past_year';
  return 'historical';
});

// Virtual field - Educational impact score
NewsIncidentSchema.virtual('educationImpactScore').get(function() {
  if (!this.educationRelevance.isEducationRelated) return 0;
  
  let score = 0;
  
  // Based on impact severity
  const severityScores = { 'minimal': 1, 'low': 2, 'moderate': 4, 'high': 7, 'severe': 10 };
  score += severityScores[this.educationRelevance.studentImpact.severity] || 0;
  
  // Based on impact scope
  const scopeScores = { 'individual': 1, 'organization': 3, 'industry': 6, 'national': 8, 'global': 10 };
  score += (scopeScores[this.severity.impactScope] || 0) * 0.3;
  
  return Math.min(10, score);
});

// Middleware - Pre-save processing
NewsIncidentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set timeline events
  if (this.isNew && this.timeline.incidentDate) {
    this.timeline.timelineEvents = this.timeline.timelineEvents || [];
    this.timeline.timelineEvents.push({
      date: this.timeline.incidentDate,
      event: 'Incident occurred',
      source: 'system'
    });
  }
  
  // Auto-calculate severity score
  if (!this.severity.score) {
    const levelScores = { 'informational': 2, 'low': 3, 'medium': 5, 'high': 7, 'critical': 9 };
    this.severity.score = levelScores[this.severity.level] || 5;
  }
  
  next();
});

// Static method - Get education-related incidents
NewsIncidentSchema.statics.getEducationRelatedIncidents = function(filters = {}) {
  const query = {
    'educationRelevance.isEducationRelated': true,
    status: 'published',
    ...filters
  };
  
  return this.find(query)
    .sort({ 'timeline.publishDate': -1 })
    .populate('relationships.relatedKnowledge', 'title category')
    .populate('relationships.relatedAttacks', 'name attackType');
};

// Static method - Get trending incidents
NewsIncidentSchema.statics.getTrendingIncidents = function(limit = 10) {
  return this.find({
    status: 'published',
    'analytics.trending': true
  })
  .sort({ 'analytics.viewCount': -1, 'timeline.publishDate': -1 })
  .limit(limit);
};

// Static method - Statistics by time range
NewsIncidentSchema.statics.getIncidentStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'timeline.publishDate': { $gte: startDate, $lte: endDate },
        status: 'published'
      }
    },
    {
      $group: {
        _id: {
          type: '$incidentType',
          severity: '$severity.level'
        },
        count: { $sum: 1 },
        avgImpactScore: { $avg: '$severity.score' },
        educationRelated: {
          $sum: { $cond: ['$educationRelevance.isEducationRelated', 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method - Search incidents
NewsIncidentSchema.statics.searchIncidents = function(query, filters = {}) {
  const searchCriteria = {
    $text: { $search: query },
    status: 'published',
    ...filters
  };
  
  return this.find(searchCriteria, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, 'timeline.publishDate': -1 })
    .populate('relationships.relatedKnowledge', 'title category');
};

// Instance method - Increase view count
NewsIncidentSchema.methods.incrementView = function() {
  this.analytics.viewCount += 1;
  
  // Check if becomes trending
  if (this.analytics.viewCount > 100 && this.timeRelevance === 'recent') {
    this.analytics.trending = true;
  }
  
  return this.save();
};

// Instance method - Add related incident
NewsIncidentSchema.methods.addRelatedIncident = function(incidentId, relationshipType = 'related') {
  if (!this.relationships.relatedIncidents.includes(incidentId)) {
    this.relationships.relatedIncidents.push(incidentId);
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('NewsIncident', NewsIncidentSchema); 