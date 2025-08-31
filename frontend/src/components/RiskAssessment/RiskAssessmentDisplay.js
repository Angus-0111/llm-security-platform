import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Button,
  Divider,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const RiskAssessmentDisplay = () => {
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRiskAssessments();
  }, []);

  const fetchRiskAssessments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/risk-assessments?limit=10&sort=-createdAt');
      const data = await response.json();
      
      if (data.status === 'success') {
        setRiskAssessments(data.data);
      } else {
        setError('Failed to fetch risk assessments');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Risk assessment fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      'minimal': 'success',
      'low': 'info',
      'medium': 'warning',
      'high': 'error',
      'critical': 'error'
    };
    return colors[level] || 'default';
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'minimal':
      case 'low':
        return <CheckCircleIcon color="success" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'high':
      case 'critical':
        return <ErrorIcon color="error" />;
      default:
        return <SecurityIcon />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const RiskScoreCard = ({ assessment }) => (
    <Card sx={{ mb: 2, border: `2px solid ${getRiskLevelColor(assessment.overallRisk.level)}` }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            {getRiskIcon(assessment.overallRisk.level)}
            <Typography variant="h6">
              Risk Assessment
            </Typography>
          </Box>
          <Chip
            label={`${assessment.overallRisk.level.toUpperCase()} RISK`}
            color={getRiskLevelColor(assessment.overallRisk.level)}
            variant="filled"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="h3" color={getRiskLevelColor(assessment.overallRisk.level)}>
                {assessment.overallRisk.score}/10
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Risk Score
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph>
              {assessment.overallRisk.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Assessment Date: {formatDate(assessment.assessmentDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: {Math.round((assessment.assessmentInfo.confidenceLevel || 0.8) * 100)}%
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <SecurityIcon />
              Security Risk Factors
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {assessment.riskFactors.security.promptInjectionRisk && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Prompt Injection Risk
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(assessment.riskFactors.security.promptInjectionRisk.score / 10) * 100}
                        sx={{ flexGrow: 1 }}
                        color={getRiskLevelColor(assessment.riskFactors.security.promptInjectionRisk.severity)}
                      />
                      <Typography variant="body2">
                        {assessment.riskFactors.security.promptInjectionRisk.score}/10
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={assessment.riskFactors.security.promptInjectionRisk.severity}
                      color={getRiskLevelColor(assessment.riskFactors.security.promptInjectionRisk.severity)}
                    />
                  </Paper>
                </Grid>
              )}
              
              {assessment.riskFactors.security.jailbreakRisk && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Jailbreak Risk
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(assessment.riskFactors.security.jailbreakRisk.score / 10) * 100}
                        sx={{ flexGrow: 1 }}
                        color={getRiskLevelColor(assessment.riskFactors.security.jailbreakRisk.severity)}
                      />
                      <Typography variant="body2">
                        {assessment.riskFactors.security.jailbreakRisk.score}/10
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={assessment.riskFactors.security.jailbreakRisk.severity}
                      color={getRiskLevelColor(assessment.riskFactors.security.jailbreakRisk.severity)}
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <SchoolIcon />
              Educational Impact
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {assessment.riskFactors.educational.academicIntegrityRisk && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Academic Integrity Risk
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(assessment.riskFactors.educational.academicIntegrityRisk.score / 10) * 100}
                        sx={{ flexGrow: 1 }}
                        color={getRiskLevelColor(assessment.riskFactors.educational.academicIntegrityRisk.severity)}
                      />
                      <Typography variant="body2">
                        {assessment.riskFactors.educational.academicIntegrityRisk.score}/10
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Cheating Potential: {Math.round((assessment.riskFactors.educational.academicIntegrityRisk.cheatingPotential || 0) * 100)}%
                    </Typography>
                  </Paper>
                </Grid>
              )}
              
              {assessment.riskFactors.educational.learningImpactRisk && (
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Learning Impact Risk
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LinearProgress
                        variant="determinate"
                        value={(assessment.riskFactors.educational.learningImpactRisk.score / 10) * 100}
                        sx={{ flexGrow: 1 }}
                        color={getRiskLevelColor(assessment.riskFactors.educational.learningImpactRisk.severity)}
                      />
                      <Typography variant="body2">
                        {assessment.riskFactors.educational.learningImpactRisk.score}/10
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Dependency Risk: {Math.round((assessment.riskFactors.educational.learningImpactRisk.dependencyRisk || 0) * 100)}%
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <AssessmentIcon />
              Mitigation Recommendations
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {assessment.mitigation.immediateActions?.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom color="error">
                  Immediate Actions Required
                </Typography>
                <List dense>
                  {assessment.mitigation.immediateActions.map((action, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={action.action}
                        secondary={`Priority: ${action.priority} | Timeline: ${action.timeline}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {assessment.mitigation.technicalRecommendations?.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Technical Recommendations
                </Typography>
                <List dense>
                  {assessment.mitigation.technicalRecommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={rec.recommendation}
                        secondary={`Category: ${rec.category} | Effectiveness: ${Math.round((rec.effectiveness || 0) * 100)}%`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {assessment.mitigation.policyRecommendations?.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Policy Recommendations
                </Typography>
                <List dense>
                  {assessment.mitigation.policyRecommendations.map((policy, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={policy.recommendation}
                        secondary={`Type: ${policy.type} | Timeline: ${policy.timeline}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>

        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Assessment ID: {assessment._id?.slice(-8)}
          </Typography>
          <Box>
            <Chip
              size="small"
              label={assessment.assessmentInfo.assessmentType}
              variant="outlined"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading risk assessments...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button onClick={fetchRiskAssessments} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={1}>
        <SecurityIcon />
        Risk Assessment Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Comprehensive risk analysis of LLM security simulations with detailed mitigation recommendations.
      </Typography>

      {riskAssessments.length === 0 ? (
        <Alert severity="info">
          No risk assessments found. Run some attack simulations to generate risk assessments.
        </Alert>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recent Risk Assessments ({riskAssessments.length})
          </Typography>
          
          {riskAssessments.map((assessment) => (
            <RiskScoreCard key={assessment._id} assessment={assessment} />
          ))}
          
          <Box mt={3} textAlign="center">
            <Button 
              variant="outlined" 
              onClick={fetchRiskAssessments}
              disabled={loading}
            >
              Refresh Assessments
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RiskAssessmentDisplay;
