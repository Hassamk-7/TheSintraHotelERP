import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { id: 'all', name: 'All Photos', count: 24 },
    { id: 'rooms', name: 'Rooms & Suites', count: 8 },
    { id: 'restaurant', name: 'Restaurant', count: 6 },
    { id: 'facilities', name: 'Facilities', count: 5 },
    { id: 'exterior', name: 'Exterior', count: 5 }
  ];

  const galleryImages = [
    // Rooms & Suites
    {
      id: 1,
      category: 'rooms',
      title: 'Deluxe Studio',
      description: 'Elegant studio with modern amenities',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      category: 'rooms',
      title: 'Executive Suite',
      description: 'Luxurious suite with panoramic views',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      category: 'rooms',
      title: 'VVIP Presidential Suite',
      description: 'Ultimate luxury accommodation',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      category: 'rooms',
      title: 'Standard Studio',
      description: 'Comfortable and affordable accommodation',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 5,
      category: 'rooms',
      title: 'Primary Room',
      description: 'Well-appointed room with modern amenities',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 6,
      category: 'rooms',
      title: 'Family Suite',
      description: 'Spacious accommodation for families',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 7,
      category: 'rooms',
      title: 'Bathroom Suite',
      description: 'Luxurious marble bathroom',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 8,
      category: 'rooms',
      title: 'Penthouse View',
      description: 'Breathtaking views from penthouse',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },

    // Restaurant
    {
      id: 9,
      category: 'restaurant',
      title: 'Main Dining Hall',
      description: 'Elegant dining experience',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 10,
      category: 'restaurant',
      title: 'Fine Dining',
      description: 'Exquisite culinary creations',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 11,
      category: 'restaurant',
      title: 'Chef\'s Special',
      description: 'Signature dishes by our master chef',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 12,
      category: 'restaurant',
      title: 'Rooftop Dining',
      description: 'Dining under the stars',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 13,
      category: 'restaurant',
      title: 'Bar & Lounge',
      description: 'Premium cocktails and beverages',
      image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 14,
      category: 'restaurant',
      title: 'Private Dining',
      description: 'Intimate dining experience',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },

    // Facilities
    {
      id: 15,
      category: 'facilities',
      title: 'Swimming Pool',
      description: 'Infinity pool with city views',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 16,
      category: 'facilities',
      title: 'Fitness Center',
      description: 'State-of-the-art gym equipment',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 17,
      category: 'facilities',
      title: 'Spa & Wellness',
      description: 'Relaxation and rejuvenation',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 18,
      category: 'facilities',
      title: 'Conference Hall',
      description: 'Modern meeting facilities',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 19,
      category: 'facilities',
      title: 'Lobby',
      description: 'Grand entrance and reception',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },

    // Exterior
    {
      id: 20,
      category: 'exterior',
      title: 'Hotel Exterior',
      description: 'Impressive architectural design',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 21,
      category: 'exterior',
      title: 'Garden View',
      description: 'Beautiful landscaped gardens',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 22,
      category: 'exterior',
      title: 'Night View',
      description: 'Hotel illuminated at night',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 23,
      category: 'exterior',
      title: 'Entrance',
      description: 'Grand hotel entrance',
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 24,
      category: 'exterior',
      title: 'Terrace View',
      description: 'Outdoor terrace and seating',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  React.useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
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
            background: 'radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)',
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
              Gallery
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
              Explore our stunning collection of images showcasing the beauty and elegance 
              of LuxuryHotel across Pakistan.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Category Filter */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={`${category.name} (${category.count})`}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                color={selectedCategory === category.id ? 'primary' : 'default'}
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Gallery Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)', 
            lg: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 4
        }}>
          {filteredImages.map((image, index) => (
            <Card
              key={image.id}
              className="gallery-item"
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                },
              }}
              onClick={() => openLightbox(index)}
            >
              <Box sx={{ 
                position: 'relative', 
                overflow: 'hidden',
                width: '100%',
                height: '280px', // Fixed height for all images
                backgroundColor: '#f5f5f5'
              }}>
                <CardMedia
                  component="img"
                  image={image.thumbnail}
                  alt={image.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    },
                  }}
                >
                  <ZoomInIcon
                    sx={{
                      color: 'white',
                      fontSize: 48,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '.MuiCard-root:hover &': {
                        opacity: 1,
                      },
                    }}
                  />
                </Box>
              </Box>
              
              {/* Image Details */}
              <Box
                sx={{
                  p: 2.5,
                  backgroundColor: 'white',
                  borderTop: '1px solid #f0f0f0',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography 
                    variant="h6" 
                    fontWeight="700" 
                    sx={{ 
                      color: '#111827',
                      mb: 1,
                      fontSize: '1.1rem',
                      lineHeight: 1.3
                    }}
                  >
                    {image.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280',
                      lineHeight: 1.5,
                      fontSize: '0.9rem'
                    }}
                  >
                    {image.description}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #f0f0f0' }}>
                  <Chip
                    label={categories.find(cat => cat.id === image.category)?.name || 'Gallery'}
                    size="small"
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: '24px',
                      '& .MuiChip-label': {
                        px: 1.5,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* No images message */}
        {filteredImages.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No images found in this category.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={closeLightbox}
        maxWidth={false}
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            onClick={closeLightbox}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {filteredImages.length > 1 && (
            <>
              <IconButton
                onClick={prevImage}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              
              <IconButton
                onClick={nextImage}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          <Box
            component="img"
            src={filteredImages[currentImageIndex]?.image}
            alt={filteredImages[currentImageIndex]?.title}
            sx={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
          
          <Paper
            sx={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              p: 3,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              textAlign: 'center',
              minWidth: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {filteredImages[currentImageIndex]?.title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              {filteredImages[currentImageIndex]?.description}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              {currentImageIndex + 1} of {filteredImages.length}
            </Typography>
          </Paper>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Gallery;
