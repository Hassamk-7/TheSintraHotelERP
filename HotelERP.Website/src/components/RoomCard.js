import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton as MuiIconButton,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Star as StarIcon,
  People as PeopleIcon,
  Wifi as WifiIcon,
  DirectionsCar as CarIcon,
  RoomService as ServiceIcon,
  Tv as TvIcon,
  AcUnit as AcIcon,
  Balcony as BalconyIcon,
  LocationCity as CityIcon,
  Water as OceanIcon,
  SupportAgent as ButlerIcon,
  FavoriteBorder as FavoriteIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { getImageUrl, getRoomAmenitiesByRoomTypeId } from '../services/api';

const normalizeYmd = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const split = value.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(split)) return split;
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const RoomCard = ({ room, searchData, viewMode = 'grid', onPlanChange }) => {
  const navigate = useNavigate();
  const [openGallery, setOpenGallery] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openAmenities, setOpenAmenities] = useState(false);
  const [openRates, setOpenRates] = useState(false);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
  const [amenitiesError, setAmenitiesError] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState([]);

  const buildReservationQuery = () => {
    const s = searchData || {};
    const checkIn = normalizeYmd(s.checkIn || s.checkInDate);
    const checkOut = normalizeYmd(s.checkOut || s.checkOutDate);
    const adults = s.adults != null ? String(s.adults) : '';
    const children = s.children != null ? String(s.children) : '';
    const rooms = s.rooms != null ? String(s.rooms) : '';

    const q = new URLSearchParams();
    if (checkIn) q.set('checkIn', checkIn);
    if (checkOut) q.set('checkOut', checkOut);
    if (adults) q.set('adults', adults);
    if (children !== '') q.set('children', children);
    if (rooms) q.set('rooms', rooms);
    return q.toString();
  };
  
  const handleBookNow = () => {
    const selectedPlan = room?.selectedPlan
      ? {
          id: room.selectedPlan.id ?? room.selectedPlan.Id,
          name: room.selectedPlan.name ?? room.selectedPlan.Name,
          basePrice: Number(room.selectedPlan.basePrice ?? room.selectedPlan.BasePrice ?? 0) || 0,
          adjustedPrice: Number(room.selectedPlan.adjustedPrice ?? room.selectedPlan.AdjustedPrice ?? 0) || 0,
          priceDelta: Number(room.selectedPlan.priceDelta ?? room.selectedPlan.PriceDelta ?? 0) || 0,
          priceAdjustmentType: room.selectedPlan.priceAdjustmentType ?? room.selectedPlan.PriceAdjustmentType ?? 'more_expensive',
          priceDifferenceType: room.selectedPlan.priceDifferenceType ?? room.selectedPlan.PriceDifferenceType ?? 'amount',
          priceDifferenceValue: Number(room.selectedPlan.priceDifferenceValue ?? room.selectedPlan.PriceDifferenceValue ?? 0) || 0,
          termsAndConditions: room.selectedPlan.termsAndConditions ?? room.selectedPlan.TermsAndConditions ?? '',
        }
      : null;

    const query = buildReservationQuery();
    const url = query ? `/reservation?${query}` : '/reservation';

    navigate(url, {
      state: {
        room: {
          ...room,
          selectedPlan,
        },
        searchData: searchData
      }
    });
  };

  // Get primary image or first image - NO MOCK DATA
  const getPrimaryImage = () => {
    if (!room.images || room.images.length === 0) {
      return null; // Return null if no images
    }
    
    return getImageUrl(room.images[0], 'roomtypes');
  };

  // Get all images with full URLs - NO MOCK DATA
  const getAllImages = () => {
    if (!room.images || room.images.length === 0) {
      return [];
    }
    
    return room.images.map(img => getImageUrl(img, 'roomtypes'));
  };

  const handleOpenGallery = () => {
    setOpenGallery(true);
    setCurrentImageIndex(0);
  };

  const handleCloseGallery = () => {
    setOpenGallery(false);
  };

  const handleNextImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    const images = getAllImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const getRoomTypeId = () => {
    return room.roomTypeId ?? room.RoomTypeId ?? room.id ?? room.Id ?? null;
  };

  const handleOpenAmenities = async () => {
    setOpenAmenities(true);
    setAmenitiesError(null);
    const roomTypeId = getRoomTypeId();
    if (!roomTypeId) {
      setAmenitiesData([]);
      setAmenitiesError('Room type id not found for this room.');
      return;
    }

    try {
      setAmenitiesLoading(true);
      const response = await getRoomAmenitiesByRoomTypeId(roomTypeId);
      const payload = response?.data ?? response;
      const rows = Array.isArray(payload) ? payload : (payload?.data || []);
      setAmenitiesData(rows);
    } catch (e) {
      console.error('Failed to load amenities:', e);
      setAmenitiesError('Failed to load amenities.');
      setAmenitiesData([]);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const handleCloseAmenities = () => {
    setOpenAmenities(false);
  };

  const handleOpenRates = () => setOpenRates(true);
  const handleCloseRates = () => setOpenRates(false);

  const nights = Number(room.nights ?? searchData?.nights ?? 1) || 1;
  const roomRateNightly = Number(room.basePriceNightly ?? room.basePrice ?? room.price ?? 0) || 0;

  const normalizePlan = (p) => {
    if (!p) return null;
    const adjustmentType = (p.priceAdjustmentType ?? p.PriceAdjustmentType ?? 'more_expensive').toString().toLowerCase();
    const differenceType = (p.priceDifferenceType ?? p.PriceDifferenceType ?? 'amount').toString().toLowerCase();
    const differenceValue = Number(p.priceDifferenceValue ?? p.PriceDifferenceValue ?? p.basePrice ?? p.BasePrice ?? 0) || 0;

    return {
      id: p.id ?? p.Id,
      name: p.name ?? p.Name,
      code: p.code ?? p.Code,
      cancellationPolicyCode: p.cancellationPolicyCode ?? p.CancellationPolicyCode ?? p.termsAndConditions ?? p.TermsAndConditions ?? '',
      cancellationPolicyDescription: p.cancellationPolicyDescription ?? p.CancellationPolicyDescription ?? '',
      basePrice: Number(p.basePrice ?? p.BasePrice ?? 0) || 0,
      priceAdjustmentType: adjustmentType,
      priceDifferenceType: differenceType,
      priceDifferenceValue: differenceValue,
      stopSell: (p.stopSell ?? p.StopSell) === true,
      validFrom: p.validFrom ?? p.ValidFrom ?? null,
      validTo: p.validTo ?? p.ValidTo ?? null,
      termsAndConditions: p.termsAndConditions ?? p.TermsAndConditions ?? '',
    };
  };

  const computePlanDelta = (plan, nightlyBaseRate = 0) => {
    if (!plan) return 0;

    const differenceValue = Number(plan.priceDifferenceValue ?? plan.basePrice ?? 0) || 0;
    const differenceType = String(plan.priceDifferenceType ?? 'amount').toLowerCase();
    const adjustmentType = String(plan.priceAdjustmentType ?? 'more_expensive').toLowerCase();

    const rawDelta = differenceType === 'percentage'
      ? (nightlyBaseRate * differenceValue) / 100
      : differenceValue;

    return adjustmentType === 'cheaper' ? -rawDelta : rawDelta;
  };

  const isSelectedPlan = (p) => {
    const selectedId = room?.selectedPlan?.id ?? room?.selectedPlan?.Id ?? null;
    const pid = p?.id ?? p?.Id ?? null;
    if (selectedId == null || pid == null) return false;
    return String(selectedId) === String(pid);
  };

  const handlePlanPick = (plan) => {
    if (typeof onPlanChange === 'function') {
      onPlanChange(room, plan || null);
    }
    setOpenRates(false);
  };

  const planSurcharge = room?.selectedPlan
    ? computePlanDelta(room.selectedPlan, roomRateNightly)
    : (Number(room?.selectedPlanPrice ?? 0) || 0);

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Free WiFi': <WifiIcon fontSize="small" />,
      'Parking': <CarIcon fontSize="small" />,
      'Room Service': <ServiceIcon fontSize="small" />,
      'TV': <TvIcon fontSize="small" />,
      'AC': <AcIcon fontSize="small" />,
      'Balcony': <BalconyIcon fontSize="small" />,
      'City View': <CityIcon fontSize="small" />,
      'Ocean View': <OceanIcon fontSize="small" />,
      'Butler Service': <ButlerIcon fontSize="small" />
    };
    return icons[amenity] || <StarIcon fontSize="small" />;
  };

  const formatDate = (value) => {
    const v = normalizeYmd(value);
    return v || null;
  };

  const basePriceNightly = roomRateNightly + planSurcharge;
  const basePriceTotal = basePriceNightly * nights;
  const includesTax = (room?.includesTax ?? room?.IncludesTax) === true;
  const taxRate = Number(room?.taxRate ?? room?.TaxRate ?? 0) || 0;
  const taxAmountNightly = includesTax ? 0 : (basePriceNightly * taxRate);
  const totalWithTaxNightly = includesTax ? basePriceNightly : (basePriceNightly + taxAmountNightly);
  const totalWithTax = totalWithTaxNightly * nights;

  return (
    <>
    <Card 
      sx={{ 
        height: viewMode === 'list' ? 'auto' : '100%',
        minHeight: viewMode === 'list' ? 'auto' : { xs: '400px', sm: '450px', md: '480px' },
        display: 'flex', 
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderColor: '#d1d5db',
        }
      }}
    >
      <Box sx={{ 
        position: 'relative',
        width: viewMode === 'list' ? { xs: '100%', sm: '300px', md: '350px' } : '100%',
        minWidth: viewMode === 'list' ? { xs: '100%', sm: '300px', md: '350px' } : 'auto',
        flexShrink: 0,
      }}>
        {getPrimaryImage() && (
          <CardMedia
            component="img"
            height={viewMode === 'list' ? '100%' : '240'}
            image={getPrimaryImage()}
            alt={room.name || room.roomTypeName}
            onClick={handleOpenGallery}
            sx={{
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'transform 0.3s',
              minHeight: viewMode === 'list' ? '250px' : 'auto',
              maxHeight: viewMode === 'list' ? '300px' : 'auto',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          />
        )}
        
        {!getPrimaryImage() && (
          <Box
            sx={{
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              color: '#9ca3af',
            }}
          >
            <Typography variant="body2">No Image Available</Typography>
          </Box>
        )}

        {/* Image count badge */}
        {room.images && room.images.length > 1 && (
          <Chip
            label={`${room.images.length} photos`}
            size="small"
            onClick={handleOpenGallery}
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
              }
            }}
          />
        )}
        
        {/* Favorite Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            width: 40,
            height: 40,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <FavoriteIcon sx={{ fontSize: 20, color: '#6b7280' }} />
        </IconButton>
        
        {/* Rating Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
          <Typography variant="caption" fontWeight="600" color="white">
            {room.rating}
          </Typography>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 2.5, md: 3 } }}>
        {/* Category */}
        {(room.category || room.roomTypeCode) && (
          <Chip
            label={(room.category || room.roomTypeCode || 'Room').toUpperCase()}
            size="small"
            sx={{
              alignSelf: 'flex-start',
              mb: 2,
              backgroundColor: '#f3f4f6',
              color: '#374151',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        )}
        
        {/* Room Name */}
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.25rem' },
            color: '#111827',
            mb: 1,
            lineHeight: 1.3,
          }}
        >
          {room.name || room.roomTypeName}
        </Typography>

        {/* Selected Plan (compact) */}
        {(room?.selectedPlan?.name || room?.selectedPlan?.Name) && (
          <Typography
            variant="caption"
            sx={{
              color: '#374151',
              fontWeight: 700,
              mb: 1,
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {room?.selectedPlan?.name || room?.selectedPlan?.Name}
            {planSurcharge !== 0 ? ` (${planSurcharge > 0 ? '+' : '-'}${(room.currency || 'PKR')} ${Math.abs(planSurcharge).toLocaleString()}/night)` : ''}
          </Typography>
        )}
        
        {/* Location */}
        {room.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationIcon sx={{ fontSize: 16, color: '#6b7280', mr: 0.5 }} />
            <Typography variant="body2" color="#6b7280" sx={{ textTransform: 'capitalize' }}>
              {room.location}
            </Typography>
          </Box>
        )}
        
        {/* Key Amenities - Show only first 3 */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {room.amenities && room.amenities.slice(0, 3).map((amenity, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                backgroundColor: '#f9fafb',
                borderRadius: 1.5,
                border: '1px solid #e5e7eb',
              }}
            >
              {getAmenityIcon(amenity)}
              <Typography variant="caption" sx={{ fontSize: '0.75rem', color: '#374151' }}>
                {amenity}
              </Typography>
            </Box>
          ))}
          {room.amenities && room.amenities.length > 3 && (
            <Typography variant="caption" sx={{ color: '#6b7280', alignSelf: 'center' }}>
              +{room.amenities.length - 3} more
            </Typography>
          )}
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Button
            onClick={handleOpenAmenities}
            variant="text"
            sx={{
              p: 0,
              minWidth: 'auto',
              textTransform: 'none',
              fontWeight: 700,
              color: '#2563eb',
              '&:hover': { backgroundColor: 'transparent', color: '#1d4ed8' }
            }}
          >
            Amenities
          </Button>
        </Box>

        {/* Rate meta */}
        {(room.rateName || room.rateCode || room.validFrom || room.validTo) && (
          <Box sx={{ mb: 2 }}>
            {(room.rateName || room.rateCode) && (
              <Typography variant="body2" color="#374151" sx={{ fontWeight: 600 }}>
                {room.rateName}{room.rateCode ? ` (${room.rateCode})` : ''}
              </Typography>
            )}

            {(searchData?.checkIn || searchData?.checkOut) && (
              <Typography
                variant="caption"
                color="#6b7280"
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                Stay: {formatDate(searchData?.checkIn) || '—'} to {formatDate(searchData?.checkOut) || '—'}
              </Typography>
            )}

            {(room.validFrom || room.validTo) && (
              <Typography
                variant="caption"
                color="#94a3b8"
                sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                Rate valid: {formatDate(room.validFrom) || '—'} to {formatDate(room.validTo) || '—'}
              </Typography>
            )}
          </Box>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Rate plans entry */}
        {Array.isArray(room?.applicablePlans) && room.applicablePlans.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="#6b7280" sx={{ display: 'block' }}>
                  Rate plan
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {room?.selectedPlan?.name || room?.selectedPlan?.Name || 'Select plan'}
                </Typography>
              </Box>
              <Button
                onClick={handleOpenRates}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: '#e5e7eb',
                  color: '#2563eb',
                  fontWeight: 700,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': { borderColor: '#2563eb', backgroundColor: '#eff6ff' }
                }}
              >
                More rates
              </Button>
            </Stack>
          </Box>
        )}

        {/* Price and Guest Info */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1, mb: 1 }}>
            <Box>
              <Typography variant="body2" color="#6b7280" sx={{ mb: 0.5 }}>
                Base Price
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, whiteSpace: 'nowrap' }}>
                <Typography 
                  variant="h5" 
                  component="span" 
                  sx={{ 
                    fontWeight: 800,
                    color: '#111827',
                    fontSize: { xs: '1.3rem', sm: '1.5rem' },
                  }}
                >
                  {(room.currency || 'PKR')} {basePriceNightly.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="#6b7280" component="span">
                  / night
                </Typography>
              </Box>
              {planSurcharge !== 0 && (
                <Typography variant="caption" color="#6b7280">
                  Room rate: {(room.currency || 'PKR')} {roomRateNightly.toLocaleString()} {planSurcharge >= 0 ? '+' : '-'} Plan: {(room.currency || 'PKR')} {Math.abs(planSurcharge).toLocaleString()}
                </Typography>
              )}
              {nights > 1 && (
                <Typography variant="body2" color="#6b7280">
                  {(room.currency || 'PKR')} {basePriceTotal.toLocaleString()} for {nights} night{nights > 1 ? 's' : ''}
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: '#6b7280',
              whiteSpace: 'nowrap'
            }}>
              <PeopleIcon sx={{ fontSize: 18, mr: 0.5 }} />
              <Typography variant="body2" fontWeight="500">
                {room.maxGuests || room.maxOccupancy || '2-4'} guests
              </Typography>
            </Box>
          </Box>

          {/* Tax Information from Room Rates */}
          {(room.taxAmount || room.totalWithTax || taxRate > 0) && (
            <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="#6b7280">
                  {(room.includesTax ? 'Tax Included' : `Tax (${((room.taxRate || 0) * 100).toFixed(0)}%)`)}
                </Typography>
                <Typography variant="caption" fontWeight="600" color="#374151">
                  {(room.currency || 'PKR')} {taxAmountNightly.toLocaleString()}
                </Typography>
              </Box>
              {nights > 1 && (
                <Typography variant="caption" color="#6b7280">
                  ({taxAmountNightly.toLocaleString()} per night × {nights} night{nights > 1 ? 's' : ''})
                </Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #e5e7eb' }}>
                <Typography variant="body2" fontWeight="700" color="#111827">
                  Total with Tax
                </Typography>
                <Typography variant="body2" fontWeight="700" color="#2563eb">
                  {(room.currency || 'PKR')} {totalWithTax.toLocaleString()}
                </Typography>
              </Box>
              {nights > 1 && (
                <Typography variant="caption" color="#6b7280">
                  ({totalWithTaxNightly.toLocaleString()} per night × {nights} night{nights > 1 ? 's' : ''})
                </Typography>
              )}
            </Box>
          )}

          {/* Legacy Tax Information */}
          {room.taxes && room.taxes.length > 0 && !room.totalWithTax && !room.taxAmount && (
            <Box sx={{ mt: 1, p: 1.5, backgroundColor: '#f9fafb', borderRadius: 2, border: '1px solid #e5e7eb' }}>
              {room.taxes.map((tax, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="#6b7280">
                    {tax.taxName} ({tax.taxType === 'Percentage' ? `${tax.taxValue}%` : 'Fixed'})
                  </Typography>
                  <Typography variant="caption" fontWeight="600" color="#374151">
                    PKR {tax.taxAmount.toLocaleString()}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px solid #e5e7eb' }}>
                <Typography variant="body2" fontWeight="700" color="#111827">
                  Total with Tax
                </Typography>
                <Typography variant="body2" fontWeight="700" color="#2563eb">
                  PKR {(room.priceWithTax || room.basePrice || 0).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}

          
        </Box>
        
        {/* Actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            onClick={handleOpenDetails}
            variant="outlined"
            fullWidth
            sx={{
              flex: { sm: 1 },
              borderColor: '#2563eb',
              color: '#2563eb',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontSize: '1rem',
              height: '48px',
              border: '2px solid',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#1d4ed8',
                backgroundColor: '#eff6ff',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
              },
            }}
          >
            View
          </Button>
          <Button
            variant="contained"
            onClick={handleBookNow}
            fullWidth
            sx={{
              flex: { sm: 1 },
              backgroundColor: '#2563eb',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2.5,
              textTransform: 'none',
              fontSize: '1rem',
              height: '48px',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#1d4ed8',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(37, 99, 235, 0.4)',
              },
            }}
          >
            Reserve
          </Button>
        </Stack>
      </CardContent>
    </Card>

    {/* Rate Plans Dialog */}
    <Dialog
      open={openRates}
      onClose={handleCloseRates}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 800 }}>
        Select a rate
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="#6b7280" sx={{ mb: 2 }}>
          {room.name || room.roomTypeName}
        </Typography>

        <List disablePadding sx={{ border: '1px solid #e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
          {room.applicablePlans
            .map(normalizePlan)
            .filter((p) => p && p.id != null)
            .map((p) => {
              const selected = isSelectedPlan(p);
              const surcharge = computePlanDelta(p, roomRateNightly);
              const totalNightly = Math.max(0, roomRateNightly + surcharge);
              const totalNightlyWithTax = includesTax ? totalNightly : (totalNightly * (1 + taxRate));
              const normalizedPlan = {
                ...p,
                adjustedPrice: totalNightly,
                priceDelta: surcharge,
              };

              return (
                <React.Fragment key={p.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handlePlanPick(normalizedPlan)}
                      sx={{
                        alignItems: 'flex-start',
                        backgroundColor: selected ? '#eff6ff' : 'white',
                        '&:hover': { backgroundColor: selected ? '#dbeafe' : '#f9fafb' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 800, color: '#111827' }}>
                                {p.name}
                              </Typography>
                              {p.cancellationPolicyCode ? (
                                <Typography variant="caption" color="#6b7280" sx={{ display: 'block' }}>
                                  {p.cancellationPolicyCode}
                                </Typography>
                              ) : null}
                              {p.cancellationPolicyDescription ? (
                                <Typography variant="caption" color="#6b7280" sx={{ display: 'block' }}>
                                  {p.cancellationPolicyDescription}
                                </Typography>
                              ) : null}
                            </Box>
                            <Box sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <Typography sx={{ fontWeight: 900, color: '#111827' }}>
                                {(room.currency || 'PKR')} {Math.round(totalNightlyWithTax).toLocaleString()}
                              </Typography>
                              <Typography variant="caption" color="#6b7280">
                                / night
                              </Typography>
                              {surcharge !== 0 && (
                                <Typography variant="caption" color="#2563eb" sx={{ display: 'block', fontWeight: 700 }}>
                                  {surcharge > 0 ? '+' : '-'}{(room.currency || 'PKR')} {Math.abs(surcharge).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })}
        </List>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Button
            onClick={() => handlePlanPick(null)}
            variant="text"
            sx={{ textTransform: 'none', fontWeight: 700, color: '#6b7280' }}
          >
            Clear selection
          </Button>
          <Button
            onClick={handleCloseRates}
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 800, backgroundColor: '#2563eb' }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>

    {/* Image Gallery Dialog */}
    <Dialog
      open={openGallery}
      onClose={handleCloseGallery}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          boxShadow: 'none',
        }
      }}
    >
      <DialogContent sx={{ position: 'relative', p: 0, overflow: 'hidden' }}>
        {/* Close Button */}
        <IconButton
          onClick={handleCloseGallery}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Image Counter */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            px: 2,
            py: 1,
            borderRadius: 2,
            zIndex: 2,
            fontWeight: 600,
          }}
        >
          {currentImageIndex + 1} / {getAllImages().length}
        </Box>

        {/* Main Image */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '70vh',
            position: 'relative',
          }}
        >
          <img
            src={getAllImages()[currentImageIndex]}
            alt={`${room.name || room.roomTypeName} - Image ${currentImageIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Navigation Buttons */}
        {getAllImages().length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 40 }} />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </>
        )}

        {/* Thumbnail Strip */}
        {getAllImages().length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 2,
              overflowX: 'auto',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          >
            {getAllImages().map((img, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: 80,
                  height: 60,
                  flexShrink: 0,
                  cursor: 'pointer',
                  border: currentImageIndex === index ? '3px solid #2563eb' : '3px solid transparent',
                  borderRadius: 1,
                  overflow: 'hidden',
                  opacity: currentImageIndex === index ? 1 : 0.6,
                  transition: 'all 0.3s',
                  '&:hover': {
                    opacity: 1,
                  }
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>

    <Dialog open={openAmenities} onClose={handleCloseAmenities} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Amenities - {room.name || room.roomTypeName}
      </DialogTitle>
      <MuiIconButton
        onClick={handleCloseAmenities}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
      >
        <CloseIcon />
      </MuiIconButton>
      <DialogContent>
        {amenitiesLoading && (
          <Typography variant="body2" color="#6b7280">Loading amenities...</Typography>
        )}

        {!amenitiesLoading && amenitiesError && (
          <Typography variant="body2" color="#dc2626">{amenitiesError}</Typography>
        )}

        {!amenitiesLoading && !amenitiesError && amenitiesData.length === 0 && (
          <Typography variant="body2" color="#6b7280">No amenities found for this room type.</Typography>
        )}

        {!amenitiesLoading && !amenitiesError && amenitiesData.length > 0 && (
          <Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {amenitiesData.map((a) => (
                <Chip
                  key={a.id ?? a.Id ?? `${a.amenityCode}-${a.amenityName}`}
                  label={a.amenityName ?? a.AmenityName}
                  sx={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb' }}
                />
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 1 }}>
              {amenitiesData.map((a) => {
                const name = a.amenityName ?? a.AmenityName;
                const isChargeable = a.isChargeable ?? a.IsChargeable;
                const chargeAmount = a.chargeAmount ?? a.ChargeAmount ?? 0;
                return (
                  <React.Fragment key={`row-${a.id ?? a.Id ?? name}`}>
                    <Typography variant="body2" sx={{ color: '#111827', fontWeight: 600 }}>
                      {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isChargeable ? '#b45309' : '#059669', fontWeight: 700 }}>
                      {isChargeable ? `PKR ${Number(chargeAmount || 0).toLocaleString()}` : 'Free'}
                    </Typography>
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>

    {/* Room Details Dialog */}
    <Dialog
      open={openDetails}
      onClose={handleCloseDetails}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Close Button */}
        <IconButton
          onClick={handleCloseDetails}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: '#f3f4f6',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Header Image */}
        {getPrimaryImage() && (
          <Box sx={{ position: 'relative', height: 300 }}>
            <img
              src={getPrimaryImage()}
              alt={room.name || room.roomTypeName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Content */}
        <Box sx={{ p: 4 }}>
          {/* Room Name and Code */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
            <Box>
              <Typography variant="h4" fontWeight="700" color="#111827" gutterBottom>
                {room.name || room.roomTypeName}
              </Typography>
              {room.hotelLocation && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationIcon sx={{ fontSize: 18, color: '#6b7280', mr: 0.5 }} />
                  <Typography variant="body2" color="#6b7280">
                    {room.hotelLocation}
                  </Typography>
                </Box>
              )}
            </Box>
            <Chip
              label={room.roomTypeCode || 'Room'}
              sx={{
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            />
          </Box>

          {/* Description */}
          {room.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="#374151" sx={{ lineHeight: 1.7 }}>
                {room.description}
              </Typography>
            </Box>
          )}

          {/* Room Details Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
                <PeopleIcon sx={{ fontSize: 32, color: '#2563eb', mb: 1 }} />
                <Typography variant="body2" color="#6b7280">Max Guests</Typography>
                <Typography variant="h6" fontWeight="600">{room.maxOccupancy || 2}</Typography>
              </Box>
            </Grid>
            {room.bedType && (
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
                  <Typography variant="body2" color="#6b7280">Bed Type</Typography>
                  <Typography variant="h6" fontWeight="600">{room.bedType}</Typography>
                </Box>
              </Grid>
            )}
            {room.roomSize && (
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
                  <Typography variant="body2" color="#6b7280">Room Size</Typography>
                  <Typography variant="h6" fontWeight="600">{room.roomSize}</Typography>
                </Box>
              </Grid>
            )}
            {room.viewType && (
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f9fafb', borderRadius: 2 }}>
                  <Typography variant="body2" color="#6b7280">View</Typography>
                  <Typography variant="h6" fontWeight="600">{room.viewType}</Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="600" color="#111827" gutterBottom>
                Amenities
              </Typography>
              <Grid container spacing={1}>
                {room.amenities.map((amenity, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                      {getAmenityIcon(amenity)}
                      <Typography variant="body2" color="#374151">
                        {amenity}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Pricing */}
          <Box sx={{ p: 3, backgroundColor: '#f9fafb', borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" color="#6b7280">Base Price (per night)</Typography>
              <Typography variant="h6" fontWeight="600">PKR {(room.basePrice || 0).toLocaleString()}</Typography>
            </Box>
            
            {room.taxes && room.taxes.length > 0 && (
              <>
                {room.taxes.map((tax, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="#6b7280">
                      {tax.taxName} ({tax.taxType === 'Percentage' ? `${tax.taxValue}%` : 'Fixed'})
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      PKR {tax.taxAmount.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ borderTop: '2px solid #e5e7eb', pt: 2, mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="700" color="#111827">Total Price</Typography>
                    <Typography variant="h6" fontWeight="700" color="#2563eb">
                      PKR {(room.priceWithTax || room.basePrice || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>

          {/* Availability */}
          {(room.availableRooms !== undefined || room.totalRooms !== undefined) && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: room.availableRooms > 0 ? '#ecfdf5' : '#fef2f2', borderRadius: 2 }}>
              <Typography variant="body1" fontWeight="600" color={room.availableRooms > 0 ? '#059669' : '#dc2626'}>
                {room.availableRooms > 0 ? '✓ Available' : '✗ Not Available'}
              </Typography>
              <Typography variant="body2" color="#6b7280" sx={{ mt: 0.5 }}>
                {room.availableRooms || 0} rooms available {room.totalRooms && `out of ${room.totalRooms} total`}
              </Typography>
            </Box>
          )}

          {/* Action Button */}
          <Button
            component={Link}
            to={`/reservation?${(() => {
              const query = buildReservationQuery();
              const roomTypeId = room.id || room.roomTypeId;
              const merged = new URLSearchParams(query);
              if (roomTypeId != null) merged.set('roomTypeId', String(roomTypeId));
              return merged.toString();
            })()}`}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              backgroundColor: '#2563eb',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            }}
          >
            Book This Room
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default RoomCard;
