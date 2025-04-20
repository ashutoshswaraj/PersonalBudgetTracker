import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <AnimatedBackground />
      
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          borderRadius: '24px',
          border: '1px solid',
          borderColor: 'rgba(76, 175, 80, 0.2)',
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          zIndex: 1,
          transition: 'transform 0.2s ease-in-out, border-color 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
            borderColor: 'rgba(76, 175, 80, 0.5)',
          },
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#fff',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            Welcome Back ✨
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            Sign in to continue to your account 💅
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff5252',
              border: '1px solid rgba(211, 47, 47, 0.2)',
              '& .MuiAlert-icon': {
                color: '#ff5252',
              },
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(76, 175, 80, 0.5)',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50',
                  },
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiOutlinedInput-input': {
                color: '#fff',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4CAF50',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(76, 175, 80, 0.5)',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4CAF50',
                  },
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiOutlinedInput-input': {
                color: '#fff',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#4CAF50',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.8,
              borderRadius: '16px',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              background: 'linear-gradient(135deg, #388E3C 0%, #4CAF50 50%, #81C784 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
                transform: 'translateY(-100%)',
                transition: 'transform 0.3s ease-in-out',
              },
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 0 30px rgba(76, 175, 80, 0.5)',
                border: '1px solid rgba(76, 175, 80, 0.5)',
                '&::before': {
                  transform: 'translateY(0)',
                },
              },
              '&:active': {
                transform: 'translateY(-1px)',
                boxShadow: '0 0 15px rgba(76, 175, 80, 0.4)',
              },
              '&.Mui-disabled': {
                background: 'linear-gradient(135deg, #388E3C40 0%, #4CAF5040 50%, #81C78440 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              {loading ? (
                <>
                  <span>Signing in</span>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      gap: '4px',
                      alignItems: 'center',
                      '& .dot': {
                        width: '4px',
                        height: '4px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        animation: 'loadingDots 1.4s infinite',
                        '&:nth-of-type(2)': {
                          animationDelay: '0.2s',
                        },
                        '&:nth-of-type(3)': {
                          animationDelay: '0.4s',
                        },
                      },
                      '@keyframes loadingDots': {
                        '0%, 100%': {
                          opacity: 0.2,
                          transform: 'translateY(0)',
                        },
                        '50%': {
                          opacity: 1,
                          transform: 'translateY(-4px)',
                        },
                      },
                    }}
                  >
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </Box>
                  <span style={{ marginLeft: '4px' }}>📈</span>
                </>
              ) : (
                <>
                  Sign In
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      transform: 'translateY(-1px)',
                      '& svg': {
                        fontSize: '1.3rem',
                      },
                    }}
                  >
                    📊
                  </Box>
                </>
              )}
            </Box>
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
          Don't have an account?{' '}
          <Link
            component={RouterLink}
            to="/register"
            sx={{
              color: '#4CAF50',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Sign Up 🌟
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 