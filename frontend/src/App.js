import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { Security, Visibility, Assessment, Newspaper } from '@mui/icons-material';
import NewsIncidentDisplay from './components/NewsIncidentDisplay';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome to LLM Security Platform
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Simulate and visualize attacks on educational LLM tools
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Security color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Attack Simulation</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Simulate various LLM security attacks including prompt injection, 
                      adversarial inputs, and data leakage scenarios.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Visibility color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Visualization</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Interactive charts and dashboards to visualize attack impacts 
                      and compare original vs attacked outputs.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Assessment color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Risk Assessment</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Automated risk scoring and comprehensive reports with 
                      mitigation recommendations for educational contexts.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Development Status
              </Typography>
              <Typography variant="body2">
                Project structure and dependencies installed<br/>
                Ready for Week 3: UI prototype development<br/>
                Week 2 Environment Setup: COMPLETED<br/>
                <strong>NEW:</strong> Real incident data integrated - Vietnamese student cheating case
              </Typography>
            </Box>
          </Box>
        );
      case 1:
        return <NewsIncidentDisplay />;
      default:
        return <Typography>Coming soon...</Typography>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LLM Security Platform for Education
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="platform navigation">
            <Tab 
              icon={<Security />} 
              label="Dashboard" 
              iconPosition="start"
            />
            <Tab 
              icon={<Newspaper />} 
              label="Real Incident Case" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Content */}
        {renderContent()}
      </Container>
    </ThemeProvider>
  );
}

export default App; 