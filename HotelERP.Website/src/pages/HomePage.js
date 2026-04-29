import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import BookingAssistant from '../components/BookingAssistant';
import SearchForm from '../components/SearchForm';
import { getRoomTypes, getRoomRates, getImageUrl } from '../services/api';
import Seo from '../components/Seo';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero slider images (useMemo to keep dependency stable)
  const heroImages = useMemo(
    () => [
      {
        url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        title: 'Luxury Accommodation',
        subtitle: 'Experience the finest hospitality in Pakistan',
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Premium Rooms & Suites',
        subtitle: 'Comfort and elegance in every detail',
      },
      {
        url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'World-Class Dining',
        subtitle: 'Savor exquisite cuisine at our restaurants',
      },
    ],
    []
  );

  // Fetch featured rooms with pricing from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const [roomTypesData, roomRatesData] = await Promise.all([getRoomTypes(), getRoomRates()]);

        const roomTypes = Array.isArray(roomTypesData) ? roomTypesData : roomTypesData?.data || [];
        const roomRates = Array.isArray(roomRatesData) ? roomRatesData : roomRatesData?.data || [];

        const toDateOnly = (v) => {
          if (!v) return null;
          const d = new Date(v);
          return Number.isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };

        const isWithin = (date, from, to) => {
          if (!date) return true;
          if (from && date < from) return false;
          if (to && date > to) return false;
          return true;
        };

        const getRateRoomTypeId = (rate) => {
          if (!rate) return null;
          return (
            rate.roomTypeId ??
            rate.RoomTypeId ??
            rate.roomType?.id ??
            rate.roomType?.Id ??
            rate.RoomType?.Id ??
            null
          );
        };

        const todayDate = toDateOnly(new Date());

        const roomsWithPricing = roomTypes
          .map((room) => {
            const roomNameKey = (room.roomTypeName || room.name || '').toString().toLowerCase();
            const roomTypeId = room.roomTypeId ?? room.RoomTypeId ?? room.roomType?.id ?? room.roomType?.Id ?? null;

            const matchingRates = roomRates
              .filter((rate) => {
                const rateRoomTypeId = getRateRoomTypeId(rate);
                if (roomTypeId && rateRoomTypeId) return Number(rateRoomTypeId) === Number(roomTypeId);

                const rateRoomType = rate?.roomType;
                const rateKey =
                  typeof rateRoomType === 'string'
                    ? rateRoomType.toLowerCase()
                    : (rateRoomType?.roomTypeName ||
                        rateRoomType?.name ||
                        rate.RoomType?.Name ||
                        '')
                        .toString()
                        .toLowerCase();

                return rateKey && rateKey === roomNameKey;
              })
              .filter((rate) => {
                const from = toDateOnly(rate.effectiveFrom || rate.EffectiveFrom || rate.validFrom);
                const to = toDateOnly(rate.effectiveTo || rate.EffectiveTo || rate.validTo);
                return isWithin(todayDate, from, to);
              });

            const rateInfo = matchingRates[0];
            if (!rateInfo) return null;

            const basePrice = rateInfo?.baseRate ?? rateInfo?.BaseRate ?? 0;
            const includesTax = (rateInfo?.includesTax ?? rateInfo?.IncludesTax) === true;
            const rateTaxPctRaw = rateInfo?.taxPercentage ?? rateInfo?.TaxPercentage;
            const taxRate =
              typeof rateTaxPctRaw === 'number' ? rateTaxPctRaw / 100 : parseFloat(rateTaxPctRaw || '0') / 100;

            const computedTaxRate = taxRate > 0 ? taxRate : 0;
            const taxAmount = includesTax ? 0 : basePrice * computedTaxRate;
            const totalWithTax = includesTax ? basePrice : basePrice + taxAmount;

            return {
              ...room,
              basePrice,
              weekendRate: rateInfo?.weekendRate ?? rateInfo?.WeekendRate ?? null,
              seasonalRate: rateInfo?.seasonalRate ?? rateInfo?.SeasonalRate ?? null,
              season: rateInfo?.season ?? rateInfo?.Season ?? null,
              currency: rateInfo?.currency ?? rateInfo?.Currency ?? 'PKR',
              includesBreakfast: (rateInfo?.includesBreakfast ?? rateInfo?.IncludesBreakfast) ?? false,
              includesTax,
              taxRate,
              taxAmount,
              totalWithTax,
              validFrom: rateInfo?.effectiveFrom ?? rateInfo?.EffectiveFrom ?? null,
              validTo: rateInfo?.effectiveTo ?? rateInfo?.EffectiveTo ?? null,
              rateName: rateInfo?.rateName ?? rateInfo?.RateName ?? room.roomTypeName,
              rateCode: rateInfo?.rateCode ?? rateInfo?.RateCode ?? null,
              price: basePrice,
            };
          })
          .filter(Boolean)
          .slice(0, 3);

        setFeaturedRooms(roomsWithPricing);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
        // Fallback to mock data if API fails
        setFeaturedRooms([
          {
            roomTypeId: 1,
            roomTypeName: 'Standard Room',
            basePrice: 5000,
            weekendRate: 6000,
            images: [
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            rating: 4.5,
            amenities: ['Free WiFi', 'AC', 'Room Service'],
          },
          {
            roomTypeId: 2,
            roomTypeName: 'Deluxe Room',
            basePrice: 8000,
            weekendRate: 9500,
            images: [
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            rating: 4.7,
            amenities: ['Free WiFi', 'AC', 'Balcony', 'Room Service'],
          },
          {
            roomTypeId: 3,
            roomTypeName: 'Executive Suite',
            basePrice: 15000,
            weekendRate: 17500,
            images: [
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            ],
            rating: 4.9,
            amenities: ['Free WiFi', 'AC', 'Balcony', 'Room Service', 'Living Area'],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Blog posts
  const blogPosts = useMemo(
    () => [
      {
        id: 1,
        title: 'Top 10 Tourist Destinations in Pakistan',
        excerpt: 'Discover the most beautiful places to visit during your stay...',
        image:
          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        date: '2024-01-15',
        author: 'Travel Team',
      },
      {
        id: 2,
        title: 'Luxury Dining Experience at Our Restaurant',
        excerpt: 'Experience world-class cuisine prepared by our master chefs...',
        image:
          'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        date: '2024-01-12',
        author: 'Culinary Team',
      },
      {
        id: 3,
        title: 'Wedding Packages and Event Planning',
        excerpt: 'Make your special day unforgettable with our premium services...',
        image:
          'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        date: '2024-01-10',
        author: 'Events Team',
      },
    ],
    []
  );

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <Box>
      <Seo
        title="Home"
        description="Luxury Hotel - Experience the finest hospitality in Pakistan with premium rooms, suites, and world-class amenities. Book your perfect stay today."
        keywords="luxury hotel, premium accommodation, Pakistan hotels, hotel booking, luxury suites, hospitality"
        author="Luxury Hotel"
      />

      {/* Hero wrapper */}
      <Box sx={{ minHeight: '100vh' }}>
        <Box
          sx={{
            position: 'relative',
            height: { xs: 'auto', sm: '90vh', md: '100vh' },
            minHeight: { xs: 'calc(100vh - 84px)', sm: '90vh', md: '100vh' },
            overflow: 'hidden',
          }}
        >
          {heroImages.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            >
              <Box
                component="img"
                src={image.url}
                alt={image.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(44, 90, 160, 0.7) 0%, rgba(30, 58, 111, 0.8) 50%, rgba(0, 0, 0, 0.6) 100%)',
                }}
              />
            </Box>
          ))}

          {/* Hero Content */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'center' },
              zIndex: 10,
              pt: { xs: 3, md: 0 },
              pb: { xs: 4, md: 0 },
            }}
          >
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, md: 3 } }}>
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'white',
                  px: { xs: 2, sm: 3, md: 2 },
                  mb: { xs: 2, md: 6 },
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: 'Playfair Display',
                    fontWeight: 700,
                    fontSize: { xs: '1.55rem', sm: '2.8rem', md: '4rem', lg: '5rem' },
                    mb: { xs: 0.75, md: 2 },
                    textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                    background: 'linear-gradient(45deg, #ffffff 30%, #e6c659 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'fadeInUp 1s ease-out',
                    lineHeight: { xs: 1.25, md: 1.1 },
                    '@keyframes fadeInUp': {
                      '0%': { opacity: 0, transform: 'translateY(30px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  {heroImages[currentSlide].title}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '0.92rem', md: '1.4rem' },
                    mb: { xs: 2, md: 4 },
                    opacity: 0.95,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    animation: 'fadeInUp 1s ease-out 0.3s both',
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: { xs: 1.5, md: 1.4 },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {heroImages[currentSlide].subtitle}
                </Typography>
              </Box>

              <Box sx={{ animation: 'fadeInUp 1s ease-out 0.6s both', mb: { xs: 2, md: 4 } }}>
                <SearchForm />
              </Box>

              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  animation: 'fadeInUp 1s ease-out 0.9s both',
                }}
              >
                <Button
                  component={Link}
                  to="/rooms"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    background: 'linear-gradient(45deg, #d4af37 30%, #e6c659 90%)',
                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #b8941f 30%, #d4af37 90%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(212, 175, 55, 0.6)',
                    },
                  }}
                >
                  Explore Rooms
                </Button>

                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderColor: 'white',
                    color: 'white',
                    borderWidth: 2,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: 'primary.main',
                      borderColor: 'white',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Container>
          </Box>

          {/* Slider Controls */}
          <IconButton
            onClick={prevSlide}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: { xs: 'none', md: 'inline-flex' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
              zIndex: 20,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={nextSlide}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: { xs: 'none', md: 'inline-flex' },
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
              zIndex: 20,
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Slider Indicators */}
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 18, md: 32 },
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 20,
            }}
          >
            {heroImages.map((_, index) => (
              <Box
                key={index}
                component="button"
                onClick={() => setCurrentSlide(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* ✅ END hero wrapper */}

      {/* Featured Rooms Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'Playfair Display',
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              }}
            >
              Featured Rooms
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              Discover our most popular accommodations, designed for comfort and luxury
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 300,
                  gridColumn: '1 / -1',
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              featuredRooms.map((room) => {
                const amenities = Array.isArray(room.amenities) ? room.amenities : [];
                return (
                  <Card
                    key={room.roomTypeId ?? room.id ?? room.roomTypeName}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '60%', backgroundColor: '#f5f5f5' }}>
                      {room.images && room.images.length > 0 ? (
                        <CardMedia
                          component="img"
                          image={getImageUrl(room.images[0], 'roomtypes')}
                          alt={room.roomTypeName}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f5f5f5',
                            color: '#9ca3af',
                          }}
                        >
                          <Typography variant="body2">No Image</Typography>
                        </Box>
                      )}

                      <Chip
                        label={room.roomTypeCode || 'Room'}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          backgroundColor: '#2563eb',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <StarIcon sx={{ fontSize: 14 }} />
                        {room.rating || 4.5}
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827', lineHeight: 1.3 }}>
                        {room.roomTypeName}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, lineHeight: 1.5, flexGrow: 1 }}>
                        {room.description || 'Luxurious accommodation with modern amenities'}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {amenities.slice(0, 3).map((amenity, index) => (
                            <Chip
                              key={`${amenity}-${index}`}
                              label={amenity}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: '#e5e7eb',
                                color: '#6b7280',
                                fontSize: '0.7rem',
                                height: '24px',
                              }}
                            />
                          ))}
                          {amenities.length > 3 && (
                            <Chip
                              label={`+${amenities.length - 3} more`}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: '#e5e7eb',
                                color: '#6b7280',
                                fontSize: '0.7rem',
                                height: '24px',
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {room.location || ''}
                          </Typography>
                          <Typography variant="h6" fontWeight="700" sx={{ color: '#2563eb' }}>
                            PKR {Number(room.basePrice || 0).toLocaleString()}/night
                          </Typography>
                        </Box>

                        <Button
                          onClick={() => {
                            const today = new Date();
                            const tomorrow = new Date(today);
                            tomorrow.setDate(tomorrow.getDate() + 1);

                            const searchParams = new URLSearchParams({
                              location: 'all',
                              checkIn: today.toISOString().split('T')[0],
                              checkOut: tomorrow.toISOString().split('T')[0],
                              adults: '1',
                              children: '0',
                              rooms: '1',
                              category: room.roomTypeCode || room.roomTypeName,
                            });

                            navigate(`/search?${searchParams.toString()}`);
                          }}
                          variant="outlined"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            borderColor: '#2563eb',
                            color: '#2563eb',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            width: '100%',
                            '&:hover': { backgroundColor: '#2563eb', color: 'white' },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button component={Link} to="/rooms" variant="contained" color="primary" size="large" endIcon={<ArrowForwardIcon />}>
              View All Rooms
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Blog Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Latest News & Updates
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto' }}>
              Stay updated with our latest news, travel tips, and special offers
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)' },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '60%', backgroundColor: '#f5f5f5' }}>
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Chip
                    label={post.author.replace(' Team', '')}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{
                      mb: 1.5,
                      color: '#111827',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      mb: 2.5,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                        {post.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        •
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    component={Link}
                    to={`/blog/${post.id}`}
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 'auto',
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#2563eb', color: 'white' },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Travel Blog Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, color: 'text.primary', mb: 2 }}>
              Travel Blog & Stories
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '600px', mx: 'auto', mb: 4 }}>
              Discover Pakistan&apos;s hidden gems, cultural treasures, and culinary delights through our travel stories
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {[
              {
                id: 1,
                title: 'Top 10 Tourist Destinations in Pakistan',
                excerpt:
                  'Discover the most beautiful places to visit during your stay in Pakistan, from the northern mountains to southern beaches.',
                image:
                  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Travel Tips',
                author: 'Sarah Ahmed',
                date: '2024-01-15',
                readTime: '8 min read',
              },
              {
                id: 2,
                title: 'A Culinary Journey Through Pakistani Cuisine',
                excerpt:
                  'Experience the rich flavors and diverse culinary traditions that make Pakistani food unique and unforgettable.',
                image:
                  'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Food & Dining',
                author: 'Chef Muhammad Ali',
                date: '2024-01-12',
                readTime: '6 min read',
              },
              {
                id: 3,
                title: 'The Majestic Beauty of Northern Pakistan',
                excerpt:
                  "Explore the stunning mountain ranges, pristine lakes, and breathtaking valleys of Pakistan's northern regions.",
                image:
                  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'Adventure',
                author: 'Ahmad Hassan',
                date: '2024-01-10',
                readTime: '10 min read',
              },
            ].map((post) => (
              <Card
                key={post.id}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)' },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '60%', backgroundColor: '#f5f5f5' }}>
                  <CardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                    sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    fontWeight="700"
                    sx={{
                      mb: 1.5,
                      color: '#111827',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#6b7280',
                      mb: 2.5,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.excerpt}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                        {post.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        •
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {post.readTime}
                    </Typography>
                  </Box>

                  <Button
                    component={Link}
                    to={`/blog/${post.id}`}
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 'auto',
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: '#2563eb', color: 'white' },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={Link}
              to="/blogs"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#2563eb',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#1d4ed8' },
              }}
            >
              View All Blog Posts
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: 'primary.dark', color: 'white' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, mb: 3 }}>
              Ready to Experience Luxury?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Book your stay today and enjoy world-class hospitality across Pakistan
            </Typography>
            <Button component={Link} to="/reservation" variant="contained" color="secondary" size="large" sx={{ px: 4, py: 1.5 }}>
              Book Now
            </Button>
          </Box>
        </Container>
      </Box>

      <BookingAssistant />
    </Box>
  );
};

export default HomePage;
