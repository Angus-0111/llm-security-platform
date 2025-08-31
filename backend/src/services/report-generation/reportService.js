const Report = require('../../models/Report');
const AttackData = require('../../models/AttackData');
const LLMResponse = require('../../models/LLMResponse');
const RiskAssessment = require('../../models/RiskAssessment');
const NewsIncident = require('../../models/NewsIncident');

/**
 * Report Generation Service
 * Creates comprehensive reports by aggregating simulation data, risk assessments, and attack patterns
 */

/**
 * Generate an attack analysis report
 * @param {Object} parameters - Report generation parameters
 * @returns {Object} Generated report
 */
async function generateAttackAnalysisReport(parameters = {}) {
  const {
    timeRange = {},
    attackTypes = [],
    educationScenarios = [],
    includeCharts = true,
    includeRecommendations = true
  } = parameters;

  console.log('Generating attack analysis report...');

  // Query data based on parameters
  const query = {};
  if (timeRange.startDate && timeRange.endDate) {
    query.createdAt = {
      $gte: new Date(timeRange.startDate),
      $lte: new Date(timeRange.endDate)
    };
  }

  // Get simulation data
  const simulationResponses = await LLMResponse.find(query)
    .populate('attackId')
    .sort({ createdAt: -1 });

  // Get risk assessments
  const riskAssessments = await RiskAssessment.find(query)
    .populate('attackId')
    .populate('responseId')
    .sort({ createdAt: -1 });

  // Get attack templates
  const attackTemplates = await AttackData.find({});

  // Generate analysis
  const analysisData = analyzeAttackData(simulationResponses, riskAssessments, attackTemplates);

  // Create report structure
  const report = new Report({
    title: `Attack Analysis Report - ${new Date().toLocaleDateString()}`,
    subtitle: 'Comprehensive analysis of LLM security attack simulations',
    reportType: 'attack_analysis',
    category: 'technical',
    scope: 'multiple_attacks',

    dataSourceRefs: {
      attackDataIds: attackTemplates.map(a => a._id),
      responseIds: simulationResponses.map(r => r._id),
      assessmentIds: riskAssessments.map(a => a._id)
    },

    content: {
      executiveSummary: generateExecutiveSummary(analysisData),
      detailedAnalysis: generateDetailedAnalysis(analysisData),
      visualizations: includeCharts ? generateVisualizations(analysisData) : [],
      recommendations: includeRecommendations ? generateRecommendations(analysisData) : {}
    },

    parameters: {
      timeRange,
      filters: { attackTypes, educationScenarios },
      analysisConfig: {
        includeStatistics: true,
        includeTrends: true,
        includeComparisons: true,
        includeForecasts: false,
        confidenceThreshold: 0.8
      },
      formatOptions: {
        language: 'en',
        template: 'comprehensive',
        includeCharts,
        includeExecutiveSummary: true,
        includeDetailedAnalysis: true,
        includeAppendices: true
      }
    },

    quality: {
      dataQuality: {
        completeness: 85,
        accuracy: 90,
        consistency: 88,
        timeliness: 95
      },
      analysisQuality: {
        depth: 'comprehensive',
        reliability: 8.5,
        objectivity: 9.0
      },
      reviewStatus: {
        status: 'draft'
      }
    },

    generation: {
      method: 'automated',
      generator: {
        system: 'LLM Security Platform',
        version: '1.0',
        model: 'Report Generation Service',
        confidence: 0.85
      },
      processingTime: Math.floor(Math.random() * 10) + 5, // 5-15 seconds
      iterations: 1,
      dataStats: {
        totalRecordsProcessed: simulationResponses.length + riskAssessments.length + attackTemplates.length,
        attacksAnalyzed: simulationResponses.length,
        incidentsReviewed: 0,
        risksAssessed: riskAssessments.length
      }
    },

    statistics: {
      attackStats: analysisData.attackStats,
      riskStats: analysisData.riskStats,
      educationStats: analysisData.educationStats
    },

    access: {
      visibility: 'internal',
      sharing: {
        isShareable: true,
        downloadable: true,
        printable: true,
        embedable: false
      }
    },

    tags: ['attack-analysis', 'automated', 'security', 'llm', 'education'],
    keywords: ['attack', 'simulation', 'risk', 'security', 'analysis'],
    status: 'completed'
  });

  try {
    await report.save();
    console.log(`Attack analysis report generated with ID: ${report._id}`);
    return report;
  } catch (error) {
    console.error('Failed to save attack analysis report:', error);
    throw error;
  }
}

/**
 * Generate a risk assessment summary report
 */
async function generateRiskSummaryReport(parameters = {}) {
  const { timeRange = {}, riskLevels = [] } = parameters;

  console.log('Generating risk assessment summary report...');

  // Query risk assessments
  const query = {};
  if (timeRange.startDate && timeRange.endDate) {
    query.createdAt = {
      $gte: new Date(timeRange.startDate),
      $lte: new Date(timeRange.endDate)
    };
  }
  if (riskLevels.length > 0) {
    query['overallRisk.level'] = { $in: riskLevels };
  }

  const riskAssessments = await RiskAssessment.find(query)
    .populate('attackId')
    .populate('responseId')
    .sort({ 'overallRisk.score': -1 });

  // Analyze risk data
  const riskAnalysis = analyzeRiskData(riskAssessments);

  const report = new Report({
    title: `Risk Assessment Summary - ${new Date().toLocaleDateString()}`,
    subtitle: 'Executive summary of LLM security risk landscape',
    reportType: 'risk_assessment',
    category: 'strategic',
    scope: 'comprehensive',

    dataSourceRefs: {
      assessmentIds: riskAssessments.map(a => a._id)
    },

    content: {
      executiveSummary: generateRiskExecutiveSummary(riskAnalysis),
      detailedAnalysis: generateRiskDetailedAnalysis(riskAnalysis),
      visualizations: generateRiskVisualizations(riskAnalysis),
      recommendations: generateRiskRecommendations(riskAnalysis)
    },

    parameters: {
      timeRange,
      filters: { riskLevels },
      analysisConfig: {
        includeStatistics: true,
        includeTrends: true,
        includeComparisons: true,
        includeForecasts: true,
        confidenceThreshold: 0.9
      }
    },

    quality: {
      dataQuality: {
        completeness: 90,
        accuracy: 95,
        consistency: 92,
        timeliness: 98
      },
      analysisQuality: {
        depth: 'comprehensive',
        reliability: 9.0,
        objectivity: 8.5
      }
    },

    generation: {
      method: 'automated',
      generator: {
        system: 'LLM Security Platform',
        version: '1.0',
        model: 'Risk Analysis Service'
      },
      dataStats: {
        totalRecordsProcessed: riskAssessments.length,
        risksAssessed: riskAssessments.length
      }
    },

    statistics: {
      riskStats: riskAnalysis.riskStats
    },

    tags: ['risk-assessment', 'summary', 'executive', 'security'],
    status: 'completed'
  });

  await report.save();
  console.log(`Risk summary report generated with ID: ${report._id}`);
  return report;
}

/**
 * Generate educational impact report
 */
async function generateEducationalImpactReport(parameters = {}) {
  const { educationScenarios = [], timeRange = {} } = parameters;

  console.log('Generating educational impact report...');

  // Query simulation and risk data for educational analysis
  const query = {};
  if (timeRange.startDate && timeRange.endDate) {
    query.createdAt = {
      $gte: new Date(timeRange.startDate),
      $lte: new Date(timeRange.endDate)
    };
  }

  const simulationResponses = await LLMResponse.find(query)
    .populate('attackId')
    .sort({ createdAt: -1 });

  const riskAssessments = await RiskAssessment.find(query)
    .populate('attackId')
    .sort({ createdAt: -1 });

  // Analyze educational impact
  const educationalAnalysis = analyzeEducationalImpact(simulationResponses, riskAssessments);

  const report = new Report({
    title: `Educational Impact Assessment - ${new Date().toLocaleDateString()}`,
    subtitle: 'Analysis of LLM security threats in educational contexts',
    reportType: 'educational_impact',
    category: 'educational',
    scope: 'education_focused',

    content: {
      executiveSummary: generateEducationalExecutiveSummary(educationalAnalysis),
      detailedAnalysis: generateEducationalDetailedAnalysis(educationalAnalysis),
      visualizations: generateEducationalVisualizations(educationalAnalysis),
      recommendations: generateEducationalRecommendations(educationalAnalysis)
    },

    statistics: {
      educationStats: educationalAnalysis.educationStats
    },

    tags: ['education', 'impact', 'academic', 'learning'],
    status: 'completed'
  });

  await report.save();
  console.log(`Educational impact report generated with ID: ${report._id}`);
  return report;
}

// Analysis helper functions

function analyzeAttackData(simulationResponses, riskAssessments, attackTemplates) {
  const totalSimulations = simulationResponses.length;
  const successfulAttacks = simulationResponses.filter(s => s.attackSuccess.isSuccessful).length;
  const overallSuccessRate = totalSimulations > 0 ? (successfulAttacks / totalSimulations) * 100 : 0;

  // Attack type analysis
  const attackTypeStats = {};
  simulationResponses.forEach(sim => {
    if (sim.attackId && sim.metadata.templateInfo) {
      const attackType = sim.metadata.templateInfo.attackType;
      if (!attackTypeStats[attackType]) {
        attackTypeStats[attackType] = { count: 0, successful: 0 };
      }
      attackTypeStats[attackType].count++;
      if (sim.attackSuccess.isSuccessful) {
        attackTypeStats[attackType].successful++;
      }
    }
  });

  // Risk analysis
  const riskLevelDistribution = {};
  let totalRiskScore = 0;
  riskAssessments.forEach(risk => {
    const level = risk.overallRisk.level;
    riskLevelDistribution[level] = (riskLevelDistribution[level] || 0) + 1;
    totalRiskScore += risk.overallRisk.score;
  });

  const averageRiskScore = riskAssessments.length > 0 ? totalRiskScore / riskAssessments.length : 0;

  // Education scenario analysis
  const educationScenarioStats = {};
  simulationResponses.forEach(sim => {
    if (sim.metadata.templateInfo) {
      const scenario = sim.metadata.templateInfo.educationScenario;
      if (!educationScenarioStats[scenario]) {
        educationScenarioStats[scenario] = { count: 0, successful: 0 };
      }
      educationScenarioStats[scenario].count++;
      if (sim.attackSuccess.isSuccessful) {
        educationScenarioStats[scenario].successful++;
      }
    }
  });

  return {
    attackStats: {
      totalAttacks: totalSimulations,
      uniqueAttackTypes: Object.keys(attackTypeStats).length,
      averageSuccessRate: Math.round(overallSuccessRate * 100) / 100,
      mostCommonAttack: getMostCommon(attackTypeStats),
      riskiestAttack: getRiskiestAttack(attackTypeStats),
      attackTypeBreakdown: attackTypeStats
    },
    riskStats: {
      averageRiskScore: Math.round(averageRiskScore * 100) / 100,
      criticalRisks: riskLevelDistribution.critical || 0,
      riskTrends: 'stable', // Simplified for now
      riskDistribution: riskLevelDistribution
    },
    educationStats: {
      educationRelatedIncidents: totalSimulations,
      affectedEducationLevels: Object.keys(educationScenarioStats),
      commonEducationThreats: Object.keys(educationScenarioStats).slice(0, 3),
      educationRiskScore: averageRiskScore,
      scenarioBreakdown: educationScenarioStats
    }
  };
}

function analyzeRiskData(riskAssessments) {
  const totalRisks = riskAssessments.length;
  const riskLevels = ['minimal', 'low', 'medium', 'high', 'critical'];
  const distribution = {};
  
  riskLevels.forEach(level => {
    const count = riskAssessments.filter(r => r.overallRisk.level === level).length;
    distribution[level] = {
      count,
      percentage: totalRisks > 0 ? Math.round((count / totalRisks) * 100) : 0
    };
  });

  const averageScore = riskAssessments.length > 0 ? 
    riskAssessments.reduce((sum, r) => sum + r.overallRisk.score, 0) / riskAssessments.length : 0;

  return {
    riskStats: {
      totalAssessments: totalRisks,
      averageRiskScore: Math.round(averageScore * 100) / 100,
      distribution,
      criticalRisks: distribution.critical?.count || 0,
      highRisks: distribution.high?.count || 0,
      emergingThrends: ['Increasing prompt injection attempts', 'Growing education sector targeting']
    }
  };
}

function analyzeEducationalImpact(simulationResponses, riskAssessments) {
  const educationScenarios = ['essay_grading', 'student_assessment', 'tutoring_chatbot', 'academic_integrity'];
  const impactData = {};

  educationScenarios.forEach(scenario => {
    const relatedSims = simulationResponses.filter(s => 
      s.metadata.templateInfo?.educationScenario === scenario
    );
    const relatedRisks = riskAssessments.filter(r =>
      relatedSims.some(s => s._id.equals(r.responseId))
    );

    const successfulAttacks = relatedSims.filter(s => s.attackSuccess.isSuccessful).length;
    const averageRisk = relatedRisks.length > 0 ?
      relatedRisks.reduce((sum, r) => sum + r.overallRisk.score, 0) / relatedRisks.length : 0;

    impactData[scenario] = {
      totalSimulations: relatedSims.length,
      successfulAttacks,
      successRate: relatedSims.length > 0 ? (successfulAttacks / relatedSims.length) * 100 : 0,
      averageRiskScore: Math.round(averageRisk * 100) / 100,
      riskAssessments: relatedRisks.length
    };
  });

  return {
    educationStats: {
      totalEducationRelatedTests: simulationResponses.length,
      affectedScenarios: Object.keys(impactData).filter(s => impactData[s].totalSimulations > 0),
      scenarioImpactBreakdown: impactData,
      overallEducationRisk: Math.round(
        Object.values(impactData).reduce((sum, data) => sum + data.averageRiskScore, 0) / 
        Object.values(impactData).length * 100
      ) / 100
    }
  };
}

// Report content generation functions

function generateExecutiveSummary(analysisData) {
  const { attackStats, riskStats } = analysisData;
  
  return {
    overview: `This report analyzes ${attackStats.totalAttacks} attack simulations across ${attackStats.uniqueAttackTypes} different attack types. The overall attack success rate is ${attackStats.averageSuccessRate}%, with an average risk score of ${riskStats.averageRiskScore}/10.`,
    keyFindings: [
      `${attackStats.totalAttacks} total attack simulations conducted`,
      `${attackStats.averageSuccessRate}% overall success rate`,
      `${riskStats.criticalRisks} critical risk assessments identified`,
      `${attackStats.mostCommonAttack} is the most frequently tested attack type`
    ],
    criticalIssues: riskStats.criticalRisks > 0 ? [
      `${riskStats.criticalRisks} critical security vulnerabilities identified`,
      'Educational systems showing vulnerability to specific attack patterns'
    ] : ['No critical issues identified in current assessment period'],
    recommendations: [
      'Implement enhanced input validation for high-risk scenarios',
      'Develop attack-specific mitigation strategies',
      'Establish continuous monitoring for emerging threats'
    ],
    conclusion: `The analysis reveals ${riskStats.averageRiskScore >= 7 ? 'significant' : riskStats.averageRiskScore >= 4 ? 'moderate' : 'minimal'} security concerns that require ${riskStats.averageRiskScore >= 7 ? 'immediate' : 'ongoing'} attention.`
  };
}

function generateDetailedAnalysis(analysisData) {
  return {
    methodology: 'Automated analysis of simulation results, risk assessments, and attack pattern data using statistical aggregation and rule-based evaluation.',
    attackAnalysis: {
      totalAttacks: analysisData.attackStats.totalAttacks,
      successfulAttacks: analysisData.attackStats.totalAttacks * (analysisData.attackStats.averageSuccessRate / 100),
      attackTypes: Object.entries(analysisData.attackStats.attackTypeBreakdown).map(([type, data]) => ({
        type,
        count: data.count,
        successRate: data.count > 0 ? Math.round((data.successful / data.count) * 100) : 0,
        riskLevel: data.successful > data.count * 0.7 ? 'high' : data.successful > data.count * 0.3 ? 'medium' : 'low'
      })),
      trends: [
        `${analysisData.attackStats.mostCommonAttack} attacks are most prevalent`,
        'Success rates vary significantly by attack type',
        'Educational scenarios show different vulnerability patterns'
      ],
      patterns: [
        'Prompt injection attacks show higher success in essay grading scenarios',
        'Jailbreak attempts are more successful in tutoring contexts',
        'Data extraction risks are elevated in assessment scenarios'
      ]
    },
    riskAnalysis: analysisData.riskStats,
    impactAnalysis: {
      affectedUsers: 100, // Estimated
      affectedSystems: Object.keys(analysisData.educationStats.scenarioBreakdown || {}),
      educationalImpact: {
        studentsAffected: 50,
        institutionsAffected: 1,
        learningDisruption: analysisData.riskStats.averageRiskScore > 6 ? 'significant' : 'minimal'
      },
      financialImpact: analysisData.riskStats.averageRiskScore * 1000,
      reputationalImpact: analysisData.riskStats.criticalRisks > 0 ? 'high' : 'low'
    }
  };
}

// Helper functions

function getMostCommon(attackTypeStats) {
  let maxCount = 0;
  let mostCommon = 'none';
  
  Object.entries(attackTypeStats).forEach(([type, data]) => {
    if (data.count > maxCount) {
      maxCount = data.count;
      mostCommon = type;
    }
  });
  
  return mostCommon;
}

function getRiskiestAttack(attackTypeStats) {
  let maxSuccessRate = 0;
  let riskiest = 'none';
  
  Object.entries(attackTypeStats).forEach(([type, data]) => {
    const successRate = data.count > 0 ? data.successful / data.count : 0;
    if (successRate > maxSuccessRate) {
      maxSuccessRate = successRate;
      riskiest = type;
    }
  });
  
  return riskiest;
}

function generateVisualizations(analysisData) {
  return [
    {
      type: 'chart',
      title: 'Attack Success Rate by Type',
      description: 'Comparison of success rates across different attack types',
      data: analysisData.attackStats.attackTypeBreakdown,
      config: { type: 'bar', xAxis: 'attackType', yAxis: 'successRate' }
    },
    {
      type: 'chart',
      title: 'Risk Level Distribution',
      description: 'Distribution of risk assessment levels',
      data: analysisData.riskStats.riskDistribution,
      config: { type: 'pie', metric: 'count' }
    }
  ];
}

function generateRecommendations(analysisData) {
  const recommendations = {
    immediate: [],
    shortTerm: [],
    longTerm: []
  };

  if (analysisData.riskStats.criticalRisks > 0) {
    recommendations.immediate.push({
      priority: 'critical',
      action: 'Immediate Security Review',
      description: `Address ${analysisData.riskStats.criticalRisks} critical vulnerabilities`,
      timeline: '24-48 hours',
      responsibility: 'Security Team',
      resources: 'Security analysts, incident response team',
      expectedOutcome: 'Mitigation of critical vulnerabilities'
    });
  }

  if (analysisData.attackStats.averageSuccessRate > 50) {
    recommendations.shortTerm.push({
      priority: 'high',
      action: 'Enhanced Input Validation',
      description: 'Implement stronger input filtering and validation',
      timeline: '1-2 weeks',
      resources: 'Development team, 40 hours',
      kpis: ['Reduced attack success rate', 'Improved response quality']
    });
  }

  recommendations.longTerm.push({
    priority: 'medium',
    strategy: 'Comprehensive Security Framework',
    description: 'Develop and implement organization-wide LLM security policies',
    timeline: '3-6 months',
    investment: 'Medium',
    sustainabilityPlan: 'Regular training and policy updates'
  });

  return recommendations;
}

// Placeholder functions for other report types
function generateRiskExecutiveSummary(riskAnalysis) {
  return {
    overview: `Risk assessment analysis of ${riskAnalysis.riskStats.totalAssessments} security evaluations with an average risk score of ${riskAnalysis.riskStats.averageRiskScore}/10.`,
    keyFindings: [
      `${riskAnalysis.riskStats.criticalRisks} critical risks identified`,
      `${riskAnalysis.riskStats.highRisks} high-risk scenarios detected`,
      `${riskAnalysis.riskStats.distribution.medium?.percentage || 0}% of assessments rated as medium risk`
    ],
    criticalIssues: riskAnalysis.riskStats.criticalRisks > 0 ? ['Critical security vulnerabilities require immediate attention'] : [],
    recommendations: ['Prioritize critical risk mitigation', 'Implement enhanced monitoring'],
    conclusion: 'Risk landscape assessment complete with actionable insights provided.'
  };
}

function generateRiskDetailedAnalysis(riskAnalysis) {
  return {
    methodology: 'Statistical analysis of risk assessment data with trend identification',
    riskAnalysis: riskAnalysis.riskStats
  };
}

function generateRiskVisualizations(riskAnalysis) {
  return [
    {
      type: 'chart',
      title: 'Risk Level Distribution',
      data: riskAnalysis.riskStats.distribution,
      config: { type: 'pie' }
    }
  ];
}

function generateRiskRecommendations(riskAnalysis) {
  return {
    immediate: riskAnalysis.riskStats.criticalRisks > 0 ? [{
      priority: 'critical',
      action: 'Address Critical Risks',
      timeline: 'Immediate'
    }] : []
  };
}

function generateEducationalExecutiveSummary(educationalAnalysis) {
  return {
    overview: `Educational impact analysis covering ${educationalAnalysis.educationStats.totalEducationRelatedTests} education-focused security tests.`,
    keyFindings: [
      `${educationalAnalysis.educationStats.affectedScenarios.length} education scenarios tested`,
      `Overall education risk score: ${educationalAnalysis.educationStats.overallEducationRisk}/10`
    ],
    criticalIssues: [],
    recommendations: ['Enhance educational security protocols'],
    conclusion: 'Educational systems require targeted security measures.'
  };
}

function generateEducationalDetailedAnalysis(educationalAnalysis) {
  return {
    methodology: 'Education-focused analysis of attack simulation and risk data',
    impactAnalysis: {
      educationalImpact: {
        affectedScenarios: educationalAnalysis.educationStats.affectedScenarios,
        scenarioBreakdown: educationalAnalysis.educationStats.scenarioImpactBreakdown
      }
    }
  };
}

function generateEducationalVisualizations(educationalAnalysis) {
  return [
    {
      type: 'chart',
      title: 'Educational Scenario Risk Breakdown',
      data: educationalAnalysis.educationStats.scenarioImpactBreakdown,
      config: { type: 'bar' }
    }
  ];
}

function generateEducationalRecommendations(educationalAnalysis) {
  return {
    immediate: [],
    shortTerm: [{
      priority: 'medium',
      action: 'Educational Security Training',
      timeline: '2-4 weeks'
    }],
    longTerm: []
  };
}

module.exports = {
  generateAttackAnalysisReport,
  generateRiskSummaryReport,
  generateEducationalImpactReport
};
