import React, { useState, memo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  styled,
  alpha,
  useTheme,
  Fade,
  Slide
} from '@mui/material';
import {
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';

// Import visualization components
import AttackFlowVisualization from './AttackFlowVisualization';
import QuickStatsVisualization from './QuickStatsVisualization';
import { keyframes } from '@mui/system';

// 动画定义
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
  50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6); }
  100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
`;


// 完全独立的背景动画组件，使用固定定位避免重新渲染
const BackgroundAnimations = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: -1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        opacity: 0.1,
        animation: `${float} 6s ease-in-out infinite`
      }}
    >
      <PsychologyIcon sx={{ fontSize: 80, color: 'white' }} />
    </Box>
    <Box
      sx={{
        position: 'absolute',
        top: '20%',
        right: '15%',
        opacity: 0.1,
        animation: `${float} 8s ease-in-out infinite reverse`
      }}
    >
      <SchoolIcon sx={{ fontSize: 60, color: 'white' }} />
    </Box>
    <Box
      sx={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        opacity: 0.1,
        animation: `${float} 7s ease-in-out infinite`
      }}
    >
      <SecurityIcon sx={{ fontSize: 70, color: 'white' }} />
    </Box>
  </Box>
);

const VisualizationDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCardClick = (index) => {
    setActiveTab(index);
    // 平滑滚动到功能区域
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const visualizationTabs = [
    {
      label: 'Attack Impact',
      icon: <SecurityIcon />,
      component: AttackFlowVisualization,
      description: 'See how attacks affect real educational scenarios',
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      label: 'Quick Stats',
      icon: <BarChartIcon />,
      component: QuickStatsVisualization,
      description: 'Simple overview of your simulation results',
      color: 'info',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`visualization-tabpanel-${index}`}
      aria-labelledby={`visualization-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );

  const ActiveComponent = visualizationTabs[activeTab].component;

  const theme = useTheme();

  return (
    <>
      {/* 独立的背景动画层 */}
      <BackgroundAnimations />
      
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1
        }}
      >

      {/* Hero Section */}
      <Box
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          p: 4,
          m: 3,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2
          }}
        >
          <ViewIcon
            key="hero-icon"
            sx={{
              fontSize: 48,
              color: 'white',
              animation: `${float} 3s ease-in-out infinite`,
              mr: 2
            }}
          />
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            Your Learning Dashboard
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)'
          }}
        >
          See how your attack simulations are helping you understand LLM security in education
        </Typography>
      </Box>

      {/* Overview Cards */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Grid container spacing={4} justifyContent="center">
          {visualizationTabs.map((tab, index) => (
            <Slide direction="up" in={true} timeout={300 + index * 100} key={tab.label}>
              <Grid item xs={12} sm={6} lg={3}>
                <Card
                  onClick={() => handleCardClick(index)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      '& .feature-icon': {
                        animation: `${pulse} 0.6s ease-in-out`,
                      }
                    }
                  }}
                >
                  {/* Gradient Top Bar */}
                  <Box
                    sx={{
                      background: tab.gradient,
                      height: 4,
                      width: '100%',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12
                    }}
                  />
                  
                  <CardContent sx={{ p: 3, textAlign: 'center', flexGrow: 1 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        color: theme.palette[tab.color].main,
                        mb: 2,
                        '& .MuiSvgIcon-root': { fontSize: 40 }
                      }}
                    >
                      {tab.icon}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        mb: 1
                      }}
                    >
                      {tab.label}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      {tab.description}
                    </Typography>
                    
                  </CardContent>
                </Card>
              </Grid>
            </Slide>
          ))}
        </Grid>
      </Box>

      {/* Information Banner */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Slide direction="up" in={true} timeout={700}>
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 3,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InfoIcon sx={{ color: theme.palette.info.main, fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Explore Your Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click on different tabs to see how your attack simulations performed. Learn from successful attacks and understand what makes educational AI systems vulnerable.
              </Typography>
            </Box>
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<PlayIcon />}
            onClick={() => navigate('/simulation')}
            sx={{ 
              fontWeight: 'bold',
              textTransform: 'none',
              px: 4,
              py: 2,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Run New Simulation
          </Button>
          </Box>
        </Slide>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ px: 3, display: 'flex', justifyContent: 'center' }}>
        <Slide direction="up" in={true} timeout={800}>
          <Paper 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            overflow: 'hidden',
            display: 'inline-flex',
            maxWidth: 'fit-content'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="visualization tabs"
            variant="standard"
            sx={{
              minHeight: 60,
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '2px 2px 0 0',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              },
              '& .MuiTab-root': {
                minHeight: 60,
                minWidth: 140,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&.Mui-selected': {
                  background: 'rgba(102, 126, 234, 0.05)',
                  color: theme.palette.primary.main
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.08)'
                }
              }
            }}
          >
            {visualizationTabs.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
                sx={{ 
                  color: activeTab === index ? theme.palette.primary.main : theme.palette.text.secondary,
                  '& .MuiSvgIcon-root': { 
                    fontSize: 20,
                    mr: 1
                  }
                }}
              />
            ))}
          </Tabs>
          </Paper>
        </Slide>
      </Box>

      {/* Tab Content */}
      <Box ref={contentRef} sx={{ px: 3, pb: 3 }}>
        {visualizationTabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            <Fade in timeout={600}>
              <Box
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 3,
                  p: 3,
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <ActiveComponent />
              </Box>
            </Fade>
          </TabPanel>
        ))}
      </Box>

      </Box>
    </>
  );
};

export default VisualizationDashboard;
