import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Stack,
  IconButton,
  AppBar,
  Toolbar,
  useScrollTrigger,
  Slide,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Fade,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Timeline,
  Category,
  ShowChart,
  Savings,
  Speed,
  Security,
  CloudDone,
  KeyboardArrowDown,
  Menu as MenuIcon,
  Dashboard,
  BarChart,
  PieChart,
  AccountBalance,
  Email,
  Lock,
  Person,
  Close,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Hide AppBar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const AuthDialog = ({ open, onClose, isLogin, onSuccess, setAuthDialog }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchMode = () => {
    setFormData({ email: '', password: '', name: '' });
    setError('');
    onClose();
    setTimeout(() => {
      setAuthDialog({ open: true, isLogin: !isLogin });
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #4CAF50, #81C784)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 3 }}>
        <IconButton
          onClick={onClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgba(255, 255, 255, 0.5)',
            '&:hover': { color: '#fff' },
          }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(211, 47, 47, 0.1)' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {!isLogin && (
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      sx={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%)',
                  transform: 'rotate(45deg)',
                  animation: 'buttonGlow 3s linear infinite',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                isLogin ? 'Login' : 'Create Account'
              )}
            </Button>
          </Stack>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Button
              variant="text"
              onClick={handleSwitchMode}
              disabled={loading}
              sx={{ 
                color: '#4CAF50',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' },
              }}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

// Animated Background Component
const AnimatedBackground = () => {
  const emojis = ['📈', '💰', '💹', '📊', '🏦', '💳', '💵', '📱'];
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.1) 0%, transparent 50%)',
          animation: 'pulse 15s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 50px,
            rgba(76, 175, 80, 0.05) 50px,
            rgba(76, 175, 80, 0.05) 51px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 50px,
            rgba(76, 175, 80, 0.05) 50px,
            rgba(76, 175, 80, 0.05) 51px
          )`,
        },
        '@keyframes pulse': {
          '0%, 100%': {
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1.5)',
          },
        },
      }}
    >
      {emojis.map((emoji, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            fontSize: '2.5rem',
            opacity: 0.15,
            animation: `float ${8 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 8}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: 'scale(1.2)',
            filter: 'blur(0.5px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              opacity: 0.4,
              transform: 'scale(1.4)',
              filter: 'blur(0)',
            },
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translate(0, 0) scale(1.2) rotate(0deg)',
              },
              '25%': {
                transform: 'translate(20px, -20px) scale(1.3) rotate(5deg)',
              },
              '50%': {
                transform: 'translate(-10px, -40px) scale(1.2) rotate(-5deg)',
              },
              '75%': {
                transform: 'translate(-20px, -20px) scale(1.3) rotate(0deg)',
              },
            },
          }}
        >
          {emoji}
        </Box>
      ))}
    </Box>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authDialog, setAuthDialog] = useState({ open: false, isLogin: true });

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleAuthOpen = (isLogin) => {
    setAuthDialog({ open: true, isLogin });
  };

  const handleAuthClose = () => {
    setAuthDialog({ ...authDialog, open: false });
  };

  const handleAuthSuccess = () => {
    handleAuthClose();
    navigate('/dashboard');
  };

  const navItems = [
    { text: 'Features', href: '#features' },
    { text: 'About', href: '#about' },
    { text: 'Contact', href: '#contact' },
  ];

  const features = [
    {
      icon: <Timeline />,
      title: 'Track Expenses',
      description: 'Monitor your spending patterns with intuitive visualizations'
    },
    {
      icon: <Category />,
      title: 'Categorize',
      description: 'Organize transactions into custom categories for better insights'
    },
    {
      icon: <ShowChart />,
      title: 'Analytics',
      description: 'Get detailed reports and trends of your financial activity'
    },
    {
      icon: <Savings />,
      title: 'Save Money',
      description: 'Set budgets and achieve your financial goals effectively'
    },
    {
      icon: <Speed />,
      title: 'Real-time Updates',
      description: 'See your financial status update instantly as you add transactions'
    },
    {
      icon: <Security />,
      title: 'Secure',
      description: 'Your financial data is encrypted and completely secure'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navbar */}
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          elevation={isScrolled ? 1 : 0}
          sx={{
            background: isScrolled 
              ? 'rgba(18, 18, 18, 0.95)'
              : 'transparent',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            borderBottom: isScrolled 
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : 'none',
            transition: 'all 0.3s ease',
            py: { xs: 1, md: 2 },
            zIndex: 10,
          }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                justifyContent: 'space-between',
                minHeight: { xs: '64px', md: '80px' },
              }}
            >
              {/* Logo */}
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center" 
                component={Link} 
                to="/"
                sx={{ 
                  textDecoration: 'none',
                  color: '#fff',
                  '&:hover': {
                    color: '#4CAF50'
                  }
                }}
              >
                <AccountBalanceWallet sx={{ fontSize: { xs: 28, md: 32 } }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Budget Planner
                </Typography>
              </Stack>

              {/* Desktop Navigation */}
              <Stack 
                direction="row" 
                spacing={6}
                alignItems="center"
                sx={{ 
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                {navItems.map((item) => (
                  <Typography
                    key={item.text}
                    component="a"
                    href={item.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      padding: '4px 0',
                      '&:hover': {
                        color: '#fff',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '0%',
                        height: '2px',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#4CAF50',
                        transition: 'width 0.2s ease',
                      },
                      '&:hover::after': {
                        width: '100%',
                      },
                    }}
                  >
                    {item.text}
                  </Typography>
                ))}
                <Stack direction="row" spacing={2} sx={{ ml: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleAuthOpen(true)}
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        borderColor: '#4CAF50',
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleAuthOpen(false)}
                    sx={{
                      bgcolor: '#4CAF50',
                      px: 3,
                      py: 1,
                      '&:hover': {
                        bgcolor: '#43A047',
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Stack>
              </Stack>

              {/* Mobile Menu */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  onClick={handleMobileMenuOpen}
                  sx={{ 
                    color: 'white',
                    width: 48,
                    height: 48,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <MenuIcon sx={{ fontSize: 28 }} />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleMobileMenuClose}
                  sx={{
                    mt: 2,
                    '& .MuiPaper-root': {
                      bgcolor: 'rgba(18, 18, 18, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      minWidth: '270px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }
                  }}
                >
                  {navItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      onClick={handleMobileMenuClose}
                      component="a"
                      href={item.href}
                      sx={{
                        py: 2,
                        px: 3,
                        color: 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#fff',
                          bgcolor: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      {item.text}
                    </MenuItem>
                  ))}
                  <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                          handleMobileMenuClose();
                          handleAuthOpen(true);
                        }}
                        sx={{
                          color: '#fff',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          py: 1.5,
                          '&:hover': {
                            borderColor: '#4CAF50',
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                          }
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                          handleMobileMenuClose();
                          handleAuthOpen(false);
                        }}
                        sx={{
                          bgcolor: '#4CAF50',
                          py: 1.5,
                          '&:hover': {
                            bgcolor: '#43A047',
                          }
                        }}
                      >
                        Get Started
                      </Button>
                    </Stack>
                  </Box>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialog.open}
        onClose={handleAuthClose}
        isLogin={authDialog.isLogin}
        onSuccess={handleAuthSuccess}
        setAuthDialog={setAuthDialog}
      />

      {/* Hero Section */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero Content */}
        <Grid 
          container 
          spacing={4} 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            minHeight: '100vh',
            pt: { xs: 8, md: 0 },
          }}
        >
          <Grid item xs={12} md={8}>
            <Stack spacing={4} sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    color: '#4CAF50',
                    fontWeight: 600,
                    letterSpacing: 2,
                    mb: 2,
                    display: 'block',
                    position: 'relative',
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      width: { xs: '40px', md: '80px' },
                      height: '1px',
                      background: 'linear-gradient(90deg, rgba(76, 175, 80, 0) 0%, #4CAF50 100%)',
                    },
                    '&::before': {
                      right: '100%',
                      marginRight: '20px',
                    },
                    '&::after': {
                      left: '100%',
                      marginLeft: '20px',
                      transform: 'rotate(180deg)',
                    },
                  }}
                >
                  SMART MONEY MANAGEMENT
                </Typography>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                    fontWeight: 800,
                    lineHeight: 1.2,
                    background: 'linear-gradient(45deg, #fff 30%, #4CAF50 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    mb: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100px',
                      height: '4px',
                      background: 'linear-gradient(90deg, rgba(76, 175, 80, 0) 0%, #4CAF50 50%, rgba(76, 175, 80, 0) 100%)',
                      borderRadius: '2px',
                    },
                  }}
                >
                  Take Control of Your Finances
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 400,
                    lineHeight: 1.5,
                    mb: 4,
                    maxWidth: '700px',
                    mx: 'auto',
                  }}
                >
                  Track expenses, set budgets, and achieve your financial goals with our intuitive budget planning platform
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    borderRadius: '50px',
                    background: 'linear-gradient(45deg, #388E3C 0%, #4CAF50 50%, #81C784 100%)',
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%)',
                      transform: 'rotate(45deg)',
                      animation: 'buttonGlow 3s linear infinite',
                    },
                    '@keyframes buttonGlow': {
                      '0%': {
                        transform: 'rotate(45deg) translateX(-100%)',
                      },
                      '100%': {
                        transform: 'rotate(45deg) translateX(100%)',
                      },
                    },
                  }}
                >
                  Start Free Today
                </Button>
                {/* Animated rings around the button */}
                {[...Array(3)].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: `${200 + index * 40}px`,
                      height: `${60 + index * 40}px`,
                      border: '1px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: '50px',
                      animation: `ringPulse 2s ${index * 0.5}s infinite`,
                      '@keyframes ringPulse': {
                        '0%': {
                          transform: 'translate(-50%, -50%) scale(0.8)',
                          opacity: 0,
                        },
                        '50%': {
                          opacity: 0.5,
                        },
                        '100%': {
                          transform: 'translate(-50%, -50%) scale(1.2)',
                          opacity: 0,
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Feature Cards */}
              <Grid container spacing={3} sx={{ mt: 8 }}>
                {[
                  { icon: <Dashboard />, title: 'Smart Dashboard', desc: 'View all your finances at a glance' },
                  { icon: <BarChart />, title: 'Real-time Analytics', desc: 'Track your spending patterns' },
                  { icon: <PieChart />, title: 'Visual Reports', desc: 'Beautiful charts and insights' },
                  { icon: <AccountBalance />, title: 'Budget Control', desc: 'Set and manage your budgets' }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: `fadeInUp 0.6s ${index * 0.1}s ease-out both`,
                        '@keyframes fadeInUp': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(20px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                          '& .feature-icon': {
                            color: '#4CAF50',
                            transform: 'scale(1.1)',
                          },
                          '&::before': {
                            transform: 'translateY(0)',
                          },
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0) 100%)',
                          transform: 'translateY(100%)',
                          transition: 'transform 0.3s ease',
                        },
                      }}
                    >
                      <Stack spacing={2} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                        <Box
                          className="feature-icon"
                          sx={{
                            p: 2,
                            borderRadius: '16px',
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                          {feature.desc}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>
        </Grid>

        {/* Scroll Indicator - only show on mobile */}
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255, 255, 255, 0.5)',
            animation: 'bounce 2s infinite',
            display: { xs: 'flex', md: 'none' },
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': { transform: 'translate(-50%, 0)' },
              '40%': { transform: 'translate(-50%, -20px)' },
              '60%': { transform: 'translate(-50%, -10px)' }
            }
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'rgba(18, 18, 18, 0.8)', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 8,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 600,
              color: '#fff'
            }}
          >
            Why Choose Budget Planner?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(18, 18, 18, 0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
                      '& .feature-icon': {
                        color: '#4CAF50',
                        transform: 'scale(1.1)'
                      }
                    }
                  }}
                >
                  <Stack spacing={2} alignItems="center" textAlign="center">
                    <Box
                      className="feature-icon"
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.3s ease',
                        '& svg': {
                          fontSize: '2.5rem'
                        }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {feature.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        sx={{ 
          bgcolor: 'rgba(18, 18, 18, 0.95)', 
          py: 4,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems="center" 
            spacing={2}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              © 2024 Budget Planner. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <CloudDone sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              <Security sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
              <Speed sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 