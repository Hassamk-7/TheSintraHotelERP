import React, { useState } from 'react';
import Seo from '../components/Seo';

const attractions = [
  {
    title: 'Faisal Mosque',
    image: '/img/places/faisalbig.png',
    thumb: '/img/places/faisal.png',
    text: 'As the largest mosque in Pakistan, Faisal Mosque is one of Islamabad’s most iconic landmarks. Its striking architecture and scenic Margalla Hills backdrop make it a must-visit destination.'
  },
  {
    title: 'Pakistan Monument',
    image: '/img/places/pakistanbig.png',
    thumb: '/img/places/pakistan.png',
    text: 'The Pakistan Monument symbolizes national unity and offers a memorable cultural experience with panoramic city views and a museum that reflects the country’s heritage.'
  },
  {
    title: 'Lok Virsa Museum',
    image: '/img/places/lokbig.png',
    thumb: '/img/places/lok.png',
    text: 'Dive into Pakistan’s cultural richness through traditional artefacts, handicrafts, folk art, and engaging exhibits at the Lok Virsa Museum.'
  },
  {
    title: 'Daman-e-Koh',
    image: '/img/places/Damanbig.png',
    thumb: '/img/places/Daman.png',
    text: 'Enjoy breathtaking panoramic views of Islamabad at Daman-e-Koh, a scenic viewpoint nestled in the Margalla Hills and ideal for photography and peaceful evenings.'
  },
  {
    title: 'Rawal Lake',
    image: '/img/places/Rawalbig.png',
    thumb: '/img/places/Rawal.png',
    text: 'Rawal Lake offers a relaxing outdoor escape with walking trails, picnic areas, and scenic beauty right in the heart of the capital.'
  }
];

const activities = [
  {
    title: 'Hiking in Margalla Hills',
    image: '/img/places/Hiking.png',
    text: 'For nature lovers and adventure seekers, hiking in the Margalla Hills is a must. With numerous trails ranging from easy to challenging, you can explore the natural beauty of the hills while enjoying stunning views of the city below. Trail 3 and Trail 5 are particularly popular among locals and tourists alike, offering picturesque landscapes and a chance to connect with nature. As you hike, keep an eye out for local wildlife and vibrant flora, and don’t forget to bring your camera to capture the breathtaking vistas along the way.'
  },
  {
    title: 'Visit the Islamabad Zoo',
    image: '/img/places/Zoo.png',
    text: 'A perfect family-friendly destination, the Islamabad Zoo is home to various animal species, including native wildlife. The zoo offers educational opportunities and interactive exhibits that are enjoyable for children and adults. It\'s an excellent place for a fun day out with family, featuring play areas, picnic spots, and informative signage about the animals. The zoo often hosts special events and educational programs, making it a great way to spend the day while learning about conservation and animal care.'
  },
  {
    title: 'Explore the Centaurus Mall',
    image: '/img/places/Centaurus.png',
    text: 'Shopping enthusiasts will love the Centaurus Mall, a modern shopping complex featuring a range of local and international brands. With various dining options and entertainment facilities, including a cinema, it’s a great place to spend a day shopping and enjoying delicious food. The mall frequently organizes events and promotions, creating a lively atmosphere where visitors can enjoy live music, exhibitions, and seasonal festivities, enhancing the shopping experience.'
  },
  {
    title: 'Enjoy Local Cuisine at Street Markets',
    image: '/img/places/Street.png',
    text: 'Savour the authentic flavours of Pakistan by exploring the bustling street markets in Islamabad. Taste mouth-watering dishes like bun kabobs, samosas, and chaat, and immerse yourself in the local food culture. The vibrant atmosphere and delicious street food make it a delightful experience. Many food stalls also offer traditional sweets, allowing you to satisfy your sweet tooth while enjoying the lively surroundings. Exploring these markets provides a unique insight into the city’s culinary scene and is a must for food lovers.'
  },
  {
    title: 'Visit the Islamabad Botanical Garden',
    image: '/img/places/Garden.png',
    text: 'Perfect for a leisurely stroll, the Islamabad Botanical Garden showcases a variety of plants and flowers from across the country. The lush green landscape provides a peaceful environment for relaxation and is ideal for picnics or family outings. The garden also hosts seasonal flower exhibitions and educational workshops, making it a great place to learn about local flora. With walking trails and serene spots to unwind, visitors can connect with nature and enjoy the beauty of Islamabad’s natural landscape.'
  }
];

const SintraPlacesActivities = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAttraction = attractions[activeIndex];

  return (
    <>
      <Seo
        title="Places & Activities"
        description="Discover top places to visit in Islamabad and fun activities to enjoy during your stay at Sintra Hotel Islamabad."
        keywords="places to visit in Islamabad, activities in Islamabad, tourist attractions Islamabad, Sintra Hotel Islamabad"
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
              <h5>Luxury Hotel</h5>
              <h1>Places & Activities</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding" style={{ background: '#e1edee66' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-30">
              <h2 className="section-title">Discover Exciting Places to Visit in Islamabad</h2>
              <p>
                Islamabad offers a beautiful mix of natural landscapes, cultural landmarks, and family-friendly attractions.
                During your stay at Sintra Hotel Islamabad, you can explore the capital’s most loved destinations with ease.
              </p>
            </div>
            <div className="col-md-12">
              <div>
                <div className="row align-items-center mb-30">
                  <div className="col-lg-7 mb-30 mb-lg-0">
                    <div style={{ background: '#fff' }}>
                      <img src={activeAttraction.image} alt={activeAttraction.title} className="img-fluid" style={{ width: '100%', borderRadius: '14px' }} />
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div style={{ paddingLeft: '10px' }}>
                      <h3 className="section-title" style={{ fontSize: '34px', marginBottom: '18px' }}>{activeAttraction.title}</h3>
                      <p style={{ marginBottom: 0, lineHeight: '1.9em' }}>{activeAttraction.text}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {attractions.map((item, index) => (
                    <div className="col-6 col-md-4 col-lg mb-15" key={item.title}>
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        style={{ border: activeIndex === index ? '3px solid #aa8453' : '1px solid #ddd', padding: 0, background: '#fff', width: '100%', overflow: 'hidden', borderRadius: '8px' }}
                      >
                        <img src={item.thumb} alt={item.title} className="img-fluid" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream" style={{ background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-30">
              <h2 className="section-title" style={{ fontSize: '46px', lineHeight: '1.25em', marginBottom: '18px' }}>Fun Activities to Enjoy in Islamabad</h2>
              <p style={{ fontSize: '15px', lineHeight: '1.95em', maxWidth: '1120px', marginBottom: 0 }}>
                Islamabad is not just about stunning sights; it also offers a wide array of fun activities that will keep you entertained during your visit. From thrilling outdoor adventures to cultural experiences, there’s something for everyone. The city's vibrant atmosphere and diverse offerings ensure that both residents and tourists can find exciting ways to engage with the local culture. Here are some popular activities to try out while staying at Sintra Hotel Islamabad:
              </p>
            </div>
            <div className="col-md-12">
              {activities.map((activity, index) => (
                <div key={activity.title} className={`rooms2 ${index !== activities.length - 1 ? 'mb-90' : ''} ${index % 2 === 1 ? 'left' : ''}`}>
                  <figure><img src={activity.image} alt={activity.title} className="img-fluid" /></figure>
                  <div className="caption">
                    <h4 style={{ fontSize: '23px', lineHeight: '1.35em', marginBottom: '14px' }}>{activity.title}</h4>
                    <p style={{ fontSize: '14px', lineHeight: '1.85em' }}>{activity.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SintraPlacesActivities;
