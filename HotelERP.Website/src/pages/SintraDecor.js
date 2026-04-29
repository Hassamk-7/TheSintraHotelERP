import React from 'react';
import Seo from '../components/Seo';

const featuredPackages = [
  {
    title: 'Deluxe Room Décor Package',
    image: '/img/pricing/birthday.png',
    description: 'Experience a beautifully decorated Deluxe Room for birthdays, intimate celebrations, anniversaries, and memorable moments at Sintra Hotel Islamabad.'
  },
  {
    title: 'Executive Room Décor Package',
    image: '/img/pricing/valentine.png',
    description: 'Celebrate your special day in style with elegant décor, cozy ambiance, and a premium stay experience tailored for meaningful occasions.'
  }
];

const packages = [
  { title: 'Birthday Package', image: '/img/roomdecore/birthdayPackage.jpg' },
  { title: 'Wedding Package', image: '/img/roomdecore/weedingPackage.jpg' },
  { title: 'Valentines Package', image: '/img/roomdecore/valDay.jpg' },
  { title: 'Anniversary Celebration Package', image: '/img/roomdecore/Anniversary.jpg' },
  { title: 'Package of Your Choice', image: '/img/roomdecore/YourChoice.jpg' }
];

const packageFeatures = [
  'Welcome drink on arrival',
  'Room decor',
  'Bouquet',
  'Cake',
  'Petals',
  'Balloons'
];

const SintraDecor = () => {
  return (
    <>
      <Seo
        title="Room Decor Packages"
        description="Discover elegant room decor packages at Sintra Hotel Islamabad for birthdays, anniversaries, weddings, and special celebrations."
        keywords="room decor packages Islamabad, birthday room decor, anniversary room decoration, wedding room decor, Sintra Hotel Islamabad"
        siteName="Sintra Hotel Islamabad"
      />

      <div
        className="banner-header section-padding valign bg-img"
        data-overlay-dark="4"
        data-background="/img/slider/sub.png"
        style={{ backgroundImage: 'url(/img/slider/sub.png)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-left caption mt-90">
              <h5>Luxury and Elegance Combined for Your Special Day</h5>
              <h1>Make Your Moments Magical with Sintra Hotel Islamabad</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="pricing section-padding" style={{ padding: '0px', position: 'relative', zIndex: 10, marginTop: '-50px' }}>
        <div className="container">
          <div className="row" style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
            {featuredPackages.map((item) => (
              <div className="col-md-5 mb-30" key={item.title}>
                <div className="pricing-card" style={{ background: '#fff', height: '100%' }}>
                  <img src={item.image} alt={item.title} />
                  <div className="desc">
                    <div className="name text-center mb-3">{item.title}</div>
                    <div className="text-center mb-3">{item.description}</div>
                    <p className="mt-3 mb-0 text-center">
                      <span className="btn btn-sm text-uppercase shadow-none" style={{ padding: '12px 16px', letterSpacing: '2px', backgroundColor: '#2B6379', border: '1px solid #2B6379', color: '#fff', fontSize: 'small' }}>PKR 20,000 (Inclusive of All Taxes)</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rooms1 section-padding bg-cream">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-30">
              <div className="section-subtitle">Sintra Hotel Islamabad</div>
              <h2 className="section-title">Room Decoration Packages</h2>
              <p>
                Every special occasion deserves to be celebrated in style. Whether you are planning a romantic evening,
                a birthday celebration, or a wedding night surprise, Sintra Hotel Islamabad offers thoughtfully curated
                décor packages to create unforgettable memories in an elegant setting.
              </p>
            </div>
          </div>
          <div className="row">
            {packages.map((pkg, index) => (
              <div className={index < 3 ? 'col-md-4 mb-30' : 'col-md-6 mb-30'} key={pkg.title}>
                <div className="item" style={{ height: '100%' }}>
                  <div className="position-re o-hidden"><img src={pkg.image} alt={pkg.title} /></div>
                  <div className="con">
                    <h6><span>20,000 PKR / Night</span></h6>
                    <h5>{pkg.title}</h5>
                    <div className="line"></div>
                    <div className="row facilities">
                      <div className="col-md-12">
                        <ul>
                          {packageFeatures.map((feature) => (
                            <li key={feature}><span className="me-2">&#10084;</span>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SintraDecor;
