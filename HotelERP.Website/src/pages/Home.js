import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [rooms, setRooms] = useState('1');

  const applyBackgroundImages = () => {
    const elements = document.querySelectorAll('[data-background]');
    elements.forEach((element) => {
      const background = element.getAttribute('data-background');
      if (background) {
        element.style.backgroundImage = `url(${background})`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center center';
        element.style.backgroundRepeat = 'no-repeat';
      }
    });
  };

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setCheckInDate(formatDate(today));
    setCheckOutDate(formatDate(tomorrow));

    // Initialize jQuery plugins after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      applyBackgroundImages();

      if (window.$ && window.jQuery) {
        try {
          // Initialize Header Slider Carousel
          const headerCarousel = window.$('.header .owl-carousel');
          if (headerCarousel.length && typeof headerCarousel.owlCarousel === 'function') {
            if (headerCarousel.hasClass('owl-loaded')) {
              headerCarousel.trigger('destroy.owl.carousel');
              headerCarousel.removeClass('owl-loaded owl-hidden');
              headerCarousel.find('.owl-stage-outer').children().unwrap();
              headerCarousel.find('.owl-stage').children().unwrap();
            }

            headerCarousel.owlCarousel({
              loop: true,
              margin: 0,
              nav: true,
              dots: true,
              autoplay: true,
              autoplayTimeout: 5000,
              items: 1,
              animateOut: 'fadeOut'
            });
          }

          // Initialize Rooms Carousel
          const roomsCarousel = window.$('.rooms3 .owl-carousel');
          if (roomsCarousel.length && typeof roomsCarousel.owlCarousel === 'function') {
            if (roomsCarousel.hasClass('owl-loaded')) {
              roomsCarousel.trigger('destroy.owl.carousel');
              roomsCarousel.removeClass('owl-loaded owl-hidden');
              roomsCarousel.find('.owl-stage-outer').children().unwrap();
              roomsCarousel.find('.owl-stage').children().unwrap();
            }

            roomsCarousel.owlCarousel({
              loop: true,
              margin: 30,
              nav: true,
              dots: false,
              autoplay: false,
              responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 }
              }
            });
          }

          const testimonialsCarousel = window.$('.testimonials-box .owl-carousel');
          if (testimonialsCarousel.length && typeof testimonialsCarousel.owlCarousel === 'function') {
            if (testimonialsCarousel.hasClass('owl-loaded')) {
              testimonialsCarousel.trigger('destroy.owl.carousel');
              testimonialsCarousel.removeClass('owl-loaded owl-hidden');
              testimonialsCarousel.find('.owl-stage-outer').children().unwrap();
              testimonialsCarousel.find('.owl-stage').children().unwrap();
            }

            testimonialsCarousel.owlCarousel({
              loop: true,
              margin: 30,
              nav: false,
              dots: true,
              autoplay: true,
              items: 1
            });
          }

          const newsCarousel = window.$('.news .owl-carousel');
          if (newsCarousel.length && typeof newsCarousel.owlCarousel === 'function') {
            if (newsCarousel.hasClass('owl-loaded')) {
              newsCarousel.trigger('destroy.owl.carousel');
              newsCarousel.removeClass('owl-loaded owl-hidden');
              newsCarousel.find('.owl-stage-outer').children().unwrap();
              newsCarousel.find('.owl-stage').children().unwrap();
            }

            newsCarousel.owlCarousel({
              loop: true,
              margin: 30,
              nav: false,
              dots: true,
              autoplay: true,
              responsive: {
                0: { items: 1 },
                768: { items: 2 },
                1000: { items: 3 }
              }
            });
          }

          const clientsCarousel = window.$('.clients .owl-carousel');
          if (clientsCarousel.length && typeof clientsCarousel.owlCarousel === 'function') {
            if (clientsCarousel.hasClass('owl-loaded')) {
              clientsCarousel.trigger('destroy.owl.carousel');
              clientsCarousel.removeClass('owl-loaded owl-hidden');
              clientsCarousel.find('.owl-stage-outer').children().unwrap();
              clientsCarousel.find('.owl-stage').children().unwrap();
            }

            clientsCarousel.owlCarousel({
              loop: true,
              margin: 30,
              nav: false,
              dots: false,
              autoplay: true,
              responsive: {
                0: { items: 2 },
                768: { items: 3 },
                1000: { items: 3 }
              }
            });
          }

         const today = new Date();

window.$('#checkInDate').datepicker({
  dateFormat: 'mm/dd/yy',
  minDate: 0,
  onSelect: function (selectedDate) {
    // React state update
    setCheckInDate(selectedDate);

    // Next day calculate
    const date = window.$(this).datepicker('getDate');
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    // Set checkout minDate + value
    window.$('#checkOutDate').datepicker('option', 'minDate', nextDay);
    window.$('#checkOutDate').datepicker('setDate', nextDay);

    setCheckOutDate(
      `${String(nextDay.getMonth() + 1).padStart(2, '0')}/${String(nextDay.getDate()).padStart(2, '0')}/${nextDay.getFullYear()}`
    );
  }
});

window.$('#checkOutDate').datepicker({
  dateFormat: 'mm/dd/yy',
  minDate: 1,
  onSelect: function (selectedDate) {
    // React state update when user manually changes checkout date
    setCheckOutDate(selectedDate);
  }
});

          // Initialize select2
          const selects = window.$('.select2');
          if (selects.length && typeof selects.select2 === 'function') {
            selects.each(function () {
              if (window.$(this).data('select2')) {
                window.$(this).select2('destroy');
              }
            });
            selects.select2({
              minimumResultsForSearch: Infinity
            });
          }
        } catch (error) {
          console.warn('jQuery plugin initialization error:', error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup owl carousel on unmount
      if (window.$ && window.$('.owl-carousel').data('owl.carousel')) {
        window.$('.owl-carousel').trigger('destroy.owl.carousel');
      }
    };
  }, []);

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatDateForAPI = (dateString) => {
    // Convert mm/dd/yyyy to YYYY-MM-DD format
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSearch = () => {
    if (!checkInDate) {
      alert('Please select a Check-in date.');
      return;
    }
    if (!checkOutDate) {
      alert('Please select a Check-out date.');
      return;
    }
    
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut <= checkIn) {
      alert('Check-out date must be later than Check-in date.');
      return;
    }
    
    if (!adults || adults === '0') {
      alert('Please select the number of adults.');
      return;
    }
    
    if (!rooms || rooms === '0') {
      alert('Please select the number of rooms.');
      return;
    }

    // Convert dates to YYYY-MM-DD format for API compatibility
    const checkInFormatted = formatDateForAPI(checkInDate);
    const checkOutFormatted = formatDateForAPI(checkOutDate);

    const queryParams = new URLSearchParams({
      CheckIn: checkInFormatted,
      CheckOut: checkOutFormatted,
      Adults: adults,
      Children: children,
      NoOfRooms: rooms
    });

    navigate(`/SearchResult/SearchResults?${queryParams.toString()}`);
  };

  useEffect(() => {
    // Load weather widget script
    const script = document.createElement('script');
    script.src = 'https://weatherwidget.io/js/widget.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <header className="header slider-fade">
        <div className="owl-carousel owl-theme">
          <div className="text-center item bg-img" data-overlay-dark="2" data-background="/img/slider/home2.jpg" style={{ backgroundImage: 'url(/img/slider/home2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
            <div className="v-middle caption">
              <div className="container">
                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <span>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                    </span>
                    <h4>Your Luxury Escape in the Heart of Islamabad</h4>
                    <h1>Welcome to Sintra Hotel in Islamabad</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center item bg-img" data-overlay-dark="2" data-background="/img/slider/home1.jpg" style={{ backgroundImage: 'url(/img/slider/home1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
            <div className="v-middle caption">
              <div className="container">
                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <span>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                    </span>
                    <h4>Your Luxury Escape in the Heart of Islamabad</h4>
                    <h2 style={{ fontSize: '40px' }}>Welcome to Sintra Hotel in Islamabad</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center item bg-img" data-overlay-dark="3" data-background="/img/slider/home.jpg" style={{ backgroundImage: 'url(/img/slider/home.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
            <div className="v-middle caption">
              <div className="container">
                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <span>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                      <i className="star-rating"></i>
                    </span>
                    <h4>Your Luxury Escape in the Heart of Islamabad</h4>
                    <h2 style={{ fontSize: '40px' }}>Welcome to Sintra Hotel in Islamabad</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="reservation">
          <a href="tel:(051) 8736313">
            <div className="icon d-flex justify-content-center align-items-center">
              <i className="flaticon-call"></i>
            </div>
            <div className="call"><span>(051) 8736313</span> <br />Reservation</div>
          </a>
        </div>
      </header>

      <div className="booking-wrapper">
        <div className="container">
          <div className="booking-inner clearfix">
            <form className="form1 smScr clearfix">
              <div className="col1 c1">
                <div className="input1_wrapper">
                  <label>Check in</label>
                  <div className="input1_inner">
                    <input 
                      type="text" 
                      id="checkInDate" 
                      className="form-control input datepicker" 
                      placeholder="Check in"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col1 c2">
                <div className="input1_wrapper">
                  <label>Check out</label>
                  <div className="input1_inner">
                    <input 
                      type="text" 
                      id="checkOutDate" 
                      className="form-control input datepicker" 
                      placeholder="Check out"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="col2 c3">
                <div className="select1_wrapper">
                  <label>Adults</label>
                  <div className="select1_inner">
                    <select 
                      className="select2 select" 
                      style={{ width: '100%' }}
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                    >
                      <option value="1">1 Adult</option>
                      <option value="2">2 Adults</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col2 c4">
                <div className="select1_wrapper">
                  <label>Children</label>
                  <div className="select1_inner">
                    <select 
                      className="select2 select" 
                      style={{ width: '100%' }}
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                    >
                      <option value="0">Children</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                      <option value="4">4 Children</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col2 c5">
                <div className="select1_wrapper">
                  <label>Rooms</label>
                  <div className="select1_inner">
                    <select 
                      className="select2 select" 
                      style={{ width: '100%' }}
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                      <option value="4">4 Rooms</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col3 c6">
                <button type="button" onClick={handleSearch} className="btn-form1-submit">Check Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <a 
          className="weatherwidget-io" 
          href="https://forecast7.com/en/33d7373d09/islamabad/" 
          data-label_1="ISLAMABAD" 
          data-label_2="WEATHER" 
          data-theme="original" 
          data-basecolor="#2B6379" 
          data-highcolor="#fff" 
          data-lowcolor="#3DA3A8" 
          data-cloudfill="#3DA3A8" 
          data-raincolor="#3DA3A8"
        >
          ISLAMABAD WEATHER
        </a>
      </div>

      <section className="about section-padding" style={{ display: 'block', background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-30">
              <span>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
              </span>
              <div className="section-subtitle">Unmatched Elegance & Comfort</div>
              <h2 className="section-title">
                Enjoy a Luxury Stay at
                <br />
                Sintra Hotel Islamabad
              </h2>
              <p>
                Nestled in the vibrant heart of the capital, Sintra Hotel in Islamabad offers the perfect blend of luxury, 
                comfort, and convenience. Whether you're a family traveller, a tourist exploring the scenic beauty of the capital, 
                or a business professional attending meetings in the bustling Blue Area, Sintra Hotel Islamabad provides everything 
                you need for a memorable stay. With a prime location in Melody, our hotel in Islamabad is a tranquil retreat just 
                minutes away from key attractions, making it one of the best family and luxury hotels in Islamabad.
              </p>
              <div className="reservations">
                <div className="icon"><span className="flaticon-call"></span></div>
                <div className="text">
                  <p>Reservation</p> <a href="tel:(051) 8736313">(051) 8736313</a>
                </div>
              </div>
            </div>
            <div className="col col-md-3">
              <img src="/img/rooms/22.png" alt="sintra" className="mt-90 mb-30 img-fluid" />
            </div>
            <div className="col col-md-3">
              <img src="/img/rooms/33.png" alt="sintra" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      <section className="rooms3 section-padding bg-cream" data-scroll-index="1">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div>
                <div className="section-subtitle">Online Room Reservations</div>
                <h2 className="section-title">Islamabad Room Booking</h2>
                <p>
                  At Sintra Hotel Islamabad, we redefine luxury and comfort. Our elegantly designed rooms serve as a serene 
                  haven after a busy day of business meetings or sightseeing adventures. Each accommodation is equipped with 
                  modern amenities, including plush bedding, high-speed Wi-Fi, and round-the-clock room service. Whether you 
                  choose a deluxe room or a spacious suite, you'll experience unparalleled hospitality and personalized service. 
                  Your comfort is our priority, ensuring that every moment spent at Sintra Hotel in Islamabad is a truly relaxing 
                  and rejuvenating experience.
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="owl-carousel owl-theme">
                <div className="square-flip">
                  <div className="square bg-img" data-background="/img/rooms/60.jpg">
                    <span className="category">Book</span>
                    <div className="square-container d-flex align-items-end justify-content-end">
                      <div className="box-title">
                        <h4>Executive Room</h4>
                      </div>
                    </div>
                    <div className="flip-overlay"></div>
                  </div>
                  <div className="square2 bg-white">
                    <div className="square-container2">
                      <h4>Executive Room</h4>
                      <div className="row room-facilities mb-30">
                        <div className="col-md-6">
                          <ul>
                            <li><i className="flaticon-car"></i> Free Parking</li>
                            <li><i className="flaticon-wifi"></i> Free Wifi</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul>
                            <li><i className="flaticon-hotel"></i> Room Service</li>
                            <li><i className="flaticon-bed"></i> Family rooms</li>
                          </ul>
                        </div>
                      </div>
                      <div className="btn-line"><a href="#!">Book Now</a></div>
                    </div>
                  </div>
                </div>
                <div className="square-flip">
                  <div className="square bg-img" data-background="/img/rooms/50.jpg">
                    <span className="category">Book</span>
                    <div className="square-container d-flex align-items-end justify-content-end">
                      <div className="box-title">
                        <h4>Super Deluxe Room</h4>
                      </div>
                    </div>
                    <div className="flip-overlay"></div>
                  </div>
                  <div className="square2 bg-white">
                    <div className="square-container2">
                      <h4>Super Deluxe Room</h4>
                      <div className="row room-facilities mb-30">
                        <div className="col-md-6">
                          <ul>
                            <li><i className="flaticon-car"></i> Free Parking</li>
                            <li><i className="flaticon-wifi"></i> Free Wifi</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul>
                            <li><i className="flaticon-hotel"></i> Room Service</li>
                            <li><i className="flaticon-bed"></i> Family rooms</li>
                          </ul>
                        </div>
                      </div>
                      <div className="btn-line"><a href="#!">Book Now</a></div>
                    </div>
                  </div>
                </div>
                <div className="square-flip">
                  <div className="square bg-img" data-background="/img/rooms/30.jpg">
                    <span className="category">Book</span>
                    <div className="square-container d-flex align-items-end justify-content-end">
                      <div className="box-title">
                        <h4>Deluxe Twin Room</h4>
                      </div>
                    </div>
                    <div className="flip-overlay"></div>
                  </div>
                  <div className="square2 bg-white">
                    <div className="square-container2">
                      <h4>Deluxe Twin Room</h4>
                      <div className="row room-facilities mb-30">
                        <div className="col-md-6">
                          <ul>
                            <li><i className="flaticon-car"></i> Free Parking</li>
                            <li><i className="flaticon-wifi"></i> Free Wifi</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul>
                            <li><i className="flaticon-hotel"></i> Room Service</li>
                            <li><i className="flaticon-bed"></i> Family rooms</li>
                          </ul>
                        </div>
                      </div>
                      <div className="btn-line"><a href="#!">Book Now</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
