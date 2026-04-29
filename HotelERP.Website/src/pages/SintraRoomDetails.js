import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';

const normalizeRoomSlug = (value = '') => value.toLowerCase().trim().replace(/\s+/g, '-');

const amenities = [
  { icon: 'flaticon-car', label: 'Free Parking' },
  { icon: 'flaticon-wifi', label: 'Free Wifi' },
  { icon: 'flaticon-breakfast', label: 'Breakfast' },
  { icon: 'flaticon-hotel', label: 'Room Service' },
  { icon: 'flaticon-bed', label: 'Family rooms' }
];

const roomPages = {
  executive: {
    id: 'executive',
    title: 'Executive Room at Sintra Hotel Islamabad',
    subtitle: 'Elegance Meets Functionality',
    description: 'Indulge in a sophisticated retreat with our Executive Rooms at Sintra Hotel Islamabad, where modern luxury harmoniously blends with thoughtful design. Perfectly suited for both business and leisure travelers, these rooms offer a sanctuary of comfort and convenience amidst the vibrant cityscape of Islamabad.',
    sliderImages: ['/img/slider/executive/1.png', '/img/slider/executive/2.png', '/img/slider/executive/3.png'],
    price: 10000,
    sections: [
      { heading: 'Relax in Style', paragraph: 'Designed with relaxation and functionality in mind, the Executive Room is your personal haven. After a day of meetings or exploring Islamabad’s attractions, unwind in a space that redefines the meaning of comfort.' },
      {
        heading: 'Key Features of Executive Room',
        list: [
          'Luxurious Bedding: A plush king-size bed adorned with premium linens, ensuring a restful night’s sleep.',
          'Smart Workspace: A dedicated work desk and ergonomic chair for productive work sessions.',
          'Advanced Entertainment System: A high-definition flat-screen TV for local, international, and streaming content.',
          'Seamless Connectivity: Complimentary high-speed Wi-Fi and convenient charging access.',
          'Luxurious Bathroom Amenities: A sleek bathroom with rain shower, soft towels, and premium toiletries.',
          'In-Room Refreshments: Tea and coffee facilities replenished daily.'
        ]
      },
      { heading: 'Enhance Your Stay in Islamabad', paragraph: 'Whether you are hosting an online meeting, watching your favorite series, or simply relaxing, every detail has been curated for your satisfaction.' },
      {
        heading: 'Why Choose the Executive Room?',
        list: [
          'Business travelers seeking a well-equipped, productive environment.',
          'Couples looking for a chic and cozy retreat.',
          'Solo adventurers wanting a balance of luxury and convenience.'
        ]
      },
      { heading: 'Book Directly with Us for Exclusive Deals', paragraph: 'Reserve your Executive Room today through our official website to enjoy exclusive offers, complimentary services, and the best rates available.' }
    ]
  },
  'twin-executive': {
    id: 'twin-executive',
    title: 'Twin Executive Room at Sintra Hotel Islamabad',
    subtitle: 'Perfect for Shared Comfort and Style',
    description: 'Welcome to the Twin Executive Room at Sintra Hotel Islamabad, where luxury meets practicality. Designed for travelers who value both comfort and functionality, this room offers a harmonious blend of elegance and modern convenience.',
    sliderImages: ['/img/slider/Twin/1.png', '/img/slider/Twin/2.png', '/img/slider/Twin/3.png'],
    price: 12000,
    sections: [
      {
        heading: 'Key Features of Twin Executive Room',
        list: [
          'Twin Beds for Two: Two premium single beds with plush mattresses and high-quality linens.',
          'Work and Play: A spacious workstation and ergonomic chair for productivity and comfort.',
          'Entertainment Options: A large high-definition LED TV with local and international channels.',
          'Privacy and Comfort: Blackout curtains and sound-conscious design for better rest.',
          'Spa-Inspired Bathroom: Modern bathroom with shower, towels, and toiletries.',
          'Fast Internet: Complimentary high-speed Wi-Fi.',
          'Housekeeping: Daily upkeep to keep the room spotless and inviting.',
          'Room Service: Convenient in-room dining for cravings any time.'
        ]
      },
      { heading: 'Tailored Comfort for Every Occasion', paragraph: 'The Twin Executive Room is ideal for business colleagues, friends on a leisure trip, or small families exploring Islamabad.' },
      { heading: 'Book Now for an Unmatched Experience', paragraph: 'Reserve your Twin Executive Room today and unlock a world of comfort and convenience at Sintra Hotel Islamabad.' }
    ]
  },
  'super-deluxe': {
    id: 'super-deluxe',
    title: 'Super Deluxe Room at Sintra Hotel Islamabad',
    subtitle: 'A Haven of Opulence',
    description: 'Experience the pinnacle of luxury and comfort in our Super Deluxe Room at Sintra Hotel Islamabad, where sophistication meets serenity. Designed for discerning travelers and luxury enthusiasts, this room encapsulates elegance with a blend of contemporary design and thoughtful amenities.',
    sliderImages: ['/img/slider/super/1.png', '/img/slider/super/2.png', '/img/slider/super/3.png'],
    price: 15000,
    sections: [
      { heading: 'A Room Tailored to Perfection', paragraph: 'Every detail of the Super Deluxe Room is curated to exceed your expectations, from indulgent textures to a calming, elegant ambiance.' },
      {
        heading: 'Key Features of Super Deluxe Room',
        list: [
          'Luxurious Bedding: Plush king-size bed with premium linens and comfort-first design.',
          'Relax and Unwind: Cozy seating area ideal for reading or a peaceful moment.',
          'Panoramic Views: Enjoy scenic views that elevate your stay experience.',
          'State-of-the-Art Entertainment: Large LED TV with extensive content options.',
          'Bathroom Indulgence: Premium toiletries, elegant design, and a spa-like feel.',
          'Extra Perks: Breakfast and flexible room service convenience.',
          'Business-Friendly Amenities: Dedicated workspace with strong Wi-Fi.',
          'Personalized Services: Thoughtful hospitality support throughout your stay.'
        ]
      },
      { heading: 'Why Choose the Super Deluxe Room?', paragraph: 'Whether you are celebrating a milestone, enjoying a romantic escape, or simply seeking refined comfort, this room offers an elevated stay experience.' },
      { heading: 'Book Your Super Deluxe Experience Today', paragraph: 'Book directly through our website for the best rates and enjoy a memorable luxury stay in Islamabad.' }
    ]
  }
};

const SintraRoomDetails = () => {
  const { slug } = useParams();
  const normalizedSlug = useMemo(() => normalizeRoomSlug(slug), [slug]);
  const room = useMemo(() => roomPages[normalizedSlug] || roomPages.executive, [normalizedSlug]);
  const [activeImage, setActiveImage] = useState(room.sliderImages[0]);

  React.useEffect(() => {
    setActiveImage(room.sliderImages[0]);
  }, [room]);

  return (
    <>
      <Seo
        title={room.title}
        description={room.description}
        keywords="Sintra Hotel Islamabad rooms, executive room Islamabad, twin executive room, super deluxe room, luxury hotel rooms Islamabad"
        siteName="Sintra Hotel Islamabad"
      />

      <header className="header slider">
        <div
          className="text-center item bg-img"
          data-overlay-dark="3"
          data-background={activeImage}
          style={{ backgroundImage: `url(${activeImage})`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', minHeight: '85vh' }}
        ></div>
        <div className="arrow bounce text-center">
          <a href="#room-content"><i className="ti-arrow-down"></i></a>
        </div>
      </header>

      <section style={{ background: '#fff', padding: '25px 0 5px 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            {room.sliderImages.map((image) => (
              <div className="col-4 col-md-2 mb-20" key={image}>
                <button
                  type="button"
                  onClick={() => setActiveImage(image)}
                  style={{ padding: 0, border: activeImage === image ? '2px solid #aa8453' : '1px solid #ddd', background: '#fff', width: '100%' }}
                >
                  <img src={image} alt={room.title} className="img-fluid" style={{ width: '100%', height: '90px', objectFit: 'cover' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rooms-page section-padding" id="room-content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <span>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
              </span>
              <div className="section-subtitle">{room.subtitle}</div>
              <h1 className="section-title">{room.title}</h1>
            </div>
            <div className="col-md-8">
              <p className="mb-30">{room.description}</p>
              <div className="row">
                {room.sections.map((section) => (
                  <div className="col-md-12" key={section.heading}>
                    <h6>{section.heading}</h6>
                    {section.paragraph ? <p>{section.paragraph}</p> : null}
                    {section.list ? (
                      <ul style={{ marginLeft: '20px' }}>
                        {section.list.map((item) => (
                          <li key={item}><b>• </b>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
                <div className="col-md-12">
                  <div className="butn-dark mt-15 mb-30"><Link to="/"><span>Book Now</span></Link></div>
                </div>
              </div>
            </div>
            <div className="col-md-3 offset-md-1">
              <h6>Amenities</h6>
              <ul className="list-unstyled page-list mb-30">
                {amenities.map((item) => (
                  <li key={item.label}>
                    <div className="page-list-icon"><span className={item.icon}></span></div>
                    <div className="page-list-text"><p>{item.label}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SintraRoomDetails;
