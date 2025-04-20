import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Assessment,
  AccountBalanceWallet,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { text: 'Dashboard', icon: <Dashboard sx={{ fontSize: 20 }} />, path: '/dashboard' },
    { text: 'Transactions', icon: <ReceiptIcon sx={{ fontSize: 20 }} />, path: '/transactions' },
    { text: 'Categories', icon: <CategoryIcon sx={{ fontSize: 20 }} />, path: '/categories' },
    { text: 'Reports', icon: <Assessment sx={{ fontSize: 20 }} />, path: '/reports' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{
        background: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(76, 175, 80, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo/Brand for larger screens */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              alignItems: 'center',
              gap: 1,
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#4CAF50',
              },
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: '1.8rem' }} />
            BudgetPlanner
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
              sx={{
                '&:hover': {
                  background: 'rgba(76, 175, 80, 0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="menu-appbar"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: 'rgba(18, 18, 18, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  mt: 1
                }
              }}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.text}
                  onClick={() => {
                    handleClose();
                    navigate(item.path);
                  }}
                  sx={{
                    py: 1.5,
                    px: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {React.cloneElement(item.icon, {
                    sx: { 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: 20
                    }
                  })}
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                </MenuItem>
              ))}
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  color: '#f44336',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          {/* Logo/Brand for mobile */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              color: '#fff',
              textDecoration: 'none',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <AccountBalanceWallet sx={{ fontSize: '1.5rem' }} />
            BudgetPlanner
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.icon}
                {item.text}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    bgcolor: '#4CAF50',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
                    },
                  }}
                >
                  {currentUser?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 