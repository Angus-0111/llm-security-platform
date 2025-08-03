const mongoose = require('mongoose');

// KnowledgeBase Schema - Knowledge base content storage
const KnowledgeBaseSchema = new mongoose.Schema({
  // Basic information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
    index: true
  },
  
  subtitle: {
    type: String,
    trim: true,
    maxlength: 500
  },
  
  // Content classification
  category: {
    type: String,
    required: true,
    enum: [
      'attack_technique',     // Attack techniques
      'defense_method',       // Defense methods
      'case_study',          // Case studies
      'best_practice',       // Best practices
      'research_paper',      // Research papers
      'tutorial',            // Tutorial guides
      'tool_resource',       // Tool resources
      'news_article',        // News articles
      'regulation',          // Regulations and policies
      'standard'             // Standards and specifications
    ]
  },
  
  subcategory: {
    type: String,
    enum: [
      // Attack technique subcategories
      'prompt_injection', 'jailbreak', 'adversarial_attack', 'data_poisoning',
      'model_extraction', 'privacy_attack', 'backdoor_attack',
      
      // Defense method subcategories
      'input_validation', 'output_filtering', 'model_alignment', 'monitoring',
      'detection_system', 'access_control', 'encryption',
      
      // Education subcategories
      'k12_education', 'higher_education', 'professional_training',
      'public_awareness', 'teacher_training',
      
      // Technical subcategories
      'nlp_security', 'ai_safety', 'ethics', 'privacy', 'governance'
    ]
  },
  
  // Content type
  contentType: {
    type: String,
    required: true,
    enum: [
      'article',             // Article
      'video',              // Video
      'tutorial',           // Tutorial
      'research_paper',     // Research paper
      'presentation',       // Presentation document
      'code_example',       // Code example
      'dataset',            // Dataset
      'tool',               // Tool
      'checklist',          // Checklist
      'guideline',          // Guidelines
      'faq',                // FAQ
      'glossary'            // Glossary
    ]
  },
  
  // Main content
  content: {
    summary: {
      type: String,
      required: true,
      maxlength: 1000
    },
    
    fullContent: {
      type: String,
      maxlength: 50000
    },
    
    keyPoints: [String],
    
    technicalDetails: {
      type: String,
      maxlength: 20000
    },
    
    codeSnippets: [{
      language: String,
      code: String,
      description: String
    }],
    
    examples: [{
      title: String,
      description: String,
      details: String
    }]
  },
  
  // Education-related information
  educationalInfo: {
    // Education level
    targetAudience: {
      type: String,
      enum: ['k12', 'undergraduate', 'graduate', 'professional', 'researcher', 'general_public'],
      required: true
    },
    
    // Difficulty level
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    
    // Learning objectives
    learningObjectives: [String],
    
    // Prerequisites
    prerequisites: [String],
    
    // Learning time
    estimatedTime: {
      reading: Number,    // Reading time (minutes)
      practice: Number,   // Practice time (minutes)
      total: Number       // Total time (minutes)
    },
    
    // Course associations
    relatedCourses: [String],
    
    // Assessment methods
    assessmentMethods: [String]
  },
  
  // Technical information
  technicalInfo: {
    // Related technology stack
    technologies: [{
      type: String,
      enum: ['python', 'javascript', 'java', 'cpp', 'tensorflow', 'pytorch', 
             'transformers', 'openai_api', 'llama', 'bert', 'gpt', 'other']
    }],
    
    // Related models
    relatedModels: [String],
    
    // Tools and frameworks
    toolsFrameworks: [String],
    
    // Datasets
    datasets: [{
      name: String,
      description: String,
      url: String,
      size: String
    }],
    
    // Performance metrics
    metrics: [{
      name: String,
      value: String,
      description: String
    }]
  },
  
  // Security-related information
  securityInfo: {
    // Threat types
    threatTypes: [{
      type: String,
      enum: ['confidentiality', 'integrity', 'availability', 'privacy', 'safety']
    }],
    
    // Attack vectors
    attackVectors: [String],
    
    // Impact assessment
    impactAssessment: {
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      likelihood: {
        type: String,
        enum: ['rare', 'unlikely', 'possible', 'likely', 'almost_certain']
      },
      scope: String
    },
    
    // Mitigation strategies
    mitigationStrategies: [String],
    
    // Detection methods
    detectionMethods: [String]
  },
  
  // Source information
  sourceInfo: {
    // Author information
    authors: [{
      name: String,
      affiliation: String,
      email: String,
      orcid: String
    }],
    
    // Source details
    source: {
      type: String,
      enum: ['academic_paper', 'blog_post', 'conference_talk', 'workshop', 
             'company_report', 'government_document', 'community_content', 'original'],
      default: 'original'
    },
    
    // Publication information
    publication: {
      venue: String,        // Publication venue
      date: Date,          // Publication date
      volume: String,      // Volume number
      pages: String,       // Page numbers
      doi: String,         // DOI
      isbn: String,        // ISBN
      issn: String         // ISSN
    },
    
    // External links
    externalLinks: [{
      type: {
        type: String,
        enum: ['paper', 'code', 'demo', 'dataset', 'video', 'slides', 'blog', 'official']
      },
      url: String,
      description: String
    }],
    
    // Citation information
    citations: {
      citationCount: Number,
      citationStyle: String,
      bibtex: String
    }
  },
  
  // Quality and verification
  quality: {
    // Verification status
    verificationStatus: {
      type: String,
      enum: ['unverified', 'peer_reviewed', 'expert_verified', 'community_verified'],
      default: 'unverified'
    },
    
    // Accuracy rating
    accuracyRating: {
      type: Number,
      min: 1,
      max: 5
    },
    
    // Usefulness rating
    usefulnessRating: {
      type: Number,
      min: 1,
      max: 5
    },
    
    // Relevancy status
    relevancyStatus: {
      type: String,
      enum: ['current', 'recent', 'outdated', 'archived'],
      default: 'current'
    },
    
    // Review information
    reviewInfo: {
      reviewer: String,
      reviewDate: Date,
      reviewNotes: String,
      approved: Boolean
    }
  },
  
  // Interaction data
  engagement: {
    viewCount: {
      type: Number,
      default: 0
    },
    
    downloadCount: {
      type: Number,
      default: 0
    },
    
    shareCount: {
      type: Number,
      default: 0
    },
    
    ratings: [{
      userId: String,
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      date: Date
    }],
    
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  
  // Relationships and tags
  relationships: {
    // Related items
    relatedItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeBase'
    }],
    
    // Prerequisites
    prerequisites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeBase'
    }],
    
    // Follow-up reading
    followUp: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KnowledgeBase'
    }]
  },
  
  // Tags and metadata
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  keywords: [String],
  
  // Access control
  accessControl: {
    isPublic: {
      type: Boolean,
      default: true
    },
    
    accessLevel: {
      type: String,
      enum: ['public', 'registered', 'verified', 'premium', 'restricted'],
      default: 'public'
    },
    
    allowedRoles: [{
      type: String,
      enum: ['student', 'educator', 'researcher', 'developer', 'admin']
    }]
  },
  
  // Multi-language support
  language: {
    primary: {
      type: String,
      default: 'en',
      enum: ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'other']
    },
    
    translations: [{
      language: String,
      title: String,
      summary: String,
      content: String
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
    changelog: [String]
  },
  
  // Status management
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'archived', 'deprecated'],
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
  },
  
  lastReviewedAt: Date,
  
  publishedAt: Date
});

// Compound index design
KnowledgeBaseSchema.index({ category: 1, subcategory: 1 });
KnowledgeBaseSchema.index({ title: 'text', 'content.summary': 'text', tags: 'text' });
KnowledgeBaseSchema.index({ 'educationalInfo.targetAudience': 1, 'educationalInfo.difficultyLevel': 1 });
KnowledgeBaseSchema.index({ status: 1, 'accessControl.isPublic': 1 });
KnowledgeBaseSchema.index({ 'quality.verificationStatus': 1, 'quality.accuracyRating': -1 });
KnowledgeBaseSchema.index({ createdAt: -1 });
KnowledgeBaseSchema.index({ 'engagement.viewCount': -1 });

// Virtual field - Average rating
KnowledgeBaseSchema.virtual('averageRating').get(function() {
  if (this.engagement.ratings.length === 0) return 0;
  const sum = this.engagement.ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return (sum / this.engagement.ratings.length).toFixed(1);
});

// Virtual field - Version string
KnowledgeBaseSchema.virtual('versionString').get(function() {
  return `${this.version.major}.${this.version.minor}.${this.version.patch}`;
});

// Virtual field - Estimated reading time
KnowledgeBaseSchema.virtual('estimatedReadingTime').get(function() {
  if (this.educationalInfo.estimatedTime && this.educationalInfo.estimatedTime.total) {
    return this.educationalInfo.estimatedTime.total;
  }
  
  // Estimate based on content length (average 200 words/minute)
  const wordCount = ((this.content.fullContent || '') + (this.content.summary || '')).split(' ').length;
  return Math.ceil(wordCount / 200);
});

// Middleware - Pre-save processing
KnowledgeBaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-generate version info
  if (this.isNew) {
    this.version = { major: 1, minor: 0, patch: 0 };
  }
  
  // Set publication time
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  // Auto-calculate total learning time
  if (this.educationalInfo.estimatedTime) {
    const { reading, practice } = this.educationalInfo.estimatedTime;
    this.educationalInfo.estimatedTime.total = (reading || 0) + (practice || 0);
  }
  
  next();
});

// Static method - Category statistics
KnowledgeBaseSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    { $match: { status: 'published', 'accessControl.isPublic': true } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgRating: { $avg: '$quality.accuracyRating' },
        totalViews: { $sum: '$engagement.viewCount' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

// Static method - Recommended content
KnowledgeBaseSchema.statics.getRecommendations = function(userId, category, limit = 5) {
  return this.find({
    status: 'published',
    'accessControl.isPublic': true,
    category: category
  })
  .sort({ 'engagement.viewCount': -1, 'quality.accuracyRating': -1 })
  .limit(limit)
  .select('title content.summary category educationalInfo.difficultyLevel engagement.viewCount');
};

// Static method - Search content
KnowledgeBaseSchema.statics.searchContent = function(query, filters = {}) {
  const searchCriteria = {
    $text: { $search: query },
    status: 'published',
    'accessControl.isPublic': true,
    ...filters
  };
  
  return this.find(searchCriteria, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .populate('relationships.relatedItems', 'title category');
};

// Instance method - Increase view count
KnowledgeBaseSchema.methods.incrementView = function() {
  this.engagement.viewCount += 1;
  return this.save();
};

// Instance method - Add rating
KnowledgeBaseSchema.methods.addRating = function(userId, rating, comment = '') {
  // Check if already rated
  const existingRating = this.engagement.ratings.find(r => r.userId === userId);
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.comment = comment;
    existingRating.date = new Date();
  } else {
    this.engagement.ratings.push({
      userId,
      rating,
      comment,
      date: new Date()
    });
  }
  
  return this.save();
};

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema); 