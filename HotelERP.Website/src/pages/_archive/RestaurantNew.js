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
  Chip,
  Rating,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn as MapPinIcon,
  Whatshot as SpicyIcon,
  Grass as VegetarianIcon,
} from '@mui/icons-material';
import { getImageUrl } from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.thesintrahotel.com/api';

const RestaurantNew = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'Appetizers', name: 'Appetizers' },
    { id: 'Main Course', name: 'Main Course' },
    { id: 'Desserts', name: 'Desserts' },
    { id: 'Beverages', name: 'Beverages' },
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'Islamabad', name: 'Islamabad' },
    { id: 'Lahore', name: 'Lahore' },
    { id: 'Karachi', name: 'Karachi' },
  ];

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurants
      const restaurantsResponse = await axios.get(`${API_BASE_URL}/RestaurantLocation`);
      setRestaurants(restaurantsResponse.data || []);
      
      // Fetch all menu items
      const menuResponse = await axios.get(`${API_BASE_URL}/MenuItem`);
      setMenuItems(menuResponse.data || []);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
      setError('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || 
      restaurants.find(r => r.restaurantID === item.restaurantID)?.location === selectedLocation;
    return categoryMatch && locationMatch;
  });

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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
              Restaurant & Dining
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
              Experience culinary excellence with our diverse menu featuring the finest
              Pakistani, Continental, and Chinese cuisines prepared by master chefs.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Our Restaurants Section */}
      {restaurants.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              textAlign: 'center',
              mb: 6,
              color: '#111827'
            }}
          >
            Our Restaurants
          </Typography>
          
          <Grid container spacing={4}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} md={4} key={restaurant.restaurantID}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={restaurant.ImagePath 
                      ? getImageUrl(restaurant.ImagePath) 
                      : 'https://api.thesintrahotel.com/uploads/default-restaurant.jpg'}
                    alt={restaurant.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" fontWeight="700" gutterBottom>
                      {restaurant.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={restaurant.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.rating}
                      </Typography>
                    </Box>
                    {restaurant.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {restaurant.description}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <MapPinIcon fontSize="small" />
                      <Typography variant="body2">{restaurant.location}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Our Menu Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Playfair Display',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            textAlign: 'center',
            mb: 6,
            color: '#111827'
          }}
        >
          Our Menu
        </Typography>

        {/* Filters */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="subtitle2" fontWeight="600" mb={2} sx={{ textAlign: 'center' }}>
            Filter by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? 'primary' : 'default'}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle2" fontWeight="600" mb={2} sx={{ textAlign: 'center' }}>
            Filter by Location
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {locations.map((location) => (
              <Chip
                key={location.id}
                label={location.name}
                onClick={() => setSelectedLocation(location.id)}
                color={selectedLocation === location.id ? 'primary' : 'default'}
                variant={selectedLocation === location.id ? 'filled' : 'outlined'}
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Menu Items Grid */}
        <Grid container spacing={4}>
          {filteredMenuItems.map((item) => {
            const restaurant = restaurants.find(r => r.restaurantID === item.restaurantID);
            return (
              <Grid item xs={12} sm={6} md={4} key={item.menuItemID}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={item.ImagePath 
                        ? getImageUrl(item.ImagePath) 
                        : 'https://api.thesintrahotel.com/uploads/default-menu.jpg'}
                      alt={item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      {item.cuisine && (
                        <Chip
                          label={item.cuisine}
                          size="small"
                          sx={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      {item.isVegetarian && (
                        <Chip
                          icon={<VegetarianIcon sx={{ color: 'white !important' }} />}
                          label="Veg"
                          size="small"
                          sx={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                      {item.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Rating value={item.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {item.rating}
                      </Typography>
                      {item.isSpicy && (
                        <Chip
                          icon={<SpicyIcon sx={{ fontSize: 14 }} />}
                          label="Spicy"
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40, flexGrow: 1 }}>
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                      <Typography variant="h6" fontWeight="700" color="primary">
                        PKR {item.price?.toLocaleString()}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#2563eb',
                          '&:hover': { backgroundColor: '#1d4ed8' },
                        }}
                      >
                        Order Now
                      </Button>
                    </Box>
                    
                    {restaurant && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                        <Typography variant="caption" color="text.secondary">
                          <MapPinIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                          Available at: {restaurant.location}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {filteredMenuItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No menu items found for the selected filters.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RestaurantNew;
