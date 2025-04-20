import React from 'react';
import { Box } from '@mui/material';

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
      }}
    >
      {[...Array(16)].map((_, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            fontSize: '2.5rem', // Increased from default size
            opacity: 0.4,
            animation: `float ${8 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${-Math.random() * 8}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: 'scale(1.2)', // Added scale transform
            filter: 'blur(0.5px)', // Slight blur for better integration
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              opacity: 0.6,
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
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'translate(-50%, -50%) rotate(0deg)',
              },
              '50%': {
                transform: 'translate(-50%, -50%) rotate(180deg)',
              },
            },
          }}
        >
          {emojis[index % emojis.length]}
        </Box>
      ))}
    </Box>
  );
};

export default AnimatedBackground; 