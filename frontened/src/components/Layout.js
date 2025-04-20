import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';

function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Add margin top to account for fixed navbar
          backgroundColor: '#1a1a1a', // Match the dark theme
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 