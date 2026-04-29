import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Hotel as HotelIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(44, 90, 160, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        {/* Sitemap Section at Top */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: 'secondary.main',
              fontFamily: 'Playfair Display',
            }}
          >
            Site Map
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 2, sm: 3 } }}>
            {[
              { text: 'Home', path: '/' },
              { text: 'Rooms & Suites', path: '/rooms' },
              { text: 'Gallery', path: '/gallery' },
              { text: 'Restaurant', path: '/restaurant' },
              { text: 'Contact Us', path: '/contact' },
              { text: 'About Us', path: '/about' },
              { text: 'Services', path: '/services' },
              { text: 'Booking', path: '/booking' },
            ].map((item, index) => (
              <Typography
                key={index}
                component={Link}
                to={item.path}
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  fontWeight: 500,
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderColor: 'rgba(212, 175, 55, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {item.text}
              </Typography>
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={6} lg={2.5}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HotelIcon sx={{ mr: 1, color: 'secondary.main', fontSize: 32 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #ffffff 30%, #d4af37 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  LuxuryHotel
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Experience the finest luxury accommodation across Pakistan.<br />
                From Islamabad to Karachi, we provide world-class<br />
                hospitality and unforgettable experiences.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'secondary.main',
                        background: 'rgba(212, 175, 55, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3} lg={2.5}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'secondary.main',
                fontFamily: 'Playfair Display',
              }}
            >
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationIcon sx={{ color: 'secondary.main', mt: 0.3, fontSize: 20, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  Islamabad: F-7 Markaz, Pakistan<br />
                  Lahore: Gulberg III, Pakistan<br />
                  Karachi: Clifton Block 4, Pakistan
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: 'secondary.main', fontSize: 20, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                  +92 300 1234567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: 'secondary.main', fontSize: 20, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                  info@luxuryhotel.com
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3} lg={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'secondary.main',
                fontFamily: 'Playfair Display',
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { text: 'Home', path: '/' },
                { text: 'Rooms', path: '/rooms' },
                { text: 'Gallery', path: '/gallery' },
                { text: 'Restaurant', path: '/restaurant' },
                { text: 'Contact', path: '/contact' },
              ].map((item, index) => (
                <Typography
                  key={index}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    display: 'block',
                    lineHeight: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'secondary.main',
                      paddingLeft: 1,
                    },
                  }}
                >
                  {item.text}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Room Categories */}
          <Grid item xs={12} md={3} lg={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: 'secondary.main',
                fontFamily: 'Playfair Display',
              }}
            >
              Room Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { 
                  text: 'Standard Studio', 
                  path: '/rooms?category=standard',
                  image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                },
                { 
                  text: 'Deluxe Studio', 
                  path: '/rooms?category=deluxe',
                  image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                },
                { 
                  text: 'Executive Room', 
                  path: '/rooms?category=executive',
                  image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                },
                { 
                  text: 'VVIP Room', 
                  path: '/rooms?category=vvip',
                  image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                },
                { 
                  text: 'Primary Room', 
                  path: '/rooms?category=primary',
                  image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
                },
              ].map((item, index) => (
                <Box key={index}>
                  <Typography
                    component={Link}
                    to={item.path}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: 'secondary.main',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.text}
                      sx={{
                        width: 40,
                        height: 30,
                        borderRadius: 1,
                        objectFit: 'cover',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Divider 
          sx={{ 
            my: 4, 
            background: 'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.5) 50%, transparent 100%)' 
          }} 
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © 2025 LuxuryHotel. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Privacy Policy', 'Terms of Service'].map((text, index) => (
              <Typography
                key={index}
                component={Link}
                to={`/${text.toLowerCase().replace(/\s+/g, '-')}`}
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
