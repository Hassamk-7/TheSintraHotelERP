import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  SmartToy as SmartToyIcon,
  Close as CloseIcon,
  Send as SendIcon,
  CalendarMonth as CalendarMonthIcon,
  LocationOn as LocationOnIcon,
  Bed as BedIcon,
  SupportAgent as SupportAgentIcon,
  AutoAwesome as AutoAwesomeIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { checkAvailability, getHotels, getRoomTypes, searchRooms } from '../services/api';
import DateRangePicker from './DateRangePicker';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const formatDate = (date) => date.toISOString().split('T')[0];

const createMessage = (id, title, content, variant = 'default') => ({
  id,
  title,
  content,
  variant,
});

const BookingAssistant = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [messages, setMessages] = useState([
    createMessage(
      'welcome',
      'Luxury Hotel Assistant',
      'I can help your guests find rooms, check availability by date, explain hotel locations, show pricing guidance, and guide them to booking in a few quick steps.',
      'primary'
    ),
  ]);
  const [formData, setFormData] = useState({
    hotelId: 'all',
    roomTypeId: 'all',
    checkIn: formatDate(today),
    checkOut: formatDate(tomorrow),
    adults: '2',
    children: '0',
    rooms: '1',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [hotelData, roomTypeData] = await Promise.all([getHotels(), getRoomTypes()]);
        setHotels(Array.isArray(hotelData) ? hotelData : []);
        setRoomTypes(Array.isArray(roomTypeData) ? roomTypeData : []);
      } catch (error) {
        console.error('Failed to load booking assistant data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedHotel = useMemo(
    () => (formData.hotelId === 'all'
      ? null
      : hotels.find((hotel) => String(hotel.id ?? hotel.Id) === String(formData.hotelId))),
    [hotels, formData.hotelId]
  );

  const selectedRoomType = useMemo(
    () => (formData.roomTypeId === 'all'
      ? null
      : roomTypes.find((room) => String(room.roomTypeId ?? room.id ?? room.Id) === String(formData.roomTypeId))),
    [roomTypes, formData.roomTypeId]
  );

  const locationOptions = useMemo(() => {
    const seen = new Set();
    return hotels.filter((hotel) => {
      const city = (hotel.city ?? hotel.City ?? '').trim().toLowerCase();
      if (!city || seen.has(city)) return false;
      seen.add(city);
      return true;
    });
  }, [hotels]);

  const appendMessage = (title, content, variant = 'default') => {
    setMessages((prev) => [...prev, createMessage(`${Date.now()}-${prev.length}`, title, content, variant)]);
  };

  const openDatePicker = Boolean(dateAnchorEl);

  const removeMessagesByTitle = (titles) => {
    setMessages((prev) => prev.filter((message) => !titles.includes(message.title)));
  };

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateFieldClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDatePopoverClose = () => {
    setDateAnchorEl(null);
  };

  const formatDateRange = () => {
    const [checkInYear, checkInMonth, checkInDay] = formData.checkIn.split('-');
    const [checkOutYear, checkOutMonth, checkOutDay] = formData.checkOut.split('-');
    if (!checkInYear || !checkOutYear) return 'Select dates';
    return `${checkInDay}/${checkInMonth}/${checkInYear} — ${checkOutDay}/${checkOutMonth}/${checkOutYear}`;
  };

  const handleQuickAction = async (action) => {
    if (action === 'guide') {
      appendMessage(
        'Quick Booking Guide',
        '1. Select your stay dates. 2. Choose a room type. 3. Check real availability. 4. Review suggested options. 5. Continue to booking or search results.',
        'info'
      );
      return;
    }

    if (action === 'hotel-info') {
      if (!hotels.length) {
        appendMessage('Hotel Information', 'Hotel information is loading. Please try again in a moment.', 'warning');
        return;
      }

      const summary = hotels
        .slice(0, 3)
        .map((hotel) => {
          const hotelName = hotel.hotelName ?? hotel.HotelName ?? 'Hotel';
          const city = hotel.city ?? hotel.City ?? 'Pakistan';
          const address = hotel.address ?? hotel.Address ?? 'Address not available';
          const phone = hotel.phoneNumber ?? hotel.PhoneNumber ?? 'Phone not available';
          return `${hotelName} - ${city}. Address: ${address}. Contact: ${phone}`;
        })
        .join(' | ');

      appendMessage('Hotel Information', summary, 'success');
      return;
    }

    if (action === 'locations') {
      const text = locationOptions.length
        ? locationOptions.map((hotel) => hotel.city ?? hotel.City).join(', ')
        : 'Location information is not available right now.';
      appendMessage('Available Locations', text, 'info');
      return;
    }

    if (action === 'plans') {
      appendMessage(
        'Recommended Stay Plan',
        'For a smooth booking experience, choose your location first, then dates, then compare room types by occupancy, amenities, and nightly price. For families, select a room type with enough max occupancy before booking.',
        'success'
      );
      return;
    }

    if (action === 'suggest') {
      try {
        setAssistantLoading(true);
        const response = await searchRooms({
          location: formData.hotelId === 'all' ? 'all' : selectedHotel?.city ?? selectedHotel?.City ?? 'all',
          roomTypeId: formData.roomTypeId === 'all' ? undefined : Number(formData.roomTypeId),
          checkInDate: formData.checkIn,
          checkOutDate: formData.checkOut,
          adults: Number(formData.adults || 1),
          children: Number(formData.children || 0),
          rooms: Number(formData.rooms || 1),
        });

        const rooms = Array.isArray(response) ? response : [];
        const available = rooms
          .filter((room) => Number(room.availableRooms ?? room.AvailableRooms ?? 0) > 0)
          .slice(0, 3);

        if (!available.length) {
          appendMessage(
            'Availability Suggestion',
            'No room suggestions are available for the selected dates right now. You can still open the search page to review all options or adjust the dates.',
            'warning'
          );
          return;
        }

        const suggestionText = available
          .map((room) => {
            const name = room.roomTypeName ?? room.RoomTypeName ?? 'Room';
            const availableRooms = room.availableRooms ?? room.AvailableRooms ?? 0;
            const price = Number(room.basePrice ?? room.BasePrice ?? 0).toLocaleString();
            const occupancy = room.maxOccupancy ?? room.MaxOccupancy ?? 0;
            return `${name}: ${availableRooms} room(s) available, PKR ${price}/night, max occupancy ${occupancy}`;
          })
          .join(' | ');

        appendMessage('Best Available Options', suggestionText, 'success');
      } catch (error) {
        console.error('Failed to suggest rooms:', error);
        appendMessage('Availability Suggestion', 'I could not fetch room suggestions right now. Please try again shortly.', 'warning');
      } finally {
        setAssistantLoading(false);
      }
    }
  };

  const handleCheckAvailability = async () => {
    const currentRoomType = roomTypes.find(
      (room) => String(room.roomTypeId ?? room.id ?? room.Id) === String(formData.roomTypeId)
    );

    removeMessagesByTitle(['Room Type Required', 'Room Category Guide']);

    if (!formData.roomTypeId || formData.roomTypeId === 'all' || !currentRoomType) {
      const categoryGuide = roomTypes.length
        ? roomTypes
            .slice(0, 4)
            .map((room) => {
              const name = room.roomTypeName ?? room.name ?? room.Name ?? 'Room';
              const occupancy = room.maxOccupancy ?? room.MaxOccupancy ?? 'N/A';
              const price = Number(room.basePrice ?? room.BasePrice ?? 0).toLocaleString();
              return `${name}: max ${occupancy} guest(s), from PKR ${price}/night`;
            })
            .join(' | ')
        : 'Room categories are loading right now. Please try again in a moment.';

      appendMessage(
        'Room Category Guide',
        `You have selected All Room Types. Choose a specific room type for exact availability, or use Open Search to view all available room categories. ${categoryGuide}`,
        'info'
      );
      return;
    }

    if (!formData.checkIn || !formData.checkOut || formData.checkIn >= formData.checkOut) {
      appendMessage('Invalid Dates', 'Please select a valid check-in and check-out date range.', 'warning');
      return;
    }

    try {
      setAssistantLoading(true);
      const response = await checkAvailability({
        roomTypeId: Number(formData.roomTypeId),
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        numberOfRooms: Number(formData.rooms || 1),
      });

      const roomName = currentRoomType?.roomTypeName ?? currentRoomType?.name ?? currentRoomType?.RoomTypeName ?? 'Selected room';
      const isAvailable = response?.isAvailable ?? response?.IsAvailable;
      const availableRooms = response?.availableRooms ?? response?.AvailableRooms ?? 0;
      const nights = response?.numberOfNights ?? response?.NumberOfNights ?? 0;
      const totalPrice = Number(response?.totalPrice ?? response?.TotalPrice ?? 0).toLocaleString();
      const perNight = Number(response?.pricePerNight ?? response?.PricePerNight ?? 0).toLocaleString();
      const message = response?.message ?? response?.Message ?? '';

      appendMessage(
        isAvailable ? 'Booking Available' : 'Limited Availability',
        isAvailable
          ? `${roomName} for ${nights} night(s): ${availableRooms} room(s) available. Estimated price is PKR ${perNight}/night and PKR ${totalPrice} total for ${formData.rooms} room(s).`
          : `${roomName}: ${message || `${availableRooms} room(s) available for the selected dates.`}`,
        isAvailable ? 'success' : 'warning'
      );
    } catch (error) {
      console.error('Availability check failed:', error);
      appendMessage('Availability Error', 'I could not verify availability right now. Please try again or use the search page.', 'warning');
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleOpenSearch = () => {
    const queryParams = new URLSearchParams({
      location: (formData.hotelId === 'all' ? 'all' : selectedHotel?.city ?? selectedHotel?.City ?? 'all').toLowerCase(),
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      adults: formData.adults,
      children: formData.children,
      rooms: formData.rooms,
    });

    navigate(`/search?${queryParams.toString()}`);
  };

  const messageStyles = {
    primary: {
      border: '1px solid rgba(37, 99, 235, 0.18)',
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(147, 197, 253, 0.10) 100%)',
    },
    success: {
      border: '1px solid rgba(16, 185, 129, 0.18)',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, rgba(209, 250, 229, 0.14) 100%)',
    },
    warning: {
      border: '1px solid rgba(245, 158, 11, 0.18)',
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(254, 243, 199, 0.18) 100%)',
    },
    info: {
      border: '1px solid rgba(124, 58, 237, 0.18)',
      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.10) 0%, rgba(233, 213, 255, 0.14) 100%)',
    },
    default: {
      border: '1px solid rgba(148, 163, 184, 0.18)',
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 1) 100%)',
    },
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      backgroundColor: 'white',
      minHeight: { xs: 42, md: 40 },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '0.76rem', md: '0.82rem' },
      fontWeight: 600,
      color: '#475569',
      backgroundColor: '#f8fafc',
      px: 0.5,
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.86)',
    },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      fontSize: { xs: '0.84rem', md: '0.92rem' },
    },
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        left: { xs: 8, md: 24 },
        bottom: { xs: 88, md: 24 },
        zIndex: 1200,
        width: { xs: 'min(320px, calc(100vw - 76px))', sm: 390 },
        maxWidth: { xs: 'calc(100vw - 76px)', sm: 'calc(100vw - 28px)' },
      }}
    >
      {open ? (
        <Card
          sx={{
            borderRadius: { xs: 5, md: 4 },
            overflow: 'hidden',
            boxShadow: '0 24px 70px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(16px)',
            background: 'rgba(248, 250, 252, 0.96)',
            maxHeight: { xs: '72vh', md: 'unset' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              px: { xs: 1.5, md: 2 },
              py: { xs: 1.2, md: 1.75 },
              color: 'white',
              background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #7c3aed 100%)',
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.16)', width: { xs: 34, md: 42 }, height: { xs: 34, md: 42 } }}>
                  <SmartToyIcon />
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>Booking Concierge</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: { xs: '0.63rem', md: '0.75rem' }, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Instant help for rooms, dates, hotel info, and booking
                  </Typography>
                </Box>
              </Stack>
              <IconButton onClick={() => setOpen(false)} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.14)', width: 30, height: 30, flexShrink: 0, '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' } }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <CardContent sx={{ p: 0, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
            <Box sx={{ p: { xs: 1.1, md: 2 }, maxHeight: { xs: 100, md: 270 }, overflowY: 'auto' }}>
              <Stack spacing={1.5}>
                {messages.map((message) => (
                  <Box
                    key={message.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      ...messageStyles[message.variant || 'default'],
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5, color: '#0f172a' }}>
                      {message.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                      {message.content}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Divider />

            <Box sx={{ p: { xs: 1.1, md: 2 }, overflowY: 'auto' }}>
              <Box
                sx={{
                  mb: 1,
                  px: 1.25,
                  py: 0.85,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
                  border: '1px solid rgba(37, 99, 235, 0.10)',
                }}
              >
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#0f172a', mb: 0.25 }}>
                  Booking details
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: { xs: 'none', md: 'block' }, lineHeight: 1.5 }}>
                  Select hotel, room type, and stay dates to get instant availability and booking guidance.
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mb: 1.2 }}>
                <Chip icon={<SupportAgentIcon />} label="Booking guide" onClick={() => handleQuickAction('guide')} sx={{ height: { xs: 28, md: 32 }, '& .MuiChip-label': { px: 1, fontSize: { xs: '0.68rem', md: '0.75rem' } } }} />
                <Chip icon={<LocationOnIcon />} label="Locations" onClick={() => handleQuickAction('locations')} sx={{ height: { xs: 28, md: 32 }, '& .MuiChip-label': { px: 1, fontSize: { xs: '0.68rem', md: '0.75rem' } } }} />
                <Chip icon={<BedIcon />} label="Best rooms" onClick={() => handleQuickAction('suggest')} sx={{ height: { xs: 28, md: 32 }, '& .MuiChip-label': { px: 1, fontSize: { xs: '0.68rem', md: '0.75rem' } } }} />
                <Chip icon={<AutoAwesomeIcon />} label="Hotel info" onClick={() => handleQuickAction('hotel-info')} sx={{ height: { xs: 28, md: 32 }, '& .MuiChip-label': { px: 1, fontSize: { xs: '0.68rem', md: '0.75rem' } } }} />
                <Chip icon={<ChatIcon />} label="Stay plan" onClick={() => handleQuickAction('plans')} sx={{ height: { xs: 28, md: 32 }, '& .MuiChip-label': { px: 1, fontSize: { xs: '0.68rem', md: '0.75rem' } } }} />
              </Stack>

              {loading ? (
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <Stack spacing={{ xs: 0.95, md: 1.5 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Hotel / Location"
                    value={formData.hotelId}
                    onChange={handleChange('hotelId')}
                    SelectProps={{ native: true }}
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  >
                    <option value="all">All Hotels / Locations</option>
                    {hotels.map((hotel) => {
                      const id = hotel.id ?? hotel.Id;
                      const hotelName = hotel.hotelName ?? hotel.HotelName;
                      const city = hotel.city ?? hotel.City;
                      return (
                        <option key={id} value={id}>
                          {hotelName} - {city}
                        </option>
                      );
                    })}
                  </TextField>

                  <TextField
                    fullWidth
                    size="small"
                    label="Check-In — Check-Out"
                    value={formatDateRange()}
                    onClick={handleDateFieldClick}
                    InputProps={{
                      readOnly: true,
                      startAdornment: <CalendarMonthIcon sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />,
                    }}
                    sx={{
                      ...fieldSx,
                      '& .MuiOutlinedInput-root': {
                        ...fieldSx['& .MuiOutlinedInput-root'],
                        cursor: 'pointer',
                      },
                    }}
                  />
                  <Popover
                    open={openDatePicker}
                    anchorEl={dateAnchorEl}
                    onClose={handleDatePopoverClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        boxShadow: 'none',
                        maxWidth: 'calc(100vw - 24px)',
                      },
                    }}
                  >
                    <DateRangePicker
                      startDate={new Date(formData.checkIn)}
                      endDate={new Date(formData.checkOut)}
                      onChange={(start, end) => {
                        setFormData((prev) => ({
                          ...prev,
                          checkIn: start.format('YYYY-MM-DD'),
                          checkOut: end.format('YYYY-MM-DD'),
                        }));
                      }}
                      onClose={handleDatePopoverClose}
                    />
                  </Popover>

                  <Stack direction="row" spacing={1}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Room Type"
                      value={formData.roomTypeId}
                      onChange={handleChange('roomTypeId')}
                      SelectProps={{ native: true }}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                    >
                      <option value="all">All Room Types</option>
                      {roomTypes.map((room) => {
                        const id = room.roomTypeId ?? room.id ?? room.Id;
                        const name = room.roomTypeName ?? room.name ?? room.Name;
                        const price = Number(room.basePrice ?? room.BasePrice ?? 0).toLocaleString();
                        return (
                          <option key={id} value={id}>
                            {name} - PKR {price}
                          </option>
                        );
                      })}
                    </TextField>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Rooms"
                      value={formData.rooms}
                      onChange={handleChange('rooms')}
                      inputProps={{ min: 1, max: 5 }}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Adults"
                      value={formData.adults}
                      onChange={handleChange('adults')}
                      inputProps={{ min: 1, max: 10 }}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Children"
                      value={formData.children}
                      onChange={handleChange('children')}
                      inputProps={{ min: 0, max: 10 }}
                      InputLabelProps={{ shrink: true }}
                      sx={fieldSx}
                    />
                  </Stack>

                  {selectedHotel && (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      {(selectedHotel.hotelName ?? selectedHotel.HotelName) || 'Hotel'} in {(selectedHotel.city ?? selectedHotel.City) || 'Pakistan'} | {(selectedHotel.address ?? selectedHotel.Address) || 'Address not available'} | {(selectedHotel.phoneNumber ?? selectedHotel.PhoneNumber) || 'Phone not available'}
                    </Alert>
                  )}

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                      variant="contained"
                      startIcon={assistantLoading ? <CircularProgress size={16} color="inherit" /> : <CalendarMonthIcon />}
                      onClick={handleCheckAvailability}
                      disabled={assistantLoading}
                      sx={{
                        flex: 1,
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        minHeight: { xs: 44, md: 'auto' },
                        fontSize: { xs: '0.82rem', md: '0.875rem' },
                      }}
                    >
                      Check Availability
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleOpenSearch}
                      startIcon={<SendIcon />}
                      sx={{
                        flex: 1,
                        borderRadius: 2.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        minHeight: { xs: 44, md: 'auto' },
                        fontSize: { xs: '0.82rem', md: '0.875rem' },
                      }}
                    >
                      Open Search
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Tooltip title="Booking Assistant" placement="right" arrow>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            startIcon={<SmartToyIcon />}
            sx={{
              minWidth: 'auto',
              px: { xs: 1.15, md: 2.25 },
              py: { xs: 0.75, md: 1.4 },
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 800,
              fontSize: { xs: '0.72rem', md: '0.95rem' },
              minHeight: { xs: 34, md: 'auto' },
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              boxShadow: '0 14px 40px rgba(37, 99, 235, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Ask for booking help
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default BookingAssistant;
