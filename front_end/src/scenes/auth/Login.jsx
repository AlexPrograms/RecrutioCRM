import React, { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { login as authLogin, isAuthenticated } from "../../services/authService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    let isValid = true;
    
    if (!formData.email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!formData.password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (name === "email" && emailError) setEmailError("");
    if (name === "password" && passwordError) setPasswordError("");
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setError("");
    setLoading(true);
    
    // Clear any previous redirect flags
    sessionStorage.removeItem('redirecting_to_login');

    try {
      console.log('Login attempt with:', { email: formData.email });
      
      // For testing purposes, allow demo login with hardcoded credentials
      if (formData.email === 'demo@example.com' && formData.password === 'demo123') {
        // Mock successful login
        localStorage.setItem('access_token', 'demo_mock_token');
        localStorage.setItem('refresh_token', 'demo_mock_refresh_token');
        console.log('Demo login successful');
        navigate('/', { replace: true });
        return;
      }
      
      // Normal login flow
      const result = await authLogin(formData.email, formData.password);
      
      console.log('Login result:', result);
      
      if (result && result.success) {
        console.log('Login successful, redirecting to dashboard...');
        navigate('/', { replace: true });
      } else {
        const errorMessage = result?.error || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login exception:', err);
      // Improved error handling with fallbacks
      const errorMsg = 
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'An error occurred during login. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // If user is already authenticated, redirect to home
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #110019 0%, #180038 50%, #1d003f 100%)",
        color: "#fff",
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          px: 4,
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          Welcome Back <span style={{ color: "#c084fc" }}>!</span>
        </Typography>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
            Glad you're back
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, backgroundColor: 'rgba(211, 47, 47, 0.1)' }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="outlined"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
            InputProps={{ 
              style: { color: "#fff" },
              autoComplete: "email"
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#c084fc',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#c084fc',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#ff6b6b',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            margin="normal"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!passwordError}
            helperText={passwordError}
            disabled={loading}
            InputProps={{
              style: { color: "#fff" },
              autoComplete: "current-password",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleTogglePassword} 
                    edge="end"
                    disabled={loading}
                    sx={{ color: "#aaa" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ style: { color: "#aaa" } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#c084fc',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#c084fc',
                },
              },
              '& .MuiFormHelperText-root': {
                color: '#ff6b6b',
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox 
                checked={formData.rememberMe}
                onChange={handleChange}
                name="rememberMe"
                sx={{ 
                  color: '#c084fc',
                  '&.Mui-checked': {
                    color: '#c084fc',
                  },
                }} 
                disabled={loading}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Remember me
              </Typography>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              mt: 2,
              py: 1.4,
              borderRadius: 2,
              background: "linear-gradient(to right, #7b2ff7, #f107a3)",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              '&:hover': {
                background: "linear-gradient(to right, #6a1cf0, #d9068c)",
              },
              '&:disabled': {
                background: "#555",
                color: "#999"
              }
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

          <Box textAlign="center" mt={2}>
            <Link 
              href="#" 
              variant="body2" 
              sx={{ 
                color: "#aaa",
                '&:hover': {
                  color: '#c084fc',
                  cursor: 'pointer',
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                // Handle forgot password
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Divider sx={{ my: 3, borderColor: "#444" }}>Or</Divider>

          <Box display="flex" justifyContent="center" gap={2}>
            <IconButton 
              sx={{ 
                color: "#fff",
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }
              }} 
              disabled={loading}
            >
              <FaGoogle />
            </IconButton>
            <IconButton 
              sx={{ 
                color: "#fff",
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }
              }} 
              disabled={loading}
            >
              <FaFacebookF />
            </IconButton>
            <IconButton 
              sx={{ 
                color: "#fff",
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                '&:disabled': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }
              }} 
              disabled={loading}
            >
              <FaGithub />
            </IconButton>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              Don't have an account?{" "}
              <Link 
                href="#" 
                underline="hover" 
                sx={{ 
                  color: "#c084fc",
                  '&:hover': {
                    cursor: 'pointer',
                  }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}
              >
                Signup
              </Link>
            </Typography>
            <Box mt={1} display="flex" justifyContent="space-between" flexWrap="wrap">
              <Link href="#" variant="caption" sx={{ color: "#666", '&:hover': { color: '#c084fc' } }}>
                Terms & Conditions
              </Link>
              <Link href="#" variant="caption" sx={{ color: "#666", '&:hover': { color: '#c084fc' } }}>
                Support
              </Link>
              <Link href="#" variant="caption" sx={{ color: "#666", '&:hover': { color: '#c084fc' } }}>
                Customer Care
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
