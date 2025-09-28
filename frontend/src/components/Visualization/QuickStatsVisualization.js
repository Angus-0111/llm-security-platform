import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Psychology as AIIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  School as EducationIcon,
  Security as AttackIcon,
  SmartToy as AIIcon2,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const QuickStatsVisualization = () => {
  const [statsData, setStatsData] = useState({
    totalSimulations: 0,
    successfulAttacks: 0,
    failedAttacks: 0,
    successRate: 0,
    attackTypeBreakdown: [],
    recentActivity: [],
    scenarioBreakdown: []
  });
  const [loading, setLoading] = useState(true);
  const [attackTemplates, setAttackTemplates] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const theme = useTheme();

  useEffect(() => {
    fetchStatsData();
  }, []);

  const fetchStatsData = async () => {
    try {
      setLoading(true);
      
      // Fetch attack templates first
      const templatesResponse = await fetch('http://localhost:3001/api/attack-data');
      const templatesData = await templatesResponse.json();
      
      if (templatesData.status === 'success') {
        setAttackTemplates(templatesData.data || []);
      }
      
      // Fetch simulation data
      const response = await fetch('http://localhost:3001/api/simulations/history?limit=200');
      const data = await response.json();
      
      if (data.status === 'success') {
        const simulations = data.data.simulations || [];
        calculateStats(simulations, templatesData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch stats data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (simulations, templates) => {
    const total = simulations.length;
    const successful = simulations.filter(sim => sim.attackSuccess?.isSuccessful).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    // Analyze by attack types and education scenarios separately
    const attackTypeStats = {};
    const educationScenarioStats = {};
    
    simulations.forEach(sim => {
      // Get attack type and education scenario from the simulation data
      const attackType = sim.attackType || 'Custom Attack';
      const scenario = sim.educationScenario || 'General Context';
      
      // Count attack types
      if (!attackTypeStats[attackType]) {
        attackTypeStats[attackType] = { total: 0, successful: 0 };
      }
      attackTypeStats[attackType].total++;
      if (sim.attackSuccess?.isSuccessful) {
        attackTypeStats[attackType].successful++;
      }
      
      // Count education scenarios
      if (!educationScenarioStats[scenario]) {
        educationScenarioStats[scenario] = { total: 0, successful: 0 };
      }
      educationScenarioStats[scenario].total++;
      if (sim.attackSuccess?.isSuccessful) {
        educationScenarioStats[scenario].successful++;
      }
    });

    // Create breakdown with two main categories: Attack Types and Education Scenarios
    const attackTypeBreakdown = [
      {
        type: 'Attack Types',
        total: Object.values(attackTypeStats).reduce((sum, stats) => sum + stats.total, 0),
        successful: Object.values(attackTypeStats).reduce((sum, stats) => sum + stats.successful, 0),
        successRate: simulations.length > 0 ? (Object.values(attackTypeStats).reduce((sum, stats) => sum + stats.successful, 0) / simulations.length * 100).toFixed(1) : 0,
        isCategory: true,
        subItems: {
          items: Object.entries(attackTypeStats).map(([type, stats]) => ({
            name: getAttackTypeDisplayName(type),
            total: stats.total,
            successful: stats.successful,
            successRate: stats.total > 0 ? (stats.successful / stats.total * 100).toFixed(1) : 0
          })).sort((a, b) => b.total - a.total)
        }
      },
      {
        type: 'Education Scenarios',
        total: Object.values(educationScenarioStats).reduce((sum, stats) => sum + stats.total, 0),
        successful: Object.values(educationScenarioStats).reduce((sum, stats) => sum + stats.successful, 0),
        successRate: simulations.length > 0 ? (Object.values(educationScenarioStats).reduce((sum, stats) => sum + stats.successful, 0) / simulations.length * 100).toFixed(1) : 0,
        isCategory: true,
        subItems: {
          items: Object.entries(educationScenarioStats).map(([scenario, stats]) => ({
            name: getScenarioDisplayName(scenario),
            total: stats.total,
            successful: stats.successful,
            successRate: stats.total > 0 ? (stats.successful / stats.total * 100).toFixed(1) : 0
          })).sort((a, b) => b.total - a.total)
        }
      }
    ].filter(item => item.total > 0); // Only show categories that have data

    // No longer need separate scenario breakdown as it's now integrated into attackTypeBreakdown

    // Recent activity with detailed attack information (same data as Attack Impact Analysis)
    const recentActivity = simulations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((sim, index) => {
        let attackType = 'Custom Attack';
        let scenario = 'General Context';
        let originalPrompt = 'No prompt data available';
        let attackPrompt = 'No prompt data available';
        
        // Get template information (same logic as AttackFlowVisualization)
        if (sim.metadata?.notes) {
          const notes = sim.metadata.notes;
          const templateMatch = notes.match(/template:\s*([^,\]]+)/i);
          if (templateMatch) {
            const templateName = templateMatch[1].trim();
            const template = templates.find(t => t.name === templateName);
            if (template) {
              attackType = getAttackTypeDisplayName(template.attackType);
              scenario = getScenarioDisplayName(template.educationScenario);
              originalPrompt = template.originalPrompt || 'No prompt data available';
              attackPrompt = template.maliciousPrompt || 'No prompt data available';
            }
          }
        } else if (sim.attackType) {
          attackType = getAttackTypeDisplayName(sim.attackType);
          scenario = getScenarioDisplayName(sim.educationScenario || 'General Context');
          originalPrompt = sim.inputData?.originalPrompt || 'No prompt data available';
          attackPrompt = sim.inputData?.attackPrompt || 'No prompt data available';
        }
        
        return {
          id: `Simulation #${total - index}`,
          timestamp: new Date(sim.createdAt).toLocaleDateString(),
          success: sim.attackSuccess?.isSuccessful || false,
          attackType: attackType,
          scenario: scenario,
          originalPrompt: originalPrompt,
          attackPrompt: attackPrompt,
          originalResponse: sim.originalResponse?.content || sim.originalResponse || 'No response data',
          attackedResponse: sim.attackedResponse?.content || sim.attackedResponse || 'No response data'
        };
      });

    setStatsData({
      totalSimulations: total,
      successfulAttacks: successful,
      failedAttacks: failed,
      successRate: successRate.toFixed(1),
      attackTypeBreakdown,
      recentActivity
    });
  };

  const getAttackTypeDisplayName = (type) => {
    const names = {
      'prompt_injection': 'Prompt Injection',
      'jailbreak': 'Jailbreak',
      'evasion': 'Evasion',
      'extraction': 'Data Extraction',
      'adversarial': 'Adversarial Examples',
      'Custom Attack': 'Custom Attack'
    };
    return names[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getScenarioDisplayName = (scenario) => {
    const names = {
      'academic_integrity': 'Academic Integrity',
      'research_assistance': 'Research Assistance',
      'general_qa': 'General Q&A',
      'General Context': 'General Context'
    };
    return names[scenario] || scenario.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleViewFlow = (activity) => {
    setSelectedFlow(activity);
    setDialogOpen(true);
  };

  const toggleCategory = (categoryType) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryType]: !prev[categoryType]
    }));
  };

  const StatCard = ({ icon, title, value, description, color }) => (
    <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ color: theme.palette[color].main, mb: 2 }}>
          {React.cloneElement(icon, { sx: { fontSize: 40 } })}
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
          Quick Statistics
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Overview of your attack simulation results. Track your progress in understanding different attack types and their success rates.
        </Typography>
      </Box>

      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={6}>
          <StatCard
            icon={<SecurityIcon />}
            title="Total Simulations"
            value={statsData.totalSimulations}
            description="Attacks you've tried"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Success Rate"
            value={`${statsData.successRate}%`}
            description="How often attacks work"
            color="info"
          />
        </Grid>
      </Grid>

      {/* Detailed Analysis */}
      <Grid container spacing={3}>
        {/* Attack Type Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssessmentIcon sx={{ color: theme.palette.primary.main }} />
                Attack Type Breakdown
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Which attack methods have you used most frequently?
              </Typography>
              
              {/* 总体统计信息 - 移到最上面 */}
              {statsData.attackTypeBreakdown && statsData.attackTypeBreakdown.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  {/* 总成功率芯片 */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Chip
                      label={`${statsData.attackTypeBreakdown[0].successRate}% success`}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  </Box>
                  
                  {/* 总体进度条 */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {/* 使用量填充 - 改为透明 */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${(statsData.attackTypeBreakdown[0].total / Math.max(...statsData.attackTypeBreakdown.map(x => x.total))) * 100}%`,
                        backgroundColor: 'transparent',
                        transition: 'width 0.3s ease'
                      }}
                    />
                    {/* 成功率填充覆盖层 - 红色 */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${(statsData.attackTypeBreakdown[0].total / Math.max(...statsData.attackTypeBreakdown.map(x => x.total))) * 100}%`,
                        background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.main} ${statsData.attackTypeBreakdown[0].successRate}%, transparent ${statsData.attackTypeBreakdown[0].successRate}%)`,
                        transition: 'background 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
              )}
              
              {statsData.attackTypeBreakdown && statsData.attackTypeBreakdown.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  {/* Main Category */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    onClick={() => toggleCategory(item.type)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.type}
                      </Typography>
                      {expandedCategories[item.type] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </Box>
                  </Box>
                  
                  {/* Expanded Details */}
                  {expandedCategories[item.type] && item.subItems && item.subItems.items && (
                    <Box sx={{ ml: 2, mb: 2 }}>
                      {item.subItems.items.map((subItem, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption">
                        {subItem.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            lineHeight: 1,
                            flexShrink: 0
                          }}
                        >
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, lineHeight: 1, margin: 0, padding: 0 }}>
                            {subItem.total}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 60,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          {/* 成功率填充 */}
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${subItem.successRate}%`,
                              backgroundColor: theme.palette.error.main,
                              transition: 'width 0.3s ease'
                            }}
                          />
                          {/* 百分比文字 */}
                          <Typography
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: 'white',
                              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                              lineHeight: 1,
                              margin: 0,
                              padding: 0,
                              zIndex: 1
                            }}
                          >
                            {subItem.successRate}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon sx={{ color: theme.palette.info.main }} />
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your latest attack simulations with attack type and scenario information
              </Typography>
              
              {statsData.recentActivity && statsData.recentActivity.map((activity, index) => (
                <Box 
                  key={index} 
                  onClick={() => handleViewFlow(activity)}
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {activity.attackType}
                    </Typography>
                    <Chip 
                      label={activity.success ? 'SUCCESS' : 'FAILED'} 
                      size="small" 
                      color={activity.success ? 'error' : 'success'}
                      icon={activity.success ? <ErrorIcon /> : <CheckCircleIcon />}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {activity.scenario}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.timestamp}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      {/* Detailed Attack Flow Analysis Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
            color: 'white',
            borderRadius: '12px 12px 0 0',
            position: 'relative',
            p: 3
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <SecurityIcon sx={{ color: 'white' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Detailed Attack Flow Analysis
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setDialogOpen(false)}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 6 }}>
          {selectedFlow && (
            <Box sx={{ pt: 2 }}>
              {/* Attack Type and Scenario Info */}
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                background: 'rgba(102, 126, 234, 0.05)', 
                borderRadius: 2, 
                border: '1px solid rgba(102, 126, 234, 0.1)' 
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 0.5 }}>
                      {selectedFlow.attackType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedFlow.scenario}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip 
                      label={selectedFlow.success ? 'SUCCESS' : 'FAILED'} 
                      color={selectedFlow.success ? 'error' : 'success'}
                      icon={selectedFlow.success ? <ErrorIcon /> : <CheckCircleIcon />}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {selectedFlow.timestamp}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    mb: 2
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <EducationIcon sx={{ fontSize: 18 }} />
                      Original Prompt
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(102, 126, 234, 0.1)'
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {selectedFlow.originalPrompt}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ 
                    background: 'rgba(33, 150, 243, 0.05)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(33, 150, 243, 0.1)'
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: 'info.main',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <AIIcon2 sx={{ fontSize: 18 }} />
                      Original Response
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(33, 150, 243, 0.1)'
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {selectedFlow.originalResponse}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    background: 'rgba(255, 152, 0, 0.05)',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid rgba(255, 152, 0, 0.1)',
                    mb: 2
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: 'warning.main',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <AttackIcon sx={{ fontSize: 18 }} />
                      Attack Prompt
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 152, 0, 0.1)'
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {selectedFlow.attackPrompt}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ 
                    background: selectedFlow.success
                      ? 'rgba(244, 67, 54, 0.05)' 
                      : 'rgba(76, 175, 80, 0.05)',
                    borderRadius: 2,
                    p: 2,
                    border: `1px solid ${selectedFlow.success ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'}`
                  }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: selectedFlow.success ? 'error.main' : 'success.main',
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <ErrorIcon sx={{ fontSize: 18 }} />
                      Attacked Response
                    </Typography>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 2,
                      backdropFilter: 'blur(5px)',
                      border: `1px solid ${selectedFlow.success ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'}`
                    }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {selectedFlow.attackedResponse}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuickStatsVisualization;