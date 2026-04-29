import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Container, Typography, Stepper, Step, StepLabel, Paper, Grid,
  Card, CardContent, Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Radio, RadioGroup, FormControlLabel, FormLabel, Divider,
  IconButton, Alert, Stack, CircularProgress
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import PaymentGateway from '../components/PaymentGateway';
import { getRoomRates, getRoomTypesRoomsManagement, getRoomTaxesByRoomTypeId } from '../services/api';
import Seo from '../components/Seo';
import { apiConfig } from '../config/api';

const toLocalYmd = (value) => {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const normalizeYmd = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const split = value.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(split)) return split;
  }
  return toLocalYmd(value);
};

const addDaysYmd = (ymd, days) => {
  if (!ymd) return '';
  const parts = String(ymd).split('-');
  if (parts.length !== 3) return '';
  const yyyy = Number(parts[0]);
  const mm = Number(parts[1]);
  const dd = Number(parts[2]);
  if (!yyyy || !mm || !dd) return '';
  const base = new Date(yyyy, mm - 1, dd);
  if (Number.isNaN(base.getTime())) return '';
  base.setDate(base.getDate() + days);
  return toLocalYmd(base);
};

const Reservation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // room/search data (from router state or query)
  const roomFromState = location.state?.room;
  const searchData   = location.state?.searchData || {};

  const fallbackCheckIn = toLocalYmd(new Date());
  const fallbackCheckOut = addDaysYmd(fallbackCheckIn, 1);

  const [reservationData, setReservationData] = useState({
    room: roomFromState || null,
    checkIn: normalizeYmd(searchParams.get('checkIn')) || normalizeYmd(searchData.checkIn) || fallbackCheckIn,
    checkOut: normalizeYmd(searchParams.get('checkOut')) || normalizeYmd(searchData.checkOut) || fallbackCheckOut,
    adults: parseInt(searchParams.get('adults')) || searchData.adults || 1,
    children: parseInt(searchParams.get('children')) || searchData.children || 0,
    rooms: parseInt(searchParams.get('rooms')) || searchData.rooms || 1,
    selectedRooms: roomFromState ? [{ ...roomFromState, quantity: 1 }] : [],
    guestInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Pakistan',
      specialRequests: ''
    },
    paymentMethod: 'online-payment',
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    }
  });

  // Keep reservationData aligned with the URL query params and navigation state
  useEffect(() => {
    const spCheckIn = normalizeYmd(searchParams.get('checkIn'));
    const spCheckOut = normalizeYmd(searchParams.get('checkOut'));
    const stateCheckIn = normalizeYmd(searchData.checkIn);
    const stateCheckOut = normalizeYmd(searchData.checkOut);

    const nextCheckIn = spCheckIn || stateCheckIn || fallbackCheckIn;
    const nextCheckOut = spCheckOut || stateCheckOut || fallbackCheckOut;

    const nextAdults = parseInt(searchParams.get('adults')) || searchData.adults || 1;
    const nextChildren = parseInt(searchParams.get('children')) || searchData.children || 0;
    const nextRooms = parseInt(searchParams.get('rooms')) || searchData.rooms || 1;

    setReservationData((prev) => {
      const nextSelectedRooms =
        roomFromState && (!Array.isArray(prev.selectedRooms) || prev.selectedRooms.length === 0)
          ? [{ ...roomFromState, quantity: 1 }]
          : prev.selectedRooms;

      const nextRoom = roomFromState || prev.room;

      if (
        prev.checkIn === nextCheckIn &&
        prev.checkOut === nextCheckOut &&
        Number(prev.adults) === Number(nextAdults) &&
        Number(prev.children) === Number(nextChildren) &&
        Number(prev.rooms) === Number(nextRooms) &&
        prev.room === nextRoom &&
        prev.selectedRooms === nextSelectedRooms
      ) {
        return prev;
      }

      return {
        ...prev,
        room: nextRoom,
        checkIn: nextCheckIn,
        checkOut: nextCheckOut,
        adults: nextAdults,
        children: nextChildren,
        rooms: nextRooms,
        selectedRooms: nextSelectedRooms,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomFromState, location.key, searchParams]);

  // If we arrive with a selected plan, ensure Step 1 displays the plan-adjusted nightly price.
  useEffect(() => {
    if (!roomFromState) return;
    setReservationData((prev) => {
      const rooms = Array.isArray(prev.selectedRooms) ? prev.selectedRooms : [];
      if (!rooms.length) return prev;

      const nextRooms = rooms.map((r, idx) => {
        if (idx !== 0) return r;

        const baseNightly = Number(r?.basePriceNightly ?? r?.basePrice ?? r?.price ?? 0) || 0;
        const planSurcharge = getPlanPriceDelta(r?.selectedPlan, baseNightly);
        if (planSurcharge === 0) return r;
        const includesTax = (r?.includesTax ?? r?.IncludesTax) === true;
        const taxRate = Number(r?.taxRate ?? r?.TaxRate ?? 0) || 0;

        const baseWithPlan = Math.max(0, baseNightly + planSurcharge);
        const computedTax = includesTax ? 0 : (baseWithPlan * taxRate);
        const withTaxNightly = includesTax ? baseWithPlan : (baseWithPlan + computedTax);

        return {
          ...r,
          basePriceNightly: baseNightly,
          totalWithTaxNightly: withTaxNightly,
        };
      });

      return { ...prev, selectedRooms: nextRooms };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helpers
  const getPlanPriceDelta = (plan, roomBaseNightly = 0) => {
    if (!plan) return 0;

    if (plan.priceDelta != null || plan.PriceDelta != null) {
      return Number(plan.priceDelta ?? plan.PriceDelta ?? 0) || 0;
    }

    const adjustmentType = String(plan.priceAdjustmentType ?? plan.PriceAdjustmentType ?? 'more_expensive').toLowerCase();
    const differenceType = String(plan.priceDifferenceType ?? plan.PriceDifferenceType ?? 'amount').toLowerCase();
    const differenceValue = Number(plan.priceDifferenceValue ?? plan.PriceDifferenceValue ?? plan.basePrice ?? plan.BasePrice ?? 0) || 0;
    const rawDelta = differenceType === 'percentage'
      ? (Number(roomBaseNightly || 0) * differenceValue) / 100
      : differenceValue;

    return adjustmentType === 'cheaper' ? -rawDelta : rawDelta;
  };

  const calculateNights = () => {
    const inParts = String(reservationData.checkIn || '').split('-');
    const outParts = String(reservationData.checkOut || '').split('-');
    if (inParts.length !== 3 || outParts.length !== 3) return 1;
    const checkIn = new Date(Number(inParts[0]), Number(inParts[1]) - 1, Number(inParts[2]));
    const checkOut = new Date(Number(outParts[0]), Number(outParts[1]) - 1, Number(outParts[2]));
    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return 1;
    const diffTime = Math.max(0, checkOut.getTime() - checkIn.getTime());
    return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  };

  const getRoomDisplayPrice = (room) => {
    // Prefer nightly values; fall back to any total that includes tax
    return room?.totalWithTaxNightly
      ?? room?.priceWithTax
      ?? room?.totalWithTax
      ?? room?.basePriceNightly
      ?? room?.basePrice
      ?? room?.price
      ?? 0;
  };

  const availableRoomTypesWithRates = availableRoomTypes.filter((rt) => {
    const price = getRoomDisplayPrice(rt);
    return Number(price || 0) > 0;
  });

  const calculateTotal = () => {
    const nights = calculateNights();
    if (!reservationData.selectedRooms?.length) {
      return { subtotal: 0, taxes: 0, total: 0, nights, taxBreakdown: [] };
    }

    let subtotal = 0;
    let totalWithTax = 0;

    reservationData.selectedRooms.forEach(room => {
      const roomBaseNightly = Number(room.basePriceNightly ?? room.basePrice ?? room.price ?? 0) || 0;
      const planSurcharge = getPlanPriceDelta(room?.selectedPlan, roomBaseNightly);
      const base = Math.max(0, roomBaseNightly + planSurcharge);
      const taxRate = Number(room?.taxRate ?? room?.TaxRate ?? 0) || 0;
      const includesTax = (room?.includesTax ?? room?.IncludesTax) === true;
      const computedTax = includesTax ? 0 : (base * taxRate);
      const withTax = includesTax ? base : (base + computedTax);
      const qty = room.quantity || 1;
      subtotal += base * nights * qty;
      totalWithTax += withTax * nights * qty;
    });

    const taxes = Math.max(0, totalWithTax - subtotal);

    const breakdownMap = new Map();
    reservationData.selectedRooms.forEach((room) => {
      if (!room?.taxBreakdown?.length) return;
      const qty = room.quantity || 1;
      room.taxBreakdown.forEach((t) => {
        const key = (t.name || 'Tax').toString();
        const prev = breakdownMap.get(key) || 0;
        breakdownMap.set(key, prev + (Number(t.amount || 0) * nights * qty));
      });
    });

    const taxBreakdown = Array.from(breakdownMap.entries()).map(([name, amount]) => ({ name, amount }));

    return { subtotal, taxes, total: totalWithTax, nights, taxBreakdown };
  };

  // Fetch available room types
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoadingRooms(true);
        const [roomTypesDataRaw, roomRatesDataRaw] = await Promise.all([
          getRoomTypesRoomsManagement(),
          getRoomRates()
        ]);

        const roomTypes = Array.isArray(roomTypesDataRaw)
          ? roomTypesDataRaw
          : (roomTypesDataRaw?.data || []);

        const roomRates = Array.isArray(roomRatesDataRaw)
          ? roomRatesDataRaw
          : (roomRatesDataRaw?.data || []);

        const toDateOnly = (v) => {
          if (!v) return null;
          const raw = normalizeYmd(v);
          if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            const [y, m, d] = raw.split('-').map((x) => Number(x));
            const local = new Date(y, m - 1, d);
            return Number.isNaN(local.getTime()) ? null : local;
          }
          const d = new Date(v);
          return Number.isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
        };

        const isWithin = (date, from, to) => {
          if (!date) return true;
          if (from && date < from) return false;
          if (to && date > to) return false;
          return true;
        };

        const checkInKey = (normalizeYmd(searchParams.get('checkIn')) || normalizeYmd(searchData.checkIn) || reservationData.checkIn);
        const checkInDate = toDateOnly(checkInKey);

        const checkOutKey = (normalizeYmd(searchParams.get('checkOut')) || normalizeYmd(searchData.checkOut) || reservationData.checkOut);
        const checkOutDate = toDateOnly(checkOutKey);
        const nights = (() => {
          if (!checkInDate || !checkOutDate) return 1;
          const diff = Math.max(0, checkOutDate - checkInDate);
          const computed = Math.round(diff / (1000 * 60 * 60 * 24));
          return computed > 0 ? computed : 1;
        })();

        const isRateBookable = (rate) => {
          if (!rate || !checkInDate || !checkOutDate) return true;

          const from = toDateOnly(rate.effectiveFrom || rate.EffectiveFrom || rate.validFrom);
          const to = toDateOnly(rate.effectiveTo || rate.EffectiveTo || rate.validTo);
          const minStay = rate.minStay ?? rate.MinStay ?? null;
          const maxStay = rate.maxStay ?? rate.MaxStay ?? null;
          const closedToArrival = rate.closedToArrival ?? rate.ClosedToArrival ?? false;
          const closedToDeparture = rate.closedToDeparture ?? rate.ClosedToDeparture ?? false;

          if (!isWithin(checkInDate, from, to) || !isWithin(checkOutDate, from, to)) return false;
          if (minStay && nights < Number(minStay)) return false;
          if (maxStay && nights > Number(maxStay)) return false;
          if (closedToArrival && from && checkInDate.getTime() !== from.getTime()) return false;
          if (closedToDeparture && to && checkOutDate.getTime() !== to.getTime()) return false;

          return true;
        };

        const getRateRoomTypeId = (rate) => {
          if (!rate) return null;
          return rate.roomTypeId ?? rate.RoomTypeId ?? rate.roomType?.id ?? rate.roomType?.Id ?? rate.RoomType?.Id ?? null;
        };

        const computeRoomTax = (basePrice, includesTax, taxesRaw) => {
          const taxes = Array.isArray(taxesRaw) ? taxesRaw : [];
          const breakdown = [];
          let taxTotal = 0;
          let percentSum = 0;

          taxes.forEach((t) => {
            const name = t.taxName ?? t.TaxName ?? 'Tax';
            const type = t.taxType ?? t.TaxType ?? 'Percentage';
            const valueRaw = t.taxValue ?? t.TaxValue ?? 0;
            const value = typeof valueRaw === 'number' ? valueRaw : parseFloat(valueRaw || '0');

            let amount = 0;
            if (includesTax) {
              amount = 0;
            } else if (String(type).toLowerCase() === 'percentage') {
              amount = (Number(basePrice || 0) * Number(value || 0)) / 100;
              percentSum += Number(value || 0);
            } else {
              amount = Number(value || 0);
            }
            taxTotal += amount;
            breakdown.push({ name, type, value, amount });
          });

          const totalWithTax = includesTax ? Number(basePrice || 0) : (Number(basePrice || 0) + taxTotal);
          return { taxTotal, taxBreakdown: breakdown, totalWithTax, percentSum };
        };

        const roomsWithPricing = await Promise.all(roomTypes.map(async (room) => {
          const roomNameKey = (room.roomTypeName || room.name || room.Name || '').toString().toLowerCase();
          const roomTypeId = room.roomTypeId ?? room.RoomTypeId ?? room.id ?? room.Id ?? null;
          const maxOccupancy = room.maxOccupancy ?? room.MaxOccupancy ?? null;
          const maximumAdults = room.maximumAdults ?? room.MaximumAdults ?? null;
          const maximumChildren = room.maximumChildren ?? room.MaximumChildren ?? null;
          const description = room.description ?? room.Description ?? '';

          const matchingRates = roomRates
            .filter((rate) => {
              const rateRoomTypeId = getRateRoomTypeId(rate);
              if (roomTypeId && rateRoomTypeId) return Number(rateRoomTypeId) === Number(roomTypeId);

              const rateRoomType = rate?.roomType;
              const rateKey = typeof rateRoomType === 'string'
                ? rateRoomType.toLowerCase()
                : (rateRoomType?.roomTypeName || rateRoomType?.name || rate.RoomType?.Name || '').toString().toLowerCase();
              return rateKey && rateKey === roomNameKey;
            })
            .filter((rate) => {
              const from = toDateOnly(rate.effectiveFrom || rate.EffectiveFrom || rate.validFrom);
              const to = toDateOnly(rate.effectiveTo || rate.EffectiveTo || rate.validTo);
              return isWithin(checkInDate, from, to);
            })
            .filter((rate) => isRateBookable(rate));

          const rateInfo = matchingRates[0];
          const minStay = room.minStay ?? room.MinStay ?? rateInfo?.minStay ?? rateInfo?.MinStay ?? null;
          const maxStay = room.maxStay ?? room.MaxStay ?? rateInfo?.maxStay ?? rateInfo?.MaxStay ?? null;
          const closedToArrival = room.closedToArrival ?? room.ClosedToArrival ?? rateInfo?.closedToArrival ?? rateInfo?.ClosedToArrival ?? false;
          const closedToDeparture = room.closedToDeparture ?? room.ClosedToDeparture ?? rateInfo?.closedToDeparture ?? rateInfo?.ClosedToDeparture ?? false;
          const restrictionMessage = room.restrictionMessage ?? room.RestrictionMessage ?? '';
          const basePrice = rateInfo?.baseRate ?? rateInfo?.BaseRate ?? room.basePrice ?? room.price ?? 0;

          const includesTax = (rateInfo?.includesTax ?? rateInfo?.IncludesTax) === true;
          const rateTaxPctRaw = rateInfo?.taxPercentage ?? rateInfo?.TaxPercentage;
          const taxRate = typeof rateTaxPctRaw === 'number'
            ? (rateTaxPctRaw / 100)
            : (parseFloat(rateTaxPctRaw || '0') / 100);

          let roomTaxPayload = null;
          try {
            if (roomTypeId) {
              roomTaxPayload = await getRoomTaxesByRoomTypeId(roomTypeId);
            }
          } catch (e) {
            roomTaxPayload = null;
          }

          const roomTaxRows = roomTaxPayload?.data ?? roomTaxPayload?.Data ?? roomTaxPayload?.success ? (roomTaxPayload?.data || []) : (roomTaxPayload || []);

          const taxFromRoomTax = computeRoomTax(basePrice, includesTax, roomTaxRows);

          const computedTaxRate = taxFromRoomTax.percentSum > 0
            ? (taxFromRoomTax.percentSum / 100)
            : (taxRate > 0 ? taxRate : 0);
          const fallbackTaxAmount = includesTax ? 0 : (basePrice * computedTaxRate);
          const fallbackTotalWithTax = includesTax ? basePrice : (basePrice + fallbackTaxAmount);

          const taxAmount = taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.taxTotal : fallbackTaxAmount;
          const totalWithTax = taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.totalWithTax : fallbackTotalWithTax;

          return {
            ...room,
            id: roomTypeId,
            roomTypeId,
            roomTypeName: room.roomTypeName || room.name || room.Name,
            description,
            maxOccupancy,
            maximumAdults,
            maximumChildren,
            minStay,
            maxStay,
            closedToArrival,
            closedToDeparture,
            restrictionMessage,
            basePrice,
            price: basePrice,
            includesTax,
            taxRate,
            taxAmount,
            totalWithTax,
            taxBreakdown: (taxFromRoomTax.taxTotal > 0 ? taxFromRoomTax.taxBreakdown : []),
            validFrom: rateInfo?.effectiveFrom ?? rateInfo?.EffectiveFrom ?? null,
            validTo: rateInfo?.effectiveTo ?? rateInfo?.EffectiveTo ?? null,
            rateName: rateInfo?.rateName ?? rateInfo?.RateName ?? room.roomTypeName ?? room.name,
            rateCode: rateInfo?.rateCode ?? rateInfo?.RateCode ?? null,
          };
        }));

        setAvailableRoomTypes(roomsWithPricing.filter((roomType) => {
          if (!roomType.rateName && !roomType.rateCode && !roomType.validFrom && !roomType.validTo) {
            return false;
          }

          const availableRooms = roomType.availableRooms ?? roomType.AvailableRooms;
          if (availableRooms !== undefined && Number(availableRooms) <= 0) {
            return false;
          }

          return true;
        }));
      } catch (error) {
        console.error('Error fetching room types:', error);
        setAvailableRoomTypes([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRoomTypes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // default demo room if none provided
    if (!roomFromState && !reservationData.room && reservationData.selectedRooms.length === 0) {
      setReservationData(prev => ({
        ...prev,
        selectedRooms: []
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setReservationData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value }}));
    } else {
      setReservationData(prev => ({ ...prev, [field]: value }));
    }
  };

  const removeRoom = (roomId) => {
    setReservationData(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.filter(r => r.id !== roomId)
    }));
  };

  const updateRoomQuantity = (roomId, quantity) => {
    if (quantity <= 0) return removeRoom(roomId);
    setReservationData(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.map(r => r.id === roomId ? { ...r, quantity } : r)
    }));
  };

  const addRoomType = (roomType) => {
    const exists = reservationData.selectedRooms.find(r => r.id === roomType.id);
    if (exists) {
      // Increase quantity if already selected
      updateRoomQuantity(roomType.id, exists.quantity + 1);
    } else {
      // Add new room type
      setReservationData(prev => ({
        ...prev,
        selectedRooms: [...prev.selectedRooms, { ...roomType, quantity: 1 }]
      }));
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep((prev) => prev + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(1, s - 1));
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStepValid = () => {
    if (step === 1) {
      return reservationData.selectedRooms.length > 0 && reservationData.checkIn && reservationData.checkOut;
    }
    if (step === 2) {
      const { firstName, lastName, email, phone } = reservationData.guestInfo;
      const validEmail = /\S+@\S+\.\S+/.test(email);
      const validPhone = phone?.trim().length >= 7;
      return Boolean(firstName && lastName && validEmail && validPhone);
    }
    if (step === 3 && reservationData.paymentMethod === 'credit-card') {
      const { cardNumber, expiryDate, cvv, cardholderName } = reservationData.paymentInfo;
      return cardNumber && expiryDate && cvv && cardholderName;
    }
    return true;
  };

  const totals = calculateTotal();
  const steps = ['Select Rooms', 'Guest Details', 'Payment'];

  // --- Key part: column order to match your screenshot ---
  // On Step 2, put SUMMARY on the LEFT and FORM on the RIGHT.
  const orders = step === 2
    ? { main: { xs: 1, lg: 2 }, summary: { xs: 2, lg: 1 } }
    : { main: { xs: 1, lg: 1 }, summary: { xs: 2, lg: 2 } };

  const handleCreateBooking = async () => {
    try {
      setProcessingPayment(true);

      const bookingRequest = {
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        rooms: reservationData.selectedRooms.map(room => ({
          roomId: room.id,
          quantity: room.quantity,
        })),
        guestInfo: reservationData.guestInfo,
        paymentMethod: reservationData.paymentMethod,
      };

      const apiBaseUrl = apiConfig?.baseURL;
      if (!apiBaseUrl) {
        throw new Error('Missing API base URL configuration');
      }

      const bookingResponse = await fetch(`${apiBaseUrl}/CustomerReservation/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest),
      });

      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.error('Booking API error:', errorText);
        throw new Error(`Failed to create booking: ${errorText}`);
      }

      const createdReservation = await bookingResponse.json();
      console.log('Reservation created:', createdReservation);

      if (reservationData.paymentMethod === 'credit-card') {
        const paymentRequest = {
          bookingId: createdReservation.id,
          paymentMethod: 'credit-card',
          paymentInfo: reservationData.paymentInfo,
        };

        const paymentResponse = await fetch(`${apiBaseUrl}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentRequest),
        });

        if (!paymentResponse.ok) {
          const errorText = await paymentResponse.text();
          console.error('Payment API error:', errorText);
          throw new Error(`Failed to process payment: ${errorText}`);
        }

        const paymentResponseJson = await paymentResponse.json();
        console.log('Payment data received:', paymentResponseJson);

        // Normalize keys from backend: paymentUrl/paymentData → PaymentUrl/PaymentData
        const normalizedPaymentData = {
          PaymentUrl: paymentResponseJson.PaymentUrl || paymentResponseJson.paymentUrl,
          PaymentData: paymentResponseJson.PaymentData || paymentResponseJson.paymentData,
          Token: paymentResponseJson.Token || paymentResponseJson.token,
          BasketId: paymentResponseJson.BasketId || paymentResponseJson.basketId,
        };

        console.log('Normalized payment data:', normalizedPaymentData);

        if (!normalizedPaymentData.PaymentUrl || !normalizedPaymentData.PaymentData) {
          throw new Error('Invalid payment data received from server');
        }
        
        setPaymentData(normalizedPaymentData);
        setShowPaymentGateway(true);
      } else {
        // For pay at hotel, go directly to thank you page
        navigate('/thank-you', { 
          state: { 
            reservationData: { ...reservationData, totals }, 
            paymentMethod: reservationData.paymentMethod,
            bookingResponse: createdReservation
          } 
        });
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(`Failed to create reservation: ${error.message}`);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Seo
        title="Reservation"
        description="Reserve your Luxury Hotel stay in minutes. Select dates and guests, choose your room, and confirm your booking securely online."
        keywords="Luxury Hotel reservation, book room Pakistan, online booking, check-in, check-out, secure reservation"
        author="Luxury Hotel"
      />
      <Box sx={{ 
        position: 'relative',
        pt: { xs: 10, md: 12 },
        pb: 4,
        background: 'linear-gradient(135deg, rgba(44, 90, 160, 0.95) 0%, rgba(102, 126, 234, 0.9) 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, px: 2 }}>
          {/* Header & Stepper */}
          <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: '14px', 
            border: '1px solid #e5e7eb', 
            background: '#fff',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
          }}>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1, fontSize: '26px', letterSpacing: '0.2px' }}>
            Complete Your Reservation
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 2.5 }}>
            Follow the steps below to secure your booking.
          </Typography>
          <Stepper activeStep={step - 1} connector={<Box sx={{ flex: 1, height: '2px', backgroundColor: '#e5e7eb', mx: 1.5 }} />}>
            {steps.map((label, idx) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <Box sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: idx < step ? '#2563eb' : '#e5e7eb',
                      color: idx < step ? '#fff' : '#374151',
                      fontSize: '13px',
                      fontWeight: 700,
                      boxShadow: idx < step ? '0 0 0 4px rgba(37, 99, 235, 0.25)' : 'none'
                    }}>
                      {idx + 1}
                    </Box>
                  )}
                  sx={{ '& .MuiStepLabel-label': { display: 'none' } }}
                />
              </Step>
            ))}
          </Stepper>
          </Paper>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4, px: 2 }}>
        <Grid container spacing={2.5} sx={{ alignItems: 'flex-start' }}>
          {/* SUMMARY column (LEFT) - Only show on Step 2 */}
          {step === 2 && (
            <Grid
              item
              xs={12}
              md={3.8}
              sx={{
                order: { xs: 2, md: 1 },
                display: 'block'
              }}
            >
              <Box sx={{ position: { md: 'sticky' }, top: { md: 88 }, height: '100%' }}>
                <Paper
                  sx={{
                    p: 2.5,
                    borderRadius: '14px',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.06)'
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25, fontSize: '18px' }}>Booking Summary</Typography>

                  {reservationData.selectedRooms.map(room => (
                    <Box key={room.id} sx={{ mb: 1.75, p: 1.75, border: '1px dashed #e5e7eb', borderRadius: '12px', background: '#fafafa' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#0f172a' }}>
                          {room.roomTypeName || room.name || 'Room'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {room.quantity} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>Rate (per night)</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          PKR {getRoomDisplayPrice(room).toLocaleString()}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>Total for stay</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                          PKR {(getRoomDisplayPrice(room) * room.quantity * calculateNights()).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1} sx={{ mb: 1.75 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Check-in</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>{reservationData.checkIn}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Check-out</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>{reservationData.checkOut}</Typography>
                    </Stack>
                  </Stack>

                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Subtotal</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>PKR {(totals.subtotal || 0).toLocaleString()}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>Taxes & Fees</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>PKR {(totals.taxes || 0).toLocaleString()}</Typography>
                    </Stack>
                    {Array.isArray(totals.taxBreakdown) && totals.taxBreakdown.length > 0 && (
                      <Box sx={{ mt: 0.5 }}>
                        {totals.taxBreakdown.map((t) => (
                          <Stack
                            key={t.name}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mt: 0.5 }}
                          >
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>{t.name}</Typography>
                            <Typography variant="caption" fontWeight={700} sx={{ color: '#0f172a' }}>
                              PKR {Number(t.amount || 0).toLocaleString()}
                            </Typography>
                          </Stack>
                        ))}
                      </Box>
                    )}
                    
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ 
                        mt: 1.75,
                        p: 1.25, 
                        borderRadius: '999px', 
                        background: '#f1f5ff',
                        border: '1px solid #dbe5ff',
                        color: '#0b1b56'
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>PKR {(totals.total || 0).toLocaleString()}</Typography>
                    </Stack>
                  </Stack>
                  <Typography variant="caption" sx={{ display: 'block', color: '#6b7280', mt: 1.25, fontSize: '13px' }}>
                    You can review your details on the next step before payment.
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          )}

          {/* MAIN column */}
          <Grid 
            item 
            xs={12} 
            md={step === 1 || step === 3 ? 12 : 8.2} 
            sx={{ 
              order: { xs: 1, md: step === 1 ? 1 : 2 },
              display: 'flex', 
              justifyContent: step === 1 ? 'center' : 'flex-end' 
            }}
          >
            {/* Step 1 */}
            {step === 1 && (
              <Box sx={{ width: '100%' }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Select Your Rooms</Typography>

                <Paper sx={{ p: 2, mb: 3, borderRadius: 2, backgroundColor: '#f9fafb', border: '1px dashed #e5e7eb' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarIcon fontSize="small" color="primary" />
                        <Typography fontWeight={600} variant="body2">
                          {reservationData.checkIn} → {reservationData.checkOut}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PeopleIcon fontSize="small" color="primary" />
                        <Typography fontWeight={600} variant="body2">
                          {reservationData.adults} Adults, {reservationData.children} Children
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon fontSize="small" color="primary" />
                        <Typography fontWeight={600} variant="body2">
                          {reservationData.rooms} Room{reservationData.rooms > 1 ? 's' : ''}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                <Grid container spacing={3}>
                  {/* LEFT: Available Room Categories */}
                  <Grid item xs={12} md={4.5} sx={{ alignSelf: 'flex-start' }}>
                    <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5e7eb', background: '#fff', height: '100%' }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#111827' }}>
                        Available Room Categories
                      </Typography>
                      {loadingRooms ? (
                        <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center', py: 4 }}>
                          Loading room types...
                        </Typography>
                      ) : (
                        <Stack spacing={1.5}>
                          {availableRoomTypes.filter(roomType => getRoomDisplayPrice(roomType) > 0).map(roomType => {
                            const isSelected = reservationData.selectedRooms.some(r => r.id === roomType.id);
                            return (
                              <Card 
                                key={roomType.id}
                                variant="outlined" 
                                sx={{ 
                                  borderRadius: 2,
                                  border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                  backgroundColor: isSelected ? '#eff6ff' : '#fff',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    borderColor: '#2563eb',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                                  }
                                }}
                                onClick={() => addRoomType(roomType)}
                              >
                                  <CardContent sx={{ p: 2 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#111827', mb: 0.5 }}>
                                          {roomType.roomTypeName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 1 }}>
                                          {roomType.description || 'Comfortable accommodation'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#2563eb', fontWeight: 700 }}>
                                          PKR {getRoomDisplayPrice(roomType).toLocaleString()} / night
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                          Max {roomType.maxOccupancy ?? roomType.maximumAdults ?? 2} guests
                                        </Typography>
                                      </Box>
                                      <IconButton 
                                        size="small" 
                                        sx={{ 
                                          backgroundColor: isSelected ? '#2563eb' : '#f3f4f6',
                                          color: isSelected ? '#fff' : '#6b7280',
                                          '&:hover': {
                                            backgroundColor: isSelected ? '#1d4ed8' : '#e5e7eb',
                                          }
                                        }}
                                      >
                                        <AddIcon fontSize="small" />
                                      </IconButton>
                                    </Stack>
                                  </CardContent>
                                </Card>
                            );
                          })}
                        </Stack>
                      )}
                    </Paper>
                  </Grid>

                  {/* RIGHT: Selected Rooms */}
                  <Grid item xs={12} md={7.5} sx={{ alignSelf: 'flex-start' }}>
                    <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e5e7eb', background: '#fff', minHeight: 400 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#111827' }}>
                        Selected Rooms ({reservationData.selectedRooms.length})
                      </Typography>
                      
                      {reservationData.selectedRooms.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Typography variant="body1" sx={{ color: '#9ca3af', mb: 1 }}>
                            No rooms selected yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            Click on room categories from the left to add them
                          </Typography>
                        </Box>
                      ) : (
                        <Stack spacing={2}>
                          {reservationData.selectedRooms.map(room => (
                            <Card key={room.id} variant="outlined" sx={{ borderRadius: 2, border: '2px solid #e5e7eb' }}>
                              <CardContent sx={{ p: 2.5 }}>
                                <Grid container spacing={2} alignItems="center">
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#111827' }}>
                                      {room.roomTypeName || room.name || 'Room'}
                                    </Typography>
                                    <Typography sx={{ color: '#2563eb', fontWeight: 700, mb: 0.5 }}>
                                      PKR {getRoomDisplayPrice(room).toLocaleString()} / night
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                      Total: PKR {(getRoomDisplayPrice(room) * room.quantity * calculateNights()).toLocaleString()}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <Stack direction="row" spacing={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }} alignItems="center">
                                      <Stack direction="row" spacing={1} alignItems="center" sx={{ 
                                        border: '1px solid #e5e7eb', 
                                        borderRadius: 2, 
                                        p: 0.5 
                                      }}>
                                        <IconButton size="small" onClick={() => updateRoomQuantity(room.id, room.quantity - 1)}>
                                          <RemoveIcon fontSize="small" />
                                        </IconButton>
                                        <Typography fontWeight={700} sx={{ minWidth: 32, textAlign: 'center' }}>
                                          {room.quantity}
                                        </Typography>
                                        <IconButton size="small" onClick={() => updateRoomQuantity(room.id, room.quantity + 1)}>
                                          <AddIcon fontSize="small" />
                                        </IconButton>
                                      </Stack>
                                      <IconButton 
                                        color="error" 
                                        onClick={() => removeRoom(room.id)}
                                        sx={{ 
                                          border: '1px solid #fee2e2',
                                          backgroundColor: '#fef2f2',
                                          '&:hover': {
                                            backgroundColor: '#fee2e2',
                                          }
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      )}

                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          onClick={handleNext} 
                          disabled={!isStepValid()} 
                          sx={{ 
                            borderRadius: 2, 
                            fontWeight: 700,
                            px: 4,
                            py: 1.5,
                            backgroundColor: '#2563eb',
                            '&:hover': {
                              backgroundColor: '#1d4ed8',
                            }
                          }}
                        >
                          Continue to Guest Details →
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 2 — Guest info (RIGHT on desktop) */}
            {step === 2 && (
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.06)',
                  maxWidth: '600px',
                  width: '100%'
                }}
              >
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: '18px' }}>Guest Information</Typography>
                <Grid container spacing={1.5}>
                  {/* Row 1: First Name, Last Name (2 fields) */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      First Name <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small"
                      name="reservation_firstName"
                      autoComplete="off"
                      value={reservationData.guestInfo.firstName}
                      onChange={(e) => handleInputChange('guestInfo', 'firstName', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Last Name <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small"
                      name="reservation_lastName"
                      autoComplete="off"
                      value={reservationData.guestInfo.lastName}
                      onChange={(e) => handleInputChange('guestInfo', 'lastName', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  
                  {/* Row 2: Email, Phone (2 fields) */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Email Address <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField 
                      fullWidth 
                      type="email" 
                      size="small"
                      name="reservation_email"
                      autoComplete="off"
                      value={reservationData.guestInfo.email}
                      onChange={(e) => handleInputChange('guestInfo', 'email', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Phone Number <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                    </Typography>
                    <TextField 
                      fullWidth 
                      type="tel" 
                      size="small"
                      name="reservation_phone"
                      autoComplete="off"
                      placeholder="+92 3XX XXXXXXX"
                      value={reservationData.guestInfo.phone}
                      onChange={(e) => handleInputChange('guestInfo', 'phone', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  
                  {/* Row 3: Address, City (2 fields) */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Address
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small"
                      name="reservation_address"
                      autoComplete="off"
                      value={reservationData.guestInfo.address}
                      onChange={(e) => handleInputChange('guestInfo', 'address', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      City
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small"
                      name="reservation_city"
                      autoComplete="off"
                      value={reservationData.guestInfo.city}
                      onChange={(e) => handleInputChange('guestInfo', 'city', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  
                  {/* Row 4: Country, Postal Code (2 fields) */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Country
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={reservationData.guestInfo.country}
                        onChange={(e) => handleInputChange('guestInfo', 'country', e.target.value)}
                        sx={{ borderRadius: '12px', '& .MuiSelect-select': { py: 0.75 } }}
                      >
                        <MenuItem value="Pakistan">Pakistan</MenuItem>
                        <MenuItem value="India">India</MenuItem>
                        <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                        <MenuItem value="United Arab Emirates">United Arab Emirates</MenuItem>
                        <MenuItem value="Saudi Arabia">Saudi Arabia</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Postal Code <Box component="span" sx={{ fontSize: '12px', color: '#9ca3af' }}>(optional)</Box>
                    </Typography>
                    <TextField 
                      fullWidth 
                      size="small"
                      name="reservation_postalCode"
                      autoComplete="off"
                      value={reservationData.guestInfo.postalCode || ''}
                      onChange={(e) => handleInputChange('guestInfo', 'postalCode', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>
                  
                  {/* Row 5: Special Requests (full width) */}
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280', fontSize: '13px' }}>
                      Special Requests <Box component="span" sx={{ fontSize: '12px', color: '#9ca3af' }}>(optional)</Box>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      name="reservation_specialRequests"
                      autoComplete="off"
                      placeholder="Allergies, etc."
                      value={reservationData.guestInfo.specialRequests}
                      onChange={(e) => handleInputChange('guestInfo', 'specialRequests', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputBase-input': { py: 0.75 } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', mt: 1.5 }}>
                      <Button 
                        variant="outlined" 
                        onClick={prevStep} 
                        sx={{ 
                          borderRadius: '999px', 
                          fontWeight: 600,
                          px: 2,
                          py: 1.5,
                          borderColor: '#e5e7eb',
                          color: '#1e3a8a',
                          background: '#eef2ff',
                          '&:hover': { borderColor: '#d1d5db', background: '#e0e7ff' }
                        }}
                      >
                        ← Back to Rooms
                      </Button>
                      <Button 
                        variant="contained" 
                        disabled={!isStepValid()} 
                        onClick={handleNext} 
                        sx={{ 
                          borderRadius: '999px', 
                          fontWeight: 600,
                          px: 2,
                          py: 1.5,
                          background: '#2563eb',
                          '&:hover': { background: '#1d4ed8' },
                          '&:disabled': { background: '#cbd5e1', color: '#64748b' }
                        }}
                      >
                        Continue to Payment →
                      </Button>
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', color: '#6b7280', mt: 1.25, fontSize: '13px' }}>
                      You can review your details on the next step before payment.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Step 3 - Payment with Booking Summary on Left */}
            {step === 3 && (
              <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                <Grid container spacing={3}>
                  {/* LEFT: Booking Summary */}
                  <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 1 } }}>
                    <Paper sx={{ p: 2.75, borderRadius: 3, border: '1px solid #e5e7eb', background: '#fff', position: 'sticky', top: 100 }}>
                      <Typography variant="h6" fontWeight={800} sx={{ mb: 2, fontSize: '17px' }}>Booking Summary</Typography>
                      
                      {reservationData.selectedRooms.map(room => (
                        <Box key={room.id} sx={{ mb: 1.5, pb: 1.5, borderBottom: '1px dashed #e5e7eb' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                              {room.roomTypeName || room.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                              PKR {getRoomDisplayPrice(room).toLocaleString()} / night
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              {room.quantity} × {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                            </Typography>
                            <Typography variant="caption" fontWeight={700} sx={{ color: '#0f172a' }}>
                              Total: PKR {(getRoomDisplayPrice(room) * room.quantity * calculateNights()).toLocaleString()}
                            </Typography>
                          </Stack>
                        </Box>
                      ))}

                      <Stack spacing={0.75} sx={{ mb: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>Check-in</Typography>
                          <Typography variant="caption" fontWeight={600}>{reservationData.checkIn}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>Check-out</Typography>
                          <Typography variant="caption" fontWeight={600}>{reservationData.checkOut}</Typography>
                        </Stack>
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Stack spacing={0.75}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>Subtotal</Typography>
                          <Typography variant="body2" fontWeight={600}>PKR {(totals.subtotal || 0).toLocaleString()}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>Taxes & Fees</Typography>
                          <Typography variant="body2" fontWeight={600}>PKR {(totals.taxes || 0).toLocaleString()}</Typography>
                        </Stack>
                        
                        <Stack 
                          direction="row" 
                          justifyContent="space-between" 
                          sx={{ 
                            mt: 1.5,
                            p: 1.25, 
                            borderRadius: 2, 
                            background: '#dbeafe',
                            border: '1px solid #93c5fd'
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e40af' }}>Total</Typography>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e40af' }}>PKR {(totals.total || 0).toLocaleString()}</Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* RIGHT: Payment Information */}
                  <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 2 } }}>
                    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb', background: '#fff' }}>
                      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2 }}>
                        <Box sx={{ width: 34, height: 34, borderRadius: 2, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <PaymentIcon fontSize="small" sx={{ color: '#4338ca' }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={800}>Payment Information</Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>Choose your preferred payment method and confirm.</Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>Payment Method</Typography>
                        <RadioGroup
                          value={reservationData.paymentMethod}
                          onChange={(e) => handleInputChange(null, 'paymentMethod', e.target.value)}
                        >
                          <FormControlLabel 
                            value="online-payment" 
                            control={<Radio />} 
                            label={<Stack direction="row" spacing={1} alignItems="center"><PaymentIcon fontSize="small" /><span>Online Payment</span></Stack>} 
                          />
                          <FormControlLabel 
                            value="credit-card" 
                            control={<Radio />} 
                            label={<Stack direction="row" spacing={1} alignItems="center"><CreditCardIcon fontSize="small" /><span>Credit Card</span></Stack>} 
                          />
                          <FormControlLabel value="manual" control={<Radio />} label="Pay at Hotel" />
                        </RadioGroup>
                      </Box>

                      {reservationData.paymentMethod === 'credit-card' && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280' }}>Cardholder Name</Typography>
                            <TextField 
                              fullWidth 
                              size="small"
                              placeholder="John Doe"
                              value={reservationData.paymentInfo.cardholderName}
                              onChange={(e) => handleInputChange('paymentInfo', 'cardholderName', e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280' }}>Card Number</Typography>
                            <TextField 
                              fullWidth 
                              size="small"
                              placeholder="1234 5678 9012 3456"
                              value={reservationData.paymentInfo.cardNumber}
                              onChange={(e) => handleInputChange('paymentInfo', 'cardNumber', e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280' }}>Expiry Date</Typography>
                            <TextField 
                              fullWidth 
                              size="small"
                              placeholder="MM/YY"
                              value={reservationData.paymentInfo.expiryDate}
                              onChange={(e) => handleInputChange('paymentInfo', 'expiryDate', e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#6b7280' }}>CVV</Typography>
                            <TextField 
                              fullWidth 
                              size="small"
                              placeholder="123"
                              value={reservationData.paymentInfo.cvv}
                              onChange={(e) => handleInputChange('paymentInfo', 'cvv', e.target.value)}
                              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                            />
                          </Grid>
                        </Grid>
                      )}

                      {reservationData.paymentMethod === 'online-payment' && (
                        <Alert severity="info" icon={<PaymentIcon />} sx={{ borderRadius: 2 }}>
                          You will be redirected to our secure payment gateway to complete your payment online.
                        </Alert>
                      )}

                      {reservationData.paymentMethod === 'manual' && (
                        <Alert severity="info" icon={<InfoIcon />} sx={{ borderRadius: 2 }}>
                          You can pay at the hotel during check-in. We accept cash, credit cards, and bank transfers.
                        </Alert>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                        <Button 
                          variant="outlined" 
                          onClick={prevStep} 
                          sx={{ 
                            borderRadius: '999px', 
                            fontWeight: 600,
                            px: 3,
                            borderColor: '#e5e7eb',
                            color: '#1e3a8a',
                            '&:hover': { borderColor: '#d1d5db', background: '#f9fafb' }
                          }}
                        >
                          ← Back
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={processingPayment}
                          sx={{
                            borderRadius: '999px', 
                            fontWeight: 700,
                            px: 4,
                            background: 'linear-gradient(135deg,#10b981 0%,#059669 100%)',
                            '&:hover': { background: 'linear-gradient(135deg,#059669 0%,#047857 100%)' },
                            '&:disabled': { background: '#cbd5e1', color: '#64748b' }
                          }}
                        >
                          {processingPayment ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                              <CircularProgress size={16} color="inherit" />
                              <span>Processing...</span>
                            </Stack>
                          ) : (
                            <>
                              {reservationData.paymentMethod === 'online-payment' ? '💳 Pay Online' : 
                               reservationData.paymentMethod === 'credit-card' ? '🔒 Complete Payment' : 
                               '✅ Confirm Booking'}
                            </>
                          )}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>

                </Grid>
              </Box>
            )}

            {/* Payment Gateway Modal */}
            {showPaymentGateway && paymentData && (
              <Box sx={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 9999 
              }}>
                <Paper sx={{ 
                  p: 4, 
                  borderRadius: 3, 
                  maxWidth: 500, 
                  width: '90%', 
                  textAlign: 'center' 
                }}>
                  <PaymentGateway 
                    paymentData={paymentData}
                    onSuccess={() => {
                      setShowPaymentGateway(false);
                      navigate('/thank-you', { 
                        state: { 
                          reservationData, 
                          paymentMethod: reservationData.paymentMethod,
                          paymentStatus: 'success'
                        } 
                      });
                    }}
                    onError={(error) => {
                      setShowPaymentGateway(false);
                      alert(`Payment failed: ${error}`);
                    }}
                  />
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Reservation;
