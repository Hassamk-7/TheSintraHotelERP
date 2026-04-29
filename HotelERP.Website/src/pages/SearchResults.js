import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
  Paper,
  Stack,
  CircularProgress,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Tune as TuneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
} from '@mui/icons-material';
import RoomCard from '../components/RoomCard';
import api, { searchRooms, getHotels, getRoomRates, getRoomTaxesByRoomTypeId, getApplicablePlans } from '../services/api';
import Seo from '../components/Seo';

const toLocalYmd = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const normalizeYmd = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const split = value.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(split)) return split;
  }
  return toLocalYmd(value);
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [allRooms, setAllRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    category: 'all',
    location: 'all',
    amenities: [],
    sortBy: 'price-low'
  });
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  const [availableAmenities, setAvailableAmenities] = useState([]);

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

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      console.log('View mode changed to:', newMode);
    }
  };

  // Fetch hotels/locations on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotelsData = await getHotels();
        setHotels(hotelsData);
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      }
    };
    fetchHotels();
  }, []);

  // Sync filters (location/category) from URL params when params or hotels change
  useEffect(() => {
    const locationParam = searchParams.get('location') || 'all';
    const categoryParam = searchParams.get('category') || 'all';

    const normalizeLocation = (value) => {
      const lower = (value || '').toLowerCase();
      if (!value || lower === 'all') return 'all';
      const matched = hotels.find((h) => (h.city || '').toLowerCase() === lower);
      return matched?.city || value;
    };

    setFilters((prev) => {
      const nextLocation = normalizeLocation(locationParam);
      const nextCategory = categoryParam;

      if (prev.location === nextLocation && prev.category === nextCategory) {
        return prev;
      }

      return {
        ...prev,
        location: nextLocation,
        category: nextCategory
      };
    });
  }, [searchParams, hotels]);

  // Fetch rooms from API based on search parameters
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const fallbackCheckIn = toLocalYmd(new Date());
        const fallbackCheckOutDate = new Date();
        fallbackCheckOutDate.setDate(fallbackCheckOutDate.getDate() + 1);
        const fallbackCheckOut = toLocalYmd(fallbackCheckOutDate);

        const apiSearchData = {
          location: searchParams.get('location') || '',
          checkInDate: normalizeYmd(searchParams.get('checkIn')) || fallbackCheckIn,
          checkOutDate: normalizeYmd(searchParams.get('checkOut')) || fallbackCheckOut,
          adults: parseInt(searchParams.get('adults')) || 1,
          children: parseInt(searchParams.get('children')) || 0,
          rooms: parseInt(searchParams.get('rooms')) || 1
        };

        // Fetch both search results and room rates
        const [roomsDataRaw, ratesDataRaw] = await Promise.all([
          searchRooms(apiSearchData),
          getRoomRates()
        ]);

        const roomsData = Array.isArray(roomsDataRaw)
          ? roomsDataRaw
          : (roomsDataRaw?.data || []);

        const ratesData = Array.isArray(ratesDataRaw)
          ? ratesDataRaw
          : (ratesDataRaw?.data || []);

        const toDateOnly = (v) => {
          if (!v) return null;
          const d = new Date(v);
          return Number.isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };

        const nights = (() => {
          const inDate = toDateOnly(apiSearchData.checkInDate);
          const outDate = toDateOnly(apiSearchData.checkOutDate);
          if (!inDate || !outDate) return 1;
          const diff = Math.max(0, outDate - inDate);
          const computed = Math.round(diff / (1000 * 60 * 60 * 24));
          return computed > 0 ? computed : 1;
        })();

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

        const checkInKey = apiSearchData.checkInDate;
        const checkInDate = toDateOnly(checkInKey);

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

        const resolveHotelId = (r) => {
          const direct = r.hotelId ?? r.HotelId ?? r.hotel?.id ?? r.hotel?.Id ?? null;
          if (direct) return direct;

          const location = (r.hotelLocation || r.HotelLocation || r.location || r.Location || '').toString().toLowerCase();
          const city = (r.city || r.City || '').toString().toLowerCase();
          const matchKey = city || location;
          if (!matchKey) return null;

          const matched = (hotels || []).find((h) => (h.city || h.City || '').toString().toLowerCase() === matchKey);
          return matched?.id ?? matched?.Id ?? null;
        };

        // Merge room rates pricing with search results
        const roomsWithPricing = await Promise.all(roomsData.map(async (room) => {
          const roomName = (room.roomTypeName || room.name || room.roomName || '').toString();
          const roomNameKey = roomName.toLowerCase();
          const roomTypeId = room.roomTypeId ?? room.RoomTypeId ?? room.roomType?.id ?? room.roomType?.Id ?? null;
          const hotelId = resolveHotelId(room);

          const matchingRates = ratesData
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
          
          const basePriceNightly = rateInfo?.baseRate ?? rateInfo?.BaseRate ?? room.price ?? room.basePrice ?? 0;

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
          const taxFromRoomTax = computeRoomTax(basePriceNightly, includesTax, roomTaxRows);

          const computedTaxRate = taxFromRoomTax.percentSum > 0
            ? (taxFromRoomTax.percentSum / 100)
            : (taxRate > 0 ? taxRate : 0);

          const fallbackTaxAmountNightly = includesTax ? 0 : (basePriceNightly * computedTaxRate);
          const fallbackTotalWithTaxNightly = includesTax ? basePriceNightly : (basePriceNightly + fallbackTaxAmountNightly);

          const taxAmountNightly = taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.taxTotal : fallbackTaxAmountNightly;
          const totalWithTaxNightly = taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.totalWithTax : fallbackTotalWithTaxNightly;

          const taxAmountTotal = taxAmountNightly * nights;
          const totalWithTax = totalWithTaxNightly * nights;
          const basePriceTotal = basePriceNightly * nights;

          let applicablePlans = [];
          try {
            if (hotelId && roomTypeId) {
              const plansPayload = await getApplicablePlans({
                hotelId,
                roomTypeId,
                checkInDate: apiSearchData.checkInDate,
                checkOutDate: apiSearchData.checkOutDate,
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
            taxAmount: taxAmountTotal,
            taxAmountNightly,
            totalWithTax: totalWithTax,
            totalWithTaxNightly,
            nights,
            hotelId,
            applicablePlans,
            selectedPlan: null,
            taxBreakdown: (taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.taxBreakdown : []),
            validFrom: rateInfo?.effectiveFrom ?? rateInfo?.EffectiveFrom ?? null,
            validTo: rateInfo?.effectiveTo ?? rateInfo?.EffectiveTo ?? null,
            minStay: room.minStay ?? room.MinStay ?? rateInfo?.minStay ?? rateInfo?.MinStay ?? null,
            maxStay: room.maxStay ?? room.MaxStay ?? rateInfo?.maxStay ?? rateInfo?.MaxStay ?? null,
            closedToArrival: room.closedToArrival ?? room.ClosedToArrival ?? rateInfo?.closedToArrival ?? rateInfo?.ClosedToArrival ?? false,
            closedToDeparture: room.closedToDeparture ?? room.ClosedToDeparture ?? rateInfo?.closedToDeparture ?? rateInfo?.ClosedToDeparture ?? false,
            restrictionMessage: room.restrictionMessage ?? room.RestrictionMessage ?? '',
            rateName: rateInfo?.rateName ?? rateInfo?.RateName ?? room.roomTypeName ?? room.name,
            rateCode: rateInfo?.rateCode ?? rateInfo?.RateCode ?? null,
            price: basePriceNightly // Keep for backward compatibility
          };
        }));

        const roomsWithActiveRate = roomsWithPricing.filter((r) => {
          if ((r.availableRooms ?? r.AvailableRooms ?? 0) <= 0) return false;
          const roomTypeId = r.roomTypeId ?? r.RoomTypeId ?? r.roomType?.id ?? r.roomType?.Id ?? null;
          if (!roomTypeId) return false;

          const hasActiveRoomRate = ratesData.some((rate) => {
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
        setFilteredRooms(roomsWithActiveRate);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError('Failed to load rooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams]);
  

  // Get search parameters
  const fallbackCheckIn = toLocalYmd(new Date());
  const fallbackCheckOutDate = new Date();
  fallbackCheckOutDate.setDate(fallbackCheckOutDate.getDate() + 1);
  const fallbackCheckOut = toLocalYmd(fallbackCheckOutDate);

  const searchData = {
    location: searchParams.get('location') || 'all',
    checkIn: normalizeYmd(searchParams.get('checkIn')) || fallbackCheckIn,
    checkOut: normalizeYmd(searchParams.get('checkOut')) || fallbackCheckOut,
    adults: parseInt(searchParams.get('adults')) || 1,
    children: parseInt(searchParams.get('children')) || 0,
    rooms: parseInt(searchParams.get('rooms')) || 1
  };

  // Filter and sort rooms
  useEffect(() => {
    let filtered = allRooms;

    // Filter by location from filters dropdown
    if (filters.location !== 'all') {
      filtered = filtered.filter(room => 
        room.hotelLocation && room.hotelLocation.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(room => 
        (room.category === filters.category) || 
        (room.roomTypeCode && room.roomTypeCode.toLowerCase() === filters.category.toLowerCase())
      );
    }

    // Filter by price range - handle both price and basePrice
    filtered = filtered.filter(room => {
      const roomPrice = room.price || room.basePrice || 0;
      return roomPrice >= filters.priceRange[0] && roomPrice <= filters.priceRange[1];
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
        filtered.sort((a, b) => (a.price || a.basePrice || 0) - (b.price || b.basePrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || b.basePrice || 0) - (a.price || a.basePrice || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => (a.name || a.roomTypeName || '').localeCompare(b.name || b.roomTypeName || ''));
        break;
      default:
        break;
    }

    setFilteredRooms(filtered);
  }, [filters, allRooms]);

  const resolveRoomTypeId = (room) => {
    return room.roomTypeId ?? room.RoomTypeId ?? room.roomType?.id ?? room.roomType?.Id ?? null;
  };

  // Load amenities list dynamically based on selected location and room type
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const activeRooms = filteredRooms.length > 0 ? filteredRooms : allRooms;

        // Determine hotelId if location filter is applied
        let hotelIds = [];
        if (filters.location && filters.location !== 'all') {
          hotelIds = hotels
            .filter((h) => (h.city || '').toLowerCase() === filters.location.toLowerCase())
            .map((h) => (h.id ?? h.Id))
            .filter(Boolean);
        }

        // Determine roomTypeId if category filter is applied
        let roomTypeId = null;
        if (filters.category && filters.category !== 'all') {
          const match = activeRooms.find((r) => {
            const code = (r.roomTypeCode || r.category || '').toString().toLowerCase();
            return code === filters.category.toLowerCase();
          });
          roomTypeId = match ? resolveRoomTypeId(match) : null;
        }

        // If no location/category selected, show amenities found in current results (fallback)
        if (hotelIds.length === 0 && !roomTypeId) {
          const raw = activeRooms.flatMap((r) => Array.isArray(r.amenities) ? r.amenities : []);
          const unique = Array.from(new Set(raw.map((x) => (x || '').toString()).filter(Boolean)));
          setAvailableAmenities(unique);
          return;
        }

        const responses = hotelIds.length > 0
          ? await Promise.all(
              hotelIds.map((hid) =>
                api.get('/RoomsManagement/room-amenities', {
                  params: {
                    page: 1,
                    pageSize: 500,
                    hotelId: hid,
                    ...(roomTypeId ? { roomTypeId } : {})
                  }
                })
              )
            )
          : [
              await api.get('/RoomsManagement/room-amenities', {
                params: {
                  page: 1,
                  pageSize: 500,
                  ...(roomTypeId ? { roomTypeId } : {})
                }
              })
            ];

        const allRows = responses.flatMap((r) => (r?.data?.data || []));
        const names = Array.from(new Set(allRows
          .map((a) => (a.AmenityName ?? a.amenityName ?? '').toString())
          .filter(Boolean)));

        setAvailableAmenities(names);

        // Remove selected amenities that are no longer available under the current filters
        setFilters((prev) => {
          const nextSelected = (prev.amenities || []).filter((a) => names.includes(a));
          if (nextSelected.length === (prev.amenities || []).length) return prev;
          return { ...prev, amenities: nextSelected };
        });
      } catch (e) {
        console.error('Failed to load amenities list:', e);
        setAvailableAmenities([]);
      }
    };

    fetchAmenities();
  }, [filters.location, filters.category, hotels, allRooms, filteredRooms]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const allAmenities = availableAmenities;
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'STD', label: 'Standard Room' },
    { value: 'DLX', label: 'Deluxe Room' },
    { value: 'EXE', label: 'Executive Suite' },
    { value: 'PRE', label: 'Presidential Suite' },
    { value: 'FAM', label: 'Family Room' },
    { value: 'VIP4', label: 'VVIP Room' },
    { value: 'PM', label: 'PM Room' }
  ];


  return (
    <Box sx={{ py: { xs: 2.5, md: 4 }, pb: { xs: 12, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Seo
        title="Search Rooms"
        description="Search Luxury Hotel room availability by dates and guests. Compare rates and amenities, then book instantly online."
        keywords="Luxury Hotel search rooms, availability, hotel booking Pakistan, check-in, check-out, guests"
        author="Luxury Hotel"
      />
      {/* Search Results Header with Background Image */}
      <Box sx={{ 
        position: 'relative',
        pt: { xs: 3, md: 12 },
        pb: { xs: 2.5, md: 4 },
        background: 'linear-gradient(135deg, rgba(44, 90, 160, 0.95) 0%, rgba(102, 126, 234, 0.9) 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 3, lg: 4 } }}>
          {/* Search Summary */}
          <Paper sx={{ p: { xs: 2.25, md: 4 }, borderRadius: { xs: 5, md: 3 }, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' } }}>
            <Box>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 2, color: '#111827', fontSize: { xs: '1.9rem', md: '2.125rem' } }}>
                Search Results
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.3, sm: 3 }} sx={{ color: '#6b7280' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {searchData.location === 'all' ? 'All Locations' : searchData.location.charAt(0).toUpperCase() + searchData.location.slice(1)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {searchData.checkIn} to {searchData.checkOut}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {searchData.adults} Adults, {searchData.children} Children, {searchData.rooms} Room{searchData.rooms > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ mt: { xs: 2, md: 0 } }}>
              <Typography variant="h6" fontWeight="700" color="primary.main" sx={{ fontSize: { xs: '1.15rem', md: '1.25rem' } }}>
                {filteredRooms.length} rooms found
              </Typography>
            </Box>
          </Box>
        </Paper>

          {/* Browse by Category Section */}
          <Paper sx={{ p: { xs: 2.25, md: 3 }, mt: 3, mb: 4, borderRadius: { xs: 5, md: 3 }, backgroundColor: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#111827', textAlign: 'center', fontSize: { xs: '1.6rem', md: '1.5rem' } }}>
            Browse by Category
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gap: { xs: 1.4, md: 2 }, 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            justifyContent: 'center',
            alignItems: 'stretch',
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%'
          }}>
            {categories.map((category) => {
              const isActive = filters.category === category.value;
              const count = category.value === 'all' 
                ? allRooms.length 
                : allRooms.filter(room => 
                    (room.category === category.value) || 
                    (room.roomTypeCode && room.roomTypeCode.toLowerCase() === category.value.toLowerCase())
                  ).length;
              
              return (
                <Button
                  key={category.value}
                  variant={isActive ? 'contained' : 'outlined'}
                  onClick={() => handleFilterChange('category', category.value)}
                  sx={{
                    borderRadius: 8,
                    px: { xs: 2.25, md: 3 },
                    py: { xs: 1.2, md: 1.5 },
                    minWidth: 0,
                    width: '100%',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.92rem', md: '0.95rem' },
                    border: isActive ? 'none' : '2px solid #e5e7eb',
                    backgroundColor: isActive ? '#2563eb' : 'white',
                    color: isActive ? 'white' : '#6b7280',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: isActive ? '#1d4ed8' : '#f3f4f6',
                      borderColor: isActive ? 'transparent' : '#2563eb',
                      color: isActive ? 'white' : '#2563eb',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    }
                  }}
                >
                  {category.label} ({count})
                </Button>
              );
            })}
          </Box>
          </Paper>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth={false} sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, sm: 3, md: 3, lg: 4 }, maxWidth: '1440px', mx: 'auto', overflowX: 'hidden' }}>
        {/* Modern Filters Section */}
        <Paper 
          sx={{ 
            p: 0,
            mb: 4, 
            borderRadius: 4, 
            backgroundColor: 'white', 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Purple Gradient Bar - Full Width */}
          <Box sx={{
            height: '4px',
            background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #a855f7 100%)',
            width: '100%',
          }} />
          
          {/* Content with padding */}
          <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 3, gap: { xs: 2, md: 0 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterIcon sx={{ color: '#2563eb', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="700" sx={{ color: '#111827', fontSize: { xs: '1.6rem', md: '1.5rem' } }}>
                Filters & Search
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 1.5 }}>
              {/* View Toggle Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 600, mr: 1 }}>
                  ● View
                </Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  size="small"
                  sx={{
                    '& .MuiToggleButton-root': {
                      px: 2,
                      py: 0.5,
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '8px !important',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      '&.Mui-selected': {
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: '1.5px solid #2563eb',
                        '&:hover': {
                          backgroundColor: '#1d4ed8',
                        }
                      },
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                      }
                    }
                  }}
                >
                  <ToggleButton value="grid">
                    <GridIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    Grid
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ListIcon sx={{ fontSize: 18, mr: 0.5 }} />
                    List
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Button 
                variant="outlined" 
                onClick={() => {
                  setFilters({
                    priceRange: [0, 100000],
                    category: 'all',
                    location: 'all',
                    amenities: [],
                    sortBy: 'price-low'
                  });
                }}
                size="medium"
                sx={{ 
                  borderRadius: 3,
                  borderColor: '#e5e7eb',
                  color: '#6b7280',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  width: { xs: '100%', sm: 'auto' },
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
          </Box>

          {/* All Filters in One Row with Fixed Widths */}
          <Box sx={{ display: 'flex', gap: { xs: 1.5, md: 2 }, flexWrap: 'wrap', mb: 3 }}>
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
                  height: { xs: '54px', md: '52px' },
                  fontSize: '0.95rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1.5px',
                  },
                }}
              >
                <MenuItem value="all">All Locations</MenuItem>
                {hotels.map((hotel) => (
                  <MenuItem key={hotel.id} value={hotel.city}>
                    {hotel.city}, {hotel.country}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Room Category Filter */}
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
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Price Range */}
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)', md: '250px' } }}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
                💰 Price: PKR {filters.priceRange[1].toLocaleString()}
              </Typography>
              <Slider
                value={filters.priceRange}
                onChange={(e, value) => handleFilterChange('priceRange', value)}
                min={0}
                max={100000}
                step={1000}
                sx={{
                  color: '#2563eb',
                  height: 8,
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20,
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.3,
                  },
                }}
              />
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
                <MenuItem value="price-low" sx={{ fontSize: '0.95rem' }}>💸 Price: Low to High</MenuItem>
                <MenuItem value="price-high" sx={{ fontSize: '0.95rem' }}>💰 Price: High to Low</MenuItem>
                <MenuItem value="rating" sx={{ fontSize: '0.95rem' }}>⭐ Rating</MenuItem>
                <MenuItem value="name" sx={{ fontSize: '0.95rem' }}>🔤 Name</MenuItem>
              </Select>
            </Box>
          </Box>

          {/* Amenities Section */}
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #e5e7eb' }}>
            <Typography variant="h6" fontWeight="600" sx={{ color: '#374151', mb: 3 }}>
              🏷️ Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.2, md: 2 } }}>
              {allAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  clickable
                  onClick={() => handleAmenityToggle(amenity)}
                  sx={{
                    backgroundColor: filters.amenities.includes(amenity) ? '#2563eb' : '#f8fafc',
                    color: filters.amenities.includes(amenity) ? 'white' : '#6b7280',
                    border: `1px solid ${filters.amenities.includes(amenity) ? '#2563eb' : '#e5e7eb'}`,
                    fontWeight: 600,
                    fontSize: { xs: '0.82rem', md: '0.9rem' },
                    height: { xs: '34px', md: '36px' },
                    borderRadius: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: filters.amenities.includes(amenity) ? '#1d4ed8' : '#eff6ff',
                      borderColor: '#2563eb',
                      color: filters.amenities.includes(amenity) ? 'white' : '#2563eb',
                      transform: 'translateY(-1px)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          </Box>
        </Paper>

        {/* Results - Full Width */}
        {filteredRooms.length === 0 ? (
          <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
            <FilterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" fontWeight="700" gutterBottom>
              No rooms found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Try adjusting your filters or search criteria to find more options.
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Back to Search
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
                  position: 'relative',
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <RoomCard room={room} searchData={searchData} viewMode={viewMode} onPlanChange={handlePlanChange} />
                {room.available <= 2 && (
                  <Chip
                    label={`Only ${room.available} left!`}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      fontWeight: 600,
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchResults;
