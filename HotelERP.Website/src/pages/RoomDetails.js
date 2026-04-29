import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Users, Wifi, Car, Coffee, Tv, MapPin, Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Seo from '../components/Seo';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '',
    checkOut: ''
  });

  // Sample room data - in real app, this would come from API
  const roomsData = {
    1: {
      id: 1,
      name: 'Deluxe Studio',
      category: 'deluxe',
      price: 15000,
      location: 'Islamabad',
      rating: 4.8,
      reviews: 124,
      description: 'Experience luxury and comfort in our spacious Deluxe Studio. Perfect for couples or business travelers, featuring modern amenities and stunning city views.',
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: [
        { name: 'Free WiFi', icon: 'wifi', description: 'High-speed internet access' },
        { name: 'Air Conditioning', icon: 'ac', description: 'Climate control system' },
        { name: 'Room Service', icon: 'service', description: '24/7 room service available' },
        { name: 'Balcony', icon: 'balcony', description: 'Private balcony with city view' },
        { name: 'Flat Screen TV', icon: 'tv', description: '55" Smart TV with cable channels' },
        { name: 'Mini Bar', icon: 'minibar', description: 'Complimentary mini bar' },
        { name: 'Safe', icon: 'safe', description: 'In-room safety deposit box' },
        { name: 'Parking', icon: 'parking', description: 'Free parking space' }
      ],
      features: [
        'King-size bed with premium linens',
        'Marble bathroom with rain shower',
        'Work desk with ergonomic chair',
        'Complimentary breakfast',
        'Daily housekeeping',
        'Concierge service',
        'Fitness center access',
        'Swimming pool access'
      ],
      specifications: {
        size: '45 sqm',
        bedType: 'King Size',
        maxOccupancy: '2 Adults + 1 Child',
        view: 'City View',
        floor: '5th - 12th Floor'
      }
    },
    2: {
      id: 2,
      name: 'Executive Room',
      category: 'executive',
      price: 25000,
      location: 'Islamabad',
      rating: 4.9,
      reviews: 89,
      description: 'Indulge in our Executive Room featuring premium amenities, exclusive access to the executive lounge, and personalized service for the discerning traveler.',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: [
        { name: 'Free WiFi', icon: 'wifi', description: 'High-speed internet access' },
        { name: 'Air Conditioning', icon: 'ac', description: 'Climate control system' },
        { name: 'Butler Service', icon: 'butler', description: 'Personal butler service' },
        { name: 'City View', icon: 'view', description: 'Panoramic city views' },
        { name: 'Executive Lounge', icon: 'lounge', description: 'Access to executive lounge' },
        { name: 'Premium Amenities', icon: 'premium', description: 'Luxury toiletries and amenities' }
      ],
      features: [
        'King-size bed with Egyptian cotton linens',
        'Marble bathroom with jacuzzi',
        'Separate living area',
        'Executive lounge access',
        'Complimentary breakfast and evening cocktails',
        'Personal concierge',
        'Priority check-in/out',
        'Spa access'
      ],
      specifications: {
        size: '65 sqm',
        bedType: 'King Size',
        maxOccupancy: '2 Adults + 2 Children',
        view: 'City View',
        floor: '10th - 15th Floor'
      }
    },
    3: {
      id: 3,
      name: 'VVIP Suite',
      category: 'vvip',
      price: 45000,
      location: 'Islamabad',
      rating: 5.0,
      reviews: 45,
      description: 'The ultimate in luxury accommodation. Our VVIP Suite offers unparalleled comfort, exclusive amenities, and breathtaking views for the most discerning guests.',
      images: [
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: [
        { name: 'Free WiFi', icon: 'wifi', description: 'High-speed internet access' },
        { name: 'Air Conditioning', icon: 'ac', description: 'Climate control system' },
        { name: 'Butler Service', icon: 'butler', description: '24/7 personal butler' },
        { name: 'Ocean View', icon: 'ocean', description: 'Panoramic ocean views' },
        { name: 'Private Terrace', icon: 'terrace', description: 'Private outdoor terrace' },
        { name: 'Limousine Service', icon: 'limo', description: 'Complimentary airport transfer' }
      ],
      features: [
        'Master bedroom with king-size bed',
        'Separate living and dining areas',
        'Private terrace with outdoor seating',
        'Marble bathroom with steam shower',
        'Personal butler and concierge',
        'Complimentary limousine service',
        'Private dining options',
        'Exclusive spa treatments'
      ],
      specifications: {
        size: '120 sqm',
        bedType: 'King Size',
        maxOccupancy: '4 Adults + 2 Children',
        view: 'Ocean View',
        floor: 'Penthouse Level'
      }
    }
  };

  useEffect(() => {
    const roomData = roomsData[id];
    if (roomData) {
      setRoom(roomData);
    }
  }, [id]);

  const nextImage = () => {
    if (room) {
      setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const prevImage = () => {
    if (room) {
      setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
    }
  };

  const handleBookNow = () => {
    const queryParams = new URLSearchParams({
      room: room.id,
      checkIn: selectedDates.checkIn,
      checkOut: selectedDates.checkOut
    }).toString();
    navigate(`/reservation?${queryParams}`);
  };

  const getAmenityIcon = (iconType) => {
    const icons = {
      wifi: <Wifi size={20} />,
      tv: <Tv size={20} />,
      service: <Coffee size={20} />,
      parking: <Car size={20} />,
      ac: <div className="text-lg">❄️</div>,
      balcony: <div className="text-lg">🏠</div>,
      view: <div className="text-lg">🏙️</div>,
      ocean: <div className="text-lg">🌊</div>,
      butler: <div className="text-lg">🛎️</div>,
      safe: <div className="text-lg">🔒</div>,
      minibar: <div className="text-lg">🍷</div>,
      lounge: <div className="text-lg">🛋️</div>,
      premium: <div className="text-lg">✨</div>,
      terrace: <div className="text-lg">🌿</div>,
      limo: <div className="text-lg">🚗</div>
    };
    return icons[iconType] || <Check size={20} />;
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Seo
          title="Room Details"
          description="View room details, amenities, pricing, and availability."
          keywords="room details, hotel room, amenities, room price, book room"
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <Link to="/rooms" className="btn-primary">
            Browse All Rooms
          </Link>
        </div>
      </div>
    );
  }

  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Seo
        title={room?.name ? `${room.name}` : 'Room Details'}
        description={room?.description || 'View room details, amenities, pricing, and availability.'}
        keywords={`room details, ${room?.name || 'hotel room'}, hotel room, amenities, room price, book room`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li><Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li><Link to="/rooms" className="text-gray-500 hover:text-primary-600">Rooms</Link></li>
            <li><span className="text-gray-400">/</span></li>
            <li><span className="text-gray-900 font-medium">{room.name}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <img
                  src={room.images[currentImageIndex]}
                  alt={room.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {room.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Image Thumbnails */}
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{room.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{room.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 fill-current mr-1" />
                      <span>{room.rating} ({room.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    PKR {room.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500">per night</div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {room.description}
              </p>

              {/* Room Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {Object.entries(room.specifications).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="font-semibold text-gray-900">{value}</div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-primary-600 mt-1">
                        {getAmenityIcon(amenity.icon)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{amenity.name}</div>
                        <div className="text-sm text-gray-600">{amenity.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features & Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Book This Room</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={selectedDates.checkIn}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={today}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={selectedDates.checkOut}
                    onChange={(e) => setSelectedDates(prev => ({ ...prev, checkOut: e.target.value }))}
                    min={selectedDates.checkIn || today}
                    className="input-field"
                  />
                </div>
              </div>

              {selectedDates.checkIn && selectedDates.checkOut && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Room Rate</span>
                    <span className="font-medium">PKR {room.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Nights</span>
                    <span className="font-medium">
                      {Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary-600">
                        PKR {(room.price * Math.ceil((new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn)) / (1000 * 60 * 60 * 24))).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleBookNow}
                disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                Book Now
              </button>

              <div className="text-center text-sm text-gray-600">
                <p>Free cancellation up to 24 hours before check-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
