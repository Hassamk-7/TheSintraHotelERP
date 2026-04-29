import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Zoom } from '@mui/material';
import { Phone as PhoneIcon, KeyboardArrowUp as ArrowUpIcon } from '@mui/icons-material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/923001234567', '_blank');
  };

  const handlePhone = () => {
    window.location.href = 'tel:+923001234567';
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 98, md: 20 },
        right: { xs: 12, md: 20 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.25, md: 2 },
        zIndex: 1250,
      }}
    >
      {/* WhatsApp Button */}
      <Tooltip title="Chat on WhatsApp" placement="left" arrow>
        <IconButton
          onClick={handleWhatsApp}
          sx={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: 'white',
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 8px 30px rgba(37, 211, 102, 0.6)',
            },
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              },
              '50%': {
                boxShadow: '0 4px 30px rgba(37, 211, 102, 0.6)',
              },
              '100%': {
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
              },
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
        </IconButton>
      </Tooltip>

      {/* Phone Button */}
      <Tooltip title="Call Us" placement="left" arrow>
        <IconButton
          onClick={handlePhone}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.1) translateY(-2px)',
              boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)',
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
        </IconButton>
      </Tooltip>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Tooltip title="Back to Top" placement="left" arrow>
          <IconButton
            onClick={scrollToTop}
            sx={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              width: { xs: 46, md: 56 },
              height: { xs: 46, md: 56 },
              boxShadow: '0 4px 20px rgba(240, 147, 251, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                transform: 'scale(1.1) translateY(-2px)',
                boxShadow: '0 8px 30px rgba(240, 147, 251, 0.6)',
              },
            }}
          >
            <ArrowUpIcon sx={{ fontSize: { xs: 24, md: 28 } }} />
          </IconButton>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default FloatingButtons;
