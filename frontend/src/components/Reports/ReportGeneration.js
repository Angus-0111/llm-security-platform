import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  Article as ArticleIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
// Date picker imports removed for simplicity - using basic text fields

const ReportGeneration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState('');
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Report generation parameters
  const [parameters, setParameters] = useState({
    timeRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      endDate: new Date()
    },
    attackTypes: [],
    educationScenarios: [],
    riskLevels: [],
    includeCharts: true,
    includeRecommendations: true
  });

  const reportTypes = [
    {
      id: 'attack-analysis',
      title: 'Attack Analysis Report',
      description: 'Comprehensive analysis of attack simulation results, success rates, and patterns',
      icon: <SecurityIcon />,
      color: 'error'
    },
    {
      id: 'risk-summary',
      title: 'Risk Assessment Summary',
      description: 'Executive summary of risk assessments with priority recommendations',
      icon: <AssessmentIcon />,
      color: 'warning'
    },
    {
      id: 'educational-impact',
      title: 'Educational Impact Report',
      description: 'Analysis of security threats specific to educational scenarios',
      icon: <SchoolIcon />,
      color: 'info'
    }
  ];

  const attackTypeOptions = [
    'prompt_injection', 'jailbreak', 'adversarial_input', 'data_leakage',
    'extraction', 'evasion', 'backdoor', 'poisoning'
  ];

  const educationScenarioOptions = [
    'essay_grading', 'student_assessment', 'tutoring_chatbot', 'content_generation',
    'academic_integrity', 'curriculum_planning', 'research_assistance', 'language_learning',
    'code_teaching', 'general_qa'
  ];

  const riskLevelOptions = ['minimal', 'low', 'medium', 'high', 'critical'];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?limit=20&status=completed');
      const data = await response.json();
      
      if (data.status === 'success') {
        setReports(data.data);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Report fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportType) => {
    try {
      setGenerateLoading(reportType);
      setError(null);

      const endpoint = `/api/reports/generate/${reportType}`;
      const requestBody = {
        timeRange: {
          startDate: parameters.timeRange.startDate.toISOString(),
          endDate: parameters.timeRange.endDate.toISOString()
        },
        attackTypes: parameters.attackTypes,
        educationScenarios: parameters.educationScenarios,
        riskLevels: parameters.riskLevels,
        includeCharts: parameters.includeCharts,
        includeRecommendations: parameters.includeRecommendations
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.status === 'success') {
        await fetchReports(); // Refresh the reports list
        setDialogOpen(false);
        alert('Report generated successfully!');
      } else {
        setError(data.message || 'Failed to generate report');
      }
    } catch (err) {
      setError('Error generating report');
      console.error('Report generation error:', err);
    } finally {
      setGenerateLoading('');
    }
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getReportTypeColor = (reportType) => {
    const colors = {
      'attack_analysis': 'error',
      'risk_assessment': 'warning',
      'educational_impact': 'info',
      'security_audit': 'secondary',
      'trend_analysis': 'primary'
    };
    return colors[reportType] || 'default';
  };

  const ReportCard = ({ reportType }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Box color={`${reportType.color}.main`} mr={1}>
            {reportType.icon}
          </Box>
          <Typography variant="h6">
            {reportType.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {reportType.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color={reportType.color}
          onClick={() => {
            setDialogOpen(reportType.id);
          }}
          disabled={generateLoading === reportType.id}
          startIcon={generateLoading === reportType.id ? <LinearProgress size={20} /> : <ArticleIcon />}
          fullWidth
        >
          {generateLoading === reportType.id ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardActions>
    </Card>
  );

  const ReportListItem = ({ report }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {report.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {report.subtitle}
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <Chip
                size="small"
                label={report.reportType.replace('_', ' ').toUpperCase()}
                color={getReportTypeColor(report.reportType)}
              />
              <Chip
                size="small"
                label={report.category.toUpperCase()}
                variant="outlined"
              />
              <Chip
                size="small"
                label={`Quality: ${report.qualityScore || 'N/A'}`}
                color={report.qualityScore > 80 ? 'success' : report.qualityScore > 60 ? 'warning' : 'error'}
              />
            </Box>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Generated: {formatDate(report.generatedAt || report.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {report._id?.slice(-8)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Key Metrics
            </Typography>
            <List dense>
              {report.statistics?.attackStats && (
                <ListItem>
                  <ListItemText
                    primary="Attacks Analyzed"
                    secondary={report.statistics.attackStats.totalAttacks || 0}
                  />
                </ListItem>
              )}
              {report.statistics?.riskStats && (
                <ListItem>
                  <ListItemText
                    primary="Average Risk Score"
                    secondary={`${report.statistics.riskStats.averageRiskScore || 0}/10`}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Data Sources
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Attack Templates"
                  secondary={report.dataSourceRefs?.attackDataIds?.length || 0}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Risk Assessments"
                  secondary={report.dataSourceRefs?.assessmentIds?.length || 0}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => viewReport(report)}
          >
            View Details
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            disabled
          >
            Download (Coming Soon)
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
      <Box>
        <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={1}>
          <BarChartIcon />
          Report Generation Dashboard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Generate comprehensive security reports from simulation data and risk assessments.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h5" gutterBottom>
              Available Report Types
            </Typography>
            <Grid container spacing={2} mb={4}>
              {reportTypes.map((reportType) => (
                <Grid item xs={12} md={4} key={reportType.id}>
                  <ReportCard reportType={reportType} />
                </Grid>
              ))}
            </Grid>

            <Typography variant="h5" gutterBottom>
              Generated Reports
            </Typography>
            {loading ? (
              <LinearProgress sx={{ mb: 2 }} />
            ) : reports.length === 0 ? (
              <Alert severity="info">
                No reports generated yet. Generate your first report using the options above.
              </Alert>
            ) : (
              <Box>
                {reports.map((report) => (
                  <ReportListItem key={report._id} report={report} />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Report Parameters
              </Typography>
              
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Time Range
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Date"
                      type="date"
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={parameters.timeRange.startDate.toISOString().split('T')[0]}
                      onChange={(e) => setParameters(prev => ({
                        ...prev,
                        timeRange: { ...prev.timeRange, startDate: new Date(e.target.value) }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="End Date"
                      type="date"
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={parameters.timeRange.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setParameters(prev => ({
                        ...prev,
                        timeRange: { ...prev.timeRange, endDate: new Date(e.target.value) }
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Attack Types</InputLabel>
                  <Select
                    multiple
                    value={parameters.attackTypes}
                    onChange={(e) => setParameters(prev => ({ ...prev, attackTypes: e.target.value }))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {attackTypeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Education Scenarios</InputLabel>
                  <Select
                    multiple
                    value={parameters.educationScenarios}
                    onChange={(e) => setParameters(prev => ({ ...prev, educationScenarios: e.target.value }))}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {educationScenarioOptions.map((scenario) => (
                      <MenuItem key={scenario} value={scenario}>
                        {scenario.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body2" color="text.secondary">
                These parameters will be used for all generated reports. Leave empty to include all data.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Report View Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Report Details
          </DialogTitle>
          <DialogContent>
            {selectedReport && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedReport.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedReport.subtitle}
                </Typography>

                {selectedReport.content?.executiveSummary && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">Executive Summary</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography paragraph>
                        {selectedReport.content.executiveSummary.overview}
                      </Typography>
                      
                      {selectedReport.content.executiveSummary.keyFindings?.length > 0 && (
                        <Box mb={2}>
                          <Typography variant="subtitle2" gutterBottom>Key Findings:</Typography>
                          <List dense>
                            {selectedReport.content.executiveSummary.keyFindings.map((finding, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={finding} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {selectedReport.content.executiveSummary.recommendations?.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>Recommendations:</Typography>
                          <List dense>
                            {selectedReport.content.executiveSummary.recommendations.map((rec, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={rec} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                )}

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Report Metadata</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Generated:</strong> {formatDate(selectedReport.generatedAt || selectedReport.createdAt)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Type:</strong> {selectedReport.reportType}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Category:</strong> {selectedReport.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          <strong>Quality Score:</strong> {selectedReport.qualityScore || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong> {selectedReport.status}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Version:</strong> {selectedReport.versionString || '1.0.0'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button variant="contained" disabled>
              Download (Coming Soon)
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default ReportGeneration;
