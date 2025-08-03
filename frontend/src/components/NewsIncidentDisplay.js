import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  Event,
  Security,
  School,
  Warning,
  ExpandMore,
  Close,
  Visibility
} from '@mui/icons-material';

const NewsIncidentDisplay = () => {
  const [newsIncidents, setNewsIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchNewsIncidents();
  }, []);

  const fetchNewsIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/news-incidents');
      const data = await response.json();
      
      if (data.status === 'success') {
        setNewsIncidents(data.data);
      } else {
        setError('Failed to fetch news incidents');
      }
    } catch (err) {
      setError('Error fetching news incidents: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (news) => {
    setSelectedNews(news);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedNews(null);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'error',
      'high': 'warning',
      'medium': 'info',
      'low': 'success'
    };
    return colors[severity] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {newsIncidents.length === 0 ? (
        <Alert severity="info">
          No news incidents found. Add some incidents to see them here.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {newsIncidents.map((incident, index) => (
            <Grid item xs={12} md={6} lg={4} key={incident._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header with severity indicator */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      label={incident.severity?.level?.toUpperCase() || 'UNKNOWN'}
                      color={getSeverityColor(incident.severity?.level)}
                      size="small"
                      icon={<Warning />}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(incident.timeline?.incidentDate)}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 2, flexGrow: 1 }}>
                    {incident.title}
                  </Typography>

                  {/* Summary */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {incident.content?.summary || incident.content?.excerpt || 'No summary available'}
                  </Typography>

                  {/* Location and affected students */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center">
                      <School sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {incident.geographic?.cities?.[0] || 'Unknown location'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {incident.educationRelevance?.studentImpact?.estimated || 0} students affected
                    </Typography>
                  </Box>

                  {/* Tags */}
                  <Box sx={{ mb: 2 }}>
                    {incident.tags?.slice(0, 3).map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={tag.replace(/_/g, ' ')}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    {incident.tags?.length > 3 && (
                      <Chip
                        label={`+${incident.tags.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Action button */}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(incident)}
                    sx={{ mt: 'auto' }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedNews && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {selectedNews.title}
                </Typography>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip
                    label={selectedNews.severity?.level?.toUpperCase()}
                    color={getSeverityColor(selectedNews.severity?.level)}
                    icon={<Warning />}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedNews.timeline?.incidentDate)}
                  </Typography>
                </Box>

                <Typography variant="body1" paragraph>
                  {selectedNews.content?.fullContent || selectedNews.content?.summary}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Technical Details */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Technical Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        LLM Models Involved:
                      </Typography>
                      <List dense>
                        {selectedNews.technicalDetails?.llmModels?.map((model, index) => (
                          <ListItem key={index} sx={{ py: 0 }}>
                            <ListItemIcon>
                              <Security sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={model.name}
                              secondary={`${model.provider} - ${model.version}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Attack Vectors:
                      </Typography>
                      <Box>
                        {selectedNews.technicalDetails?.attackVectors?.map((vector, index) => (
                          <Chip
                            key={index}
                            label={vector}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Timeline */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Timeline</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {selectedNews.timeline?.timelineEvents?.map((event, index) => (
                      <ListItem key={index} sx={{ borderLeft: '3px solid #1976d2', mb: 1 }}>
                        <ListItemIcon>
                          <Event color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.event}
                          secondary={`${formatDate(event.date)} - Source: ${event.source}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              {/* Impact */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">Impact Assessment</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Immediate Impact:
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Users Affected: {selectedNews.impact?.immediate?.usersAffected || 'Unknown'}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Services Disrupted: {selectedNews.impact?.immediate?.servicesDisrupted?.join(', ') || 'None'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Educational Impact:
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Students Affected: {selectedNews.impact?.educational?.studentsAffected || 'Unknown'}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        • Institutions Affected: {selectedNews.impact?.educational?.institutionsAffected || 'Unknown'}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default NewsIncidentDisplay; 