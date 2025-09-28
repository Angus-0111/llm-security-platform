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
  IconButton,
  Container,
  Fade,
  Slide,
  alpha,
  useTheme
} from '@mui/material';
import {
  Event,
  Security,
  School,
  Warning,
  ExpandMore,
  Close,
  Visibility,
  Newspaper,
  Timeline,
  Public,
  People,
  TrendingUp,
  AutoAwesome
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// 动画定义
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const NewsIncidentDisplay = () => {
  const theme = useTheme();
  const [newsIncidents, setNewsIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchNewsIncidents();
  }, []);

  const fetchNewsIncidents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news-incidents');
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Animations */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 60,
              height: 60,
              background: `rgba(255, 255, 255, ${0.1 - i * 0.01})`,
              borderRadius: '50%',
              left: `${20 + i * 15}%`,
              top: `${10 + i * 15}%`,
              animation: `${float} ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </Box>

      {/* Hero Section */}
      <Fade in={mounted} timeout={800}>
        <Box
          sx={{
            pt: 8,
            pb: 4,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <Newspaper
                sx={{
                  fontSize: 48,
                  color: 'white',
                  mr: 2,
                  animation: `${pulse} 2s ease-in-out infinite`
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                Real Incident Cases
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                textShadow: '0 1px 5px rgba(0,0,0,0.2)'
              }}
            >
              Explore real-world LLM security incidents in education. Learn from actual cases to better understand the threats and build stronger defenses.
            </Typography>
          </Container>
        </Box>
      </Fade>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 6 }}>
        {newsIncidents.length === 0 ? (
          <Fade in={mounted} timeout={1000}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                p: 4,
                textAlign: 'center'
              }}
            >
              <Alert severity="info" sx={{ fontSize: '1.1rem', py: 2 }}>
                No news incidents found. Add some incidents to see them here.
              </Alert>
            </Card>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {newsIncidents.map((incident, index) => (
              <Grid item xs={12} lg={6} key={incident._id}>
                <Fade in={mounted} timeout={800 + index * 200}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(102, 126, 234, 0.3)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                      {/* Header with severity indicator */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Chip
                          label={incident.severity?.level?.toUpperCase() || 'UNKNOWN'}
                          size="small"
                          sx={{
                            background: incident.severity?.level === 'critical' ? 
                                       'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)' :
                                       incident.severity?.level === 'high' ? 
                                       'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)' :
                                       incident.severity?.level === 'medium' ? 
                                       'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)' :
                                       'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            px: 1.5,
                            py: 0.8,
                            borderRadius: 2,
                            boxShadow: incident.severity?.level === 'critical' ? 
                                       '0 4px 15px rgba(255, 71, 87, 0.3)' :
                                       incident.severity?.level === 'high' ? 
                                       '0 4px 15px rgba(255, 167, 38, 0.3)' :
                                       incident.severity?.level === 'medium' ? 
                                       '0 4px 15px rgba(66, 165, 245, 0.3)' :
                                       '0 4px 15px rgba(102, 187, 106, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)'
                          }}
                          icon={
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.9)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 0.3
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: '0.5rem',
                                  fontWeight: 800,
                                  color: incident.severity?.level === 'critical' ? '#ff4757' :
                                         incident.severity?.level === 'high' ? '#ff9800' :
                                         incident.severity?.level === 'medium' ? '#2196f3' :
                                         '#4caf50'
                                }}
                              >
                                !
                              </Typography>
                            </Box>
                          }
                        />
                        <Box display="flex" alignItems="center">
                          <Timeline sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {formatDate(incident.timeline?.incidentDate)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Title */}
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        sx={{ 
                          mb: 2, 
                          flexGrow: 1,
                          fontWeight: 600,
                          lineHeight: 1.3,
                          color: 'text.primary'
                        }}
                      >
                        {incident.title}
                      </Typography>

                      {/* Summary */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 3, 
                          flexGrow: 1,
                          lineHeight: 1.6,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {incident.content?.summary || incident.content?.excerpt || 'No summary available'}
                      </Typography>

                      {/* Location and affected students */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box display="flex" alignItems="center">
                          <Public sx={{ fontSize: 18, mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {incident.geographic?.cities?.[0] || 'Unknown location'}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <People sx={{ fontSize: 18, mr: 1, color: theme.palette.secondary.main }} />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {incident.educationRelevance?.studentImpact?.estimated || 0} affected
                          </Typography>
                        </Box>
                      </Box>

                      {/* Tags */}
                      <Box sx={{ mb: 3 }}>
                        {incident.tags?.slice(0, 3).map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag.replace(/_/g, ' ')}
                            size="small"
                            sx={{ 
                              mr: 0.5, 
                              mb: 0.5,
                              background: 'rgba(102, 126, 234, 0.1)',
                              color: theme.palette.primary.main,
                              fontWeight: 500
                            }}
                          />
                        ))}
                        {incident.tags?.length > 3 && (
                          <Chip
                            label={`+${incident.tags.length - 3} more`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        )}
                      </Box>

                      {/* Action button */}
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(incident)}
                        sx={{ 
                          mt: 'auto',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2,
                          py: 1.5,
                          fontWeight: 600,
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Enhanced Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            maxHeight: '95vh',
            height: '95vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {selectedNews && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Enhanced Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                p: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }}
              />
              
              {/* Header Content */}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box sx={{ flex: 1, pr: 2 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        lineHeight: 1.2,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {selectedNews.title}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                      <Chip
                        label={selectedNews.severity?.level?.toUpperCase()}
                        sx={{
                          background: selectedNews.severity?.level === 'critical' ? 
                                     'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)' :
                                     selectedNews.severity?.level === 'high' ? 
                                     'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)' :
                                     selectedNews.severity?.level === 'medium' ? 
                                     'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)' :
                                     'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          px: 2.5,
                          py: 1.2,
                          borderRadius: 3,
                          boxShadow: selectedNews.severity?.level === 'critical' ? 
                                     '0 6px 20px rgba(255, 71, 87, 0.4)' :
                                     selectedNews.severity?.level === 'high' ? 
                                     '0 6px 20px rgba(255, 167, 38, 0.4)' :
                                     selectedNews.severity?.level === 'medium' ? 
                                     '0 6px 20px rgba(66, 165, 245, 0.4)' :
                                     '0 6px 20px rgba(102, 187, 106, 0.4)',
                          border: '2px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: selectedNews.severity?.level === 'critical' ? 
                                       '0 8px 25px rgba(255, 71, 87, 0.5)' :
                                       selectedNews.severity?.level === 'high' ? 
                                       '0 8px 25px rgba(255, 167, 38, 0.5)' :
                                       selectedNews.severity?.level === 'medium' ? 
                                       '0 8px 25px rgba(66, 165, 245, 0.5)' :
                                       '0 8px 25px rgba(102, 187, 106, 0.5)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                        icon={
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.9)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 0.5
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                color: selectedNews.severity?.level === 'critical' ? '#ff4757' :
                                       selectedNews.severity?.level === 'high' ? '#ff9800' :
                                       selectedNews.severity?.level === 'medium' ? '#2196f3' :
                                       '#4caf50'
                              }}
                            >
                              !
                            </Typography>
                          </Box>
                        }
                      />
                      
                      <Box display="flex" alignItems="center" gap={1}>
                        <Timeline sx={{ fontSize: 18 }} />
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDate(selectedNews.timeline?.incidentDate)}
                        </Typography>
                      </Box>
                      
                      {selectedNews.geographic?.countries && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Public sx={{ fontSize: 18 }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {selectedNews.geographic.countries.join(', ')}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  <IconButton 
                    onClick={handleCloseDialog}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Enhanced Content */}
            <Box sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              overflowX: 'hidden',
              p: 4,
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(102, 126, 234, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.5)'
                }
              }
            }}>
              {/* Summary Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Event sx={{ fontSize: 20 }} />
                  Incident Summary
                </Typography>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1.05rem',
                      color: 'text.primary'
                    }}
                  >
                    {selectedNews.content?.fullContent || selectedNews.content?.summary}
                  </Typography>
                </Card>
              </Box>

              {/* Key Information Grid */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Affected Users */}
                {selectedNews.educationRelevance?.studentImpact?.estimated && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
                        border: '1px solid rgba(255, 152, 0, 0.2)',
                        borderRadius: 3,
                        p: 2,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)'
                        }
                      }}
                    >
                      <People sx={{ fontSize: 32, color: theme.palette.warning.main, mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                        {selectedNews.educationRelevance.studentImpact.estimated.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Students Affected
                      </Typography>
                    </Card>
                  </Grid>
                )}

                {/* Impact Scope */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(30, 136, 229, 0.1) 100%)',
                      border: '1px solid rgba(33, 150, 243, 0.2)',
                      borderRadius: 3,
                      p: 2,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)'
                      }
                    }}
                  >
                    <Public sx={{ fontSize: 32, color: theme.palette.info.main, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.info.main, textTransform: 'capitalize' }}>
                      {selectedNews.severity?.impactScope || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Impact Scope
                    </Typography>
                  </Card>
                </Grid>

                {/* Education Level */}
                {selectedNews.educationRelevance?.educationLevel && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Card
                      sx={{
                        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        borderRadius: 3,
                        p: 2,
                        textAlign: 'center',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)'
                        }
                      }}
                    >
                      <School sx={{ fontSize: 32, color: theme.palette.success.main, mb: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main, textTransform: 'capitalize' }}>
                        {selectedNews.educationRelevance.educationLevel.join(', ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Education Level
                      </Typography>
                    </Card>
                  </Grid>
                )}

                {/* Incident Type */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(142, 36, 170, 0.1) 100%)',
                      border: '1px solid rgba(156, 39, 176, 0.2)',
                      borderRadius: 3,
                      p: 2,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(156, 39, 176, 0.2)'
                      }
                    }}
                  >
                    <Security sx={{ fontSize: 32, color: theme.palette.secondary.main, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.secondary.main, textTransform: 'capitalize' }}>
                      {selectedNews.incidentType?.replace(/_/g, ' ') || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Incident Type
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              {/* Enhanced Accordions */}
              <Box sx={{ '& .MuiAccordion-root': { mb: 2, borderRadius: 3, overflow: 'hidden' } }}>
                {/* Technical Details */}
                <Accordion
                  sx={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      '& .MuiAccordionSummary-content': { alignItems: 'center' }
                    }}
                  >
                    <Security sx={{ fontSize: 24, color: theme.palette.primary.main, mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      Technical Details
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {selectedNews.technicalDetails?.llmModels?.length > 0 && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                            AI Models Involved
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {selectedNews.technicalDetails.llmModels.map((model, index) => (
                              <Card key={index} sx={{ p: 2, background: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Security sx={{ color: theme.palette.primary.main }} />
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {model.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {model.provider} - {model.version}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Card>
                            ))}
                          </Box>
                        </Grid>
                      )}
                      
                      {selectedNews.technicalDetails?.attackVectors?.length > 0 && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                            Attack Vectors
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedNews.technicalDetails.attackVectors.map((vector, index) => (
                              <Chip
                                key={index}
                                label={vector.replace(/_/g, ' ')}
                                sx={{
                                  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%)',
                                  border: '1px solid rgba(244, 67, 54, 0.2)',
                                  color: theme.palette.error.main,
                                  fontWeight: 500,
                                  textTransform: 'capitalize'
                                }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Timeline */}
                {selectedNews.timeline?.timelineEvents?.length > 0 && (
                  <Accordion
                    sx={{
                      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(30, 136, 229, 0.05) 100%)',
                      border: '1px solid rgba(33, 150, 243, 0.1)',
                      '&:before': { display: 'none' }
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMore />}
                      sx={{ 
                        background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(30, 136, 229, 0.1) 100%)',
                        '& .MuiAccordionSummary-content': { alignItems: 'center' }
                      }}
                    >
                      <Timeline sx={{ fontSize: 24, color: theme.palette.info.main, mr: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                        Timeline
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3 }}>
                      <Box sx={{ position: 'relative' }}>
                        {selectedNews.timeline.timelineEvents.map((event, index) => (
                          <Box key={index} sx={{ display: 'flex', mb: 3, position: 'relative' }}>
                            {/* Timeline Line */}
                            <Box
                              sx={{
                                width: 3,
                                height: '100%',
                                background: 'linear-gradient(180deg, #2196f3 0%, #1976d2 100%)',
                                borderRadius: 2,
                                mr: 2,
                                position: 'relative'
                              }}
                            >
                              {/* Timeline Dot */}
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: theme.palette.info.main,
                                  position: 'absolute',
                                  top: 0,
                                  left: -4.5,
                                  border: '3px solid white',
                                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                                }}
                              />
                            </Box>
                            
                            {/* Event Content */}
                            <Card
                              sx={{
                                flex: 1,
                                p: 2,
                                background: 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid rgba(33, 150, 243, 0.2)',
                                borderRadius: 2
                              }}
                            >
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                {event.event}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(event.date)} • Source: {event.source}
                              </Typography>
                            </Card>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}

                {/* Impact Assessment */}
                <Accordion
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(255, 193, 7, 0.05) 100%)',
                    border: '1px solid rgba(255, 152, 0, 0.1)',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    sx={{ 
                      background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
                      '& .MuiAccordionSummary-content': { alignItems: 'center' }
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 24, color: theme.palette.warning.main, mr: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                      Impact Assessment
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, background: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.warning.main }}>
                            Immediate Impact
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2">
                              <strong>Users Affected:</strong> {selectedNews.impact?.immediate?.usersAffected?.toLocaleString() || 'Unknown'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Services Disrupted:</strong> {selectedNews.impact?.immediate?.servicesDisrupted?.join(', ') || 'None'}
                            </Typography>
                            {selectedNews.impact?.immediate?.financialLoss && (
                              <Typography variant="body2">
                                <strong>Financial Loss:</strong> ${selectedNews.impact.immediate.financialLoss.toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, background: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.warning.main }}>
                            Educational Impact
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2">
                              <strong>Students Affected:</strong> {selectedNews.impact?.educational?.studentsAffected?.toLocaleString() || 'Unknown'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Institutions Affected:</strong> {selectedNews.impact?.educational?.institutionsAffected || 'Unknown'}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Learning Disruption:</strong> {selectedNews.impact?.educational?.learningDisruption || 'Unknown'}
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Tags Section */}
              {selectedNews.tags?.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                    Related Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedNews.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag.replace(/_/g, ' ')}
                        sx={{
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                          border: '1px solid rgba(102, 126, 234, 0.2)',
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          textTransform: 'capitalize'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Enhanced Footer */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                borderTop: '1px solid rgba(102, 126, 234, 0.1)',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatDate(selectedNews.updatedAt || selectedNews.createdAt)}
              </Typography>
              <Button
                variant="contained"
                onClick={handleCloseDialog}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default NewsIncidentDisplay; 