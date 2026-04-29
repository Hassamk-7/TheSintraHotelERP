import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchRooms, getHotels, getRoomRates, getRoomTaxesByRoomTypeId, getApplicablePlans, getImageUrl } from '../services/api';
import { useCart } from '../context/CartContext';

const SintraSearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomSelections, setRoomSelections] = useState({});
  const [selectedPlans, setSelectedPlans] = useState({});
  const [ratePlanModal, setRatePlanModal] = useState({ roomId: null });
  const [activeGallery, setActiveGallery] = useState({ roomId: null, imageIndex: 0 });
  const [activeVideoRoom, setActiveVideoRoom] = useState(null);
  const heroBackgroundImage = '/img/slider/sub.png';

  const getParam = (legacyKey, modernKey, fallback = '') => {
    return searchParams.get(legacyKey) || searchParams.get(modernKey) || fallback;
  };

  const normalizeYmd = (value) => {
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '';

    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDisplayDate = (value) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    const yyyy = parsed.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const toDateOnly = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  };

  const legacySearchData = {
    checkIn: getParam('CheckIn', 'checkIn'),
    checkOut: getParam('CheckOut', 'checkOut'),
    adults: parseInt(getParam('Adults', 'adults', '1'), 10) || 1,
    children: parseInt(getParam('Children', 'children', '0'), 10) || 0,
    rooms: parseInt(getParam('NoOfRooms', 'rooms', '1'), 10) || 1
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError('');

        const checkInDate = normalizeYmd(legacySearchData.checkIn);
        const checkOutDate = normalizeYmd(legacySearchData.checkOut);

        const apiSearchData = {
          location: '',
          checkInDate,
          checkOutDate,
          adults: legacySearchData.adults,
          children: legacySearchData.children,
          rooms: legacySearchData.rooms
        };

        const [roomsDataRaw, ratesDataRaw, hotelsRaw] = await Promise.all([
          searchRooms(apiSearchData),
          getRoomRates(),
          getHotels()
        ]);

        const roomsData = Array.isArray(roomsDataRaw) ? roomsDataRaw : (roomsDataRaw?.data || []);
        const ratesData = Array.isArray(ratesDataRaw) ? ratesDataRaw : (ratesDataRaw?.data || []);
        const hotelsData = Array.isArray(hotelsRaw) ? hotelsRaw : (hotelsRaw?.data || []);

        const inDate = toDateOnly(checkInDate);
        const outDate = toDateOnly(checkOutDate);
        const nights = inDate && outDate ? Math.max(1, Math.round((outDate - inDate) / (1000 * 60 * 60 * 24))) : 1;

        const isWithin = (date, from, to) => {
          if (!date) return true;
          if (from && date < from) return false;
          if (to && date > to) return false;
          return true;
        };

        const getRateRoomTypeId = (rate) => rate?.roomTypeId ?? rate?.RoomTypeId ?? rate?.roomType?.id ?? rate?.roomType?.Id ?? rate?.RoomType?.Id ?? null;

        const resolveHotelId = (room) => {
          const direct = room.hotelId ?? room.HotelId ?? room.hotel?.id ?? room.hotel?.Id ?? null;
          if (direct) return direct;

          const location = (room.hotelLocation || room.HotelLocation || room.location || room.Location || '').toString().toLowerCase();
          if (!location) return null;

          const matched = hotelsData.find((hotel) => (hotel.city || hotel.City || '').toString().toLowerCase() === location);
          return matched?.id ?? matched?.Id ?? null;
        };

        const toImageUrl = (imagePath) => {
          if (!imagePath) return null;
          return getImageUrl(imagePath, 'roomtypes');
        };

        const getRoomImages = (room) => {
          const apiImages = room.Images ?? room.images ?? [];
          if (Array.isArray(apiImages) && apiImages.length > 0) {
            return apiImages.map((img) => toImageUrl(img)).filter(Boolean);
          }

          const imageList = room.roomPictures || room.RoomPictures || room.Images || room.images || [];
          if (Array.isArray(imageList) && imageList.length > 0) {
            return imageList.map((img) => toImageUrl(img)).filter(Boolean);
          }

          const uploadLikeImage = room.imgURL || room.ImgURL || room.imageName || room.ImageName;
          if (uploadLikeImage) {
            const resolved = toImageUrl(uploadLikeImage);
            return resolved ? [resolved] : [];
          }

          return [];
        };

        const getRoomImage = (room) => {
          const images = getRoomImages(room);
          if (images.length > 0) {
            return images[0];
          }

          const directImage = room.image || room.Image || room.picture || room.Picture || room.roomImage || room.RoomImage;
          if (directImage) {
            return directImage.startsWith('http') || directImage.startsWith('/') ? directImage : toImageUrl(directImage);
          }

          const uploadLikeImage = room.imgURL || room.ImgURL || room.imageName || room.ImageName;
          if (uploadLikeImage) {
            return toImageUrl(uploadLikeImage);
          }

          const roomName = (room.roomTypeName || room.name || '').toLowerCase();
          if (roomName.includes('executive') && roomName.includes('twin')) return '/img/rooms/30.jpg';
          if (roomName.includes('super deluxe')) return '/img/rooms/50.jpg';
          return '/img/rooms/60.jpg';
        };

        const computeTaxAmount = (baseRate, taxes) => {
          if (!Array.isArray(taxes)) return 0;
          return taxes.reduce((sum, tax) => {
            const type = (tax.taxType ?? tax.TaxType ?? '').toString().toLowerCase();
            const value = parseFloat(tax.taxValue ?? tax.TaxValue ?? 0) || 0;
            if (type === 'percentage') {
              return sum + ((baseRate * value) / 100);
            }
            return sum + value;
          }, 0);
        };

        const normalizeTaxRows = (taxes, baseRate) => {
          if (!Array.isArray(taxes)) return [];
          return taxes.map((tax, taxIndex) => {
            const type = (tax.taxType ?? tax.TaxType ?? '').toString().toLowerCase();
            const value = parseFloat(tax.taxValue ?? tax.TaxValue ?? 0) || 0;
            const label = tax.taxName ?? tax.TaxName ?? tax.name ?? `Tax ${taxIndex + 1}`;
            const amount = type === 'percentage' ? ((baseRate * value) / 100) : value;

            return {
              id: tax.id ?? tax.Id ?? `${label}-${taxIndex}`,
              label,
              type,
              value,
              displayValue: type === 'percentage' ? `${formatCurrency(value)}%` : `PKR ${formatCurrency(value)}`,
              amount
            };
          });
        };

        const normalizePlans = (plansPayload, baseRate) => {
          if (!Array.isArray(plansPayload) || plansPayload.length === 0) {
            return [
              {
                id: 'standard-plan',
                name: 'Select plan',
                description: 'Standard booking policy',
                pricePerNight: baseRate,
                extraAmount: 0,
                cancellationPolicy: 'Standard cancellation policy',
                mealPlan: 'Room Only',
                validFrom: '',
                validTo: ''
              }
            ];
          }

          return plansPayload.map((plan, planIndex) => {
            const priceDifferenceType = (plan.priceDifferenceType ?? plan.PriceDifferenceType ?? '').toString().toLowerCase();
            const priceAdjustmentRule = (plan.priceAdjustmentType ?? plan.PriceAdjustmentType ?? '').toString().toLowerCase();
            const rawBasePrice = parseFloat(plan.basePrice ?? plan.BasePrice ?? 0) || 0;
            const rawDifferenceValue = parseFloat(plan.priceDifferenceValue ?? plan.PriceDifferenceValue ?? plan.priceAdjustment ?? plan.PriceAdjustment ?? plan.additionalAmount ?? plan.AdditionalAmount ?? plan.rateDifference ?? plan.RateDifference ?? 0) || 0;
            const fallbackDifferenceAmount = ['%', 'percent', 'percentage'].includes(priceDifferenceType)
              ? ((baseRate * rawDifferenceValue) / 100)
              : rawDifferenceValue;
            const unsignedExtraAmount = rawBasePrice > 0 ? rawBasePrice : fallbackDifferenceAmount;
            const isNegative = priceAdjustmentRule.includes('cheap') || priceAdjustmentRule.includes('less') || priceAdjustmentRule.includes('discount') || priceAdjustmentRule.includes('lower');
            const extraAmount = isNegative ? (-1 * unsignedExtraAmount) : unsignedExtraAmount;
            const totalPerNight = baseRate + extraAmount;

            return {
              id: plan.id ?? plan.Id ?? `plan-${planIndex}`,
              name: plan.planName ?? plan.PlanName ?? plan.name ?? `Plan ${planIndex + 1}`,
              description: plan.description ?? plan.Description ?? plan.planDescription ?? 'Rate plan available for this room',
              pricePerNight: totalPerNight,
              extraAmount,
              cancellationPolicy: plan.cancellationPolicyDescription ?? plan.CancellationPolicyDescription ?? plan.cancellationPolicy ?? plan.CancellationPolicy ?? plan.termsAndConditions ?? plan.TermsAndConditions ?? plan.policy ?? plan.Policy ?? 'Standard cancellation policy',
              mealPlan: plan.mealPlan ?? plan.MealPlan ?? plan.boardType ?? plan.BoardType ?? (plan.isBreakfastIncluded || plan.IsBreakfastIncluded || plan.isLunchIncluded || plan.IsLunchIncluded || plan.isDinnerIncluded || plan.IsDinnerIncluded ? [
                (plan.isBreakfastIncluded || plan.IsBreakfastIncluded) ? 'Breakfast' : null,
                (plan.isLunchIncluded || plan.IsLunchIncluded) ? 'Lunch' : null,
                (plan.isDinnerIncluded || plan.IsDinnerIncluded) ? 'Dinner' : null
              ].filter(Boolean).join(' + ') : 'Room Only'),
              priceDifferenceType: priceDifferenceType || 'fixed',
              priceDifferenceValue: rawDifferenceValue,
              validFrom: plan.validFrom ?? plan.ValidFrom ?? plan.effectiveFrom ?? plan.EffectiveFrom ?? '',
              validTo: plan.validTo ?? plan.ValidTo ?? plan.effectiveTo ?? plan.EffectiveTo ?? ''
            };
          });
        };

        const enhancedRooms = await Promise.all(
          roomsData.map(async (room, index) => {
            const roomTypeId = room.roomTypeId ?? room.RoomTypeId ?? room.roomType?.id ?? room.roomType?.Id ?? null;
            const hotelId = resolveHotelId(room);
            const roomName = room.roomTypeName || room.name || room.roomName || `Room ${index + 1}`;

            const matchingRates = ratesData.filter((rate) => {
              const rateRoomTypeId = getRateRoomTypeId(rate);
              if (!roomTypeId || !rateRoomTypeId) return false;
              if (Number(rateRoomTypeId) !== Number(roomTypeId)) return false;
              const from = toDateOnly(rate.effectiveFrom || rate.EffectiveFrom || rate.validFrom);
              const to = toDateOnly(rate.effectiveTo || rate.EffectiveTo || rate.validTo);
              return isWithin(inDate, from, to);
            });

            const rateInfo = matchingRates[0] || {};
            const normalPrice = parseFloat(rateInfo.baseRate ?? rateInfo.BaseRate ?? room.price ?? room.basePrice ?? 0) || 0;
            const discountedPrice = parseFloat(rateInfo.discountedRate ?? rateInfo.DiscountedRate ?? normalPrice) || normalPrice;

            let taxRows = [];
            try {
              if (roomTypeId) {
                const taxPayload = await getRoomTaxesByRoomTypeId(roomTypeId);
                taxRows = taxPayload?.data ?? taxPayload?.Data ?? taxPayload ?? [];
              }
            } catch (taxError) {
              taxRows = [];
            }

            let plans = [];
            try {
              if (hotelId && roomTypeId) {
                const plansPayload = await getApplicablePlans({ hotelId, roomTypeId, checkInDate, checkOutDate });
                plans = Array.isArray(plansPayload) ? plansPayload : (plansPayload?.data || []);
              }
            } catch (planError) {
              plans = [];
            }

            const availableRooms = room.availableRooms ?? room.AvailableRooms ?? room.noOfRooms ?? room.NoOfRooms ?? legacySearchData.rooms;
            const normalizedPlans = normalizePlans(plans, discountedPrice);
            const selectedNightlyPrice = Number(discountedPrice || 0);
            const selectedExtraAmount = 0;
            const normalizedTaxes = normalizeTaxRows(taxRows, selectedNightlyPrice);
            const taxAmount = computeTaxAmount(selectedNightlyPrice, taxRows);

            return {
              id: room.id ?? room.Id ?? roomTypeId ?? index + 1,
              roomTypeId,
              name: roomName,
              image: getRoomImage(room),
              imgURL: room.imgURL ?? room.ImgURL ?? room.imageName ?? room.ImageName ?? '',
              images: getRoomImages(room),
              description: room.Description ?? room.description ?? '',
              price: normalPrice,
              discountedPrice: selectedNightlyPrice,
              baseRoomPrice: discountedPrice,
              roomsLeft: availableRooms,
              availableRooms,
              policy: 'Select plan',
              ratePolicy: 'Standard cancellation policy',
              mealPlan: 'Room Only',
              adultAllowed: room.adultAllowed ?? room.AdultAllowed ?? legacySearchData.adults,
              childAllowed: room.noOfChildAllowed ?? room.NoOfChildAllowed ?? legacySearchData.children,
              maxAdults: room.MaxAdults ?? room.maxAdults ?? room.MaximumAdults ?? room.maximumAdults ?? 0,
              maxChildren: room.MaxChildren ?? room.maxChildren ?? room.MaximumChildren ?? room.maximumChildren ?? 0,
              maxOccupancy: room.MaxOccupancy ?? room.maxOccupancy ?? legacySearchData.adults + legacySearchData.children,
              hotelLocation: room.HotelLocation ?? room.hotelLocation ?? '',
              bedType: room.BedType ?? room.bedType ?? '',
              roomSize: room.RoomSize ?? room.roomSize ?? '',
              viewType: room.ViewType ?? room.viewType ?? '',
              videoPath: room.VideoPath ?? room.videoPath ?? room.VideoLink ?? room.videoLink ?? '',
              restrictionMessage: room.RestrictionMessage ?? room.restrictionMessage ?? '',
              minStay: room.MinStay ?? room.minStay ?? null,
              maxStay: room.MaxStay ?? room.maxStay ?? null,
              nights,
              taxAmount,
              taxes: normalizedTaxes,
              plans: normalizedPlans,
              selectedPlanExtraAmount: selectedExtraAmount,
              selectedPlanId: null,
              totalWithTax: (selectedNightlyPrice + taxAmount) * nights,
              facilities: Array.isArray(room.Amenities ?? room.amenities) && (room.Amenities ?? room.amenities).length > 0
                ? (room.Amenities ?? room.amenities)
                : ['Free Parking', 'Free Wifi', 'Room Service', 'Family rooms', 'Restaurant', 'Breakfast']
            };
          })
        );

        const filteredRooms = enhancedRooms.filter((room) => Number(room.availableRooms) > 0);
        setRooms(filteredRooms);
        setRoomSelections(
          filteredRooms.reduce((acc, room) => {
            acc[room.id] = 1;
            return acc;
          }, {})
        );
      } catch (fetchError) {
        console.error('Failed to load search results:', fetchError);
        setError('Failed to load rooms. Please try again.');
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams]);

  const handleAddToCart = (roomId) => {
    const selectedRooms = roomSelections[roomId] || 1;
    const selectedRoom = rooms.find((room) => String(room.id) === String(roomId));
    const selectedPlanId = selectedPlans[roomId] || selectedRoom?.selectedPlanId;
    const selectedPlan = selectedRoom?.plans?.find((plan) => String(plan.id) === String(selectedPlanId)) || selectedRoom?.plans?.[0] || null;

    if (!selectedRoom) {
      alert('Room not found');
      return;
    }

    const roomData = {
      id: selectedRoom.id,
      name: selectedRoom.name,
      image: selectedRoom.image,
      price: selectedRoom.discountedPrice || selectedRoom.price,
      roomType: selectedRoom.name,
      maxOccupancy: selectedRoom.maxOccupancy,
      selectedPlan: selectedPlan,
      taxAmount: selectedRoom.taxAmount,
      nights: selectedRoom.nights
    };

    addToCart(roomData, legacySearchData.checkIn, legacySearchData.checkOut, selectedRooms);
    alert('Room added to cart successfully!');
  };

  const handleBookRoom = (roomId) => {
    const selectedRooms = roomSelections[roomId] || 1;
    const selectedRoom = rooms.find((room) => String(room.id) === String(roomId));
    const selectedPlanId = selectedPlans[roomId] || selectedRoom?.selectedPlanId;
    const selectedPlan = selectedRoom?.plans?.find((plan) => String(plan.id) === String(selectedPlanId)) || selectedRoom?.plans?.[0] || null;
    const queryParams = new URLSearchParams({
      roomId: String(roomId),
      CheckIn: legacySearchData.checkIn,
      CheckOut: legacySearchData.checkOut,
      Adults: String(legacySearchData.adults),
      Children: String(legacySearchData.children),
      NoOfRooms: String(selectedRooms)
    });

    navigate(`/reservation?${queryParams.toString()}`, {
      state: {
        rooms: selectedRoom
          ? [{
              ...selectedRoom,
              quantity: selectedRooms,
              selectedPlan,
              selectedPlanId: selectedPlan?.id ?? null,
              basePriceNightly: Number(selectedRoom.discountedPrice || selectedRoom.price || 0),
              totalWithTaxNightly: Number(selectedRoom.discountedPrice || selectedRoom.price || 0) + Number(selectedRoom.taxAmount || 0),
              taxBreakdown: Array.isArray(selectedRoom.taxes) ? selectedRoom.taxes : [],
              checkIn: legacySearchData.checkIn,
              checkOut: legacySearchData.checkOut,
              nights: Math.max(1, Math.round((new Date(legacySearchData.checkOut) - new Date(legacySearchData.checkIn)) / (1000 * 60 * 60 * 24))),
              maxAdults: legacySearchData.adults
            }]
          : [],
        room: selectedRoom
          ? {
              ...selectedRoom,
              quantity: selectedRooms,
              selectedPlan,
              selectedPlanId: selectedPlan?.id ?? null,
              basePriceNightly: Number(selectedRoom.discountedPrice || selectedRoom.price || 0),
              totalWithTaxNightly: Number(selectedRoom.discountedPrice || selectedRoom.price || 0) + Number(selectedRoom.taxAmount || 0),
              taxBreakdown: Array.isArray(selectedRoom.taxes) ? selectedRoom.taxes : []
            }
          : null,
        searchData: {
          checkIn: legacySearchData.checkIn,
          checkOut: legacySearchData.checkOut,
          adults: legacySearchData.adults,
          children: legacySearchData.children,
          rooms: selectedRooms
        }
      }
    });
  };

  const handleRoomCountChange = (roomId, maxRooms, delta) => {
    setRoomSelections((prev) => {
      const current = prev[roomId] || 1;
      const next = Math.min(Math.max(current + delta, 1), Math.max(parseInt(maxRooms, 10) || 1, 1));
      return {
        ...prev,
        [roomId]: next
      };
    });
  };

  const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  };

  const getSelectedRoomCount = (roomId) => roomSelections[roomId] || 1;

  const getSelectedPlan = (room) => {
    const selectedPlanId = selectedPlans[room.id] || room.selectedPlanId;
    return room.plans?.find((plan) => String(plan.id) === String(selectedPlanId)) || null;
  };

  const formatPlanDelta = (value) => {
    const amount = Number(value || 0);
    if (amount === 0) return 'PKR 0';
    return `${amount > 0 ? '+' : '-'}PKR ${formatCurrency(Math.abs(amount))}`;
  };

  const updateRoomPlan = (roomId, planId) => {
    setSelectedPlans((prev) => ({
      ...prev,
      [roomId]: planId
    }));

    setRooms((prevRooms) => prevRooms.map((room) => {
      if (String(room.id) !== String(roomId)) {
        return room;
      }

      const nextPlan = room.plans?.find((plan) => String(plan.id) === String(planId)) || room.plans?.[0];
      const nextNightlyPrice = Number(room.baseRoomPrice ?? room.discountedPrice ?? 0) || 0;
      const nextExtraAmount = Number(nextPlan?.extraAmount || 0);
      const taxableAmount = nextNightlyPrice + nextExtraAmount;
      const nextTaxes = Array.isArray(room.taxes)
        ? room.taxes.map((tax) => ({
            ...tax,
            amount: tax.type === 'percentage' ? ((taxableAmount * Number(tax.value || 0)) / 100) : Number(tax.value || 0)
          }))
        : [];
      const nextTaxAmount = nextTaxes.reduce((sum, tax) => sum + Number(tax.amount || 0), 0);

      return {
        ...room,
        discountedPrice: nextNightlyPrice,
        selectedPlanId: nextPlan?.id ?? null,
        selectedPlanExtraAmount: nextExtraAmount,
        policy: nextPlan?.name ?? room.policy,
        ratePolicy: nextPlan?.cancellationPolicy ?? room.ratePolicy,
        mealPlan: nextPlan?.mealPlan ?? room.mealPlan,
        taxes: nextTaxes,
        taxAmount: nextTaxAmount,
        totalWithTax: (taxableAmount + nextTaxAmount) * Number(room.nights || 1)
      };
    }));
  };

  const getDisplayAmounts = (room) => {
    const quantity = getSelectedRoomCount(room.id);
    const planExtra = Number(room.selectedPlanExtraAmount || 0) * quantity;
    return {
      originalTotal: Number(room.price || 0) * quantity,
      discountedTotal: Number(room.discountedPrice || 0) * quantity,
      planExtra,
      taxTotal: Number(room.taxAmount || 0) * quantity,
      totalWithTax: Number(room.totalWithTax || 0) * quantity
    };
  };

  const getGuestText = (room) => {
    const maxAdults = Number(room.maxAdults ?? 0) || 0;
    const maxChildren = Number(room.maxChildren ?? 0) || 0;

    if (maxAdults > 0 || maxChildren > 0) {
      return `${maxAdults} Adults, ${maxChildren} Children`;
    }

    return `${room.maxOccupancy} Guests Max`;
  };

  const openGallery = (roomId, imageIndex = 0) => {
    setActiveGallery({ roomId, imageIndex });
  };


  
  const closeGallery = () => {
    setActiveGallery({ roomId: null, imageIndex: 0 });
  };

  const changeGalleryImage = (direction) => {
    setActiveGallery((prev) => {
      const room = rooms.find((item) => String(item.id) === String(prev.roomId));
      const images = room?.images || [];
      if (!images.length) return prev;
      const nextIndex = (prev.imageIndex + direction + images.length) % images.length;
      return { ...prev, imageIndex: nextIndex };
    });
  };

  const getActiveGalleryRoom = () => rooms.find((item) => String(item.id) === String(activeGallery.roomId));

  const resolveVideoUrl = (videoPath) => {
    if (!videoPath) return '';
    if (videoPath.includes('youtube.com/watch?v=')) {
      return videoPath.replace('watch?v=', 'embed/');
    }
    if (videoPath.includes('youtu.be/')) {
      const videoId = videoPath.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : videoPath;
    }
    return videoPath;
  };

  const getFacilityColumns = (room) => {
    const fallback = ['Free Parking', 'Free Wifi', 'Room Service', 'Family rooms', 'Restaurant', 'Breakfast'];
    const source = Array.isArray(room.facilities) && room.facilities.length > 0 ? room.facilities : fallback;
    const normalized = source.slice(0, 6);

    while (normalized.length < 6) {
      normalized.push(fallback[normalized.length]);
    }

    return [
      [normalized[0], normalized[1]],
      [normalized[2], normalized[3]],
      [normalized[4], normalized[5]]
    ];
  };

  const facilityIconClass = (facilityName) => {
    const key = (facilityName || '').toLowerCase();
    if (key.includes('parking')) return 'flaticon-car';
    if (key.includes('wifi') || key.includes('wi-fi') || key.includes('internet')) return 'flaticon-wifi';
    if (key.includes('service')) return 'flaticon-hotel';
    if (key.includes('family') || key.includes('bed')) return 'flaticon-bed';
    if (key.includes('restaurant') || key.includes('food') || key.includes('cafe')) return 'flaticon-fast-food';
    if (key.includes('breakfast')) return 'flaticon-breakfast';
    return 'flaticon-check';
  };

  return (
    <>
      <div
        className="banner-header section-padding valign bg-img"
        data-overlay-dark="4"
        data-background={heroBackgroundImage}
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12 caption mt-90">
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
          <div className="row">
            <div className="col-md-12">
              <div className="mb-30" style={{ position: 'relative', zIndex: 3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ marginBottom: 0, fontSize: '15px', color: '#111827' }}>
                    <strong>Check-In:</strong> {formatDisplayDate(legacySearchData.checkIn)} &nbsp;|&nbsp; <strong>Check-Out:</strong> {formatDisplayDate(legacySearchData.checkOut)} &nbsp;|&nbsp; <strong>Adults:</strong> {legacySearchData.adults} &nbsp;|&nbsp; <strong>Children:</strong> {legacySearchData.children} &nbsp;|&nbsp; <strong>Rooms:</strong> {legacySearchData.rooms}
                  </p>
                </div>
              </div>
              
              {loading ? (
                <div className="text-center" style={{ padding: '50px 0' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p style={{ marginTop: '20px', color: '#666' }}>Loading rooms...</p>
                </div>
              ) : error ? (
                <div className="txt7">
                  <p>{error}</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="txt7">
                  <p>No room available. Please try another dates.</p>
                </div>
              ) : (
                rooms.map((room, index) => {
                  const isEven = index % 2 === 0;
                  const facilityColumns = getFacilityColumns(room);
                  const amounts = getDisplayAmounts(room);
                  const selectedPlan = getSelectedPlan(room);
                  const hasVideo = Boolean(room.videoPath);
                  return (
                    <div key={room.id} className={`rooms2 mb-90 ${isEven ? '' : 'left'}`}>
                      <figure>
                        <div className="property-img">
                          <img src={room.image} alt={room.name} className="img-fluid w-100" />
                          <div className="property-overlay">
                            {hasVideo ? (
                              <div className="vid-area" style={{ marginRight: '10px' }}>
                                <button
                                  type="button"
                                  className="overlay-link property-video"
                                  onClick={() => setActiveVideoRoom(room)}
                                  style={{ background: 'transparent', border: 0, color: '#fff' }}
                                >
                                  <i className="fa fa-video-camera"></i>
                                </button>
                              </div>
                            ) : null}
                            <div className="property-magnify-gallery">
                              <button
                                type="button"
                                className="overlay-link"
                                onClick={() => openGallery(room.id, 0)}
                                style={{ background: 'transparent', border: 0, color: '#fff' }}
                              >
                                <i className="fa fa-expand"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className={isEven ? 'top-rightt-text' : 'top-left-text'}>
                          Hurry! {room.roomsLeft} Rooms Left
                        </div>
                      </figure>
                      <div className="caption">
                        <div className="room-row">
                          <h4><a href="/rooms">{room.name}</a></h4>
                          <h3>
                            Policy:
                            <span className="tooltip">
                              {selectedPlan?.name || room.policy} <i className="fa fa-info-circle" aria-hidden="true"></i>
                              <div className="tooltiptext color-2">
                                <p><b>Policy: </b><span>{selectedPlan?.name || room.policy}</span></p>
                                <p><b>Meal Plan: </b><span>{selectedPlan?.mealPlan || room.mealPlan || 'Room Only'}</span></p>
                                <p><b>Cancellation Policy: </b><span>{selectedPlan?.cancellationPolicy || room.ratePolicy}</span></p>
                              </div>
                            </span>
                          </h3>
                        </div>

                       

                        {/* Check-In/Check-Out Dates */}
                        {/* <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          Stay: {formatDisplayDate(legacySearchData.checkIn)} to {formatDisplayDate(legacySearchData.checkOut)}
                        </p> */}

                        <div className="row room-facilities">
                          <div className="col-md-4">
                            <ul>
                              <li><i className={facilityIconClass(facilityColumns[0][0])}></i> {facilityColumns[0][0]}</li>
                              <li><i className={facilityIconClass(facilityColumns[0][1])}></i> {facilityColumns[0][1]}</li>
                            </ul>
                          </div>
                          <div className="col-md-4">
                            <ul>
                              <li><i className={facilityIconClass(facilityColumns[1][0])}></i> {facilityColumns[1][0]}</li>
                              <li><i className={facilityIconClass(facilityColumns[1][1])}></i> {facilityColumns[1][1]}</li>
                            </ul>
                          </div>
                          <div className="col-md-4">
                            <ul>
                              <li><i className={facilityIconClass(facilityColumns[2][0])}></i> {facilityColumns[2][0]}</li>
                              <li><i className={facilityIconClass(facilityColumns[2][1])}></i> {facilityColumns[2][1]}</li>
                            </ul>
                          </div>
                        </div>
                        
                         {/* Rate Plan Section */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          {/* <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Rate plan</p>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#2563eb', marginBottom: 0 }}>{selectedPlan?.name || 'Select plan'}</p>
                          </div> */}
                          <div className="col-sm d-none d-sm-block">
                          <div className="room-counter">
                            <h3>Add Rooms:</h3>
                            <div className="counter-buttons">
                              <button
                                type="button"
                                onClick={() => handleRoomCountChange(room.id, room.roomsLeft, -1)}
                                style={{ width: '25px', height: '30px', fontSize: '18px', border: '0', backgroundColor: '#3DA3A8', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', color: 'white' }}
                              >
                                -
                              </button>
                              <input type="text" readOnly value={roomSelections[room.id] || 1} />
                              <button
                                type="button"
                                onClick={() => handleRoomCountChange(room.id, room.roomsLeft, 1)}
                                style={{ width: '25px', height: '30px', fontSize: '18px', border: '0', backgroundColor: '#3DA3A8', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', color: 'white' }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                             <div className="col-sm d-block d-sm-none">
                          <div className="room-counter">
                            <h3>Add Rooms:</h3>
                            <div className="counter-buttons">
                              <button
                                type="button"
                                onClick={() => handleRoomCountChange(room.id, room.roomsLeft, -1)}
                                style={{ width: '25px', height: '30px', fontSize: '18px', border: '0', backgroundColor: '#3DA3A8', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', color: 'white' }}
                              >
                                -
                              </button>
                              <input type="text" readOnly value={roomSelections[room.id] || 1} />
                              <button
                                type="button"
                                onClick={() => handleRoomCountChange(room.id, room.roomsLeft, 1)}
                                style={{ width: '25px', height: '30px', fontSize: '18px', border: '0', backgroundColor: '#3DA3A8', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', color: 'white' }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                          {room.plans?.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => setRatePlanModal({ roomId: room.id })}
                              style={{ border: '1px solid #d1d5db', background: '#fff', color: '#2563eb', fontSize: '13px', fontWeight: 500, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}
                            >
                              More rates
                            </button>
                          ) : null}
                        </div>
                        
                        {/* Room Price and Tax Section */}
                        <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                          {/* Room Price Section */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                            <span>Room Price</span>
                            <span>PKR {formatCurrency(amounts.discountedTotal)}</span>
                          </div>
                          
                          {/* Tax Section */}
                          {Array.isArray(room.taxes) && room.taxes.length > 0 ? room.taxes.map((tax) => (
                            <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#666' }}>
                              <span>{tax.label} ({tax.displayValue})</span>
                              <span>PKR {formatCurrency(Number(tax.amount || 0) * getSelectedRoomCount(room.id))}</span>
                            </div>
                          )) : null}
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, paddingTop: '6px', borderTop: '1px solid #e5e7eb' }}>
                            <span>Total with Tax</span>
                            <span style={{ color: '#2563eb' }}>PKR {formatCurrency(amounts.totalWithTax)}</span>
                          </div>
                        </div>

                        <div className="info-wrapper d-flex justify-content-between align-items-center">
                          <div className="more">
                            <h3><i className="flaticon-group"></i> <span>{getGuestText(room)}</span></h3>
                          </div>
                          <div className="d-flex gap-2">
                            <div className="butn-dark">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(room.id)}
                                style={{ backgroundColor: '#2563eb', border: '1px solid #2563eb', padding: '12px 20px', cursor: 'pointer', color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '11px', fontWeight: 600 }}
                              >
                                <span>Add to Cart</span>
                              </button>
                            </div>
                            <div className="butn-dark">
                              <button
                                type="button"
                                onClick={() => handleBookRoom(room.id)}
                                style={{ backgroundColor: '#3da3a8', border: '1px solid #3da3a8', padding: '12px 30px', cursor: 'pointer', color: '#fff', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px', fontWeight: 600 }}
                              >
                                <span>Book Now</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {getActiveGalleryRoom() ? (
        <div
          onClick={closeGallery}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: '900px', textAlign: 'center' }}
          >
            <button type="button" onClick={closeGallery} style={{ position: 'absolute', top: '-18px', right: '-4px', background: 'transparent', color: '#fff', border: 0, fontSize: '40px', zIndex: 2 }}>×</button>
            <img
              src={getActiveGalleryRoom().images?.[activeGallery.imageIndex] || getActiveGalleryRoom().image}
              alt={getActiveGalleryRoom().name}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', border: '2px solid #fff' }}
            />
            {(getActiveGalleryRoom().images?.length || 0) > 1 ? (
              <>
                <button type="button" onClick={() => changeGalleryImage(-1)} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid #fff', width: '44px', height: '44px', fontSize: '28px' }}>‹</button>
                <button type="button" onClick={() => changeGalleryImage(1)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid #fff', width: '44px', height: '44px', fontSize: '28px' }}>›</button>
              </>
            ) : null}
            <div style={{ color: '#fff', textAlign: 'left', marginTop: '8px', fontSize: '14px' }}>{getActiveGalleryRoom().name}</div>
          </div>
        </div>
      ) : null}

      {activeVideoRoom ? (
        <div
          onClick={() => setActiveVideoRoom(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: '960px', backgroundColor: '#fff' }}
          >
            <button type="button" onClick={() => setActiveVideoRoom(null)} style={{ position: 'absolute', top: '6px', right: '10px', background: 'transparent', color: '#333', border: 0, fontSize: '36px', zIndex: 2 }}>×</button>
            <div className="row g-0">
              <div className="col-lg-5">
                <div style={{ minHeight: '320px', background: '#111' }}>
                  <iframe
                    title={`${activeVideoRoom.name} video`}
                    src={resolveVideoUrl(activeVideoRoom.videoPath)}
                    allowFullScreen
                    style={{ width: '100%', height: '320px', border: 0 }}
                  />
                </div>
              </div>
              <div className="col-lg-7" style={{ padding: '26px' }}>
                <h2 style={{ color: '#2f93a0', marginBottom: '8px' }}>Sintra Hotel Islamabad</h2>
                <p style={{ marginBottom: '18px' }}>{activeVideoRoom.hotelLocation || 'Sintra Hotel, Islamabad'}</p>
                <h3 style={{ color: '#2f93a0', marginBottom: '10px' }}>Features</h3>
                <div className="row" style={{ marginBottom: '18px' }}>
                  {getFacilityColumns(activeVideoRoom).flat().map((facility, idx) => (
                    <div className="col-md-6" key={`${facility}-${idx}`} style={{ marginBottom: '8px' }}>
                      <i className={facilityIconClass(facility)}></i> {facility}
                    </div>
                  ))}
                </div>
                <h3 style={{ color: '#2f93a0', marginBottom: '10px' }}>{activeVideoRoom.name}</h3>
                <p style={{ marginBottom: 0 }}>{activeVideoRoom.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {ratePlanModal.roomId ? (
        <div
          onClick={() => setRatePlanModal({ roomId: null })}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', 
              maxWidth: '520px', 
              background: '#fff', 
              borderRadius: '16px', 
              boxShadow: '0 20px 50px rgba(15,23,42,0.25)', 
              overflow: 'hidden',
              margin: '10px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {(() => {
              const modalRoom = rooms.find((room) => String(room.id) === String(ratePlanModal.roomId));
              if (!modalRoom) return null;

              return (
                <>
                  <div style={{ padding: '14px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ marginBottom: '6px', color: '#111827' }}>Select a rate</h3>
                      <p style={{ marginBottom: 0, color: '#6b7280', fontSize: '14px' }}>{modalRoom.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRatePlanModal({ roomId: null })}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        fontSize: '24px', 
                        cursor: 'pointer', 
                        color: '#6b7280',
                        padding: '0',
                        lineHeight: '1',
                        minWidth: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.color = '#374151';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#6b7280';
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ padding: '0 14px 14px', overflowY: 'auto', flex: 1 }}>
                    {modalRoom.plans?.map((plan) => {
                      const isSelected = String((selectedPlans[modalRoom.id] || modalRoom.selectedPlanId || '')) === String(plan.id);
                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => {
                            updateRoomPlan(modalRoom.id, plan.id);
                            setRatePlanModal({ roomId: null });
                          }}
                          style={{ 
                            width: '100%', 
                            textAlign: 'left', 
                            border: isSelected ? '1px solid #2f58cd' : '1px solid #e5e7eb', 
                            background: isSelected ? '#f8fbff' : '#fff', 
                            borderRadius: '14px', 
                            padding: '12px 14px', 
                            marginBottom: '10px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{plan.name}</div>
                              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>{plan.description}</div>
                              <div style={{ fontSize: '11px', color: '#4b5563' }}>{plan.cancellationPolicy}</div>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Base PKR {formatCurrency(modalRoom.baseRoomPrice || modalRoom.discountedPrice || 0)}</div>
                              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>{formatPlanDelta(plan.extraAmount)}</div>
                              <div style={{ fontSize: '11px', color: '#6b7280' }}>/ night adjustment</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                      <button
                        type="button"
                        onClick={() => setRatePlanModal({ roomId: null })}
                        style={{ border: '0', background: '#2f58cd', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px' }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      ) : null}

    </>
  );
};

export default SintraSearchResults;
