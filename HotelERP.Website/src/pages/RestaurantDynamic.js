import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocalDining as DiningIcon,
  LocationOn as MapPinIcon,
  Spa as VegetarianIcon,
  Whatshot as SpicyIcon,
} from '@mui/icons-material';
import api, { IMAGE_BASE_URL, getImageUrl } from '../services/api';
import Seo from '../components/Seo';

const RestaurantDynamic = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'Appetizers', name: 'Appetizers' },
    { id: 'Main Course', name: 'Main Course' },
    { id: 'Desserts', name: 'Desserts' },
    { id: 'Beverages', name: 'Beverages' },
  ];

  const cuisines = [
    { id: 'all', name: 'All Cuisines' },
    { id: 'Pakistani', name: 'Pakistani Cuisine' },
    { id: 'Continental', name: 'Continental' },
    { id: 'Chinese', name: 'Chinese' },
    { id: 'Italian', name: 'Italian' },
    { id: 'Thai', name: 'Thai' }
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'Islamabad', name: 'Islamabad' },
    { id: 'Lahore', name: 'Lahore' },
    { id: 'Karachi', name: 'Karachi' }
  ];

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/RestaurantLocation');
      const restaurants = response.data || [];
      
      // Fetch menu items for all restaurants
      const menuResponse = await api.get('/MenuItem');
      const items = menuResponse.data || [];
      console.log('🍽️ Menu Items API Response:', items);
      console.log('🍽️ First item:', items[0]);
      
      // Transform API data
      const transformedItems = items.map(item => {
        console.log('🔍 Transforming item:', item.name, 'imagePath:', item.imagePath);
        const imageUrl = item.imagePath
          ? `${IMAGE_BASE_URL}${item.imagePath}`
          : getImageUrl('chicken-tikka.jpg', 'restaurant');
        console.log('🖼️ Final image URL:', imageUrl);
        return {
          id: item.menuItemID,
          name: item.name || 'Menu Item',
          category: item.category || 'Main Course',
          cuisine: item.cuisine || 'Pakistani',
          price: item.price || 0,
          description: item.description || '',
          image: imageUrl,
          rating: item.rating || 4.5,
          spicy: item.isSpicy || false,
          vegetarian: item.isVegetarian || false,
          locations: item.restaurantID ? [restaurants.find(r => r.restaurantID === item.restaurantID)?.location || 'Islamabad'] : ['Islamabad'],
          displayOrder: item.displayOrder
        };
      });

      transformedItems.sort((a, b) => a.displayOrder - b.displayOrder);
      
      setMenuItems(transformedItems);
      
      // Get unique restaurants (room types with Restaurant category)
      const uniqueRestaurants = [...new Set(transformedItems.map(item => item.locations[0]))];
      setRestaurants(uniqueRestaurants.map((loc, idx) => ({
        id: idx + 1,
        name: `${loc} Restaurant`,
        location: loc,
        rating: 4.8,
        image: transformedItems.find(item => item.locations.includes(loc))?.image || ''
      })));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching restaurant data:', err);
      setError('Failed to load restaurant menu');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = menuItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || item.locations.includes(selectedLocation);
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
      <Seo
        title="Restaurant"
        description="Dine at Luxury Hotel with curated Pakistani and international flavors. Explore our menu, locations, and signature dishes for every occasion."
        keywords="Luxury Hotel restaurant, hotel dining, Pakistani cuisine, continental food, menu, breakfast, lunch, dinner"
        author="Luxury Hotel"
      />
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '360px', md: '460px' },
          display: 'flex',
          alignItems: 'flex-end',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.36), rgba(0,0,0,0.46)), url(/img/slider/sub.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pb: { xs: 6, md: 9 }, pl: { xs: 2, md: 6 } }}>
          <Box sx={{ maxWidth: { xs: '100%', md: '980px' }, color: '#fff', textAlign: 'left' }}>
            <Typography
              sx={{
                fontSize: '16px',
                letterSpacing: '4px',
                color: '#d4af37',
                lineHeight: 1,
                mb: 1,
                ml: { xs: 0, md: '4px' },
              }}
            >
              *****
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                letterSpacing: '6px',
                textTransform: 'uppercase',
                mb: 1.6,
                color: '#ffffff',
              }}
            >
              Sintra hotel islamabad
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Gilda Display, serif',
                fontWeight: 400,
                fontSize: { xs: '34px', md: '48px' },
                lineHeight: 1.12,
                color: '#ffffff',
                maxWidth: { xs: '100%', md: '980px' },
              }}
            >
              A Culinary Adventure Awaits at Spice <br /> Fusion Restaurant, Islamabad
            </Typography>
          </Box>
        </Container>
      </Box>

      {restaurants.length > 0 && (
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Typography
            sx={{
              fontFamily: 'Playfair Display',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              textAlign: 'center',
              mb: 6,
              color: '#111827',
            }}
          >
            Our Restaurants
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 4,
            }}
          >
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={restaurant.image}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                    <MapPinIcon fontSize="small" />
                    <Typography variant="body2">{restaurant.location}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      )}

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography
          sx={{
            fontFamily: 'Playfair Display',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
            textAlign: 'center',
            mb: 6,
            color: '#111827',
          }}
        >
          Our Menu
        </Typography>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 6, borderRadius: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight="600" mb={1}>
                Filter by Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => setSelectedCategory(category.id)}
                    color={selectedCategory === category.id ? 'primary' : 'default'}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="600" mb={1}>
                Filter by Location
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {locations.map((location) => (
                  <Chip
                    key={location.id}
                    label={location.name}
                    onClick={() => setSelectedLocation(location.id)}
                    color={selectedLocation === location.id ? 'primary' : 'default'}
                    variant={selectedLocation === location.id ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Menu Items Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 4,
          }}
        >
          {filteredMenuItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
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
                  image={item.image}
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
                  }}
                >
                  <Chip
                    label={item.cuisine}
                    size="small"
                    sx={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  {item.vegetarian && (
                    <Chip
                      icon={<VegetarianIcon />}
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

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  {item.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Rating value={item.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {item.rating}
                  </Typography>
                  {item.spicy && (
                    <Chip
                      icon={<SpicyIcon />}
                      label="Spicy"
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                  <Typography variant="h6" fontWeight="700" color="primary">
                    PKR {item.price.toLocaleString()}
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

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                  <Typography variant="caption" color="text.secondary">
                    <MapPinIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                    Available at: {item.locations.join(', ')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

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

export default RestaurantDynamic;
