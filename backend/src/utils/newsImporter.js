const NewsIncident = require('../models/NewsIncident');

// Template for creating news incidents from basic information
const createNewsIncidentFromTemplate = (basicInfo) => {
  const {
    title,
    headline,
    summary,
    fullContent,
    incidentDate,
    location,
    llmModels,
    attackVectors,
    severity,
    studentsAffected,
    institutionsAffected
  } = basicInfo;

  return {
    title: title,
    headline: headline || title,
    content: {
      summary: summary,
      fullContent: fullContent || summary,
      excerpt: summary.substring(0, 200) + '...',
      keyPoints: generateKeyPoints(summary),
      quotes: []
    },
    incidentType: 'educational_incident',
    category: 'incident_report',
    subcategory: 'education',
    severity: {
      level: severity || 'medium',
      score: getSeverityScore(severity),
      impactScope: 'national',
      urgency: severity === 'high' || severity === 'critical' ? 'high' : 'medium'
    },
    educationRelevance: {
      isEducationRelated: true,
      educationContext: `This incident demonstrates ${severity || 'medium'} level security concerns in educational AI usage.`,
      educationLevel: ['k12'],
      affectedInstitutions: [`Institutions in ${location}`],
      studentImpact: {
        estimated: studentsAffected || 100,
        severity: getStudentImpactSeverity(severity),
        description: `Students affected by ${title.toLowerCase()}`
      },
      teachingImplications: [
        'Need for AI-resistant assessment methods',
        'Enhanced monitoring and detection systems',
        'Updated academic integrity policies'
      ],
      curriculumRelevance: [
        'Academic integrity education',
        'Digital literacy and AI awareness',
        'Ethical use of technology in education'
      ]
    },
    sourceInfo: {
      primarySource: {
        name: 'AI Incident Database',
        type: 'research_org',
        url: 'https://incidentdatabase.ai',
        credibility: 'high'
      },
      additionalSources: [],
      reporters: []
    },
    timeline: {
      incidentDate: new Date(incidentDate),
      discoveryDate: new Date(incidentDate),
      reportDate: new Date(),
      publishDate: new Date(),
      lastUpdateDate: new Date(),
      timelineEvents: [
        {
          date: new Date(incidentDate),
          event: 'Incident occurred',
          source: 'system'
        },
        {
          date: new Date(),
          event: 'Added to LLM Security Platform',
          source: 'system'
        }
      ]
    },
    geographic: {
      countries: ['Global'],
      regions: ['Global'],
      cities: [location],
      scope: 'national'
    },
    entities: {
      affectedOrganizations: [
        {
          name: 'Educational Institutions',
          type: 'school_district',
          role: 'Affected organizations',
          impact: 'Security compromise'
        }
      ],
      technologies: llmModels.map(model => ({
        name: model.name,
        type: 'llm_model',
        vendor: model.provider,
        version: model.version
      })),
      individuals: []
    },
    technicalDetails: {
      llmModels: llmModels,
      attackVectors: attackVectors,
      vulnerabilities: [
        {
          cveId: 'N/A',
          description: 'Traditional security vulnerable to AI-powered attacks',
          severity: severity || 'medium',
          affected: 'Educational systems'
        }
      ],
      technicalDescription: `Students exploited AI tools to bypass traditional security measures.`,
      exploitMethod: 'AI tool exploitation',
      fixStatus: 'in_progress'
    },
    impact: {
      immediate: {
        usersAffected: studentsAffected || 100,
        dataCompromised: 'Educational data',
        servicesDisrupted: ['Educational systems'],
        financialLoss: 0
      },
      longTerm: {
        reputationDamage: 'Loss of trust in educational systems',
        regulatoryChanges: ['Enhanced security policies'],
        industryImpact: 'Increased focus on AI security',
        trustImpact: 'Decreased confidence in traditional methods'
      },
      educational: {
        studentsAffected: studentsAffected || 100,
        institutionsAffected: institutionsAffected || 10,
        learningDisruption: 'Compromised academic integrity',
        policyChanges: ['Enhanced monitoring', 'AI usage policies']
      }
    },
    response: {
      officialResponse: [
        {
          organization: 'Educational Authorities',
          statement: 'Investigating the incident and developing new security measures',
          date: new Date(),
          actions: ['Enhanced monitoring', 'Policy review']
        }
      ],
      mitigationActions: [
        {
          action: 'Enhanced security monitoring',
          implementer: 'Educational authorities',
          timeline: 'Immediate',
          effectiveness: 'High'
        }
      ],
      regulatoryResponse: [
        {
          authority: 'Educational Authorities',
          action: 'Policy review for AI usage',
          date: new Date(),
          requirements: ['Enhanced security measures', 'AI usage restrictions']
        }
      ]
    },
    verification: {
      verificationStatus: 'verified',
      verifiedBy: ['AI Incident Database'],
      verificationDate: new Date(),
      credibilityScore: 8,
      factCheckResults: [],
      disputedClaims: []
    },
    relationships: {
      relatedIncidents: [],
      relatedAttacks: [],
      relatedKnowledge: [],
      parentIncident: null,
      childIncidents: []
    },
    tags: generateTags(title, llmModels),
    keywords: generateKeywords(title, llmModels),
    media: {
      images: [],
      videos: [],
      documents: []
    },
    analytics: {
      viewCount: 0,
      shareCount: 0,
      commentCount: 0,
      sentiment: 'negative',
      trending: false
    },
    status: 'published'
  };
};

// Helper functions
const generateKeyPoints = (summary) => {
  const sentences = summary.split('. ').filter(s => s.length > 10);
  return sentences.slice(0, 6).map(s => s.trim());
};

const getSeverityScore = (level) => {
  const scores = { 'critical': 9, 'high': 7, 'medium': 5, 'low': 3 };
  return scores[level] || 5;
};

const getStudentImpactSeverity = (level) => {
  const severityMap = { 'critical': 'severe', 'high': 'high', 'medium': 'moderate', 'low': 'low' };
  return severityMap[level] || 'moderate';
};

const generateTags = (title, llmModels) => {
  const tags = ['academic_integrity', 'ai_cheating', 'education_security', 'llm_misuse'];
  llmModels.forEach(model => {
    tags.push(model.name.toLowerCase().replace(/\s+/g, '_'));
  });
  return tags;
};

const generateKeywords = (title, llmModels) => {
  const keywords = ['academic dishonesty', 'AI cheating', 'exam security'];
  llmModels.forEach(model => {
    keywords.push(model.name);
  });
  return keywords;
};

// Batch import function
const batchImportNews = async (newsList) => {
  const results = [];
  
  for (const news of newsList) {
    try {
      const incidentData = createNewsIncidentFromTemplate(news);
      const incident = new NewsIncident(incidentData);
      const savedIncident = await incident.save();
      results.push({
        success: true,
        title: savedIncident.title,
        id: savedIncident._id
      });
      console.log(` Imported: ${savedIncident.title}`);
    } catch (error) {
      results.push({
        success: false,
        title: news.title,
        error: error.message
      });
      console.log(`❌ Failed to import: ${news.title} - ${error.message}`);
    }
  }
  
  return results;
};

// Example usage function
const importExampleNews = async () => {
  const exampleNews = [
    {
      title: "Students Use AI to Generate Essays in University Course",
      summary: "Multiple university students were caught using AI tools to generate essays and assignments, raising concerns about academic integrity in higher education.",
      incidentDate: "2025-01-15",
      location: "United States",
      llmModels: [
        { name: "ChatGPT", provider: "OpenAI", version: "GPT-4", vulnerability: "Essay generation" },
        { name: "Claude", provider: "Anthropic", version: "Claude-3", vulnerability: "Essay generation" }
      ],
      attackVectors: [
        "AI-generated essay submission",
        "Assignment completion automation",
        "Academic dishonesty"
      ],
      severity: "high",
      studentsAffected: 50,
      institutionsAffected: 5
    },
    {
      title: "AI Chatbot Provides Inappropriate Answers to Students",
      summary: "An educational AI chatbot was found to provide inappropriate and potentially harmful responses to student queries, raising safety concerns in educational AI systems.",
      incidentDate: "2025-02-20",
      location: "United Kingdom",
      llmModels: [
        { name: "Educational AI", provider: "EdTech Company", version: "v2.1", vulnerability: "Inappropriate responses" }
      ],
      attackVectors: [
        "Prompt manipulation",
        "Inappropriate content generation",
        "Safety bypass"
      ],
      severity: "medium",
      studentsAffected: 200,
      institutionsAffected: 15
    }
  ];
  
  return await batchImportNews(exampleNews);
};

module.exports = {
  createNewsIncidentFromTemplate,
  batchImportNews,
  importExampleNews
}; 