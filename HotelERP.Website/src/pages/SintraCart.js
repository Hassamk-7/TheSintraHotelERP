import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton,
  Divider,
  Grid,
  Paper,
  TextField
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const SintraCart = () => {
  const { items, subtotal, tax, total, removeFromCart, updateQuantity, updateNights } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we came from reservation page and handle back navigation
  useEffect(() => {
    if (items.length === 0 && location.state?.fromReservation) {
      // If cart is empty and we came from reservation, navigate back
      navigate('/reservation', { replace: true });
    }
  }, [items.length, location.state, navigate]);

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Playfair Display', fontWeight: 600 }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any rooms to your cart yet.
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            Browse Rooms
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton component={Link} to="/" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 600 }}>
            Shopping Cart ({items.length} items)
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 0 }}>
                <Grid container>
                  <Grid item xs={12} sm={2}>
                    <CardMedia
                      component="img"
                      height="80"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'cover', borderRadius: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: '1.1rem' }}>
                          {item.name}
                        </Typography>
                        <IconButton onClick={() => removeFromCart(item.id)} color="error" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.85rem' }}>
                        Check-in: {item.checkIn} | Check-out: {item.checkOut}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Rooms:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              sx={{ width: 24, height: 24 }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              size="small"
                              sx={{ width: 50, mx: 0.5 }}
                              inputProps={{ min: 1, style: { textAlign: 'center', fontSize: '0.85rem' } }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              sx={{ width: 24, height: 24 }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>Nights:</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                              size="small" 
                              onClick={() => updateNights(item.id, item.nights - 1)}
                              disabled={item.nights <= 1}
                              sx={{ width: 24, height: 24 }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              value={item.nights}
                              onChange={(e) => updateNights(item.id, parseInt(e.target.value) || 1)}
                              size="small"
                              sx={{ width: 50, mx: 0.5 }}
                              inputProps={{ min: 1, style: { textAlign: 'center', fontSize: '0.85rem' } }}
                            />
                            <IconButton 
                              size="small" 
                              onClick={() => updateNights(item.id, item.nights + 1)}
                              sx={{ width: 24, height: 24 }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          PKR {item.price.toLocaleString()} × {item.quantity} × {item.nights} nights
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                          PKR {(item.price * item.quantity * item.nights).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: 'sticky', top: 100, backgroundColor: '#f8f9fa' }}>
            <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: '1.1rem' }}>
              Shopping Cart
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Subtotal</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>PKR {subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>Tax (18%)</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>PKR {tax.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>Total</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  PKR {total.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                console.log('Proceed to Checkout clicked');
                console.log('Navigating to /reservation');
                navigate('/reservation', { 
                  state: { fromCart: true, cartItems: items } 
                });
              }}
              sx={{
                background: '#2563eb',
                py: 1.2,
                borderRadius: 1,
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                '&:hover': {
                  background: '#1d4ed8',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outlined"
              fullWidth
              component={Link}
              to="/"
              sx={{ 
                mt: 2,
                borderColor: '#2563eb',
                color: '#2563eb',
                '&:hover': {
                  borderColor: '#1d4ed8',
                  backgroundColor: 'rgba(37, 99, 235, 0.04)'
                }
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SintraCart;
