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
  Skeleton,
} from '@mui/material';
import {
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import Seo from '../components/Seo';
import api, { IMAGE_BASE_URL } from '../services/api';

// Lazy loading image component with compression
const LazyImage = ({ src, alt, sx, onLoad }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <>
      {!loaded && !error && (
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        sx={{
          ...sx,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </>
  );
};

const GalleryDynamic = () => {
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
    
    // Ensure scroll is enabled on mount
    document.body.style.overflow = 'auto';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      console.log('[GalleryDynamic] Fetching categories with main images...');
      
      // Fetch all gallery items
      const response = await api.get('/GalleryItem');
      const allItems = response.data || [];
      console.log('[GalleryDynamic] Received items:', allItems.length);

      // Group by category and get main image for each
      const categoryMap = new Map();
      
      allItems.forEach(item => {
        const catName = item.category?.name || 'Uncategorized';
        const catId = item.category?.categoryID || 0;
        
        if (!categoryMap.has(catId)) {
          categoryMap.set(catId, {
            categoryID: catId,
            name: catName,
            title: item.category?.title || catName,
            subtitle: item.category?.subtitle || '',
            description: item.category?.description || '',
            mainImage: null,
            itemCount: 0,
          });
        }
        
        const cat = categoryMap.get(catId);
        cat.itemCount++;
        
        // Set main image (prefer isMainImage flag, otherwise first image)
        if (!cat.mainImage || item.isMainImage) {
          cat.mainImage = {
            ImagePath: item.imagePath,
            title: item.title,
          };
        }
      });

      const categories = Array.from(categoryMap.values());
      console.log('[GalleryDynamic] Processed categories:', categories.length);
      categories.forEach(cat => {
        console.log(`[GalleryDynamic] ${cat.name}: MainImage=${cat.mainImage?.ImagePath}, Items=${cat.itemCount}`);
      });
      
      setGalleryCategories(categories);
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
      console.log('[GalleryDynamic] Fetching images for category:', category.categoryID);
      
      // Fetch all images for this category
      const response = await api.get('/GalleryItem');
      const allItems = response.data || [];
      
      // Filter by category
      const categoryImages = allItems
        .filter(item => item.category?.categoryID === category.categoryID)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      
      console.log('[GalleryDynamic] Category images:', categoryImages.length);
      
      setCurrentCategory({
        ...category,
        allImages: categoryImages
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (!lightboxOpen) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [lightboxOpen]);

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

  const currentImage = currentCategory?.allImages?.[currentImageIndex];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Seo
        title="Gallery"
        description="Explore the Luxury Hotel gallery—rooms, suites, dining, and facilities. Preview the experience before you book your stay in Pakistan."
        keywords="Luxury Hotel gallery, hotel photos, rooms images, suites photos, facilities, restaurant photos, Pakistan hotel"
        author="Luxury Hotel"
      />
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '360px', md: '430px' },
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0.38)), url(/img/home/hotel.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pb: { xs: 6, md: 9 } }}>
          <Box sx={{ maxWidth: '520px', color: '#fff', textAlign: 'left' }}>
            <Typography
              sx={{
                fontSize: '12px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                mb: 1.5,
                color: '#ffffff',
              }}
            >
              Images & Videos
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Gilda Display, serif',
                fontWeight: 400,
                fontSize: { xs: '42px', md: '60px' },
                lineHeight: 1.15,
                color: '#ffffff',
              }}
            >
              Our Gallery
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: { xs: 7, md: 10 }, pb: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: 'Gilda Display, serif',
              fontWeight: 400,
              fontSize: { xs: '34px', md: '54px' },
              color: '#0f172a',
              lineHeight: 1.18,
              mb: 3,
              width: '100%',
            }}
          >
            Explore Sintra Hotel Islamabad Pictures Gallery
          </Typography>
          <Typography
            sx={{
              fontSize: '15px',
              lineHeight: '2em',
              color: '#444',
              width: '100%',
              display: 'block',
            }}
          >
            Welcome to the Sintra Hotel Islamabad Pictures Gallery—your visual journey into luxury, comfort, and style. Situated in the heart of Islamabad&apos;s vibrant Melody area, near the bustling Blue Area, Sintra Hotel offers a unique blend of elegance and convenience, making it the perfect choice for family travellers, tourists, business professionals, and individuals alike. Our hotel gallery provides a first-hand look at the premium amenities and sophisticated atmosphere that define our hotel. From beautifully designed luxury hotel rooms pictures to serene outdoor spaces and fine dining experiences, every image reflects the warmth and quality of the Sintra stay experience.
          </Typography>
        </Box>
      </Container>

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
                  <LazyImage
                    src={`${IMAGE_BASE_URL}${category.mainImage?.ImagePath || '/uploads/gallery/default.jpg'}`}
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
                  <Chip
                    label="Main"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#fbbf24',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
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
        <DialogContent sx={{ p: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
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
          
          {currentCategory?.allImages && currentCategory.allImages.length > 1 && (
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
                <ChevronLeftIcon sx={{ fontSize: 40 }} />
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
                <ChevronRightIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </>
          )}

          {currentImage && (
            <>
              <Box
                component="img"
                src={`${IMAGE_BASE_URL}${currentImage.imagePath}`}
                alt={currentImage.title}
                sx={{
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  objectFit: 'contain',
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
                  maxWidth: '80%',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {currentImage.title}
                </Typography>
                {currentImage.description && (
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    {currentImage.description}
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

export default GalleryDynamic;
