import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Alert } from '@mui/material';

const PaymentGateway = ({ paymentData, onSuccess, onError }) => {
  const formRef = useRef(null);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (paymentData?.PaymentUrl && paymentData?.PaymentData) {
      console.log('PaymentGateway received data:', paymentData);
      
      // Set redirecting state
      setRedirecting(true);
      
      // Auto-submit the form to redirect to PayFast after a short delay
      const timer = setTimeout(() => {
        if (formRef.current) {
          console.log('Submitting payment form to:', paymentData.PaymentUrl);
          formRef.current.submit();
        } else {
          setError('Payment form not found');
          onError && onError('Payment form not available');
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else if (paymentData) {
      console.error('Invalid payment data structure:', paymentData);
      setError('Invalid payment data structure received');
      onError && onError('Invalid payment data structure');
    }
  }, [paymentData, onError]);

  if (!paymentData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Preparing payment...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {redirecting ? 'Redirecting to Payment Gateway...' : 'Preparing Payment...'}
      </Typography>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Please wait while we redirect you to the secure payment page.
      </Typography>
      
      {redirecting && (
        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'warning.main' }}>
          If you are not redirected automatically, please click the button below.
        </Typography>
      )}

      {/* Hidden form that auto-submits to PayFast */}
      <form
        ref={formRef}
        method="POST"
        action={paymentData.PaymentUrl}
        style={{ display: 'none' }}
      >
        {Object.entries(paymentData.PaymentData || {}).map(([key, value]) => (
          <input
            key={key}
            type="hidden"
            name={key}
            value={value}
          />
        ))}
      </form>

      {/* Manual submit button as fallback */}
      {redirecting && (
        <Button 
          variant="outlined" 
          onClick={() => formRef.current?.submit()}
          sx={{ mt: 2 }}
        >
          Continue to Payment
        </Button>
      )}
    </Box>
  );
};

export default PaymentGateway;
