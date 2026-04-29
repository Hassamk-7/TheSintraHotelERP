import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  InputAdornment,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Seo from '../components/Seo';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: 'Pakistan'
    }
  });

  const reservationData = location.state?.reservationData;

  if (!reservationData) {
    navigate('/');
    return null;
  }

  const calculateTotal = () => {
    const nights = Math.ceil((new Date(reservationData.checkOut) - new Date(reservationData.checkIn)) / (1000 * 60 * 60 * 24));

    // Prefer API-calculated totals if provided
    const apiSubtotal = reservationData.subtotal;
    const apiTax = reservationData.taxAmount;
    const apiTotal = reservationData.totalAmount;
    if (apiSubtotal != null && apiTax != null && apiTotal != null) {
      return { subtotal: apiSubtotal, tax: apiTax, total: apiTotal, nights };
    }

    const roomTotal = reservationData.selectedRooms.reduce((sum, room) => sum + (room.price * room.quantity * nights), 0);
    const tax = roomTotal * 0.18; // fallback percentage
    return {
      subtotal: roomTotal,
      tax,
      total: roomTotal + tax,
      nights
    };
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setPaymentData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange('cardNumber', formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    handleInputChange('expiryDate', formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate('/thank-you', { 
        state: { 
          reservationData, 
          paymentMethod: 'credit-card',
          paymentData 
        } 
      });
    }, 3000);
  };

  const isFormValid = () => {
    return paymentData.cardNumber.replace(/\s/g, '').length >= 16 &&
           paymentData.expiryDate.length === 5 &&
           paymentData.cvv.length >= 3 &&
           paymentData.cardholderName.length > 0;
  };

  const totals = calculateTotal();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pt: 12 }}>
      <Seo
        title="Payment"
        description="Complete your Luxury Hotel booking securely. Enter your payment details to confirm your reservation and receive instant confirmation."
        keywords="Luxury Hotel payment, secure checkout, booking payment, credit card payment, reservation checkout"
        author="Luxury Hotel"
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <SecurityIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h3" fontWeight="700" sx={{ color: '#111827' }}>
              Secure Payment
            </Typography>
          </Stack>
          <Typography variant="h6" sx={{ color: '#6b7280' }}>
            Complete your booking with our secure payment system
          </Typography>
        </Paper>

        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                <SecurityIcon sx={{ color: 'success.main' }} />
                <Typography variant="h5" fontWeight="700" sx={{ color: '#111827' }}>
                  Payment Details
                </Typography>
                <LockIcon sx={{ color: '#9ca3af', ml: 'auto' }} />
              </Stack>

              <Box component="form" onSubmit={handleSubmit}>
                {/* Card Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
                    Card Information
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Cardholder Name"
                      required
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="John Doe"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Card Number"
                      required
                      value={paymentData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      inputProps={{ maxLength: 19 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCardIcon />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          required
                          value={paymentData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          inputProps={{ maxLength: 5 }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          required
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          inputProps={{ maxLength: 4 }}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </Box>

                {/* Billing Address */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
                    Billing Address
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={paymentData.billingAddress.address}
                      onChange={(e) => handleInputChange('billingAddress.address', e.target.value)}
                      placeholder="123 Main Street"
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={paymentData.billingAddress.city}
                          onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                          placeholder="Islamabad"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={paymentData.billingAddress.postalCode}
                          onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
                          placeholder="44000"
                        />
                      </Grid>
                    </Grid>

                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={paymentData.billingAddress.country}
                        onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                        label="Country"
                      >
                        <MenuItem value="Pakistan">Pakistan</MenuItem>
                        <MenuItem value="India">India</MenuItem>
                        <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>

                {/* Security Notice */}
                <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Your payment is secure</Typography>
                  <Typography variant="body2">
                    We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers.
                  </Typography>
                </Alert>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!isFormValid() || processing}
                  sx={{ 
                    py: 2, 
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}
                  startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                >
                  {processing ? 'Processing Payment...' : `Pay PKR ${totals.total.toLocaleString()}`}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 4, borderRadius: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" fontWeight="700" sx={{ mb: 3, color: '#111827' }}>
                Order Summary
              </Typography>
              
              {/* Guest Information */}
              <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827' }}>
                  Guest Information
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {reservationData.guestInfo.firstName} {reservationData.guestInfo.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {reservationData.guestInfo.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    {reservationData.guestInfo.phone}
                  </Typography>
                </Stack>
              </Box>

              {/* Booking Details */}
              <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827' }}>
                  Booking Details
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Check-in:</Typography>
                    <Typography variant="body2" fontWeight="600">{reservationData.checkIn}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Check-out:</Typography>
                    <Typography variant="body2" fontWeight="600">{reservationData.checkOut}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Nights:</Typography>
                    <Typography variant="body2" fontWeight="600">{totals.nights}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Guests:</Typography>
                    <Typography variant="body2" fontWeight="600">
                      {reservationData.adults} Adults, {reservationData.children} Children
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Room Details */}
              <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid #e5e7eb' }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827' }}>
                  Room Details
                </Typography>
                <Stack spacing={2}>
                  {reservationData.selectedRooms.map((room) => (
                    <Box key={room.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="body1" fontWeight="600" sx={{ color: '#111827' }}>
                          {room.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {room.quantity} room{room.quantity > 1 ? 's' : ''} × {totals.nights} night{totals.nights > 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="600">
                        PKR {(room.price * room.quantity * totals.nights).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Subtotal</Typography>
                    <Typography variant="body2" fontWeight="600">PKR {totals.subtotal.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>Tax (16%)</Typography>
                    <Typography variant="body2" fontWeight="600">PKR {totals.tax.toLocaleString()}</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="700">Total</Typography>
                  <Typography variant="h6" fontWeight="700" sx={{ color: 'primary.main' }}>
                    PKR {totals.total.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              {/* Cancellation Policy */}
              <Box sx={{ pt: 3, borderTop: '1px solid #e5e7eb' }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#111827' }}>
                  Cancellation Policy
                </Typography>
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    • Free cancellation up to 24 hours before check-in
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    • 50% refund for cancellations within 24 hours
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    • No refund for no-shows
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Payment;
