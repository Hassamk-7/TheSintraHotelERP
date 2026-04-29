import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  Popover,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import DateRangePicker from './DateRangePicker';
import { getHotels } from '../services/api';

const SearchForm = () => {
  const navigate = useNavigate();
  
  // Get today and tomorrow dates
  const today = dayjs();
  const tomorrow = dayjs().add(1, 'day');
  
  const todayString = today.format('YYYY-MM-DD');
  const tomorrowString = tomorrow.format('YYYY-MM-DD');
  
  const [searchData, setSearchData] = useState({
    location: 'all',
    checkIn: todayString,
    checkOut: tomorrowString,
    adults: 1,
    children: 0,
    rooms: 1
  });
  
  const [dateRange, setDateRange] = useState([today, tomorrow]);
  const [dateError, setDateError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [locations, setLocations] = useState([{ value: 'all', label: 'All Locations' }]);

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const hotels = await getHotels();
        const hotelLocations = [
          { value: 'all', label: 'All Locations' },
          ...hotels.map(hotel => ({
            value: hotel.city.toLowerCase(),
            label: hotel.city
          }))
        ];
        setLocations(hotelLocations);
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        // Keep default locations if API fails
      }
    };
    fetchHotels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDateError('');
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
    if (newValue[0] && newValue[1]) {
      setSearchData({
        ...searchData,
        checkIn: newValue[0].format('YYYY-MM-DD'),
        checkOut: newValue[1].format('YYYY-MM-DD')
      });
      setDateError('');
    }
  };

  const handleDateFieldClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDatePopoverClose = () => {
    setAnchorEl(null);
  };

  const openDatePicker = Boolean(anchorEl);

  const formatDateRange = () => {
    if (dateRange[0] && dateRange[1]) {
      return `${dateRange[0].format('DD/MM/YYYY')} — ${dateRange[1].format('DD/MM/YYYY')}`;
    }
    return 'Select dates';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!searchData.checkIn || !searchData.checkOut) {
      setDateError('Please select check-in and check-out dates');
      return;
    }

    const checkInDate = new Date(searchData.checkIn);
    const checkOutDate = new Date(searchData.checkOut);

    // Check if same date booking
    if (checkInDate.getTime() === checkOutDate.getTime()) {
      setDateError('Same day booking is not allowed. Check-out must be at least the next day.');
      return;
    }

    // Check if check-out is before check-in
    if (checkOutDate <= checkInDate) {
      setDateError('Check-out date must be after check-in date');
      return;
    }

    // Navigate to search results with query parameters
    const queryParams = new URLSearchParams(searchData).toString();
    navigate(`/search?${queryParams}`);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2.25, md: 4 }, 
        borderRadius: { xs: 5, md: 4 },
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '1200px',
        mx: 'auto',
        width: { xs: 'calc(100vw - 24px)', sm: 'auto' },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #2c5aa0 0%, #d4af37 50%, #2c5aa0 100%)',
        }
      }}
    >
      <Typography
        variant="h4"
        component="h3"
        sx={{
          fontFamily: 'Playfair Display',
          fontWeight: 700,
          textAlign: 'center',
          mb: { xs: 2.5, md: 4 },
          color: 'text.primary',
          background: 'linear-gradient(45deg, #2c5aa0 30%, #d4af37 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '1.15rem', sm: '1.8rem', md: '2.2rem' },
          lineHeight: { xs: 1.3, md: 1.2 },
          px: { xs: 2, md: 0 },
        }}
      >
        Find Your Perfect Stay
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        {/* Responsive fields - one per row on mobile */}
        <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="flex-end" sx={{ mb: { xs: 2, md: 3 } }}>
          {/* Location */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              label="Location"
              name="location"
              value={searchData.location}
              onChange={handleInputChange}
              size="small"
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 6, md: 2 },
                  height: { xs: '52px', md: '48px' },
                }
              }}
            >
              {locations.map((location) => (
                <MenuItem key={location.value} value={location.value}>
                  {location.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Date Range Picker */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Check-In — Check-Out"
              value={formatDateRange()}
              onClick={handleDateFieldClick}
              size="small"
              InputProps={{
                readOnly: true,
                startAdornment: <CalendarIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 6, md: 2 },
                  height: { xs: '52px', md: '48px' },
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(44, 90, 160, 0.04)',
                  }
                }
              }}
              required
            />
            <Popover
              open={openDatePicker}
              anchorEl={anchorEl}
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
                }
              }}
            >
              <DateRangePicker
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(start, end) => {
                  setDateRange([start, end]);
                  setSearchData({
                    ...searchData,
                    checkIn: start.format('YYYY-MM-DD'),
                    checkOut: end.format('YYYY-MM-DD')
                  });
                }}
                onClose={handleDatePopoverClose}
              />
            </Popover>
          </Grid>

          {/* Adults */}
          <Grid item xs={6} sm={4} md={1.5}>
            <TextField
              select
              fullWidth
              label="Adults"
              name="adults"
              value={searchData.adults}
              onChange={handleInputChange}
              size="small"
              InputProps={{
                startAdornment: <PeopleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 6, md: 2 },
                  height: { xs: '52px', md: '48px' },
                }
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} Adult{num > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Children */}
          <Grid item xs={6} sm={4} md={1.5}>
            <TextField
              select
              fullWidth
              label="Children"
              name="children"
              value={searchData.children}
              onChange={handleInputChange}
              size="small"
              InputProps={{
                startAdornment: <PeopleIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 6, md: 2 },
                  height: { xs: '52px', md: '48px' },
                }
              }}
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} {num === 1 ? 'Child' : 'Children'}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Rooms */}
          <Grid item xs={5} sm={4} md={1.5}>
            <TextField
              select
              fullWidth
              label="Rooms"
              name="rooms"
              value={searchData.rooms}
              onChange={handleInputChange}
              size="small"
              InputProps={{
                startAdornment: <LocationIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />,
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: { xs: 6, md: 2 },
                  height: { xs: '52px', md: '48px' },
                }
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} Room{num > 1 ? 's' : ''}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Search Button */}
          <Grid item xs={7} sm={12} md={1.5}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={<SearchIcon />}
              sx={{
                height: { xs: '54px', md: '48px' },
                fontSize: { xs: '0.92rem', md: '1rem' },
                fontWeight: 700,
                borderRadius: { xs: 6, md: 2 },
                background: 'linear-gradient(45deg, #2c5aa0 30%, #5a7bc8 90%)',
                boxShadow: '0 4px 15px rgba(44, 90, 160, 0.4)',
                textTransform: 'none',
                minWidth: 0,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e3a6f 30%, #2c5aa0 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(44, 90, 160, 0.6)',
                },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>

        {/* Date Error Display */}
        {dateError && (
          <Alert 
            severity="error" 
            sx={{ 
              mt: 2, 
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '0.95rem',
                fontWeight: 500,
              }
            }}
          >
            {dateError}
          </Alert>
        )}
      </Box>

      {/* Quick Search Tips - Compact Version */}
      <Box 
        sx={{ 
          mt: { xs: 2, md: 3 },
          p: { xs: 1.5, md: 2 },
          borderRadius: { xs: 4, md: 2 },
          backgroundColor: 'rgba(44, 90, 160, 0.05)',
          border: '1px solid rgba(44, 90, 160, 0.1)',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.78rem', md: '0.85rem' }, lineHeight: 1.6 }}>
          💡 <strong>Quick Tips:</strong> Book in advance for better rates • Select "All Locations" to see all cities • Children under 12 stay free
        </Typography>
      </Box>
    </Paper>
  );
};

export default SearchForm;
