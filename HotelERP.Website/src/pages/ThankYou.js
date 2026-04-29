import React, { useEffect, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  Chip,
  Divider,
  Alert,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Home as HomeIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import Seo from '../components/Seo';

const ThankYou = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { reservationData, paymentMethod, paymentData, bookingResponse } = location.state || {};
  const printRef = useRef();

  // Get payment status from URL parameters (PayFast return)
  const paymentStatus = searchParams.get('status');
  const basketId = searchParams.get('basket_id');

  // Use booking reference from API or generate one
  const bookingRef = bookingResponse?.reservationNumber || `LH${Date.now().toString().slice(-6)}`;

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`Booking-${bookingRef}.pdf`);
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!reservationData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pt: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h4" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
            Booking not found
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<HomeIcon />}
            sx={{ borderRadius: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  const calculateTotal = () => {
    const nights = bookingResponse?.numberOfNights
      ?? Math.ceil((new Date(reservationData.checkOut) - new Date(reservationData.checkIn)) / (1000 * 60 * 60 * 24))
      ?? 1;

    // Prefer API totals; then the totals we computed in Reservation; then derive from room pricing payload
    const apiSubtotal = bookingResponse?.subtotal ?? reservationData?.subtotal;
    const apiTax = bookingResponse?.taxAmount ?? reservationData?.taxAmount;
    const apiTotal = bookingResponse?.totalAmount ?? reservationData?.totalAmount;
    if (apiSubtotal != null && apiTax != null && apiTotal != null) {
      return { subtotal: apiSubtotal, tax: apiTax, total: apiTotal, nights };
    }

    if (reservationData?.totals?.subtotal != null && reservationData?.totals?.taxes != null && reservationData?.totals?.total != null) {
      return {
        subtotal: reservationData.totals.subtotal,
        tax: reservationData.totals.taxes,
        total: reservationData.totals.total,
        nights
      };
    }

    const roomAgg = reservationData.selectedRooms.reduce(
      (acc, room) => {
        const qty = room.quantity || 1;
        const base = room.basePriceNightly ?? room.basePrice ?? room.price ?? 0;
        const taxNight = room.taxAmountNightly ?? room.taxAmount ?? 0;
        const withTaxNight = room.totalWithTaxNightly ?? room.totalWithTax ?? base + taxNight;

        acc.subtotal += base * qty * nights;
        acc.tax += taxNight * qty * nights || Math.max(0, withTaxNight * qty * nights - base * qty * nights);
        acc.total += withTaxNight * qty * nights;
        return acc;
      },
      { subtotal: 0, tax: 0, total: 0 }
    );

    return { ...roomAgg, nights };
  };

  const totals = calculateTotal();


  const handleShareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Hotel Booking Confirmation',
        text: `Booking confirmed at LuxuryHotel! Reference: ${bookingRef}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Booking confirmed at LuxuryHotel! Reference: ${bookingRef}`);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pt: 12 }}>
      <Seo
        title="Booking Confirmation"
        description="Your Luxury Hotel booking is confirmed. View reservation details, download your confirmation, and contact support if you need assistance."
        keywords="Luxury Hotel booking confirmation, reservation confirmed, hotel booking receipt, booking details"
        author="Luxury Hotel"
        robots="noindex,nofollow"
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div ref={printRef}>
        {/* Success Header */}
        <Paper sx={{ p: 6, mb: 4, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            mx: 'auto', 
            mb: 3 
          }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#fff' }} />
          </Avatar>
          
          <Typography variant="h2" fontWeight="800" sx={{ mb: 2, color: '#fff' }}>
            Booking Confirmed!
          </Typography>
          
          <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Thank you for choosing {bookingResponse?.hotelName || 'LuxuryHotel'}. Your reservation has been successfully confirmed.
          </Typography>
          
          <Chip
            label={`Booking Reference: ${bookingRef}`}
            color="primary"
            size="large"
            sx={{ 
              fontSize: '1rem', 
              fontWeight: 700, 
              px: 2, 
              py: 1,
              height: 'auto',
              borderRadius: 2
            }}
          />
        </Paper>

        {/* Booking Details */}
        <Grid container spacing={4}>
          {/* Booking Details */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 4, color: '#111827' }}>
                Booking Details
              </Typography>
              
              {/* Guest Information */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <PeopleIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="700" sx={{ color: '#111827' }}>
                    Guest Information
                  </Typography>
                </Stack>
                <Paper sx={{ 
                  p: 4, 
                  backgroundColor: '#f9fafb', 
                  borderRadius: 3,
                  border: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Full Name
                          </Typography>
                          <Typography variant="body1" fontWeight="700" sx={{ color: '#111827' }}>
                            {reservationData.guestInfo.title} {reservationData.guestInfo.firstName} {reservationData.guestInfo.lastName}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Email Address
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                            {reservationData.guestInfo.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Phone Number
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                            {reservationData.guestInfo.phone}
                          </Typography>
                        </Box>
                        {reservationData.guestInfo.address && (
                          <Box>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                              Address
                            </Typography>
                            <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                              {reservationData.guestInfo.address}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                  
                  {reservationData.guestInfo.arrival && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                        Expected Arrival Time
                      </Typography>
                      <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                        {reservationData.guestInfo.arrival}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              {/* Stay Information */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <CalendarIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="700" sx={{ color: '#111827' }}>
                    Stay Information
                  </Typography>
                </Stack>
                <Paper sx={{ 
                  p: 4, 
                  backgroundColor: '#f9fafb', 
                  borderRadius: 3,
                  border: '1px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Check-in Date
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                            {new Date(reservationData.checkIn).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Duration
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                            {totals.nights} night{totals.nights > 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Check-out Date
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                            {new Date(reservationData.checkOut).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5, fontWeight: 500 }}>
                            Total Guests
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                            {reservationData.adults} Adults, {reservationData.children} Children
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Room Information */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <LocationIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="700" sx={{ color: '#111827' }}>
                    Booked Rooms ({reservationData.selectedRooms.length})
                  </Typography>
                </Stack>
                <Stack spacing={3}>
                  {reservationData.selectedRooms.map((room, index) => (
                    <Paper key={room.id || index} sx={{ 
                      p: 3, 
                      backgroundColor: '#f9fafb', 
                      borderRadius: 3,
                      border: '1px solid #e5e7eb',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                          <Box
                            component="img"
                            src={room.image || '/img/rooms/60.jpg'}
                            alt={room.roomTypeName || room.name}
                            sx={{
                              width: '100%',
                              height: 120,
                              objectFit: 'cover',
                              borderRadius: 2,
                              border: '1px solid #e5e7eb'
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="700" sx={{ color: '#111827', mb: 1 }}>
                                {room.roomTypeName || room.name}
                              </Typography>
                              <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                <Chip 
                                  label={`${room.quantity || 1} Room${(room.quantity || 1) > 1 ? 's' : ''}`}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: 'primary.main', 
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                />
                                <Chip 
                                  label={room.category || 'Standard'}
                                  size="small"
                                  variant="outlined"
                                  sx={{ 
                                    borderColor: '#d1d5db',
                                    color: '#6b7280',
                                    fontSize: '0.75rem'
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                {room.maxAdults || reservationData.adults} Adults, {room.maxChildren || reservationData.children} Children
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" fontWeight="700" sx={{ color: 'primary.main' }}>
                                PKR {((room.totalWithTaxNightly || room.totalWithTax || room.basePriceNightly || room.price || 0) * (room.quantity || 1)).toLocaleString()}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                per night
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            pt: 2,
                            borderTop: '1px solid #e5e7eb'
                          }}>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              {totals.nights} night{totals.nights > 1 ? 's' : ''} × {room.quantity || 1} room{(room.quantity || 1) > 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="body1" fontWeight="700" sx={{ color: '#111827' }}>
                              Total: PKR {((room.totalWithTaxNightly || room.totalWithTax || room.basePriceNightly || room.price || 0) * (room.quantity || 1) * totals.nights).toLocaleString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              {/* Special Requests */}
              {reservationData.guestInfo.specialRequests && (
                <Box sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                    <SupportIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="700" sx={{ color: '#111827' }}>
                      Special Requests
                    </Typography>
                  </Stack>
                  <Paper sx={{ 
                    p: 4, 
                    backgroundColor: '#fefce8', 
                    borderRadius: 3,
                    border: '1px solid #fde047',
                    background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)'
                  }}>
                    <Typography variant="body1" sx={{ color: '#713f12', fontWeight: 500 }}>
                      {reservationData.guestInfo.specialRequests}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Payment & Summary */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Payment Information */}
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
                  Payment Information
                </Typography>
                
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Payment Method:</Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ textTransform: 'capitalize' }}>
                      {paymentMethod === 'credit-card' ? 'Credit Card' : 'Pay at Hotel'}
                    </Typography>
                  </Box>
                  
                  {paymentMethod === 'credit-card' && paymentData && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Card:</Typography>
                      <Typography variant="body2" fontWeight="600">
                        **** **** **** {paymentData.cardNumber.slice(-4)}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Status:</Typography>
                    <Typography variant="body2" fontWeight="600" sx={{ 
                      color: paymentStatus === 'success' || paymentMethod === 'online-payment' ? 'success.main' : 
                             paymentStatus === 'failed' ? 'error.main' : 'warning.main' 
                    }}>
                      {paymentStatus === 'success' ? 'Payment Successful' :
                       paymentStatus === 'failed' ? 'Payment Failed' :
                       paymentMethod === 'online-payment' ? 'Paid Online' :
                       paymentMethod === 'credit-card' ? 'Paid' : 'Pending'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Price Summary */}
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
                  Price Summary
                </Typography>
                
                <Stack spacing={2}>
                  {reservationData.selectedRooms.map((room) => {
                    const qty = room.quantity || 1;
                    const nightly = room.totalWithTaxNightly
                      ?? room.totalWithTax
                      ?? room.priceWithTax
                      ?? room.basePriceNightly
                      ?? room.basePrice
                      ?? room.price
                      ?? 0;
                    return (
                      <Box key={room.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {room.roomTypeName || room.name} × {qty} × {totals.nights} night{totals.nights > 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          PKR {(nightly * qty * totals.nights).toLocaleString()}
                        </Typography>
                      </Box>
                    );
                  })}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Subtotal:</Typography>
                    <Typography variant="body2" fontWeight="600">PKR {totals.subtotal.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Taxes &amp; fees:</Typography>
                    <Typography variant="body2" fontWeight="600">PKR {totals.tax.toLocaleString()}</Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="700">Total:</Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ color: 'primary.main' }}>
                      PKR {totals.total.toLocaleString()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Next Steps */}
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>What's Next?</Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <EmailIcon sx={{ fontSize: 16, mt: 0.5, color: 'primary.main' }} />
                    <Typography variant="body2">
                      A confirmation email has been sent to {reservationData.guestInfo.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <PhoneIcon sx={{ fontSize: 16, mt: 0.5, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Our team will contact you 24 hours before check-in
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <CheckCircleIcon sx={{ fontSize: 16, mt: 0.5, color: 'primary.main' }} />
                    <Typography variant="body2">
                      Arrive at the hotel with a valid ID and this confirmation
                    </Typography>
                  </Stack>
                </Stack>
              </Alert>
            </Stack>
          </Grid>
        </Grid>

        {/* Contact Information */}
        <Paper sx={{ p: 6, mt: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="700" sx={{ mb: 2, color: '#111827' }}>
            Need Help?
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 4, maxWidth: 600, mx: 'auto' }}>
            Our customer service team is available 24/7 to assist you with any questions or concerns.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" sx={{ mb: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body1" fontWeight="600">
                {bookingResponse?.hotelPhone || '+92 300 1234567'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body1" fontWeight="600">
                {reservationData.guestInfo.email}
              </Typography>
            </Stack>
          </Stack>
          {bookingResponse?.hotelAddress && (
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
              <LocationIcon sx={{ color: 'primary.main' }} />
              <Typography variant="body1" fontWeight="600">
                {bookingResponse.hotelAddress}
              </Typography>
            </Stack>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              to="/"
              variant="contained"
              startIcon={<HomeIcon />}
              size="large"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Return to Home
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              startIcon={<SupportIcon />}
              size="large"
              sx={{ borderRadius: 2, px: 4 }}
            >
              Contact Support
            </Button>
          </Stack>
        </Paper>
        </div>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{ 
              borderRadius: 2, 
              px: 4,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
            }}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareBooking}
            sx={{ borderRadius: 2, px: 4 }}
          >
            Share Booking
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default ThankYou;
