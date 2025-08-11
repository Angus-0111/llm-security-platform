import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Security, ArrowBack } from '@mui/icons-material';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NewsIncidentDisplay from './components/NewsIncidentDisplay';
import AttackSimulation from './components/AttackSimulation';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function Layout({ children }) {
  const navigate = useNavigate();
  const isHome = window.location.pathname === '/';
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LLM Security Platform for Education
          </Typography>
          {!isHome && (
            <Button color="inherit" startIcon={<ArrowBack />} onClick={() => navigate('/')}>Home</Button>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>{children}</Container>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulation" element={<AttackSimulation />} />
            <Route path="/incidents" element={<NewsIncidentDisplay />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App; 