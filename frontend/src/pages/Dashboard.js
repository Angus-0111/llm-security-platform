import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material';
import { Security, Visibility, Assessment, Newspaper, BarChart } from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();

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

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Attack Simulation</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Simulate various LLM security attacks including prompt injection,
                adversarial inputs, and data leakage scenarios.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => navigate('/simulation')}>
                  Go to Attack Simulation
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Visibility color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Visualization</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Interactive charts and dashboards to visualize attack impacts
                and compare original vs attacked outputs.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" disabled>
                  Coming soon
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Risk Assessment</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Automated risk scoring and comprehensive reports with
                mitigation recommendations for educational contexts.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => navigate('/risk-assessment')}>
                  Go to Risk Assessment
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Newspaper color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Real Incident Case</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                View education-related LLM security incidents collected from real sources.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => navigate('/incidents')}>
                  Go to Real Incident Case
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChart color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Report Generation</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                Generate comprehensive security reports from simulation data
                and risk assessments for analysis and sharing.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => navigate('/reports')}>
                  Go to Report Generation
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Development Status
        </Typography>
        <Typography variant="body2">
          Backend and database connected<br/>
          Real incident data integrated (NewsIncident)<br/>
          Attack Simulation MVP with LLM integration<br/>
          <strong>NEW:</strong> Risk Assessment & Report Generation (Week 7)<br/>
          Available: Dashboard, Attack Simulation, Risk Assessment, Report Generation, Real Incident Case
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;


