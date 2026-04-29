import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LocationOn as MapPinIcon,
  Phone as PhoneIcon,
  Email as MailIcon,
  Schedule as ClockIcon,
  Send as SendIcon,
  Chat as MessageCircleIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import Seo from '../components/Seo';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    location: 'islamabad'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const locations = [
    {
      id: 'islamabad',
      name: 'Islamabad',
      address: 'F-7 Markaz, Islamabad, Pakistan',
      phone: '+92 51 1234567',
      email: 'islamabad@luxuryhotel.com',
      hours: '24/7 Reception',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.0123456789!2d73.0479!3d33.7294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQzJzQ1LjgiTiA3M8KwMDInNTIuNCJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s'
    },
    {
      id: 'lahore',
      name: 'Lahore',
      address: 'Gulberg III, Lahore, Pakistan',
      phone: '+92 42 1234567',
      email: 'lahore@luxuryhotel.com',
      hours: '24/7 Reception',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.0123456789!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMjEnMzEuMyJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s'
    },
    {
      id: 'karachi',
      name: 'Karachi',
      address: 'Clifton Block 4, Karachi, Pakistan',
      phone: '+92 21 1234567',
      email: 'karachi@luxuryhotel.com',
      hours: '24/7 Reception',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.0123456789!2d67.0299!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzM4LjUiTiA2N8KwMDEnNDcuNiJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to API
      await axios.post('https://api.thesintrahotel.com/api/ContactMessage', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        location: formData.location
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        location: 'islamabad'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setIsSubmitting(false);
      alert('Failed to send message. Please try again.');
    }
  };

  const selectedLocation = locations.find(loc => loc.id === formData.location);

  return (
    <Box sx={{ py: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Seo
        title="Contact Us"
        description="Contact Luxury Hotel for reservations, corporate inquiries, events, or support. Call, email, or send us a message—we’re here to help."
        keywords="contact Luxury Hotel, hotel phone, hotel email, reservations support, booking help, customer service"
      />
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a6f 50%, #0f3460 100%)',
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                background: 'linear-gradient(45deg, #ffffff 30%, #d4af37 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.9,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              We're here to help make your stay unforgettable. Get in touch with our team for any questions, 
              reservations, or special requests.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={{ xs: 3, md: 6 }} sx={{ alignItems: 'flex-start' }}>
          {/* Contact Form - Left Side */}
          <Grid item xs={12} md={10}>
            <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, boxShadow: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <MessageCircleIcon sx={{ color: 'primary.main', mr: 2, fontSize: 32 }} />
                <Typography variant="h4" fontWeight="bold">
                  Send us a Message
                </Typography>
              </Box>

              {submitted ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      backgroundColor: 'success.light',
                      borderRadius: '50%',
                      mb: 3,
                    }}
                  >
                    <SendIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  </Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Message Sent!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setSubmitted(false)}
                    size="large"
                  >
                    Send Another Message
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Row 1: Name and Email */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        size="large"
                      />
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        size="large"
                      />
                    </Box>
                    
                    {/* Row 2: Phone and Subject */}
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="large"
                      />
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        size="large"
                      />
                    </Box>
                    
                    {/* Row 3: Message - Full Width */}
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      multiline
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      placeholder="Please provide details about your inquiry..."
                    />
                    
                    {/* Row 4: Submit Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<SendIcon />}
                        disabled={isSubmitting}
                        sx={{ 
                          px: 6, 
                          py: 2,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          minWidth: 200,
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Location Information - Right Side */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Filter Button */}
              <Button
                variant="outlined"
                startIcon={<TuneIcon />}
                sx={{ 
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: '1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-1px)',
                    boxShadow: 2,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Filter Locations
              </Button>

              {/* Location Selector */}
              <FormControl fullWidth size="large">
                <InputLabel sx={{ fontSize: '1.1rem', fontWeight: 500 }}>Select Location</InputLabel>
                <Select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  label="Select Location"
                  sx={{
                    fontSize: '1.1rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: 2,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id} sx={{ fontSize: '1.1rem' }}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Current Location Info */}
              <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  {selectedLocation.name} Location
                </Typography>
                <List>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <MapPinIcon color="primary" fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={selectedLocation.address}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '1rem' }}
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <PhoneIcon color="primary" fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={selectedLocation.phone}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '1rem' }}
                    />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <MailIcon color="primary" fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={selectedLocation.email}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '1rem' }}
                    />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ClockIcon color="primary" fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={selectedLocation.hours}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '1rem' }}
                    />
                  </ListItem>
                </List>
              </Paper>

              {/* All Locations Quick Access */}
              <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                  Quick Access
                </Typography>
                <Grid container spacing={2}>
                  {locations.map((location) => (
                    <Grid item xs={12} key={location.id}>
                      <Button
                        fullWidth
                        variant={formData.location === location.id ? 'contained' : 'outlined'}
                        size="large"
                        onClick={() => setFormData(prev => ({ ...prev, location: location.id }))}
                        sx={{ 
                          justifyContent: 'flex-start', 
                          textTransform: 'none',
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 500,
                          borderRadius: 2,
                          '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: 2,
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {location.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Full Width Map Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
            Find Us on Map
          </Typography>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.0123456789!2d73.0479!3d33.7294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bdb02b4!2sF-7%20Markaz%2C%20Islamabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              sx={{
                width: '100%',
                height: 450,
                border: 0,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Contact;
