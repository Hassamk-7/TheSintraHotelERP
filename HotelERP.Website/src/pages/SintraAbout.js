import React, { useEffect, useMemo, useState } from 'react';
import Seo from '../components/Seo';

const accommodationCards = [
  {
    title: 'Spice Fusion Restaurant',
    image: '/img/pricing/3.jpg',
    text: 'Spice Fusion Restaurant at our Hotel offers a blend of traditional Pakistani and international cuisines in a cosy setting. Whether its breakfast, lunch, or dinner, the restaurant in Islamabad provides a diverse menu for all tastes. Perfect for family meals, business lunches, or romantic dinners.'
  },
  {
    title: 'Cafe SOIR',
    image: '/img/pricing/cafe.jpg',
    text: 'Cafe SOIR at our Hotel in Islamabad is a charming spot for coffee, pastries, and light snacks, ideal for a relaxed afternoon or casual meet-up. It offers a welcoming ambiance for both quick bites and leisurely conversations. Perfect for guests seeking a cosy retreat.'
  },
  {
    title: 'Business & Event Facilities',
    image: '/img/pricing/business.jpg',
    text: 'Sintra Hotel Islamabad offers modern business and event facilities with fully equipped conference rooms. Ideal for meetings, workshops, and corporate events, the facilities come with the latest technology and professional service. Our team ensures smooth and successful events.'
  },
  {
    title: 'Nearby Tourist Attractions',
    image: '/img/pricing/attractions.jpg',
    text: 'Located near Islamabad’s top attractions like Faisal Mosque and Daman-e-Koh, Sintra Hotel is perfect for exploring the city. Guests can easily visit popular cultural and natural landmarks. Whether for business or leisure, enjoy convenient access to these spots.'
  }
];

const chooseCards = [
  {
    title: 'Prime Location',
    image: '/img/team/prime location.jpg',
    text: 'Stay close to Islamabad’s top attractions and business centres, including Blue Area and Melody Market in the heart of the capital.'
  },
  {
    title: 'In-House Dining',
    image: '/img/team/in house dining.jpg',
    text: 'Enjoy a range of delicious meals at Spice Fusion Restaurant or unwind at Cafe SOIR located at Sintra Hotel Islamabad.'
  },
  {
    title: 'Business-Friendly',
    image: '/img/team/friendly busines.jpg',
    text: 'Host corporate events and gatherings in our modern conference rooms, designed for seamless business meetings.'
  },
  {
    title: 'Modern Amenities',
    image: '/img/team/modern amenities.jpg',
    text: 'Enjoy high-speed internet, flat-screen TVs, fully air-conditioned rooms, and 24/7 room service at Sintra Hotel Islamabad.'
  },
  {
    title: 'Easy Online Booking',
    image: '/img/team/2.jpg',
    text: 'Reserve your stay in minutes with our user-friendly online hotel booking system by Sintra Hotel Islamabad.'
  },
  {
    title: '24/7 Security',
    image: '/img/team/security.jpg',
    text: 'Enjoy your trip to Islamabad with peace of mind with round-the-clock security for a safe and comfortable stay.'
  }
];

const faqItems = [
  {
    question: 'How can I book a room online at Sintra Hotel Islamabad?',
    answer: 'You can easily book a room through our website’s online hotel booking system. Simply select your preferred dates, room type, and confirm your booking within minutes.'
  },
  {
    question: 'What types of rooms are available for booking at Sintra Hotel Islamabad?',
    answer: 'Sintra Hotel offers a range of luxury rooms and suites designed for family travellers, business professionals, and tourists. Our rooms are spacious, equipped with modern amenities, and available for short or extended stays.'
  },
  {
    question: 'What are the current hotel rates at Sintra Hotel in Islamabad?',
    answer: 'Our hotel rates in Islamabad vary based on room type and the duration of your stay. We recommend checking our website for up-to-date pricing or contacting our reservations team directly.'
  },
  {
    question: 'Does Sintra Hotel offer any family-friendly amenities?',
    answer: 'Yes, Sintra Hotel is ideal for families. We provide family suites, a children’s play area, and easy access to nearby tourist attractions, ensuring a comfortable stay for guests of all ages.'
  },
  {
    question: 'What are the dining options at Sintra Hotel Islamabad?',
    answer: 'We have two dining venues—Spice Fusion Restaurant, offering local and international dishes, and Cafe SOIR, perfect for coffee and snacks. Both offer delicious options for breakfast, lunch, and dinner.'
  },
  {
    question: 'What business facilities does Sintra Hotel provide for corporate travellers?',
    answer: 'Sintra Hotel offers modern business and event facilities, including conference rooms with state-of-the-art equipment. Ideal for meetings, workshops, and corporate events, we ensure a professional environment for business travellers.'
  },
  {
    question: 'How close is Sintra Hotel to popular tourist attractions in Islamabad?',
    answer: 'Our hotel is located near Islamabad’s top attractions, such as Faisal Mosque, Daman-e-Koh, and the Pakistan Monument. These landmarks are easily accessible, making Sintra Hotel a great choice for tourists.'
  },
  {
    question: 'Is there parking available at Sintra Hotel Islamabad?',
    answer: 'Yes, Sintra Hotel provides secure, on-site free parking for our guests, ensuring convenience and peace of mind during your stay.'
  },
  {
    question: 'How do I contact Sintra Hotel for more information or inquiries?',
    answer: 'You can contact us directly via phone, email, or through the contact form on our website. Our team is available 24/7 to assist with any inquiries or booking needs.'
  },
  {
    question: 'Are there any special offers or discounts available for Sintra Hotel bookings?',
    answer: 'Yes, we regularly offer promotions and discounts for our guests. Please visit our website or contact our reservations team to learn more about current deals on hotel bookings in Islamabad.'
  }
];

const SintraAbout = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const accommodationSlides = useMemo(() => {
    const grouped = [];

    for (let index = 0; index < accommodationCards.length; index += 2) {
      grouped.push(accommodationCards.slice(index, index + 2));
    }

    return grouped;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.$ && window.jQuery) {
        try {
          const carousel = window.$('.about-accommodation-carousel');
          const chooseCarousel = window.$('.about-choose-carousel');

          if (carousel.length && typeof carousel.owlCarousel === 'function') {
            if (carousel.hasClass('owl-loaded')) {
              carousel.trigger('destroy.owl.carousel');
              carousel.removeClass('owl-loaded owl-hidden');
              carousel.find('.owl-stage-outer').children().unwrap();
              carousel.find('.owl-stage').children().unwrap();
            }

            carousel.owlCarousel({
              loop: false,
              margin: 30,
              nav: false,
              dots: true,
              autoplay: false,
              smartSpeed: 600,
              responsive: {
                0: {
                  items: 1
                },
                768: {
                  items: 1
                },
                1000: {
                  items: 1
                }
              }
            });
          }

          if (chooseCarousel.length && typeof chooseCarousel.owlCarousel === 'function') {
            if (chooseCarousel.hasClass('owl-loaded')) {
              chooseCarousel.trigger('destroy.owl.carousel');
              chooseCarousel.removeClass('owl-loaded owl-hidden');
              chooseCarousel.find('.owl-stage-outer').children().unwrap();
              chooseCarousel.find('.owl-stage').children().unwrap();
            }

            chooseCarousel.owlCarousel({
              loop: true,
              margin: 30,
              nav: false,
              dots: true,
              autoplay: false,
              smartSpeed: 600,
              responsive: {
                0: {
                  items: 1
                },
                768: {
                  items: 2
                },
                1000: {
                  items: 3
                }
              }
            });
          }
        } catch (error) {
          console.warn('About accommodation slider initialization error:', error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);

      if (window.$) {
        const carousel = window.$('.about-accommodation-carousel');
        const chooseCarousel = window.$('.about-choose-carousel');
        if (carousel.data('owl.carousel')) {
          carousel.trigger('destroy.owl.carousel');
        }
        if (chooseCarousel.data('owl.carousel')) {
          chooseCarousel.trigger('destroy.owl.carousel');
        }
      }
    };
  }, []);

  return (
    <>
      <Seo
        title="About Sintra Hotel Islamabad"
        description="Experience luxury at Sintra Hotel Islamabad. Seamless online hotel booking Islamabad for a memorable stay, ideal for families and business travellers alike!"
        keywords="Book hotel in Islamabad, hotel rates in Islamabad, hotels in Islamabad booking, hotel room Islamabad, luxury hotel in Islamabad, Islamabad hotels, hotel Islamabad contact number, Islamabad hotel rates, Islamabad family hotels, 3 star hotel in Islamabad, top hotel in Islamabad"
        siteName="Sintra Hotel Islamabad"
      />

      <div
        className="banner-header section-padding valign bg-img"
        data-overlay-dark="4"
        data-background="/img/slider/sub.png"
        style={{
          backgroundImage: 'url(/img/slider/sub.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-left caption mt-90">
              <span>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
              </span>
              <h5>Luxury Hotel</h5>
              <h1>About Sintra Hotel Islamabad</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="about section-padding" style={{ paddingTop: '120px', paddingBottom: '120px', background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="rooms2 animate-box fadeInUp animated" data-animate-effect="fadeInUp" style={{ marginBottom: 0 }}>
                <figure>
                  <img src="/img/slider/about.jpg" alt="Online Hotel Booking Islamabad" className="img-fluid" />
                </figure>
                <div className="caption" style={{ padding: '3% 3% 3% 3%', background: '#dfeef1' }}>
                  <h3 style={{ fontSize: '26px', color: '#2f6f86', marginBottom: '10px', fontWeight: 400, letterSpacing: '0px', textTransform: 'none' }}>Quick & Convenient</h3>
                  <h1 style={{ fontSize: '35px', lineHeight: 1.2, marginBottom: '18px' }}>Online Hotel Booking Islamabad</h1>
                  <p style={{ fontSize: '15px', lineHeight: 1.9, marginBottom: 0 }}>
                    Booking your stay at Sintra Hotel Islamabad has never been more convenient. Our online hotel booking system allows you to reserve your room in just a few clicks, ensuring a hassle-free experience from the moment you plan your visit. You can check hotel room availability, compare hotel rates in Islamabad, and even choose your preferred room type, all from the comfort of your home or office. Whether you're planning a business trip, family getaway, or a last-minute weekend escape, we’ve made it easy to book your stay at one of the finest luxury hotels in Islamabad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing section-padding bg-blck">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-30">
              <div className="section-title"><span>Luxury Accommodation in Islamabad</span></div>
              <p className="color-2">
                Our elegantly designed rooms and suites provide a serene escape from the busy city life. Each room at our hotel is fully equipped with modern amenities, offering a combination of style and comfort that sets us apart from other hotels in Islamabad. Whether you are looking for a spacious family suite or a cosy room for an individual stay, Sintra Hotel Islamabad ensures that every guest enjoys a luxurious experience. Plus, with our online hotel booking system, securing your stay has never been easier.
              </p>
            </div>
            <div className="col-md-12">
              <div className="owl-carousel owl-theme about-accommodation-carousel">
                {accommodationSlides.map((slide, slideIndex) => (
                  <div key={`accommodation-slide-${slideIndex}`}>
                    <div className="row">
                      {slide.map((card) => (
                        <div className="col-md-6 mb-30" key={card.title}>
                          <div className="pricing-card" style={{ backgroundColor: '#fff', height: '100%' }}>
                            <img src={card.image} alt={card.title} style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
                            <div className="desc" style={{ minHeight: '220px', padding: '30px 28px' }}>
                              <div className="name" style={{ fontSize: '24px', lineHeight: 1.1, marginBottom: '16px' }}>{card.title}</div>
                              <p className="pag" style={{ marginBottom: 0, fontSize: '15px', lineHeight: 1.8 }}>{card.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {slide.length === 1 ? <div className="col-md-6 mb-30"></div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team section-padding bg-cream">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-30">
              <div style={{ width: '100%' }}>
                <div className="section-subtitle" style={{ marginBottom: '10px', letterSpacing: '6px', fontSize: '12px' }}>Tailored to Your Needs</div>
                <h2 className="section-title" style={{ fontSize: window.innerWidth <= 768 ? '28px' : '46px', fontFamily: 'Gilda Display, serif', fontWeight: 400, color: '#000', position: 'relative', marginBottom: '20px', lineHeight: '1.25em', whiteSpace: 'normal' }}>Why Choose Sintra Hotel Islamabad?</h2>
                <p style={{ fontSize: '15px', lineHeight: '2em', color: '#1b1b1b', marginBottom: '8px', maxWidth: '100%' }}>
                  At Sintra Hotel Islamabad, we offer a perfect blend of luxury, comfort, and convenience for every type of traveller. Located in the vibrant Melody neighbourhood, just minutes away from Islamabad’s bustling Blue Area, our hotel in Islamabad is an ideal destination for families, business travellers, tourists, and individuals seeking a premium stay experience. Whether you’re visiting Islamabad for business or leisure, Sintra Hotel promises to make your stay exceptional.
                </p>
              </div>
            </div>
            <div className="col-md-12">
              <div className="owl-carousel owl-theme about-choose-carousel">
                {chooseCards.map((card) => (
                  <div className="item" key={card.title} style={{ background: '#fff' }}>
                    <div className="img"><img src={card.image} alt={card.title} style={{ width: '100%', height: '320px', objectFit: 'cover' }} /></div>
                    <div className="info" style={{ minHeight: '170px' }}>
                      <h6 style={{ fontSize: '32px', marginBottom: '10px' }}>{card.title}</h6>
                      <p style={{ fontSize: '14px', lineHeight: '1.9em' }}>{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-30">
              <div className="section-subtitle">Your Queries Answered</div>
              <div className="section-title">FAQs About Hotel Booking Islamabad</div>
              <p>
                At Sintra Hotel Islamabad, we believe in providing a seamless and comfortable experience for all our guests. Whether you're curious about online booking, our luxurious amenities, or the best ways to enjoy your stay in Islamabad, we've compiled a list of frequently asked questions to help answer all your queries. Explore the details below and get ready for an unforgettable stay at Sintra Hotel.
              </p>
            </div>
            <div className="col-md-12">
              <ul className="accordion-box clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {faqItems.map((item, index) => {
                  const isOpen = openFaqIndex === index;

                  return (
                    <li className={`accordion block ${isOpen ? 'active-block' : ''}`} key={item.question} style={{ marginBottom: '20px', border: '1px solid #e8e3d9', background: '#fff' }}>
                      <div
                        className={`acc-btn ${isOpen ? 'active' : ''}`}
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                        style={{ cursor: 'pointer', padding: '22px 25px', fontSize: '18px', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.5px' }}
                      >
                        {item.question}
                      </div>
                      <div className="acc-content" style={{ display: isOpen ? 'block' : 'none' }}>
                        <div className="content">
                          <div className="text" style={{ padding: '0 25px 22px 25px' }}>{item.answer}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SintraAbout;
