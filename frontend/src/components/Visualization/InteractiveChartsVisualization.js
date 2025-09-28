import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  School as EducationIcon,
  Psychology as AIIcon
} from '@mui/icons-material';

const InteractiveChartsVisualization = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchChartData();
  }, [timeRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple data sources
      const [simulationsRes, riskRes, analyticsRes] = await Promise.all([
        fetch('/api/simulations/history?limit=100'),
        fetch('/api/risk-assessments?limit=100'),
        fetch(`/api/analytics/simulations/trend?groupBy=${timeRange}`)
      ]);

      const [simulationsData, riskData, analyticsData] = await Promise.all([
        simulationsRes.json(),
        riskRes.json(),
        analyticsRes.json()
      ]);

      if (simulationsData.status === 'success' && riskData.status === 'success') {
        const processedData = processChartData(
          simulationsData.data.simulations || [],
          riskData.data || [],
          analyticsData.data || []
        );
        setChartData(processedData);
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (simulations, riskAssessments, analytics) => {
    // Attack Type Distribution
    const attackTypeStats = {};
    const educationScenarioStats = {};
    const riskLevelStats = { minimal: 0, low: 0, medium: 0, high: 0, critical: 0 };
    
    simulations.forEach(sim => {
      // Extract attack type and scenario
      let attackType = 'unknown';
      let scenario = 'unknown';
      
      if (sim.metadata?.templateInfo) {
        attackType = sim.metadata.templateInfo.attackType || attackType;
        scenario = sim.metadata.templateInfo.educationScenario || scenario;
      }
      
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

    // Risk level distribution
    riskAssessments.forEach(risk => {
      const level = risk.overallRisk?.level || 'unknown';
      if (riskLevelStats.hasOwnProperty(level)) {
        riskLevelStats[level]++;
      }
    });

    return {
      attackTypeStats,
      educationScenarioStats,
      riskLevelStats,
      analytics,
      totalSimulations: simulations.length,
      totalRiskAssessments: riskAssessments.length
    };
  };

  const createSVGBarChart = (data, title, maxValue = null) => {
    const width = 600;
    const height = 300;
    const padding = 60;
    const barWidth = 30;
    const barSpacing = 10;
    
    const entries = Object.entries(data);
    const chartMaxValue = maxValue || Math.max(...entries.map(([_, values]) => 
      typeof values === 'object' ? Math.max(values.total || 0, values.successful || 0) : values
    ));
    
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const totalBarWidth = barWidth + barSpacing;
    const totalWidth = entries.length * totalBarWidth;
    const startX = padding + (chartWidth - totalWidth) / 2;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          {title}
        </Typography>
        <svg width={width} height={height} style={{ border: '1px solid #ddd', borderRadius: 4 }}>
          {/* Background */}
          <rect width={width} height={height} fill="#fafafa" />
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => {
            const y = padding + (chartHeight * (100 - percent) / 100);
            return (
              <g key={percent}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e0e0e0" strokeWidth="1" />
                <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#666">
                  {Math.round(chartMaxValue * percent / 100)}
                </text>
              </g>
            );
          })}
          
          {/* Bars */}
          {entries.map(([key, values], index) => {
            const x = startX + index * totalBarWidth;
            const isObject = typeof values === 'object';
            const totalValue = isObject ? values.total || 0 : values;
            const successValue = isObject ? values.successful || 0 : 0;
            
            const totalHeight = (totalValue / chartMaxValue) * chartHeight;
            const successHeight = (successValue / chartMaxValue) * chartHeight;
            
            return (
              <g key={key}>
                {/* Total bar (background) */}
                <rect
                  x={x}
                  y={padding + chartHeight - totalHeight}
                  width={barWidth}
                  height={totalHeight}
                  fill="#e3f2fd"
                  stroke="#1976d2"
                  strokeWidth="1"
                />
                
                {/* Success bar (foreground) */}
                {isObject && (
                  <rect
                    x={x}
                    y={padding + chartHeight - successHeight}
                    width={barWidth}
                    height={successHeight}
                    fill="#f44336"
                    stroke="#d32f2f"
                    strokeWidth="1"
                  />
                )}
                
                {/* Labels */}
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                  transform={`rotate(-45, ${x + barWidth / 2}, ${height - 10})`}
                >
                  {key.replace('_', ' ').substring(0, 8)}
                </text>
                
                {/* Values */}
                <text
                  x={x + barWidth / 2}
                  y={padding + chartHeight - totalHeight - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#333"
                >
                  {totalValue}
                </text>
              </g>
            );
          })}
          
          {/* Axes */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#333" strokeWidth="2" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#333" strokeWidth="2" />
        </svg>
        
        {/* Legend */}
        {entries.some(([_, values]) => typeof values === 'object') && (
          <Box display="flex" justifyContent="center" gap={2} mt={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={12} height={12} bgcolor="#e3f2fd" border="1px solid #1976d2" />
              <Typography variant="caption">Total</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={12} height={12} bgcolor="#f44336" />
              <Typography variant="caption">Successful</Typography>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const createSVGPieChart = (data, title) => {
    const width = 300;
    const height = 300;
    const radius = 100;
    const centerX = width / 2;
    const centerY = height / 2;
    
    const entries = Object.entries(data);
    const total = entries.reduce((sum, [_, value]) => {
      // Handle both object and primitive values
      const displayValue = typeof value === 'object' ? (value.total || 0) : value;
      return sum + displayValue;
    }, 0);
    
    if (total === 0) return null;
    
    const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];
    let currentAngle = 0;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          {title}
        </Typography>
        <svg width={width} height={height}>
          <g transform={`translate(${centerX}, ${centerY})`}>
            {entries.map(([key, value], index) => {
              // Handle both object and primitive values
              const displayValue = typeof value === 'object' ? (value.total || 0) : value;
              const percentage = (displayValue / total) * 100;
              const angle = (displayValue / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = radius * Math.cos(startAngleRad);
              const y1 = radius * Math.sin(startAngleRad);
              const x2 = radius * Math.cos(endAngleRad);
              const y2 = radius * Math.sin(endAngleRad);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <g key={key}>
                  <path
                    d={pathData}
                    fill={colors[index % colors.length]}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {/* Label */}
                  {percentage > 5 && (
                    <text
                      x={x1 * 0.7}
                      y={y1 * 0.7}
                      textAnchor="middle"
                      fontSize="10"
                      fill="white"
                      fontWeight="bold"
                    >
                      {percentage.toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
        
        {/* Legend */}
        <Box display="flex" flexDirection="column" gap={1} mt={2}>
          {entries.map(([key, value], index) => {
            // Handle both object and primitive values
            const displayValue = typeof value === 'object' ? (value.total || 0) : value;
            const percentage = (displayValue / total) * 100;
            
            return (
              <Box key={key} display="flex" alignItems="center" gap={1}>
                <Box width={12} height={12} bgcolor={colors[index % colors.length]} />
                <Typography variant="caption">
                  {key.replace('_', ' ')}: {displayValue} ({percentage.toFixed(1)}%)
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
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
        <BarChartIcon />
        Interactive Charts
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Interactive data visualization showing attack patterns, success rates, and risk distributions.
      </Typography>

      <Box mb={3} display="flex" gap={2} alignItems="center">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="day">Daily</MenuItem>
            <MenuItem value="week">Weekly</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, newType) => newType && setChartType(newType)}
          size="small"
        >
          <ToggleButton value="bar">
            <BarChartIcon />
          </ToggleButton>
          <ToggleButton value="pie">
            <PieChartIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <Button variant="outlined" onClick={fetchChartData}>
          Refresh Data
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {chartType === 'bar' 
                ? createSVGBarChart(chartData.attackTypeStats || {}, 'Attack Types Distribution')
                : createSVGPieChart(chartData.attackTypeStats || {}, 'Attack Types Distribution')
              }
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {chartType === 'bar'
                ? createSVGBarChart(chartData.educationScenarioStats || {}, 'Education Scenarios')
                : createSVGPieChart(chartData.educationScenarioStats || {}, 'Education Scenarios')
              }
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {createSVGPieChart(chartData.riskLevelStats || {}, 'Risk Level Distribution')}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                    <Typography variant="h4" color="primary">
                      {chartData.totalSimulations || 0}
                    </Typography>
                    <Typography variant="caption">Total Simulations</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                    <Typography variant="h4" color="warning.main">
                      {chartData.totalRiskAssessments || 0}
                    </Typography>
                    <Typography variant="caption">Risk Assessments</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractiveChartsVisualization;
