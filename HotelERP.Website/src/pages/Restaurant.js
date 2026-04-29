import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  Button,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Schedule as ClockIcon,
  LocationOn as MapPinIcon,
  Phone as PhoneIcon,
  Restaurant as ChefHatIcon,
  Dining as UtensilsIcon,
  LocalBar as WineIcon,
  Spellcheck as SpicyIcon,
  Eco as VegetarianIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';

const Restaurant = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  
  // Hotel WhatsApp number for orders
  const HOTEL_WHATSAPP = '+923001234567'; // Replace with actual hotel WhatsApp number
  
  const handleWhatsAppOrder = (item) => {
    const message = `Hi! I would like to order:\n\n*${item.name}*\n${item.description}\n\nPrice: PKR ${item.price.toLocaleString()}\nCuisine: ${item.cuisine}\n\nPlease confirm availability and delivery details.`;
    const whatsappUrl = `https://wa.me/${HOTEL_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'main-course', name: 'Main Course' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'pakistani', name: 'Pakistani Cuisine' },
    { id: 'continental', name: 'Continental' },
    { id: 'chinese', name: 'Chinese' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'islamabad', name: 'Islamabad' },
    { id: 'lahore', name: 'Lahore' },
    { id: 'karachi', name: 'Karachi' }
  ];

  const menuItems = [
    // Appetizers
    {
      id: 1,
      name: 'Chicken Tikka',
      category: 'appetizers',
      cuisine: 'pakistani',
      price: 1200,
      description: 'Tender chicken pieces marinated in yogurt and spices, grilled to perfection',
      image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      spicy: true,
      vegetarian: false,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 2,
      name: 'Samosa Platter',
      category: 'appetizers',
      cuisine: 'pakistani',
      price: 800,
      description: 'Crispy triangular pastries filled with spiced potatoes and peas',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 3,
      name: 'Caesar Salad',
      category: 'appetizers',
      cuisine: 'continental',
      price: 1000,
      description: 'Fresh romaine lettuce with parmesan cheese, croutons and caesar dressing',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore']
    },
    {
      id: 4,
      name: 'Spring Rolls',
      category: 'appetizers',
      cuisine: 'chinese',
      price: 900,
      description: 'Crispy vegetable spring rolls served with sweet and sour sauce',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.4,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'karachi']
    },

    // Main Course
    {
      id: 5,
      name: 'Chicken Karahi',
      category: 'main-course',
      cuisine: 'pakistani',
      price: 2500,
      description: 'Traditional Pakistani chicken curry cooked in a wok with tomatoes and spices',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      spicy: true,
      vegetarian: false,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 6,
      name: 'Beef Biryani',
      category: 'main-course',
      cuisine: 'pakistani',
      price: 2800,
      description: 'Aromatic basmati rice cooked with tender beef pieces and traditional spices',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      spicy: true,
      vegetarian: false,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 7,
      name: 'Grilled Salmon',
      category: 'main-course',
      cuisine: 'continental',
      price: 3500,
      description: 'Fresh Atlantic salmon grilled with herbs and served with vegetables',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      spicy: false,
      vegetarian: false,
      locations: ['islamabad', 'lahore']
    },
    {
      id: 8,
      name: 'Beef Steak',
      category: 'main-course',
      cuisine: 'continental',
      price: 4000,
      description: 'Premium beef tenderloin grilled to perfection with garlic butter',
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      spicy: false,
      vegetarian: false,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 9,
      name: 'Sweet & Sour Chicken',
      category: 'main-course',
      cuisine: 'chinese',
      price: 2200,
      description: 'Crispy chicken pieces in tangy sweet and sour sauce with vegetables',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
      spicy: false,
      vegetarian: false,
      locations: ['islamabad', 'karachi']
    },
    {
      id: 10,
      name: 'Vegetable Fried Rice',
      category: 'main-course',
      cuisine: 'chinese',
      price: 1800,
      description: 'Wok-fried rice with mixed vegetables and soy sauce',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.3,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    },

    // Desserts
    {
      id: 11,
      name: 'Gulab Jamun',
      category: 'desserts',
      cuisine: 'pakistani',
      price: 600,
      description: 'Traditional milk dumplings soaked in rose-flavored sugar syrup',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.7,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 12,
      name: 'Chocolate Lava Cake',
      category: 'desserts',
      cuisine: 'continental',
      price: 800,
      description: 'Warm chocolate cake with molten chocolate center, served with vanilla ice cream',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.8,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore']
    },
    {
      id: 13,
      name: 'Tiramisu',
      category: 'desserts',
      cuisine: 'continental',
      price: 900,
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.6,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    },

    // Beverages
    {
      id: 14,
      name: 'Fresh Mango Juice',
      category: 'beverages',
      cuisine: 'pakistani',
      price: 400,
      description: 'Freshly squeezed mango juice from the finest Pakistani mangoes',
      image: 'https://images.unsplash.com/photo-1546173159-315724a31696?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.5,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 15,
      name: 'Kashmiri Chai',
      category: 'beverages',
      cuisine: 'pakistani',
      price: 300,
      description: 'Traditional pink tea with almonds and cardamom',
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.4,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    },
    {
      id: 16,
      name: 'Fresh Lime Soda',
      category: 'beverages',
      cuisine: 'continental',
      price: 350,
      description: 'Refreshing lime soda with mint and ice',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      rating: 4.2,
      spicy: false,
      vegetarian: true,
      locations: ['islamabad', 'lahore', 'karachi']
    }
  ];

  const restaurants = [
    {
      id: 1,
      name: 'The Grand Dining Hall',
      location: 'islamabad',
      description: 'Our flagship restaurant offering international cuisine in an elegant setting',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hours: '6:00 AM - 11:00 PM',
      phone: '+92 51 1234567',
      rating: 4.8,
      specialties: ['Continental', 'Pakistani', 'Chinese']
    },
    {
      id: 2,
      name: 'Rooftop Garden Restaurant',
      location: 'lahore',
      description: 'Dine under the stars with panoramic city views and fresh air',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hours: '6:00 PM - 12:00 AM',
      phone: '+92 42 1234567',
      rating: 4.9,
      specialties: ['BBQ', 'Pakistani', 'Continental']
    },
    {
      id: 3,
      name: 'Ocean View Café',
      location: 'karachi',
      description: 'Casual dining with stunning ocean views and fresh seafood',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      hours: '7:00 AM - 10:00 PM',
      phone: '+92 21 1234567',
      rating: 4.7,
      specialties: ['Seafood', 'Continental', 'Pakistani']
    }
  ];

  const filteredItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory || item.cuisine === selectedCategory;
    const locationMatch = selectedLocation === 'all' || item.locations.includes(selectedLocation);
    return categoryMatch && locationMatch;
  });

  const filteredRestaurants = selectedLocation === 'all' 
    ? restaurants 
    : restaurants.filter(restaurant => restaurant.location === selectedLocation);

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
            background: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)',
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
              Restaurant & Dining
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
              Experience culinary excellence with our diverse menu featuring the finest Pakistani, 
              Continental, and Chinese cuisines prepared by master chefs.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Restaurant Locations */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
              color: 'text.primary',
            }}
          >
            Our Restaurants
          </Typography>
          <Grid container spacing={4}>
            {filteredRestaurants.map((restaurant) => (
              <Grid item xs={12} md={6} lg={4} key={restaurant.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={restaurant.image}
                    alt={restaurant.name}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {restaurant.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={restaurant.rating} readOnly size="small" max={1} />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {restaurant.rating}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MapPinIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {restaurant.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {restaurant.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ClockIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.hours}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {restaurant.phone}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                        Specialties:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {restaurant.specialties.map((specialty, index) => {
                          // Define colors for different cuisines
                          const getSpecialtyColor = (specialty) => {
                            switch (specialty.toLowerCase()) {
                              case 'continental':
                                return {
                                  backgroundColor: '#f0f9ff',
                                  color: '#0369a1',
                                  border: '1px solid #0ea5e9',
                                  '&:hover': {
                                    backgroundColor: '#0ea5e9',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                  }
                                };
                              case 'pakistani':
                                return {
                                  backgroundColor: '#f0fdf4',
                                  color: '#166534',
                                  border: '1px solid #22c55e',
                                  '&:hover': {
                                    backgroundColor: '#22c55e',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                  }
                                };
                              case 'chinese':
                                return {
                                  backgroundColor: '#fef2f2',
                                  color: '#dc2626',
                                  border: '1px solid #ef4444',
                                  '&:hover': {
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                  }
                                };
                              case 'bbq':
                                return {
                                  backgroundColor: '#fef3c7',
                                  color: '#d97706',
                                  border: '1px solid #f59e0b',
                                  '&:hover': {
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                  }
                                };
                              case 'seafood':
                                return {
                                  backgroundColor: '#ecfdf5',
                                  color: '#059669',
                                  border: '1px solid #10b981',
                                  '&:hover': {
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                  }
                                };
                              default:
                                return {
                                  backgroundColor: '#f3f4f6',
                                  color: '#374151',
                                  border: '1px solid #9ca3af',
                                  '&:hover': {
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    transform: 'translateY(-1px)',
                                  }
                                };
                            }
                          };

                          return (
                            <Chip
                              key={index}
                              label={specialty}
                              size="medium"
                              sx={{
                                ...getSpecialtyColor(specialty),
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                height: '28px',
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                '& .MuiChip-label': {
                                  px: 1.5,
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Menu Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              textAlign: 'center',
              mb: 6,
              color: 'text.primary',
            }}
          >
            Our Menu
          </Typography>
          
          {/* Filters */}
          <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Filter by Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => setSelectedCategory(category.id)}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                    color={selectedCategory === category.id ? 'primary' : 'default'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Filter by Location
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {locations.map((location) => (
                  <Chip
                    key={location.id}
                    label={location.name}
                    onClick={() => setSelectedLocation(location.id)}
                    variant={selectedLocation === location.id ? 'filled' : 'outlined'}
                    color={selectedLocation === location.id ? 'secondary' : 'default'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            },
            gap: 4,
            mb: 4
          }}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box sx={{ 
                  position: 'relative',
                  paddingTop: '60%', // 5:3 aspect ratio for food images
                  backgroundColor: '#f5f5f5'
                }}>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.name}
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
                  
                  {/* Top badges */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {item.vegetarian && (
                      <Chip 
                        label="🥬 Veg" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#dcfce7', 
                          color: '#166534',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }} 
                      />
                    )}
                    {item.spicy && (
                      <Chip 
                        label="🌶️ Spicy" 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#fef2f2', 
                          color: '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }} 
                      />
                    )}
                  </Box>
                  
                  <Chip
                    label={item.cuisine}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      textTransform: 'capitalize',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 3,
                  backgroundColor: 'white'
                }}>
                  {/* Header with name and rating */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="700"
                      sx={{ 
                        color: '#111827',
                        fontSize: '1.2rem',
                        lineHeight: 1.3,
                        flex: 1,
                        mr: 1
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <Rating value={1} readOnly size="small" max={1} sx={{ color: '#fbbf24' }} />
                      <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600, color: '#374151' }}>
                        {item.rating}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280',
                      lineHeight: 1.6,
                      mb: 3,
                      fontSize: '0.9rem'
                    }}
                  >
                    {item.description}
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1 }} />
                  
                  {/* Price and Order section */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 2,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e5e7eb'
                  }}>
                    <Typography
                      variant="h5"
                      fontWeight="700"
                      sx={{
                        color: '#2563eb',
                        fontSize: '1.4rem'
                      }}
                    >
                      PKR {item.price.toLocaleString()}
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="medium"
                      onClick={() => handleWhatsAppOrder(item)}
                      startIcon={<WhatsAppIcon />}
                      sx={{
                        backgroundColor: '#25D366',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#128C7E',
                        }
                      }}
                    >
                      Order
                    </Button>
                  </Box>
                  
                  {/* Availability */}
                  <Box sx={{ pt: 2, borderTop: '1px solid #f0f0f0' }}>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>
                      📍 Available at: {item.locations.map(loc => loc.charAt(0).toUpperCase() + loc.slice(1)).join(', ')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* No items message */}
          {filteredItems.length === 0 && (
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <UtensilsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                No menu items found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters to see more options.
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Chef's Special Section */}
        <Paper sx={{ p: 6, mb: 6, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <ChefHatIcon sx={{ fontSize: 64, mb: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                mb: 2,
              }}
            >
              Chef's Special
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '600px', mx: 'auto', opacity: 0.9 }}>
              Our master chefs create unique dishes daily using the finest ingredients. 
              Ask your server about today's special recommendations.
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)' 
            },
            gap: 4
          }}>
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <UtensilsIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Fresh Ingredients
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We source the finest local and international ingredients daily
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <ChefHatIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Expert Chefs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our experienced chefs bring years of culinary expertise
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <WineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Perfect Pairings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expertly curated beverage selections to complement every dish
              </Typography>
            </Paper>
          </Box>
        </Paper>

        {/* Reservation CTA */}
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #2c5aa0 0%, #1e3a6f 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              mb: 2,
            }}
          >
            Ready to Dine?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, maxWidth: '600px', mx: 'auto', opacity: 0.9 }}>
            Reserve your table today and experience the finest dining in Pakistan. 
            Our restaurants are open daily with extended hours for your convenience.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              Reserve Table
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'primary.main',
                },
              }}
            >
              Order Delivery
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Restaurant;
