import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, TextField, Alert } from '@mui/material';
import { login, refreshToken, isAuthenticated } from '../services/authService';
import api from '../utils/api';

const AuthDebugger = () => {
  const [authStatus, setAuthStatus] = useState({ 
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    error: null
  });
  const [testApiResponse, setTestApiResponse] = useState(null);
  const [testCredentials, setTestCredentials] = useState({
    email: 'test@email.com',
    password: 'test'
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshTokenValue = localStorage.getItem('refresh_token');
    
    setAuthStatus({
      isAuthenticated: !!accessToken,
      accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : null,
      refreshToken: refreshTokenValue ? `${refreshTokenValue.substring(0, 10)}...` : null,
      error: null
    });
  };

  const handleLogin = async () => {
    try {
      setAuthStatus(prev => ({ ...prev, error: null }));
      const result = await login(testCredentials.email, testCredentials.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        setAuthStatus({
          isAuthenticated: true,
          accessToken: localStorage.getItem('access_token').substring(0, 10) + '...',
          refreshToken: localStorage.getItem('refresh_token').substring(0, 10) + '...',
          error: null
        });
      } else {
        setAuthStatus(prev => ({ ...prev, error: result.error }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthStatus(prev => ({ ...prev, error: error.message }));
    }
  };

  const handleCredentialChange = (field) => (e) => {
    setTestCredentials(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    checkAuthStatus();
  };

  const handleTokenRefresh = async () => {
    try {
      const result = await refreshToken();
      if (result.success) {
        checkAuthStatus();
      } else {
        setAuthStatus(prev => ({ ...prev, error: 'Refresh failed: ' + result.error }));
      }
    } catch (error) {
      setAuthStatus(prev => ({ ...prev, error: 'Refresh error: ' + error.message }));
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      // You can replace this with any protected endpoint in your API
      const response = await api.get('/api/auth/protected-test/');
      setTestApiResponse({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('API test error:', error);
      setTestApiResponse({
        success: false,
        error: error.message
      });
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Authentication Debugger</Typography>
      
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Authentication Status</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography>
            <strong>Authenticated:</strong> {authStatus.isAuthenticated ? 'Yes' : 'No'}
          </Typography>
          <Typography>
            <strong>Access Token:</strong> {authStatus.accessToken || 'Not set'}
          </Typography>
          <Typography>
            <strong>Refresh Token:</strong> {authStatus.refreshToken || 'Not set'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={checkAuthStatus}
          >
            Refresh Status
          </Button>
          
          {authStatus.isAuthenticated && (
            <>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={handleTokenRefresh}
              >
                Refresh Token
              </Button>
              
              <Button 
                variant="contained" 
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Paper>
      
      {!authStatus.isAuthenticated && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Login Test</Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={testCredentials.email}
              onChange={handleCredentialChange('email')}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={testCredentials.password}
              onChange={handleCredentialChange('password')}
            />
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleLogin}
          >
            Test Login
          </Button>
        </Paper>
      )}
      
      {authStatus.isAuthenticated && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>API Test</Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={testProtectedEndpoint}
            sx={{ mb: 2 }}
          >
            Test Protected API
          </Button>
          
          {testApiResponse && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                Result: {testApiResponse.success ? 'Success' : 'Failed'}
              </Typography>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px', 
                maxHeight: '200px', 
                overflow: 'auto' 
              }}>
                {testApiResponse.success 
                  ? JSON.stringify(testApiResponse.data, null, 2) 
                  : testApiResponse.error}
              </pre>
            </Box>
          )}
        </Paper>
      )}
      
      {authStatus.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {authStatus.error}
        </Alert>
      )}
    </Box>
  );
};

export default AuthDebugger;
