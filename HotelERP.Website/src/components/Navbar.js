import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  HomeOutlined as HomeOutlinedIcon,
  Menu as MenuIcon, 
  Phone as PhoneIcon, 
  Email as EmailIcon,
  Hotel as HotelIcon,
  BedOutlined as BedOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  ContactMailOutlined as ContactMailOutlinedIcon,
  EventAvailableOutlined as EventAvailableOutlinedIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Restaurant', path: '/restaurant' },
    { name: 'Blog', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  const mobileBottomItems = [
    { name: 'Home', path: '/', icon: <HomeOutlinedIcon fontSize="small" /> },
    { name: 'Rooms', path: '/rooms', icon: <BedOutlinedIcon fontSize="small" /> },
    { name: 'Search', path: '/search?location=all', icon: <SearchOutlinedIcon fontSize="small" /> },
    { name: 'Contact', path: '/contact', icon: <ContactMailOutlinedIcon fontSize="small" /> },
    { name: 'Book', path: '/reservation', icon: <EventAvailableOutlinedIcon fontSize="small" /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontFamily: 'Playfair Display' }}>
        LuxuryHotel
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemText 
              primary={
                <Link 
                  to={item.path} 
                  style={{ 
                    textDecoration: 'none', 
                    color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                    fontWeight: isActive(item.path) ? 600 : 400
                  }}
                >
                  {item.name}
                </Link>
              } 
            />
          </ListItem>
        ))}
        <ListItem disablePadding>
          <Button
            component={Link}
            to="/reservation"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mx: 2, mt: 2 }}
          >
            Book Now
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Contact Bar */}
      <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', py: { xs: 0.75, md: 1 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">+92 300 1234567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, maxWidth: { xs: 140, md: 'none' } }}>
                <EmailIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  info@luxuryhotel.com
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="caption">Best Luxury Hotels in Pakistan</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Navigation */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(to right, #ffffff 0%, #f8fafc 100%)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: { xs: 62, md: 72 }, px: { xs: 0.5, md: 0 } }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <HotelIcon sx={{ mr: 1, color: 'primary.main', fontSize: { xs: 20, md: 28 } }} />
              <Typography
                variant="h5"
                component={Link}
                to="/"
                sx={{
                  fontFamily: 'Playfair Display',
                  fontWeight: 700,
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  '&:hover': { textDecoration: 'none' }
                }}
              >
                Luxury
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  Hotel
                </Box>
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{
                    fontWeight: isActive(item.path) ? 700 : 500,
                    color: isActive(item.path) ? '#667eea' : '#374151',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: isActive(item.path) ? '80%' : '0%',
                      height: '3px',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#667eea',
                      '&::after': {
                        width: '80%'
                      }
                    }
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Button
                component={Link}
                to="/reservation"
                variant="contained"
                sx={{ 
                  ml: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 700,
                  px: 3,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Book Now
              </Button>
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: '#667eea',
                  backgroundColor: mobileOpen ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.15)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 12,
          right: 12,
          bottom: 10,
          zIndex: 1300,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
          px: 1,
          py: 0.8,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {mobileBottomItems.map((item) => {
          const active = item.path === '/search?location=all'
            ? location.pathname === '/search'
            : isActive(item.path);

          return (
            <Box
              key={item.name}
              component={Link}
              to={item.path}
              sx={{
                flex: 1,
                minWidth: 0,
                textDecoration: 'none',
                color: active ? '#2563eb' : '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.45,
                py: 0.4,
                borderRadius: 3,
                backgroundColor: active ? 'rgba(37, 99, 235, 0.10)' : 'transparent',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box>
              <Typography sx={{ fontSize: '0.68rem', fontWeight: active ? 700 : 600, lineHeight: 1, whiteSpace: 'nowrap' }}>
                {item.name}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'none' }, height: 84 }} />
    </Box>
  );
};

export default Navbar;
