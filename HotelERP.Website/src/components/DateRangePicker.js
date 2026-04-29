import React, { useState } from 'react';
import { Box, Paper, IconButton, Typography, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth < 600;

const normalizeDateValue = (value, fallback = null) => {
  if (!value) return fallback;
  if (dayjs.isDayjs(value)) return value;
  const normalized = dayjs(value);
  return normalized.isValid() ? normalized : fallback;
};

const DateRangePicker = ({ startDate, endDate, onChange, onClose }) => {
  const normalizedStartDate = normalizeDateValue(startDate, dayjs());
  const normalizedEndDate = normalizeDateValue(endDate);
  const [currentMonth, setCurrentMonth] = useState(normalizedStartDate);
  const [selecting, setSelecting] = useState(null);
  const [tempStart, setTempStart] = useState(normalizedStartDate);
  const [tempEnd, setTempEnd] = useState(normalizedEndDate);
  const mobile = isMobileViewport();

  const getDaysInMonth = (date) => {
    const start = date.startOf('month');
    const end = date.endOf('month');
    const days = [];
    
    // Add empty cells for days before month starts
    const startDay = start.day();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= end.date(); i++) {
      days.push(date.date(i));
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    if (!date || date.isBefore(dayjs(), 'day')) return;

    if (!tempStart || (tempStart && tempEnd)) {
      // Start new selection
      setTempStart(date);
      setTempEnd(null);
      setSelecting('end');
    } else if (tempStart && !tempEnd) {
      // Complete selection
      if (date.isBefore(tempStart)) {
        setTempStart(date);
        setTempEnd(tempStart);
      } else {
        setTempEnd(date);
      }
      setSelecting(null);
    }
  };

  const isInRange = (date) => {
    if (!date || !tempStart) return false;
    if (!tempEnd) return date.isSame(tempStart, 'day');
    return date.isSameOrAfter(tempStart, 'day') && date.isSameOrBefore(tempEnd, 'day');
  };

  const isStartDate = (date) => {
    return date && tempStart && date.isSame(tempStart, 'day');
  };

  const isEndDate = (date) => {
    return date && tempEnd && date.isSame(tempEnd, 'day');
  };

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange(tempStart, tempEnd);
      onClose();
    }
  };

  const renderMonth = (monthOffset = 0) => {
    const month = currentMonth.add(monthOffset, 'month');
    const days = getDaysInMonth(month);
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
      <Box sx={{ minWidth: mobile ? 250 : 280, p: mobile ? 1.5 : 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
          {month.format('MMMM YYYY')}
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
          {weekDays.map(day => (
            <Box key={day} sx={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', py: 1 }}>
              {day}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {days.map((date, index) => {
            const isDisabled = !date || date.isBefore(dayjs(), 'day');
            const inRange = isInRange(date);
            const isStart = isStartDate(date);
            const isEnd = isEndDate(date);

            return (
              <Box
                key={index}
                onClick={() => !isDisabled && handleDateClick(date)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  borderRadius: isStart || isEnd ? '50%' : inRange ? 0 : '4px',
                  backgroundColor: isStart || isEnd ? '#2c5aa0' : inRange ? 'rgba(44, 90, 160, 0.1)' : 'transparent',
                  color: isStart || isEnd ? 'white' : isDisabled ? '#ccc' : inRange ? '#2c5aa0' : 'text.primary',
                  fontWeight: isStart || isEnd ? 700 : inRange ? 600 : 400,
                  fontSize: '0.875rem',
                  '&:hover': !isDisabled && {
                    backgroundColor: isStart || isEnd ? '#2c5aa0' : 'rgba(44, 90, 160, 0.15)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                {date ? date.date() : ''}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Paper 
      elevation={8} 
      sx={{ 
        borderRadius: 3,
        overflow: 'hidden',
        maxWidth: mobile ? 320 : 620,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: mobile ? 1.5 : 2, backgroundColor: '#f5f5f5' }}>
        <IconButton onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} size="small">
          <ChevronLeft />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: mobile ? '0.8rem' : '0.875rem', textAlign: 'center', px: 1 }}>
          {tempStart && tempEnd 
            ? `${tempStart.format('DD/MM/YYYY')} — ${tempEnd.format('DD/MM/YYYY')}`
            : 'Select check-in and check-out dates'}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', borderTop: '1px solid #e0e0e0' }}>
        {renderMonth(0)}
        {!mobile && <Box sx={{ width: 1, backgroundColor: '#e0e0e0' }} />}
        {!mobile && renderMonth(1)}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, p: mobile ? 1.5 : 2, borderTop: '1px solid #e0e0e0', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="outlined" size="small">
          Cancel
        </Button>
        <Button 
          onClick={handleApply} 
          variant="contained" 
          size="small"
          disabled={!tempStart || !tempEnd}
          sx={{
            background: 'linear-gradient(45deg, #2c5aa0 30%, #5a7bc8 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1e3a6f 30%, #2c5aa0 90%)',
            }
          }}
        >
          Apply
        </Button>
      </Box>
    </Paper>
  );
};

export default DateRangePicker;
