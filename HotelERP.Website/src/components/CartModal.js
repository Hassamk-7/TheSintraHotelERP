import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Divider,
  TextField,
  Paper
} from '@mui/material';
import { 
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';

const CartModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { 
    items, 
    subtotal, 
    tax, 
    total, 
    removeFromCart, 
    updateQuantity, 
    updateNights 
  } = useCart();

  // Close modal if cart becomes empty
  useEffect(() => {
    if (open && items.length === 0) {
      setTimeout(() => {
        onClose();
      }, 1500); // Give user time to see empty cart message
    }
  }, [items.length, open, onClose]);

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    
    // Create room data for all items in cart
    const allRoomData = items.map(item => {
      // Use actual tax amount from room data instead of fixed 18%
      const taxAmount = item.taxAmount || 0; // Use tax from item data
      const itemPrice = item.price || 0; // Ensure price is not undefined
      const totalWithTaxNightly = itemPrice + taxAmount;

      return {
        id: item.roomId,
        roomTypeId: item.roomId,
        name: item.name,
        image: item.image,
        basePriceNightly: itemPrice,
        taxAmount: taxAmount,
        totalWithTaxNightly: totalWithTaxNightly,
        hotelId: null,
        quantity: item.quantity || 1,
        maxAdults: item.maxOccupancy || 2,
        maxChildren: 0,
        selectedPlan: item.selectedPlan || null,
        nights: item.nights || 1,
        checkIn: item.checkIn,
        checkOut: item.checkOut
      };
    });

    // Get first item for URL parameters (for compatibility)
    const firstItem = items[0];
    const queryParams = new URLSearchParams({
      roomId: String(firstItem.roomId),
      CheckIn: firstItem.checkIn,
      CheckOut: firstItem.checkOut,
      Adults: String(firstItem.maxOccupancy || 2),
      Children: '0',
      NoOfRooms: String(items.reduce((sum, item) => sum + item.quantity, 0))
    });

    console.log('All room data being passed:', allRoomData);
    console.log('Navigation state:', {
      rooms: allRoomData,
      room: allRoomData[0],
      searchData: {
        checkIn: firstItem.checkIn,
        checkOut: firstItem.checkOut,
        adults: firstItem.maxOccupancy || 2,
        children: 0,
        rooms: items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });

    navigate(`/reservation?${queryParams.toString()}`, {
      state: {
        rooms: allRoomData, // Pass all rooms instead of single room
        room: allRoomData[0], // Keep single room for backward compatibility
        searchData: {
          checkIn: firstItem.checkIn,
          checkOut: firstItem.checkOut,
          adults: firstItem.maxOccupancy || 2,
          children: 0,
          rooms: items.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    });
    
    onClose(); // Close the cart modal after navigation
  };

  if (items.length === 0) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: window.innerWidth <= 768 ? '100%' : 400,
            backgroundColor: '#fff',
          }
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 600 }}>
              Your Cart
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
              Your booking cart is empty
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onClose}
              sx={{
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                }
              }}
            >
              Continue Booking
            </Button>
          </Box>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: window.innerWidth <= 768 ? '100%' : 450,
          backgroundColor: '#f8f9fa',
        }
      }}
    >
      <Box sx={{ p: window.innerWidth <= 768 ? 1 : 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: window.innerWidth <= 768 ? 1 : 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, fontSize: window.innerWidth <= 768 ? '0.9rem' : '1.1rem' }}>
            Your Cart ({items.length} items)
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: window.innerWidth <= 768 ? 1 : 2, mb: window.innerWidth <= 768 ? 1 : 2, backgroundColor: '#fff' }}>
              <Box sx={{ display: 'flex', flexDirection: window.innerWidth <= 768 ? 'column' : 'row', gap: window.innerWidth <= 768 ? 1 : 2 }}>
                {/* Product Image */}
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: window.innerWidth <= 768 ? 60 : 80,
                    height: window.innerWidth <= 768 ? 60 : 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    flexShrink: 0
                  }}
                />
                
                {/* Product Details */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontFamily: 'Playfair Display', 
                      fontWeight: 600, 
                      fontSize: '0.95rem',
                      lineHeight: 1.2
                    }}>
                      {item.name}
                    </Typography>
                    <IconButton 
                      onClick={() => removeFromCart(item.id)} 
                      size="small" 
                      sx={{ p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
                    Check-in: {item.checkIn} | Check-out: {item.checkOut}
                  </Typography>

                  {/* Quantity and Price Controls */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Qty:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          sx={{ width: 20, height: 20 }}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          size="small"
                          sx={{ 
                            width: 45, 
                            mx: 0.5,
                            '& .MuiInputBase-input': {
                              textAlign: 'center',
                              fontSize: '0.8rem',
                              padding: '4px'
                            }
                          }}
                          inputProps={{ min: 1 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          sx={{ width: 20, height: 20 }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      PKR {((item.price || 0) * (item.quantity || 1) * (item.nights || 1)).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Order Summary */}
        <Paper sx={{ p: 2, backgroundColor: '#fff' }}>
          <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, mb: 2, fontSize: '1rem' }}>
            Booking Summary
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Subtotal</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>PKR {subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>Tax</Typography>
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>PKR {tax.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
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
            onClick={handleProceedToCheckout}
            sx={{
              backgroundColor: '#2563eb',
              py: 1.2,
              borderRadius: 1,
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Proceed to Checkout
          </Button>
        </Paper>
      </Box>
    </Drawer>
  );
};

export default CartModal;
