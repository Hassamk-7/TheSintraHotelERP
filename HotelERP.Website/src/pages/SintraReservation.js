import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PaymentGateway from '../components/PaymentGateway';
import api, { API_BASE_URL, createReservation } from '../services/api';
import { useCart } from '../context/CartContext';

const SintraReservation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, removeFromCart, addToCart } = useCart();

  const getParam = (legacyKey, modernKey, fallback = '') => {
    return searchParams.get(legacyKey) || searchParams.get(modernKey) || fallback;
  };

  const incomingRoom = location.state?.room || null;
  const incomingRooms = location.state?.rooms || [];
  const incomingSearchData = location.state?.searchData || {};
  const fromCart = location.state?.fromCart || false;
  const cartItems = location.state?.cartItems || [];

  const checkIn = getParam('CheckIn', 'checkIn', incomingSearchData.checkIn || '');
  const checkOut = getParam('CheckOut', 'checkOut', incomingSearchData.checkOut || '');
  const adults = parseInt(getParam('Adults', 'adults', String(incomingSearchData.adults || 1)), 10) || 1;
  const children = parseInt(getParam('Children', 'children', String(incomingSearchData.children || 0)), 10) || 0;
  const noOfRooms = parseInt(getParam('NoOfRooms', 'rooms', String(incomingSearchData.rooms || incomingRoom?.quantity || 1)), 10) || 1;

  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    arrival: '',
    coupon: '',
    specialMessage: '',
    paymentMethod: 'online-payment',
    agreed: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [voucherState, setVoucherState] = useState({ applied: false, loading: false, data: null, message: '' });
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [expandedRooms, setExpandedRooms] = useState({});
  const syncRef = useRef(false);

  const roomData = useMemo(() => {
    // If we have multiple rooms, use the current room index
    if (incomingRooms.length > 0) {
      const currentRoom = incomingRooms[currentRoomIndex] || incomingRooms[0];
      const nightlyBase = Number(currentRoom.basePriceNightly ?? currentRoom.discountedPrice ?? currentRoom.price ?? 0) || 0;
      // Use same tax calculation as room cards
      const nightlyTax = Array.isArray(currentRoom.taxes) && currentRoom.taxes.length > 0 
        ? currentRoom.taxes.reduce((sum, tax) => {
            const type = (tax.taxType ?? tax.TaxType ?? '').toString().toLowerCase();
            const value = parseFloat(tax.taxValue ?? tax.TaxValue ?? 0) || 0;
            if (type === 'percentage') {
              return sum + ((nightlyBase * value) / 100);
            }
            return sum + value;
          }, 0)
        : 0;
      const nightlyTotal = nightlyBase + nightlyTax;

      return {
        ...currentRoom,
        quantity: currentRoom.quantity || noOfRooms,
        basePriceNightly: nightlyBase,
        taxAmount: nightlyTax,
        totalWithTaxNightly: nightlyTotal,
        image: currentRoom.image || '/img/rooms/60.jpg',
        name: currentRoom.name || currentRoom.roomTypeName || 'Executive Room'
      };
    }

    // Fallback to single room logic
    if (!incomingRoom) {
      return {
        id: searchParams.get('roomId') || '',
        roomTypeId: searchParams.get('roomId') || 0,
        name: 'Executive Room',
        image: '/img/rooms/60.jpg',
        basePriceNightly: 21735,
        taxAmount: 0,
        totalWithTaxNightly: 21735,
        hotelId: null,
        quantity: noOfRooms,
        maxAdults: adults,
        maxChildren: children
      };
    }

    const nightlyBase = Number(incomingRoom.basePriceNightly ?? incomingRoom.discountedPrice ?? incomingRoom.price ?? 0) || 0;
    // Use same tax calculation as room cards for single room too
    const nightlyTax = Array.isArray(incomingRoom.taxes) && incomingRoom.taxes.length > 0 
      ? incomingRoom.taxes.reduce((sum, tax) => {
            const type = (tax.taxType ?? tax.TaxType ?? '').toString().toLowerCase();
            const value = parseFloat(tax.taxValue ?? tax.TaxValue ?? 0) || 0;
            if (type === 'percentage') {
              return sum + ((nightlyBase * value) / 100);
            }
            return sum + value;
          }, 0)
      : 0;
    const nightlyTotal = nightlyBase + nightlyTax;

    return {
      ...incomingRoom,
      quantity: incomingRoom.quantity || noOfRooms,
      basePriceNightly: nightlyBase,
      taxAmount: nightlyTax,
      totalWithTaxNightly: nightlyTotal,
      image: incomingRoom.image || '/img/rooms/60.jpg',
      name: incomingRoom.name || incomingRoom.roomTypeName || 'Executive Room'
    };
  }, [incomingRoom, incomingRooms, searchParams, noOfRooms, adults, children, currentRoomIndex]);

  // Calculate totals for multiple rooms
  const allRoomsData = useMemo(() => {
    if (incomingRooms.length > 0) {
      return incomingRooms.map(room => {
        const nightlyBase = Number(room.basePriceNightly ?? room.discountedPrice ?? room.price ?? 0) || 0;
        const nightlyTax = Number(room.taxAmount ?? 0) || 0;
        const nightlyTotal = Number(room.totalWithTaxNightly ?? room.totalWithTax ?? (nightlyBase + nightlyTax)) || (nightlyBase + nightlyTax);

        return {
          ...room,
          basePriceNightly: nightlyBase,
          taxAmount: nightlyTax,
          totalWithTaxNightly: nightlyTotal
        };
      });
    }
    return [];
  }, [incomingRooms]);

  // Sync cart with reservation data
  useEffect(() => {
    // Only sync once on mount or when rooms change significantly
    if (!syncRef.current && (roomData.id || allRoomsData.length > 0) && checkIn && checkOut) {
      syncRef.current = true;
      
      // Clear cart first to avoid duplicates
      clearCart();
      
      // Add all rooms from reservation to cart
      const roomsToAdd = allRoomsData.length > 0 ? allRoomsData : [roomData];
      
      roomsToAdd.forEach(room => {
        if (room && room.id && checkIn && checkOut) {
          // Ensure room has price property for cart context
          const roomWithPrice = {
            ...room,
            price: room.basePriceNightly || room.price || 0
          };
          addToCart(roomWithPrice, checkIn, checkOut, room.quantity || 1);
        }
      });
    }
  }, [allRoomsData.length, roomData.id, checkIn, checkOut]); // Only re-run when essential data changes

  const dateInfo = useMemo(() => {
    const inDate = checkIn ? new Date(checkIn) : null;
    const outDate = checkOut ? new Date(checkOut) : null;
    const validIn = inDate && !Number.isNaN(inDate.getTime()) ? inDate : null;
    const validOut = outDate && !Number.isNaN(outDate.getTime()) ? outDate : null;
    const nights = validIn && validOut ? Math.max(1, Math.round((validOut - validIn) / (1000 * 60 * 60 * 24))) : 1;
    return { inDate: validIn, outDate: validOut, nights };
  }, [checkIn, checkOut]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let tax = 0;
    let totalQuantity = 0;

    // Calculate totals for multiple rooms
    if (allRoomsData.length > 0) {
      allRoomsData.forEach(room => {
        const quantity = Number(room.quantity || 1);
        subtotal += Number(room.basePriceNightly || 0) * dateInfo.nights * quantity;
        tax += Number(room.taxAmount || 0) * dateInfo.nights * quantity;
        totalQuantity += quantity;
      });
    } else {
      // Fallback to single room
      const quantity = Number(roomData.quantity || noOfRooms || 1);
      subtotal = Number(roomData.basePriceNightly || 0) * dateInfo.nights * quantity;
      tax = Number(roomData.taxAmount || 0) * dateInfo.nights * quantity;
      totalQuantity = quantity;
    }

    const grossTotal = subtotal + tax;
    const voucher = voucherState.data;
    let discount = 0;

    if (voucher) {
      const minimumAmount = Number(voucher.minimumAmount ?? voucher.MinimumAmount ?? 0) || 0;
      const maximumDiscount = Number(voucher.maximumDiscount ?? voucher.MaximumDiscount ?? 0) || 0;
      const discountType = String(voucher.discountType ?? voucher.DiscountType ?? 'Fixed').toLowerCase();
      if (grossTotal >= minimumAmount) {
        if (discountType === 'percentage') {
          const percentage = Number(voucher.discountPercentage ?? voucher.DiscountPercentage ?? 0) || 0;
          discount = (grossTotal * percentage) / 100;
        } else {
          discount = Number(voucher.discountAmount ?? voucher.DiscountAmount ?? 0) || 0;
        }
        if (maximumDiscount > 0) {
          discount = Math.min(discount, maximumDiscount);
        }
      }
    }

    discount = Math.min(discount, grossTotal);
    const total = Math.max(0, grossTotal - discount);
    const advanceAmount = formData.paymentMethod === 'online-payment' ? total : Number((total * 0.25).toFixed(2));
    return { subtotal, tax, grossTotal, discount, total, advanceAmount, quantity: totalQuantity };
  }, [roomData, noOfRooms, dateInfo.nights, voucherState.data, formData.paymentMethod, allRoomsData]);

  const formatDateNumber = (date) => (date ? date.getDate() : '--');
  const formatMonthYear = (date) => (date ? date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A');
  const formatDayName = (date) => (date ? date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase() : 'N/A');
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const compactFieldStyle = {
    height: '42px',
    fontSize: '13px',
    borderRadius: '0',
    border: '0',
    borderBottom: '1px solid #ececec',
    boxShadow: 'none',
    padding: '8px 0',
    color: '#6b7280',
    backgroundColor: 'transparent'
  };
  const paymentCardBaseStyle = {
    border: '2px solid #2f6f88',
    padding: '16px 16px 14px',
    borderRadius: '12px',
    cursor: 'pointer',
    minHeight: '120px'
  };
  const reservationMetricBoxStyle = {
    backgroundColor: '#151515',
    padding: '16px 14px 12px',
    textAlign: 'center',
    minHeight: '92px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const reservationlastMetricBoxStyle = {
    backgroundColor: '#151515',
    padding: '16px 14px 12px',
    textAlign: 'center',
    minHeight: '92px',
    display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePreviousRoom = () => {
    setCurrentRoomIndex((prev) => (prev - 1 + allRoomsData.length) % allRoomsData.length);
  };

  const handleNextRoom = () => {
    setCurrentRoomIndex((prev) => (prev + 1) % allRoomsData.length);
  };

  const handleEditRoom = (index) => {
    const roomToEdit = allRoomsData[index];
    // Navigate back to search results with URL parameters
    const queryParams = new URLSearchParams({
      CheckIn: roomToEdit.checkIn,
      CheckOut: roomToEdit.checkOut,
      Adults: String(roomToEdit.maxAdults || adults),
      Children: String(children),
      NoOfRooms: String(roomToEdit.quantity),
      editingRoomId: String(roomToEdit.id),
      editIndex: String(index)
    });

    navigate(`/search-results?${queryParams.toString()}`);
  };

  const handleDeleteRoom = (index) => {
    if (window.confirm('Are you sure you want to delete this room from your reservation?')) {
      // Create new rooms array without the deleted room
      const updatedRooms = allRoomsData.filter((_, i) => i !== index);
      
      // Remove from cart context as well
      const roomToDelete = allRoomsData[index];
      if (roomToDelete) {
        const cartItemId = `${roomToDelete.id}-${roomToDelete.checkIn}-${roomToDelete.checkOut}`;
        removeFromCart(cartItemId);
      }
      
      if (updatedRooms.length === 0) {
        // If no rooms left, navigate back to search results with current parameters
        const queryParams = new URLSearchParams({
          CheckIn: incomingSearchData?.checkIn || searchParams.get('CheckIn'),
          CheckOut: incomingSearchData?.checkOut || searchParams.get('CheckOut'),
          Adults: String(incomingSearchData?.adults || searchParams.get('Adults') || adults),
          Children: String(incomingSearchData?.children || searchParams.get('Children') || children),
          NoOfRooms: '1', // Default to 1 room for new selection
          addingRoom: 'true' // Flag to indicate adding another room
        });

        navigate(`/search-results?${queryParams.toString()}`);
      } else {
        // Update the state with the remaining rooms
        const updatedIncomingRooms = incomingRooms.filter((_, i) => i !== index);
        
        // Navigate to same page with updated rooms
        navigate(`/reservation?${searchParams.toString()}`, {
          state: {
            rooms: updatedIncomingRooms,
            room: updatedIncomingRooms[0] || null,
            searchData: incomingSearchData
          },
          replace: true
        });
      }
    }
  };

  const toggleRoomDetails = (index) => {
    setExpandedRooms(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  
  const handleApplyVoucher = async () => {
    const code = (formData.coupon || '').trim();
    if (!code) {
      setVoucherState({ applied: false, loading: false, data: null, message: 'Enter a voucher code.' });
      return;
    }

    try {
      setVoucherState((prev) => ({ ...prev, loading: true, message: '' }));
      const response = await api.get('/Vouchers', { params: { page: 1, pageSize: 100, status: 'Active' } });
      const vouchers = Array.isArray(response?.data?.data) ? response.data.data : [];
      const matchedVoucher = vouchers.find((voucher) => String(voucher.voucherCode || '').trim().toLowerCase() === code.toLowerCase());

      if (!matchedVoucher) {
        setVoucherState({ applied: false, loading: false, data: null, message: 'Voucher not found or inactive.' });
        return;
      }

      const roomTypeId = Number(roomData.roomTypeId || roomData.id || 0);
      const voucherRoomTypeId = Number(matchedVoucher.roomTypeId ?? matchedVoucher.RoomTypeId ?? 0);
      if (voucherRoomTypeId && roomTypeId && voucherRoomTypeId !== roomTypeId) {
        setVoucherState({ applied: false, loading: false, data: null, message: 'This voucher is not valid for the selected room type.' });
        return;
      }

      setVoucherState({ applied: true, loading: false, data: matchedVoucher, message: 'Voucher applied successfully.' });
    } catch (voucherError) {
      setVoucherState({ applied: false, loading: false, data: null, message: voucherError?.response?.data?.message || 'Unable to apply voucher.' });
    }
  };

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  };

  const normalizePlanId = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const numericValue = Number(value);
    return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      setError('Please accept the Terms and Conditions and Privacy Policy.');
      return;
    }

    if (!roomData || !roomData.roomTypeId) {
      setError('Room data is missing. Please go back and select a room again.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Prepare selected rooms array - include all rooms for multiple room bookings
      const selectedRoomsForBooking = allRoomsData.length > 0 
        ? allRoomsData.map(room => ({
            roomTypeId: room.roomTypeId || room.id || 0,
            roomTypeName: room.name || room.roomTypeName || '',
            quantity: room.quantity || 1,
            basePrice: Number(room.basePriceNightly || 0),
            taxAmount: Number(room.taxAmount || 0),
            totalWithTax: Number(room.totalWithTaxNightly || 0),
            planId: normalizePlanId(room.selectedPlan?.id ?? room.selectedPlan?.Id ?? room.planId ?? room.PlanId),
            planName: room.selectedPlan?.name || room.selectedPlan?.Name || '',
            planSurcharge: Number(room.selectedPlanExtraAmount || 0)
          }))
        : [
          {
            roomTypeId: roomData.roomTypeId || roomData.id || 0,
            roomTypeName: roomData.name || '',
            quantity: totals.quantity,
            basePrice: Number(roomData.basePriceNightly || 0),
            taxAmount: Number(roomData.taxAmount || 0),
            totalWithTax: Number(roomData.totalWithTaxNightly || 0),
            planId: normalizePlanId(roomData.selectedPlan?.id ?? roomData.selectedPlan?.Id ?? roomData.planId ?? roomData.PlanId),
            planName: roomData.selectedPlan?.name || roomData.selectedPlan?.Name || '',
            planSurcharge: Number(roomData.selectedPlanExtraAmount || 0)
          }
        ];

      const bookingRequest = {
        hotelId: roomData.hotelId || 1,
        roomTypeId: roomData.roomTypeId || roomData.id || null,
        selectedRooms: selectedRoomsForBooking,
        checkInDate: formatDateForApi(checkIn),
        checkOutDate: formatDateForApi(checkOut),
        numberOfAdults: adults,
        numberOfChildren: children,
        specialRequests: formData.specialMessage || '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
        city: 'Islamabad',
        country: 'Pakistan',
        postalCode: '',
        idType: 'CNIC',
        idNumber: '',
        title: formData.title,
        company: '',
        notes: formData.specialMessage || '',
        arrivalTime: formData.arrival || '',
        couponCode: formData.coupon || '',
        voucherId: voucherState.data?.id || null,
        voucherCode: voucherState.data?.voucherCode || formData.coupon || '',
        bookingSource: 'Website',
        numberOfRooms: totals.quantity,
        nights: dateInfo.nights,
        paymentMethod: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'online-payment' ? 'Paid' : 'Partial',
        paymentAccount: formData.paymentMethod === 'online-payment' ? 'PayFast' : 'Pay at Hotel',
        ratePlanId: roomData.selectedPlan?.id ? String(roomData.selectedPlan.id) : '',
        source: 'Website',
        market: 'Online',
        reservationMadeBy: `${formData.firstName} ${formData.lastName}`.trim(),
        checkinNotes: formData.arrival ? `Arrival Time: ${formData.arrival}` : '',
        enteredBy: 'Website',
        subtotal: totals.subtotal,
        taxAmount: totals.tax,
        discountAmount: totals.discount,
        advanceAmount: totals.advanceAmount,
        totalAmount: totals.total
      };

      const bookingResponse = await createReservation(bookingRequest);

      if (formData.paymentMethod === 'online-payment') {
        const paymentResponse = await fetch(`${API_BASE_URL}/Payfast/ProcessPayment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            BasketId: bookingResponse.reservationNumber || `LH${Date.now()}`,
            Amount: Number(bookingResponse.totalPaid ?? bookingResponse.totalAmount ?? totals.total ?? 0),
            CustomerEmail: formData.email,
            CustomerName: `${formData.firstName} ${formData.lastName}`.trim()
          })
        });

        if (!paymentResponse.ok) {
          const responseText = await paymentResponse.text();
          throw new Error(responseText || 'Failed to initiate online payment.');
        }

        const payfastPayload = await paymentResponse.json();
        const normalizedPaymentData = {
          PaymentUrl: payfastPayload.PaymentUrl || payfastPayload.paymentUrl,
          PaymentData: payfastPayload.PaymentData || payfastPayload.paymentData,
          Token: payfastPayload.Token || payfastPayload.token,
          BasketId: payfastPayload.BasketId || payfastPayload.basketId
        };

        setPaymentData({
          ...normalizedPaymentData,
          bookingResponse,
          reservationData: {
            guestInfo: {
              title: formData.title,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              arrival: formData.arrival,
              coupon: formData.coupon,
              specialRequests: formData.specialMessage
            },
            selectedRooms: allRoomsData.length > 0 ? allRoomsData.map(room => ({ ...room, quantity: room.quantity || 1 })) : [{ ...roomData, quantity: totals.quantity }],
            checkIn,
            checkOut,
            adults,
            children,
            totals,
            voucher: voucherState.data
          }
        });
        setShowPaymentGateway(true);
        return;
      }

      // Clear cart after successful booking
      clearCart();
      
      navigate('/thank-you', {
        state: {
          bookingResponse,
          reservationData: {
            guestInfo: {
              title: formData.title,
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              arrival: formData.arrival,
              coupon: formData.coupon,
              specialRequests: formData.specialMessage
            },
            selectedRooms: allRoomsData.length > 0 ? allRoomsData.map(room => ({ ...room, quantity: room.quantity || 1 })) : [{ ...roomData, quantity: totals.quantity }],
            checkIn,
            checkOut,
            adults,
            children,
            totals,
            voucher: voucherState.data
          },
          paymentMethod: formData.paymentMethod
        }
      });
    } catch (submitError) {
      setError(submitError?.message || 'Failed to complete booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="banner-header section-padding valign bg-img" data-overlay-dark="4" data-background="/img/slider/sub.png" style={{ backgroundImage: 'url(/img/slider/sub.png)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 caption mt-90 text-left">
              <span>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
              </span>
              <h1>Book Luxury Hotel in Islamabad</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div className="col-lg-7 col-md-7">
              <h2 style={{ fontFamily: 'Gilda Display, serif', fontSize: '56px', lineHeight: '1.08em', marginBottom: '28px', color: '#0f172a' }}>Personal Information</h2>
              <form onSubmit={handleSubmit}>
                {error ? (
                  <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    {error}
                  </div>
                ) : null}
                <div className="row">
                  <div className="col-md-2">
                    <div className="form-group">
                      <select 
                        name="title" 
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                      >
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="firstName"
                        className="form-control" 
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="lastName"
                        className="form-control" 
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input 
                        type="email" 
                        name="email"
                        className="form-control" 
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input 
                        type="tel" 
                        name="phone"
                        className="form-control" 
                        placeholder="+92 3xxxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="address"
                        className="form-control" 
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <input 
                        type="time" 
                        name="arrival"
                        placeholder="Arrival Time"
                        className="form-control"
                        value={formData.arrival}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                      />
                      
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <input 
                        type="text" 
                        name="coupon"
                        className="form-control" 
                        placeholder="Coupon"
                        value={formData.coupon}
                        onChange={handleInputChange}
                        style={compactFieldStyle}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                    
                      <button type="button" className="btn btn-dark btn-sm" onClick={handleApplyVoucher} disabled={voucherState.loading} style={{ marginTop: '10px', minWidth: '102px', height: '28px', padding: '4px 14px', fontSize: '12px', borderRadius: '2px', lineHeight: '1.1' }}>{voucherState.loading ? 'Applying...' : 'Apply Voucher'}</button>
                      {voucherState.message ? (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: voucherState.applied ? '#15803d' : '#dc2626' }}>{voucherState.message}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <textarea 
                        name="specialMessage"
                        className="form-control" 
                        rows="3" 
                        placeholder="Special Message"
                        value={formData.specialMessage}
                        onChange={handleInputChange}
                        style={{ ...compactFieldStyle, height: '66px', resize: 'vertical', paddingTop: '10px' }}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <h2 className="mt-4" style={{ fontFamily: 'Gilda Display, serif', fontSize: '56px', lineHeight: '1.08em', marginTop: '6px', marginBottom: '18px', color: '#0f172a' }}>Payment Method</h2>
                <div className="row">
  <div className="col-md-6">
    <div
      className="payment-option"
      style={{
        ...paymentCardBaseStyle,
        borderColor: formData.paymentMethod === 'online-payment' ? '#2f6f88' : '#d1d5db',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'online-payment' }))}
    >
      <input
        type="radio"
        name="paymentMethod"
        value="online-payment"
        checked={formData.paymentMethod === 'online-payment'}
        onChange={handleInputChange}
      />

      <label style={{ marginLeft: '10px', fontWeight: '400', fontSize: '20px', color: '#111827' }}>
        Online Payment
      </label>

      {formData.paymentMethod === 'online-payment' && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#2f6f88',
          color: '#fff',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          ✓
        </div>
      )}

      <div style={{ marginTop: '12px', marginLeft: '5px', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
        <img src="/img/visa.svg" alt="Visa" style={{ width: '30px', height: '35px' }} />
        <img src="/img/mastercard.svg" alt="Mastercard" style={{ width: '30px', height: '35px' }} />
        <img src="/img/easypaisa.svg" alt="Easypaisa" style={{ width: '30px', height: '35px' }} />
        <img src="/img/jazzcash.svg" alt="JazzCash" style={{ width: '30px', height: '35px' }} />
        <img src="/img/upasia.svg" alt="UPaisa" style={{ width: '30px', height: '35px' }} />
      </div>
    </div>
  </div>

  <div className="col-md-6">
    <div
      className="payment-option"
      style={{
        ...paymentCardBaseStyle,
        borderColor: formData.paymentMethod === 'pay-at-hotel' ? '#2f6f88' : '#d1d5db',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}
      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'pay-at-hotel' }))}
    >
      <input
        type="radio"
        name="paymentMethod"
        value="pay-at-hotel"
        checked={formData.paymentMethod === 'pay-at-hotel'}
        onChange={handleInputChange}
      />

      <label style={{ marginLeft: '10px', fontWeight: '400', fontSize: '20px', color: '#111827' }}>
        25% Deposit
      </label>

      <p style={{ marginTop: '12px', marginBottom: '0', fontSize: '12px', color: '#111827', marginLeft: '24px' }}>
        To confirm your booking.
      </p>

      {formData.paymentMethod === 'pay-at-hotel' && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#2f6f88',
          color: '#fff',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          ✓
        </div>
      )}
    </div>
  </div>
</div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="form-check" style={{ marginTop: '8px' }}>
                      <input type="checkbox" className="form-check-input" id="terms" name="agreed" checked={formData.agreed} onChange={handleInputChange} />
                      <label className="form-check-label" htmlFor="terms" style={{ fontSize: '13px', color: '#374151' }}>
                        I have read and agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-primary btn-lg btn-block" style={{
                      backgroundColor: '#2f6f88',
                      border: 'none',
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: '500',
                      letterSpacing: '0.22em',
                      minWidth: '116px',
                      borderRadius: '0',
                      lineHeight: '1.2'
                    }} disabled={submitting}>
                      {submitting ? 'PROCESSING...' : 'BOOK NOW'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-4 col-md-5 offset-md-1" >
              <div className="card" style={{ 
                backgroundColor: '#1a1a1a', 
                color: 'white', 
                padding: '0',
                borderRadius: '0',
                // maxWidth: '272px',
                // width: '100%',
                border: '0'
              }}>
                <div style={{ position: 'relative' }}>
                  <img src={roomData.image} alt={roomData.name} style={{ width: '100%', objectFit: 'cover', borderRadius: '0' }} />
                  <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    right: '10px', 
                    backgroundColor: '#1f1f1f',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontSize: '11px',
                    lineHeight: '1.2'
                  }}>
                    {roomData.name}
                  </div>
                  
                  {/* Navigation Buttons - Only show if multiple rooms */}
                  {allRoomsData.length > 1 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '0', 
                      right: '0', 
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0 10px',
                      pointerEvents: 'none'
                    }}>
                      <button
                        type="button"
                        onClick={handlePreviousRoom}
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          pointerEvents: 'auto',
                          transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                      >
                        &#8249;
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleNextRoom}
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          pointerEvents: 'auto',
                          transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                      >
                        &#8250;
                      </button>
                    </div>
                  )}
                  
                  {/* Room Indicators */}
                  {allRoomsData.length > 1 && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '15px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      display: 'flex', 
                      gap: '6px' 
                    }}>
                      {allRoomsData.map((_, index) => (
                        <div
                          key={index}
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: index === currentRoomIndex ? '#3DA3A8' : 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                          }}
                          onClick={() => setCurrentRoomIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* All Rooms Details Display */}
                {allRoomsData.length > 0 && (
                  <div style={{ backgroundColor: '#151515', padding: '15px' }}>
                    <h3 style={{ color: '#ffffff', textAlign: 'center', fontSize: '12px', letterSpacing: '0.18em', marginBottom: '15px' }}>YOUR RESERVATION</h3>
                    
                    {allRoomsData.map((room, index) => (
                      <div key={index} style={{ 
                        backgroundColor: '#1a1a1a', 
                        padding: '12px', 
                        marginBottom: '10px', 
                        borderRadius: '4px',
                        border: '1px solid #333'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           
                            <h5 style={{ color: '#ffffff', fontSize: '14px', margin: 0, fontWeight: 600 }}>
                              Room {index + 1}: {room.name}
                            </h5>
                             <span 
                              style={{ 
                                cursor: 'pointer', 
                                color: '#ffffff', 
                                fontSize: '12px',
                                transition: 'transform 0.3s ease',
                                transform: expandedRooms[index] ? 'rotate(180deg)' : 'rotate(0deg)'
                              }}
                              onClick={() => toggleRoomDetails(index)}
                            >
                              <i className="fa fa-chevron-down"></i>
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span 
                              style={{ cursor: 'pointer', color: '#F2C94C', fontSize: '12px' }}
                              onClick={() => handleEditRoom(index)}
                              title="Edit Room"
                            >
                              <i className="fa fa-pencil"></i>
                            </span>
                            <span 
                              style={{ cursor: 'pointer', color: '#EB5757', fontSize: '12px' }}
                              onClick={() => handleDeleteRoom(index)}
                              title="Delete Room"
                            >
                              <i className="fa fa-trash"></i>
                            </span>
                          </div>
                        </div>
                        
                        {/* Always Visible Basic Info */}
                        <div style={{ color: '#ffffff', fontSize: '10px', marginBottom: '8px' }}>
                          <strong style={{ color: '#F2C94C' }}>Best Available Rate</strong> 
                          <i className="fa fa-info-circle" style={{ marginLeft: '4px', fontSize: '8px' }}></i>
                        </div>
                        
                        <div style={{ color: '#ffffff', fontSize: '10px', marginBottom: '4px' }}>
                          {formatDisplayDate(room.checkIn)} - {formatDisplayDate(room.checkOut)}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', color: '#a3a3a3', fontSize: '10px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span>{room.maxAdults || adults} adult</span> |
                            <span>{room.quantity} {room.quantity > 1 ? 'rooms' : 'room'}</span> |
                            <span>{room.nights} {room.nights > 1 ? 'nights' : 'night'}</span>
                          </div>
                          <div style={{ color: '#3DA3A8', fontSize: '12px', fontWeight: 600 }}>
                            PKR {(room.totalWithTaxNightly * room.quantity * room.nights).toLocaleString()}
                          </div>
                        </div>
                        
                        {/* Collapsible Pricing Details */}
                        {expandedRooms[index] && (
                          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #333' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '12px', marginBottom: '2px' }}>
                              <span>Room Subtotal:</span>
                              <span>PKR {(room.basePriceNightly * room.quantity * room.nights).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '10px', marginBottom: '2px' }}>
                              <span>Taxes ({room.taxes && room.taxes[0] ? room.taxes[0].displayValue || `${Math.round((room.taxAmount / room.basePriceNightly) * 100)}%` : `${Math.round((room.taxAmount / room.basePriceNightly) * 100)}%`}):</span>
                              <span>PKR {(room.taxAmount * room.quantity * room.nights).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3DA3A8', fontSize: '12px', fontWeight: 600, marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #333' }}>
                              <span>Total Room Amount:</span>
                              <span>PKR {(room.totalWithTaxNightly * room.quantity * room.nights).toLocaleString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Section Here */}
                <div style={{ backgroundColor: '#1a1a1a', padding: '20px', marginTop: '15px', borderRadius: '4px', border: '1px solid #333' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#ffffff', fontSize: '15px' }}>Reservation Subtotal</span>
                    <span style={{ color: '#3DA3A8', fontSize: '12px', fontWeight: 600 }}>
                      PKR {totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: '#ffffff', fontSize: '13px' }}>Taxes</span>
                    <span style={{ color: '#3DA3A8', fontSize: '12px', fontWeight: 600 }}>
                      PKR {totals.tax.toLocaleString()}
                    </span>
                  </div>
                  
                  <div style={{ borderTop: '1px solid #333', paddingTop: '15px', marginTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600 }}>Total Reservation</span>
                      <span style={{ color: '#3DA3A8', fontSize: '16px', fontWeight: 700 }}>
                        PKR {totals.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                      style={{
                        flex: 1,
                        backgroundColor: '#3DA3A8',
                        border: 'none',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2c8a8f'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3DA3A8'}
                      onClick={() => {
                        // Navigate back to search results with current parameters to add another room
                        const queryParams = new URLSearchParams({
                          CheckIn: incomingSearchData?.checkIn || searchParams.get('CheckIn'),
                          CheckOut: incomingSearchData?.checkOut || searchParams.get('CheckOut'),
                          Adults: String(incomingSearchData?.adults || searchParams.get('Adults') || adults),
                          Children: String(incomingSearchData?.children || searchParams.get('Children') || children),
                          NoOfRooms: '1', // Default to 1 room for new selection
                          addingRoom: 'true' // Flag to indicate adding another room
                        });

                        navigate(`/search-results?${queryParams.toString()}`);
                      }}
                    >
                      ADD ANOTHER ROOM
                    </button>
                    <button
                      style={{
                        flex: 1,
                        backgroundColor: '#555',
                        border: 'none',
                        color: '#fff',
                        padding: '12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#666'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#555'}
                      onClick={() => navigate('/')}
                    >
                      START OVER
                    </button>
                  </div>
                </div>

                </div>
              </div>
            </div>
          </div>
        </section>

      {showPaymentGateway ? (
        <section className="section-padding" style={{ paddingTop: '0' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card" style={{ padding: '30px', borderRadius: '8px' }}>
                  <PaymentGateway
                    paymentData={paymentData}
                    onError={(message) => setError(message || 'Unable to continue to payment gateway.')}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default SintraReservation;
