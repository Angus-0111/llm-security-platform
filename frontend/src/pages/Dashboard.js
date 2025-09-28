import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Container,
  Fade,
  Slide,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Security,
  MenuBook,
  Visibility,
  Newspaper,
  ArrowForward,
  AutoAwesome,
  TrendingUp,
  Analytics,
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// 动画定义
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: 'Learn',
      description: 'Explore comprehensive LLM attack concepts, types, risks, and real-world examples.',
      icon: MenuBook,
      color: 'primary',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/learn',
      delay: 0
    },
    {
      title: 'Attack Simulation',
      description: 'Simulate various LLM security attacks including prompt injection, adversarial inputs, and data leakage scenarios.',
      icon: Security,
      color: 'secondary',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/simulation',
      delay: 100
    },
    {
      title: 'Visualization',
      description: 'Interactive charts and dashboards to visualize attack impacts and compare original vs attacked outputs.',
      icon: Visibility,
      color: 'success',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/visualization',
      delay: 200
    },
    {
      title: 'Real Incident Case',
      description: 'View education-related LLM security incidents collected from real sources and news.',
      icon: Newspaper,
      color: 'warning',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/incidents',
      delay: 300
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        {/* Hero Section */}
        <Fade in={mounted} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                p: 3,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                animation: `${float} 6s ease-in-out infinite`,
              }}
            >
              <Security 
                sx={{ 
                  fontSize: 48, 
                  color: 'white',
                  animation: `${glow} 3s ease-in-out infinite`,
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
                }} 
              />
              <Box>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 800,
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    mb: 1
                  }}
                >
                  LLM Security Platform
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 400,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  for Education
                </Typography>
              </Box>
            </Box>
            
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'white', 
                fontWeight: 600, 
                mb: 2,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              Welcome to the Future of LLM Security
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              Simulate, visualize, and understand attacks on educational LLM tools with our comprehensive security platform
            </Typography>
          </Box>
        </Fade>

        {/* Features Grid */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={feature.title}>
              <Slide 
                in={mounted} 
                direction="up" 
                timeout={600 + feature.delay}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      '& .feature-icon': {
                        animation: `${pulse} 0.6s ease-in-out`,
                      }
                    }
                  }}
                  onClick={() => navigate(feature.route)}
                >
                  <Box
                    sx={{
                      background: feature.gradient,
                      height: 4,
                      width: '100%'
                    }}
                  />
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        className="feature-icon"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: `${alpha(theme.palette[feature.color].main, 0.1)}`,
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <feature.icon 
                          sx={{ 
                            fontSize: 28, 
                            color: theme.palette[feature.color].main,
                          }} 
                        />
                      </Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          color: theme.palette.text.primary
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        flexGrow: 1,
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          ))}
        </Grid>

        {/* Bottom Stats */}
        <Fade in={mounted} timeout={1200}>
          <Box 
            sx={{ 
              mt: 8, 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 4,
              flexWrap: 'wrap'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                4
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Core Features
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                10+
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Attack Types
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                100%
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Educational Focus
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Dashboard;