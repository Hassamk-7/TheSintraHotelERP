import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
} from '@mui/icons-material';
import RoomCard from '../components/RoomCard';
import { getRoomTypes, getRoomRates, getRoomTaxesByRoomTypeId, getApplicablePlans } from '../services/api';
import Seo from '../components/Seo';

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    priceRange: [0, 100000],
    location: 'all',
    checkIn: today.toISOString().split('T')[0],
    checkOut: tomorrow.toISOString().split('T')[0],
    amenities: [],
    sortBy: 'price-low'
  });
  const [filteredRooms, setFilteredRooms] = useState([]);

  const handlePlanChange = (room, selectedPlan) => {
    const roomTypeId = room?.roomTypeId ?? room?.RoomTypeId ?? room?.roomType?.id ?? room?.roomType?.Id ?? null;
    const roomKey = room?.id ?? roomTypeId;
    if (roomKey == null) return;

    const updater = (prev) => prev.map((r) => {
      const rRoomTypeId = r?.roomTypeId ?? r?.RoomTypeId ?? r?.roomType?.id ?? r?.roomType?.Id ?? null;
      const rKey = r?.id ?? rRoomTypeId;
      if (rKey == null) return r;
      if (String(rKey) !== String(roomKey)) return r;
      return { ...r, selectedPlan: selectedPlan || null };
    });

    setAllRooms(updater);
    setFilteredRooms(updater);
  };

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const [roomTypesDataRaw, roomRatesDataRaw] = await Promise.all([
          getRoomTypes(),
          getRoomRates()
        ]);

        const roomTypes = Array.isArray(roomTypesDataRaw)
          ? roomTypesDataRaw
          : (roomTypesDataRaw?.data || []);

        const roomRates = Array.isArray(roomRatesDataRaw)
          ? roomRatesDataRaw
          : (roomRatesDataRaw?.data || []);

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
          return rate.roomTypeId ?? rate.RoomTypeId ?? rate.roomType?.id ?? rate.roomType?.Id ?? rate.RoomType?.Id ?? null;
        };

        const checkInDate = toDateOnly(filters.checkIn);

        const nights = (() => {
          const inDate = toDateOnly(filters.checkIn);
          const outDate = toDateOnly(filters.checkOut);
          if (!inDate || !outDate) return 1;
          const diff = Math.max(0, outDate - inDate);
          const computed = Math.round(diff / (1000 * 60 * 60 * 24));
          return computed > 0 ? computed : 1;
        })();

        const computeRoomTax = (basePrice, includesTax, taxesRaw) => {
          const taxes = Array.isArray(taxesRaw) ? taxesRaw : [];
          const breakdown = [];
          let taxTotal = 0;
          let percentSum = 0;

          taxes.forEach((t) => {
            const name = t.taxName ?? t.TaxName ?? 'Tax';
            const type = t.taxType ?? t.TaxType ?? 'Percentage';
            const valueRaw = t.taxValue ?? t.TaxValue ?? 0;
            const value = typeof valueRaw === 'number' ? valueRaw : parseFloat(valueRaw || '0');

            let amount = 0;
            if (includesTax) {
              amount = 0;
            } else if (String(type).toLowerCase() === 'percentage') {
              amount = (Number(basePrice || 0) * Number(value || 0)) / 100;
              percentSum += Number(value || 0);
            } else {
              amount = Number(value || 0);
            }
            taxTotal += amount;
            breakdown.push({ name, type, value, amount });
          });

          const totalWithTax = includesTax ? Number(basePrice || 0) : (Number(basePrice || 0) + taxTotal);
          return { taxTotal, taxBreakdown: breakdown, totalWithTax, percentSum };
        };

        const roomsWithPricing = await Promise.all(roomTypes.map(async (room) => {
          const roomNameKey = (room.roomTypeName || room.name || '').toString().toLowerCase();
          const roomTypeId = room.roomTypeId ?? room.RoomTypeId ?? room.roomType?.id ?? room.roomType?.Id ?? null;

          const matchingRates = roomRates
            .filter((rate) => {
              const rateRoomTypeId = getRateRoomTypeId(rate);
              if (roomTypeId && rateRoomTypeId) return Number(rateRoomTypeId) === Number(roomTypeId);

              const rateRoomType = rate?.roomType;
              const rateKey = typeof rateRoomType === 'string'
                ? rateRoomType.toLowerCase()
                : (rateRoomType?.roomTypeName || rateRoomType?.name || rate.RoomType?.Name || '').toString().toLowerCase();
              return rateKey && rateKey === roomNameKey;
            })
            .filter((rate) => {
              const from = toDateOnly(rate.effectiveFrom || rate.EffectiveFrom || rate.validFrom);
              const to = toDateOnly(rate.effectiveTo || rate.EffectiveTo || rate.validTo);
              return isWithin(checkInDate, from, to);
            });

          const rateInfo = matchingRates[0];

          const roomRateNightly = rateInfo?.baseRate ?? rateInfo?.BaseRate ?? room.basePrice ?? room.price ?? 0;

          const includesTax = (rateInfo?.includesTax ?? rateInfo?.IncludesTax) === true;
          const rateTaxPctRaw = rateInfo?.taxPercentage ?? rateInfo?.TaxPercentage;
          const taxRate = typeof rateTaxPctRaw === 'number'
            ? (rateTaxPctRaw / 100)
            : (parseFloat(rateTaxPctRaw || '0') / 100);

          let roomTaxPayload = null;
          try {
            if (roomTypeId) {
              roomTaxPayload = await getRoomTaxesByRoomTypeId(roomTypeId);
            }
          } catch (e) {
            roomTaxPayload = null;
          }

          const roomTaxRows = roomTaxPayload?.data ?? roomTaxPayload?.Data ?? (roomTaxPayload || []);
          const taxFromRoomTax = computeRoomTax(roomRateNightly, includesTax, roomTaxRows);

          const computedTaxRate = taxFromRoomTax.percentSum > 0
            ? (taxFromRoomTax.percentSum / 100)
            : (taxRate > 0 ? taxRate : 0);

          const fallbackTaxAmountNightly = includesTax ? 0 : (roomRateNightly * computedTaxRate);
          const fallbackTotalWithTaxNightly = includesTax ? roomRateNightly : (roomRateNightly + fallbackTaxAmountNightly);

          const taxAmountNightly = taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.taxTotal : fallbackTaxAmountNightly;
          const totalWithTaxNightly = taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.totalWithTax : fallbackTotalWithTaxNightly;

          const taxAmount = taxAmountNightly * nights;
          const totalWithTax = totalWithTaxNightly * nights;
          const basePriceNightly = roomRateNightly;
          const basePriceTotal = basePriceNightly * nights;

          const hotelId = room.hotelId ?? room.HotelId ?? room.hotel?.id ?? room.hotel?.Id ?? null;
          let applicablePlans = [];
          try {
            if (hotelId && roomTypeId) {
              const plansPayload = await getApplicablePlans({
                hotelId,
                roomTypeId,
                checkInDate: filters.checkIn,
                checkOutDate: filters.checkOut,
              });
              applicablePlans = Array.isArray(plansPayload) ? plansPayload : (plansPayload?.data || []);
            }
          } catch (e) {
            applicablePlans = [];
          }

          return {
            ...room,
            basePrice: basePriceNightly,
            basePriceNightly,
            basePriceTotal,
            weekendRate: rateInfo?.weekendRate ?? rateInfo?.WeekendRate ?? null,
            seasonalRate: rateInfo?.seasonalRate ?? rateInfo?.SeasonalRate ?? null,
            season: rateInfo?.season ?? rateInfo?.Season ?? null,
            currency: rateInfo?.currency ?? rateInfo?.Currency ?? 'PKR',
            includesBreakfast: (rateInfo?.includesBreakfast ?? rateInfo?.IncludesBreakfast) ?? false,
            includesTax,
            taxRate: computedTaxRate,
            taxAmount,
            taxAmountNightly,
            totalWithTax,
            totalWithTaxNightly,
            nights,
            taxBreakdown: (taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.taxBreakdown : []),
            validFrom: rateInfo?.effectiveFrom ?? rateInfo?.EffectiveFrom ?? null,
            validTo: rateInfo?.effectiveTo ?? rateInfo?.EffectiveTo ?? null,
            rateName: rateInfo?.rateName ?? rateInfo?.RateName ?? room.roomTypeName,
            rateCode: rateInfo?.rateCode ?? rateInfo?.RateCode ?? null,
            price: basePriceNightly,
            hotelId,
            applicablePlans,
            selectedPlan: null,
          };
        }));

        const roomsWithActiveRate = roomsWithPricing.filter((r) => {
          const roomTypeId = r.roomTypeId ?? r.RoomTypeId ?? r.roomType?.id ?? r.roomType?.Id ?? null;
          if (!roomTypeId) return false;

          const hasActiveRoomRate = roomRates.some((rate) => {
            const rateRoomTypeId = getRateRoomTypeId(rate);
            if (!rateRoomTypeId) return false;
            if (Number(rateRoomTypeId) !== Number(roomTypeId)) return false;
            const from = toDateOnly(rate.effectiveFrom || rate.EffectiveFrom || rate.validFrom);
            const to = toDateOnly(rate.effectiveTo || rate.EffectiveTo || rate.validTo);
            return isWithin(checkInDate, from, to);
          });

          if (!hasActiveRoomRate) return false;

          return Array.isArray(r.applicablePlans) && r.applicablePlans.length > 0;
        });

        setAllRooms(roomsWithActiveRate);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Filter and sort rooms
  useEffect(() => {
    let filtered = allRooms;

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(room => 
        room.roomTypeCode && room.roomTypeCode.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Filter by location
    if (filters.location !== 'all') {
      filtered = filtered.filter(room => 
        room.hotelLocation && room.hotelLocation.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter(room => {
      const price = room.basePrice || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(room =>
        room.amenities && filters.amenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    // Sort rooms
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.roomTypeName || '').localeCompare(b.roomTypeName || ''));
        break;
      default:
        break;
    }

    setFilteredRooms(filtered);
  }, [filters, allRooms]);

  const categories = [
    { value: 'all', label: 'All Categories', count: allRooms.length },
    { value: 'STD', label: 'Standard Room', count: allRooms.filter(r => r.roomTypeCode === 'STD').length },
    { value: 'DLX', label: 'Deluxe Room', count: allRooms.filter(r => r.roomTypeCode === 'DLX').length },
    { value: 'EXE', label: 'Executive Suite', count: allRooms.filter(r => r.roomTypeCode === 'EXE').length },
    { value: 'PRE', label: 'Presidential Suite', count: allRooms.filter(r => r.roomTypeCode === 'PRE').length },
    { value: 'FAM', label: 'Family Room', count: allRooms.filter(r => r.roomTypeCode === 'FAM').length },
    { value: 'VIP4', label: 'VVIP Room', count: allRooms.filter(r => r.roomTypeCode === 'VIP4').length },
    { value: 'PM', label: 'PM Room', count: allRooms.filter(r => r.roomTypeCode === 'PM').length }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'karachi', label: 'Karachi' }
  ];


  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };


  const clearFilters = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFilters({
      category: 'all',
      priceRange: [0, 100000],
      location: 'all',
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0],
      amenities: [],
      sortBy: 'price-low'
    });
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Seo
        title="Rooms"
        description="Explore Luxury Hotel rooms and suites in Pakistan. Compare amenities, view pricing, and choose the perfect room for your stay."
        keywords="luxury hotel rooms, suites, room types, premium rooms, Pakistan accommodation, room rates, book room"
      />
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3,
                color: 'white',
              }}
            >
              Our Rooms & Suites
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Discover our collection of luxurious accommodations, each designed to provide 
              the ultimate comfort and elegance for your stay.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ py: 6, px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }, maxWidth: '1440px', mx: 'auto', overflowX: 'hidden' }}>
        {/* Category Tabs */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3, textAlign: 'center', color: '#111827' }}>
            Browse by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category.value}
                label={`${category.label} (${category.count})`}
                onClick={() => handleFilterChange('category', category.value)}
                variant={filters.category === category.value ? 'filled' : 'outlined'}
                sx={{
                  px: 3,
                  py: 1.5,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 3,
                  height: 'auto',
                  backgroundColor: filters.category === category.value ? '#2563eb' : 'transparent',
                  color: filters.category === category.value ? 'white' : '#374151',
                  borderColor: filters.category === category.value ? '#2563eb' : '#d1d5db',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: filters.category === category.value ? '#1d4ed8' : '#f3f4f6',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Filters Section */}
        <Paper 
          sx={{ 
            p: { xs: 2, sm: 3, md: 3.5 }, 
            mb: 4, 
            borderRadius: 4, 
            backgroundColor: 'white', 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%)',
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterIcon sx={{ color: '#2563eb', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="700" sx={{ color: '#111827' }}>
                Filters & Search
              </Typography>
            </Box>
            <Button 
              variant="outlined" 
              onClick={clearFilters} 
              size="medium"
              sx={{ 
                borderRadius: 3,
                borderColor: '#e5e7eb',
                color: '#6b7280',
                fontWeight: 600,
                px: 3,
                py: 1,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                }
              }}
            >
              Clear All Filters
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            {/* Check-in Date */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                📅 Check-in
              </Typography>
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  border: '1.5px solid #e5e7eb',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              />
            </Box>

            {/* Check-out Date */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                📅 Check-out
              </Typography>
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                min={filters.checkIn}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.95rem',
                  borderRadius: '10px',
                  border: '1.5px solid #e5e7eb',
                  outline: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              />
            </Box>

            {/* Location Filter */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                📍 Location
              </Typography>
              <Select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                fullWidth
                sx={{
                  borderRadius: 2.5,
                  height: '52px',
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1.5px',
                  },
                }}
              >
                {locations.map((location) => (
                  <MenuItem key={location.value} value={location.value} sx={{ fontSize: '0.95rem' }}>
                    {location.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Room Type Filter */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                🏨 Room Type
              </Typography>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                fullWidth
                sx={{
                  borderRadius: 2.5,
                  height: '52px',
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1.5px',
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value} sx={{ fontSize: '0.95rem' }}>
                    {category.label} ({category.count})
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Price Range */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                💰 Price: PKR {filters.priceRange[1].toLocaleString()}
              </Typography>
              <Box sx={{ pt: 1.5, px: 1 }}>
                <Slider
                  value={filters.priceRange[1]}
                  onChange={(e, value) => handleFilterChange('priceRange', [0, value])}
                  min={0}
                  max={100000}
                  step={1000}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `PKR ${value.toLocaleString()}`}
                  sx={{
                    color: '#2563eb',
                    height: 7,
                    '& .MuiSlider-track': {
                      border: 'none',
                      background: 'linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)',
                    },
                    '& .MuiSlider-thumb': {
                      height: 18,
                      width: 18,
                      backgroundColor: '#fff',
                      border: '2px solid #2563eb',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(37, 99, 235, 0.16)',
                      },
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: 12,
                      background: '#2563eb',
                      padding: '5px 10px',
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Sort By */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                🔄 Sort By
              </Typography>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                fullWidth
                sx={{
                  borderRadius: 2.5,
                  height: '52px',
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1.5px',
                  },
                }}
              >
                <MenuItem value="price-low" sx={{ fontSize: '0.95rem' }}>💸 Low to High</MenuItem>
                <MenuItem value="price-high" sx={{ fontSize: '0.95rem' }}>💰 High to Low</MenuItem>
                <MenuItem value="rating" sx={{ fontSize: '0.95rem' }}>⭐ Rating</MenuItem>
                <MenuItem value="name" sx={{ fontSize: '0.95rem' }}>🔤 Name</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* View Toggle */}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" sx={{ color: '#374151', fontSize: '0.9rem' }}>
              👁️ View
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => {
                console.log('View mode changing from', viewMode, 'to', newMode);
                if (newMode !== null) {
                  setViewMode(newMode);
                  console.log('View mode set to:', newMode);
                }
              }}
              size="medium"
              sx={{
                backgroundColor: 'white',
                '& .MuiToggleButton-root': {
                  border: '2px solid #e5e7eb',
                  color: '#6b7280',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#eff6ff',
                    borderColor: '#2563eb',
                    color: '#2563eb',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#2563eb !important',
                    borderColor: '#2563eb !important',
                    color: 'white !important',
                    '&:hover': {
                      backgroundColor: '#1d4ed8 !important',
                      borderColor: '#1d4ed8 !important',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridIcon sx={{ mr: 0.5 }} fontSize="small" />
                Grid
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ListIcon sx={{ mr: 0.5 }} fontSize="small" />
                List
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Active Filters Display */}
          {(filters.category !== 'all' || filters.location !== 'all' || filters.priceRange[1] < 100000) && (
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ color: '#374151', mb: 2 }}>
                🏷️ Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {filters.category !== 'all' && (
                  <Chip
                    label={`Category: ${categories.find(c => c.value === filters.category)?.label}`}
                    onDelete={() => handleFilterChange('category', 'all')}
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': {
                        color: '#2563eb',
                      },
                    }}
                  />
                )}
                {filters.location !== 'all' && (
                  <Chip
                    label={`Location: ${locations.find(l => l.value === filters.location)?.label}`}
                    onDelete={() => handleFilterChange('location', 'all')}
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': {
                        color: '#2563eb',
                      },
                    }}
                  />
                )}
                {filters.priceRange[1] < 100000 && (
                  <Chip
                    label={`Max Price: PKR ${filters.priceRange[1].toLocaleString()}`}
                    onDelete={() => handleFilterChange('priceRange', [0, 100000])}
                    sx={{
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      fontWeight: 600,
                      '& .MuiChip-deleteIcon': {
                        color: '#2563eb',
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Paper>

        {/* Results Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="700" gutterBottom sx={{ color: '#111827' }}>
              {filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''} Found
            </Typography>
            {filters.category !== 'all' && (
              <Typography variant="body1" sx={{ color: '#6b7280' }}>
                Showing {categories.find(c => c.value === filters.category)?.label} rooms
              </Typography>
            )}
            <Chip 
              label={viewMode === 'grid' ? '🔲 Grid View' : '☰ List View'}
              size="small"
              sx={{ 
                mt: 1,
                backgroundColor: viewMode === 'grid' ? '#dbeafe' : '#fef3c7',
                color: viewMode === 'grid' ? '#1e40af' : '#92400e',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {/* Results Grid/List */}
        {filteredRooms.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <FilterIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: '#111827' }}>
              No rooms found
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', mb: 4 }}>
              Try adjusting your filters to find more options.
            </Typography>
            <Button 
              variant="contained" 
              onClick={clearFilters}
              sx={{
                backgroundColor: '#2563eb',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                }
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Box sx={{ 
            display: viewMode === 'list' ? 'flex' : 'grid',
            flexDirection: viewMode === 'list' ? 'column' : 'row',
            gridTemplateColumns: viewMode === 'list'
              ? undefined
              : {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(3, minmax(0, 1fr))',
                  lg: 'repeat(4, minmax(0, 1fr))'
                },
            gap: 3,
            transition: 'all 0.3s ease-in-out',
            width: '100%',
            maxWidth: viewMode === 'list' ? '100%' : '1320px',
            mx: 'auto',
            overflowX: 'hidden',
            alignItems: 'stretch',
          }}>
            {filteredRooms.map((room) => (
              <Box 
                key={room.id}
                sx={{
                  width: '100%',
                  minWidth: 0,
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <RoomCard room={room} viewMode={viewMode} onPlanChange={handlePlanChange} />
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Rooms;
