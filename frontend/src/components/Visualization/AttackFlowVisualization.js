import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme
} from '@mui/material';
import {
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  School as EducationIcon,
  AutoFixHigh as AttackIcon,
  Psychology as AIIcon
} from '@mui/icons-material';

const AttackFlowVisualization = () => {
  const theme = useTheme();
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [attackFlowData, setAttackFlowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null);

  useEffect(() => {
    fetchAttackFlowData();
  }, []);

  const fetchAttackFlowData = async () => {
    try {
      setLoading(true);
      // 同时获取模拟数据和模板数据
      const [simulationsResponse, templatesResponse] = await Promise.all([
        fetch('/api/simulations/history?limit=20'),
        fetch('/api/attack-data')
      ]);
      
      const simulationsData = await simulationsResponse.json();
      const templatesData = await templatesResponse.json();
      
      if (simulationsData.status === 'success') {
        const simulations = simulationsData.data.simulations || [];
        
        // 如果有模板数据，尝试匹配并补充信息
        if (templatesData.status === 'success' && templatesData.data.length > 0) {
          const templates = templatesData.data;
          
          // 为每个模拟补充模板信息
          const enrichedSimulations = simulations.map(sim => {
            // 尝试从 metadata.notes 中提取模板名称
            const notes = sim.metadata?.notes || '';
            const templateMatch = notes.match(/template:\s*([^,\]]+)/i);
            
            if (templateMatch) {
              const templateName = templateMatch[1].trim();
              const matchingTemplate = templates.find(t => 
                t.name.toLowerCase().includes(templateName.toLowerCase()) ||
                templateName.toLowerCase().includes(t.name.toLowerCase())
              );
              
              if (matchingTemplate) {
                return {
                  ...sim,
                  attackType: matchingTemplate.attackType,
                  educationScenario: matchingTemplate.educationScenario,
                  originalPrompt: sim.inputData?.originalPrompt || matchingTemplate.originalPrompt,
                  attackPrompt: sim.inputData?.attackPrompt || matchingTemplate.maliciousPrompt
                };
              }
            }
            
            return sim;
          });
          
          setAttackFlowData(enrichedSimulations);
        } else {
          setAttackFlowData(simulations);
        }
      }
    } catch (error) {
      console.error('Failed to fetch attack flow data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleViewFlow = (simulation) => {
    setSelectedFlow(simulation);
    setDialogOpen(true);
  };

  const AttackFlowCard = ({ simulation, index }) => {
    const isSuccessful = simulation.attackSuccess?.isSuccessful;
    
    // 从 metadata 中获取攻击类型和场景信息
    const attackType = simulation.metadata?.attackType || 
                      simulation.attackType || 
                      'Custom Attack';
    const scenario = simulation.metadata?.educationScenario || 
                     simulation.educationScenario || 
                     'General Context';
    
    // 格式化攻击类型显示名称
    const getAttackTypeDisplayName = (type) => {
      const typeMap = {
        'prompt_injection': 'Prompt Injection',
        'jailbreak': 'Jailbreak',
        'adversarial_input': 'Adversarial Input',
        'extraction': 'Data Leakage',
        'backdoor': 'Backdoor',
        'poisoning': 'Poisoning',
        'evasion': 'Evasion'
      };
      return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };
    
    return (
      <Card 
        sx={{ 
          mb: 2, 
          border: isSuccessful ? '2px solid #f44336' : '2px solid #4caf50',
          position: 'relative',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {getAttackTypeDisplayName(attackType)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {scenario.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Chip
                icon={isSuccessful ? <ErrorIcon /> : <CheckCircleIcon />}
                label={isSuccessful ? 'ATTACK SUCCESSFUL' : 'ATTACK BLOCKED'}
                color={isSuccessful ? 'error' : 'success'}
                variant="filled"
                sx={{ fontWeight: 'bold' }}
              />
              <Button
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => handleViewFlow(simulation)}
                variant="outlined"
              >
                Analyze Details
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: 2,
                p: 2,
                border: '1px solid rgba(102, 126, 234, 0.1)',
                height: '100%'
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.primary.main,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <EducationIcon sx={{ fontSize: 18 }} />
                  Original Request
                </Typography>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 2,
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {simulation.originalPrompt || simulation.inputData?.originalPrompt ? 
                      ((simulation.originalPrompt || simulation.inputData?.originalPrompt).length > 150 ? 
                        (simulation.originalPrompt || simulation.inputData?.originalPrompt).substring(0, 150) + '...' : 
                        (simulation.originalPrompt || simulation.inputData?.originalPrompt)) : 
                      'No original prompt data available'}
                  </Typography>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                background: 'rgba(255, 152, 0, 0.05)',
                borderRadius: 2,
                p: 2,
                border: '1px solid rgba(255, 152, 0, 0.1)',
                height: '100%'
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.warning.main,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AttackIcon sx={{ fontSize: 18 }} />
                  Attack Attempt
                </Typography>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 2,
                  backdropFilter: 'blur(5px)',
                  border: '1px solid rgba(255, 152, 0, 0.1)'
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {simulation.attackPrompt || simulation.inputData?.attackPrompt ? 
                      ((simulation.attackPrompt || simulation.inputData?.attackPrompt).length > 150 ? 
                        (simulation.attackPrompt || simulation.inputData?.attackPrompt).substring(0, 150) + '...' : 
                        (simulation.attackPrompt || simulation.inputData?.attackPrompt)) : 
                      'No attack prompt data available'}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Created: {new Date(simulation.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const FlowDialog = () => (
    <Dialog 
      open={dialogOpen} 
      onClose={() => setDialogOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0',
        position: 'relative'
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <SecurityIcon sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Detailed Attack Flow Analysis
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setDialogOpen(false)}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 12 }}>
        {selectedFlow && (
          <Box sx={{ pt: 2 }}>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  background: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  mb: 2
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600, 
                    color: 'primary.main',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <EducationIcon sx={{ fontSize: 18 }} />
                    Original Prompt
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedFlow.originalPrompt || selectedFlow.inputData?.originalPrompt || 'No original prompt data available'}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ 
                  background: 'rgba(33, 150, 243, 0.05)',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(33, 150, 243, 0.1)'
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600, 
                    color: 'info.main',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <AIIcon sx={{ fontSize: 18 }} />
                    Original Response
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(33, 150, 243, 0.1)'
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedFlow.originalResponse?.content || selectedFlow.originalResponse || 'No response data'}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  background: 'rgba(255, 152, 0, 0.05)',
                  borderRadius: 2,
                  p: 2,
                  border: '1px solid rgba(255, 152, 0, 0.1)',
                  mb: 2
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600, 
                    color: 'warning.main',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <AttackIcon sx={{ fontSize: 18 }} />
                    Attack Prompt
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 152, 0, 0.1)',
                    maxHeight: 150, 
                    overflow: 'auto'
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedFlow.attackPrompt || selectedFlow.inputData?.attackPrompt || 'No attack prompt data available'}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ 
                  background: selectedFlow.attackSuccess?.isSuccessful 
                    ? 'rgba(244, 67, 54, 0.05)' 
                    : 'rgba(76, 175, 80, 0.05)',
                  borderRadius: 2,
                  p: 2,
                  border: `1px solid ${selectedFlow.attackSuccess?.isSuccessful ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'}`
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600, 
                    color: selectedFlow.attackSuccess?.isSuccessful ? 'error.main' : 'success.main',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <ErrorIcon sx={{ fontSize: 18 }} />
                    Attacked Response
                  </Typography>
                  <Paper sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    backdropFilter: 'blur(5px)',
                    border: `1px solid ${selectedFlow.attackSuccess?.isSuccessful ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)'}`,
                    maxHeight: 150,
                    overflow: 'auto'
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {selectedFlow.attackedResponse?.content || 'No response data'}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={() => setDialogOpen(false)}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

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
        <SecurityIcon sx={{ color: theme.palette.primary.main }} />
        Attack Impact Analysis
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Discover real attack scenarios and their impact on educational AI systems. Learn from actual simulations to understand vulnerabilities and defenses.
      </Typography>

      {attackFlowData.length === 0 ? (
        <Alert severity="info">
          No attack examples available yet. Try running some attack simulations to see real examples of how attacks work!
        </Alert>
      ) : (
        <Box>
          {attackFlowData.map((simulation, index) => (
            <AttackFlowCard 
              key={simulation._id} 
              simulation={simulation} 
              index={index}
            />
          ))}
        </Box>
      )}

      <FlowDialog />
    </Box>
  );
};

export default AttackFlowVisualization;

