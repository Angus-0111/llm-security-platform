import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Tooltip,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  School as EducationIcon,
  Psychology as AIIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const RiskHeatmapVisualization = () => {
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('successRate');

  const attackTypes = [
    'prompt_injection', 'jailbreak', 'adversarial_input', 
    'data_leakage', 'extraction', 'evasion', 'backdoor', 'poisoning'
  ];

  const educationScenarios = [
    'essay_grading', 'student_assessment', 'tutoring_chatbot', 
    'content_generation', 'academic_integrity', 'research_assistance',
    'language_learning', 'code_teaching', 'general_qa'
  ];

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      
      // Fetch simulation data
      const simulationResponse = await fetch('/api/simulations/history?limit=100');
      const simulationData = await simulationResponse.json();
      
      // Fetch risk assessment data
      const riskResponse = await fetch('/api/risk-assessments?limit=100');
      const riskData = await riskResponse.json();
      
      if (simulationData.status === 'success' && riskData.status === 'success') {
        const heatmap = generateHeatmapData(
          simulationData.data.simulations || [],
          riskData.data || []
        );
        setHeatmapData(heatmap);
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHeatmapData = (simulations, riskAssessments) => {
    const data = {};
    
    // Initialize matrix
    attackTypes.forEach(attackType => {
      data[attackType] = {};
      educationScenarios.forEach(scenario => {
        data[attackType][scenario] = {
          successRate: 0,
          riskScore: 0,
          totalSimulations: 0,
          successfulAttacks: 0
        };
      });
    });

    // Process simulation data
    simulations.forEach(sim => {
      // Try to get attack type and scenario from metadata or attackId
      let attackType = 'general';
      let scenario = 'general_qa';
      
      if (sim.metadata?.templateInfo) {
        attackType = sim.metadata.templateInfo.attackType || attackType;
        scenario = sim.metadata.templateInfo.educationScenario || scenario;
      }
      
      if (data[attackType] && data[attackType][scenario]) {
        data[attackType][scenario].totalSimulations++;
        if (sim.attackSuccess?.isSuccessful) {
          data[attackType][scenario].successfulAttacks++;
        }
      }
    });

    // Process risk assessment data
    riskAssessments.forEach(risk => {
      // Try to get attack type and scenario from risk assessment
      let attackType = 'general';
      let scenario = 'general_qa';
      
      if (risk.attackId && typeof risk.attackId === 'object') {
        attackType = risk.attackId.attackType || attackType;
        scenario = risk.attackId.educationScenario || scenario;
      }
      
      if (data[attackType] && data[attackType][scenario]) {
        data[attackType][scenario].riskScore = Math.max(
          data[attackType][scenario].riskScore,
          risk.overallRisk?.score || 0
        );
      }
    });

    // Calculate success rates
    Object.keys(data).forEach(attackType => {
      Object.keys(data[attackType]).forEach(scenario => {
        const cell = data[attackType][scenario];
        if (cell.totalSimulations > 0) {
          cell.successRate = (cell.successfulAttacks / cell.totalSimulations) * 100;
        }
      });
    });

    return data;
  };

  const getRiskColor = (value, metric) => {
    if (metric === 'successRate') {
      // Green (low success) to Red (high success)
      if (value === 0) return '#e8f5e8'; // Very light green
      if (value < 20) return '#4caf50'; // Green
      if (value < 40) return '#ffeb3b'; // Yellow
      if (value < 60) return '#ff9800'; // Orange
      return '#f44336'; // Red
    } else if (metric === 'riskScore') {
      // Green (low risk) to Red (high risk)
      if (value === 0) return '#e8f5e8'; // Very light green
      if (value < 3) return '#4caf50'; // Green
      if (value < 5) return '#ffeb3b'; // Yellow
      if (value < 7) return '#ff9800'; // Orange
      return '#f44336'; // Red
    }
    return '#f5f5f5'; // Default gray
  };

  const getTextColor = (value, metric) => {
    if (metric === 'successRate') {
      return value > 40 ? '#ffffff' : '#000000';
    } else if (metric === 'riskScore') {
      return value > 5 ? '#ffffff' : '#000000';
    }
    return '#000000';
  };

  const HeatmapCell = ({ attackType, scenario, data }) => {
    const value = data[selectedMetric];
    const color = getRiskColor(value, selectedMetric);
    const textColor = getTextColor(value, selectedMetric);
    
    return (
      <Tooltip
        title={
          <Box>
            <Typography variant="subtitle2">
              {attackType.replace('_', ' ').toUpperCase()} × {scenario.replace('_', ' ').toUpperCase()}
            </Typography>
            <Typography variant="body2">
              Success Rate: {data.successRate.toFixed(1)}%
            </Typography>
            <Typography variant="body2">
              Risk Score: {data.riskScore.toFixed(1)}/10
            </Typography>
            <Typography variant="body2">
              Simulations: {data.totalSimulations}
            </Typography>
          </Box>
        }
        arrow
      >
        <Paper
          sx={{
            p: 1,
            textAlign: 'center',
            bgcolor: color,
            color: textColor,
            minHeight: 60,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              zIndex: 1
            }
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
            {selectedMetric === 'successRate' 
              ? `${data.successRate.toFixed(0)}%` 
              : `${data.riskScore.toFixed(1)}`
            }
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
            {data.totalSimulations} sims
          </Typography>
        </Paper>
      </Tooltip>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={1}>
        <AssessmentIcon />
        Successful Attack Stories
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Explore real examples of attacks that actually worked! These are the cases where someone 
        successfully manipulated an AI system in an educational setting. Learn from these examples 
        to understand what makes systems vulnerable.
      </Typography>

      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>View By</InputLabel>
          <Select
            value={selectedMetric}
            label="View By"
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <MenuItem value="successRate">How Often Attacks Work</MenuItem>
            <MenuItem value="riskScore">How Dangerous Each Attack Is</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={1}>
            {/* Header row with education scenarios */}
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={2}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', p: 1 }}>
                    Attack Method
                  </Typography>
                </Grid>
                {educationScenarios.map(scenario => (
                  <Grid item xs key={scenario}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold', 
                        p: 1,
                        display: 'block',
                        textAlign: 'center',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center'
                      }}
                    >
                      {scenario.replace('_', ' ')}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Data rows */}
            {attackTypes.map(attackType => (
              <Grid item xs={12} key={attackType}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold', 
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      {attackType.replace('_', ' ')}
                    </Typography>
                  </Grid>
                  {educationScenarios.map(scenario => (
                    <Grid item xs key={scenario}>
                      <HeatmapCell
                        attackType={attackType}
                        scenario={scenario}
                        data={heatmapData[attackType]?.[scenario] || {
                          successRate: 0,
                          riskScore: 0,
                          totalSimulations: 0,
                          successfulAttacks: 0
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* Legend */}
          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              What the Colors Mean:
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <Paper sx={{ width: 20, height: 20, bgcolor: '#4caf50' }} />
                <Typography variant="caption">Safe - Attacks rarely work</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Paper sx={{ width: 20, height: 20, bgcolor: '#ffeb3b' }} />
                <Typography variant="caption">Caution - Some attacks work</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Paper sx={{ width: 20, height: 20, bgcolor: '#ff9800' }} />
                <Typography variant="caption">Dangerous - Many attacks work</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Paper sx={{ width: 20, height: 20, bgcolor: '#f44336' }} />
                <Typography variant="caption">Critical - Almost all attacks work</Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RiskHeatmapVisualization;

