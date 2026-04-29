import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { getImageUrl } from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.thesintrahotel.com/api';

const GalleryNew = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [galleryCategories, setGalleryCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      // Fetch categories with main images only
      const response = await axios.get(`${API_BASE_URL}/GalleryCategory/MainImages`);
      setGalleryCategories(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery data:', err);
      setError('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = async (category) => {
    try {
      // Fetch all images for this category
      const response = await axios.get(`${API_BASE_URL}/GalleryItem/ByCategory/${category.categoryID}`);
      const images = response.data || [];
      
      setCurrentCategory({
        ...category,
        allImages: images
      });
      setCurrentImageIndex(0);
      setLightboxOpen(true);
    } catch (err) {
      console.error('Error fetching category images:', err);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentCategory(null);
  };

  const nextImage = () => {
    if (currentCategory && currentCategory.allImages) {
      setCurrentImageIndex((prev) => (prev + 1) % currentCategory.allImages.length);
    }
  };

  const prevImage = () => {
    if (currentCategory && currentCategory.allImages) {
      setCurrentImageIndex((prev) => 
        (prev - 1 + currentCategory.allImages.length) % currentCategory.allImages.length
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
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
  }, [lightboxOpen, currentImageIndex]);

  // Get unique category names for filters
  const categoryNames = ['All Photos', ...new Set(galleryCategories.map(cat => cat.name))];
  
  const filteredCategories = selectedCategory === 'all' 
    ? galleryCategories 
    : galleryCategories.filter(cat => cat.name === selectedCategory);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

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
            <Chip
              label={`All Photos (${galleryCategories.length})`}
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
              color={selectedCategory === 'all' ? 'primary' : 'default'}
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
            {[...new Set(galleryCategories.map(cat => cat.name))].map((categoryName) => {
              const count = galleryCategories.filter(cat => cat.name === categoryName).length;
              return (
                <Chip
                  key={categoryName}
                  label={`${categoryName} (${count})`}
                  onClick={() => setSelectedCategory(categoryName)}
                  variant={selectedCategory === categoryName ? 'filled' : 'outlined'}
                  color={selectedCategory === categoryName ? 'primary' : 'default'}
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
              );
            })}
          </Box>
        </Box>

        {/* Gallery Grid - Only Main Images */}
        <Grid container spacing={3}>
          {filteredCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.categoryID}>
              <Card
                onClick={() => openLightbox(category)}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%',
                  height: '260px',
                  backgroundColor: '#f5f5f5',
                  overflow: 'hidden'
                }}>
                  <CardMedia
                    component="img"
                    image={getImageUrl(category.mainImage?.ImagePath)}
                    alt={category.title}
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
                </Box>
                
                <CardContent sx={{ p: 2.5 }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="700" 
                    sx={{ 
                      color: '#111827',
                      mb: 0.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    {category.title}
                  </Typography>
                  
                  {category.subtitle && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#6b7280',
                        mb: 1.5,
                        fontSize: '0.9rem'
                      }}
                    >
                      {category.subtitle}
                    </Typography>
                  )}
                  
                  <Chip
                    label={category.name}
                    size="small"
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: '24px',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredCategories.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No gallery items found.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Lightbox/Slider */}
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
          
          {currentCategory && currentCategory.allImages && currentCategory.allImages.length > 1 && (
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

          {currentCategory && currentCategory.allImages && currentCategory.allImages[currentImageIndex] && (
            <>
              <Box
                component="img"
                src={getImageUrl(currentCategory.allImages[currentImageIndex].ImagePath)}
                alt={currentCategory.allImages[currentImageIndex].title}
                sx={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Gallery+Image';
                }}
              />
              
              <Box
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
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {currentCategory.allImages[currentImageIndex].title}
                </Typography>
                {currentCategory.allImages[currentImageIndex].description && (
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    {currentCategory.allImages[currentImageIndex].description}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ opacity: 0.6 }}>
                  {currentImageIndex + 1} of {currentCategory.allImages.length}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GalleryNew;
