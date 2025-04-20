import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home, Refresh } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(true);
  
  // Emojis for the money animation
  const moneyEmojis = ['💸', '💰', '💵', '💲', '🪙', '💎', '🤑'];
  
  useEffect(() => {
    // Hide loader animation after 2.5 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}
      />
      
      {showAnimation ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          <Box sx={{ position: 'relative', height: 120, width: 120 }}>
            {/* Money emojis animation */}
            {moneyEmojis.map((emoji, index) => (
              <Typography
                key={index}
                variant="h2"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '3rem',
                  animation: `fall ${1 + index * 0.2}s infinite`,
                  opacity: 0,
                  '@keyframes fall': {
                    '0%': {
                      transform: 'translate(-50%, -150%)',
                      opacity: 0,
                    },
                    '50%': {
                      opacity: 1,
                    },
                    '100%': {
                      transform: 'translate(-50%, 150%)',
                      opacity: 0,
                    }
                  }
                }}
              >
                {emoji}
              </Typography>
            ))}
          </Box>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: 600,
              color: 'primary.main',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: 1
            }}
          >
            Loading...
          </Typography>
        </Box>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            textAlign: 'center',
            zIndex: 2,
            px: 3,
            animation: 'fadeIn 0.6s ease-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '5rem', md: '8rem' },
              fontWeight: 800,
              color: 'primary.main',
              textShadow: '0 5px 15px rgba(0,0,0,0.3)',
              mb: 1,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: -2
            }}
          >
            404
          </Typography>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Oops! Page Not Found
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 400,
              maxWidth: '80%',
              mx: 'auto'
            }}
          >
            Looks like this page took an unexpected financial detour. Our investment in this URL didn't pay off.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{
                borderRadius: '12px',
                py: 1.2,
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
              }}
            >
              Back to Home
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
              sx={{
                borderRadius: '12px',
                py: 1.2,
                px: 3,
                fontWeight: 600,
                textTransform: 'none',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.4)',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Reload Page
            </Button>
          </Box>
          
          {/* Money emojis as decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: 30,
              right: 40,
              fontSize: '2rem',
              opacity: 0.6,
              animation: 'bounce 3s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-15px)' }
              }
            }}
          >
            💸
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 50,
              left: 60,
              fontSize: '2.5rem',
              opacity: 0.5,
              animation: 'float 4s infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0) rotate(5deg)' },
                '50%': { transform: 'translateY(-20px) rotate(-5deg)' }
              }
            }}
          >
            💰
          </Box>
          
          <Box
            sx={{
              position: 'absolute',
              top: 150,
              left: 100,
              fontSize: '1.8rem',
              opacity: 0.4,
              animation: 'float 5s infinite ease-in-out',
            }}
          >
            💵
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default NotFound; 