import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSharedBookingSearch = () => {
    const checkIn = document.getElementById('layoutCheckIn')?.value || formatDate(today);
    const checkOut = document.getElementById('layoutCheckOut')?.value || formatDate(tomorrow);
    const adults = document.querySelector('.adults-select')?.value || '1';
    const children = document.querySelector('.children-select')?.value || '0';

    const queryParams = new URLSearchParams({
      CheckIn: checkIn,
      CheckOut: checkOut,
      Adults: adults,
      Children: children,
      NoOfRooms: '1'
    });

    window.location.href = `/SearchResult/SearchResults?${queryParams.toString()}`;
  };

  return (
    <>
      <section className="pricing section-padding bg-blck">
        <div className="container">
          <iframe 
            src="https://my.matterport.com/show/?m=3Hn3JmwUSb9" 
            width="100%" 
            height="450" 
            allowFullScreen
            title="Virtual Tour"
          ></iframe>
          <div className="row" style={{ marginTop: '40px' }}>
            <div className="col-md-4 mb-30">
              <div className="section-subtitle"><span>Prime Location</span></div>
              <h2 className="section-title"><span>Discover the Ideal Hotel Near Blue Area, Islamabad</span></h2>
              <p className="color-2">
                Conveniently located in a prime location near Blue Area, Islamabad, Sintra Hotel is the perfect choice 
                for business travellers and tourists alike. Enjoy seamless access to Islamabad's bustling commercial hub.
              </p>
              <div className="reservations mb-30">
                <div className="icon"><span style={{ color: '#fff' }} className="flaticon-call"></span></div>
                <div className="text">
                  <p className="color-2">For information</p>
                  <a style={{ color: '#fff' }} href="tel:(051) 8736313">(051) 8736313</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-30">
              <div className="pricing-card" style={{ backgroundColor: '#fff' }}>
                <img src="/img/home/1.jpg" alt="Key Features" />
                <div className="desc">
                  <div className="name">Key Features</div>
                  <ul className="list-unstyled list">
                    <li><i className="ti-check"></i>Luxury Hotel Rooms in Islamabad</li>
                    <li><i className="ti-check"></i>Complimentary High-Speed Wi-Fi</li>
                    <li><i className="ti-check"></i>24-hour Room Service</li>
                    <li><i className="ti-check"></i>In-Room Flat-Screen TVs</li>
                    <li><i className="ti-check"></i>Families, Tourists & Business travellers</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-30">
              <div className="pricing-card" style={{ backgroundColor: '#fff' }}>
                <img src="/img/home/2.jpg" alt="Business Services" />
                <div className="desc">
                  <div className="name">Business Services</div>
                  <ul className="list-unstyled list">
                    <li><i className="ti-check"></i>Fully Equipped Conference Rooms</li>
                    <li><i className="ti-check"></i>High-Speed Internet Access</li>
                    <li><i className="ti-check"></i>Presentation Services</li>
                    <li><i className="ti-check"></i>Corporate Events</li>
                    <li><i className="ti-check"></i>Customized Catering Options</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="facilties section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="section-title">Exceptional Amenities at Sintra Hotel Islamabad</h2>
              <p>At Sintra Hotel Islamabad, we prioritize your comfort and convenience with a range of top-notch amenities designed to enhance your stay. Here's what you can expect:</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="single-facility">
                <span className="flaticon-world"></span>
                <h5>Pick Up & Drop Service</h5>
                <p>Experience hassle-free travel with our convenient pick-up and drop-off service. Whether you’re arriving at the airport or heading to a business meeting, our professional drivers are here to ensure your journey is smooth and comfortable.</p>
                <div className="facility-shape"><span className="flaticon-world"></span></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="single-facility">
                <span className="flaticon-car"></span>
                <h5>Free Parking</h5>
                <p>Enjoy the peace of mind that comes with complimentary on-site parking. Whether you're traveling by car or renting a vehicle, our secure parking facility ensures your vehicle is safe and easily accessible.</p>
                <div className="facility-shape"><span className="flaticon-car"></span></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="single-facility">
                <span className="flaticon-bed"></span>
                <h5>Room Service</h5>
                <p>Indulge in the luxury of in-room dining with our prompt and attentive room service. Whether you crave a late-night snack or a gourmet meal, our diverse menu is just a call away.</p>
                <div className="facility-shape"><span className="flaticon-bed"></span></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="single-facility">
                <span className="flaticon-fast-food"></span>
                <h5>In-House Restaurant</h5>
                <p>Savour delectable dishes at our in-house restaurant, where our skilled chefs craft a variety of cuisines to delight your palate in a cosy atmosphere.</p>
                <div className="facility-shape"><span className="flaticon-fast-food"></span></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="single-facility">
                <span className="flaticon-wifi"></span>
                <h5>High-Speed Internet</h5>
                <p>Stay connected with our complimentary high-speed internet throughout the hotel. Perfect for business travellers and leisure guests alike.</p>
                <div className="facility-shape"><span className="flaticon-wifi"></span></div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="single-facility">
                <span className="flaticon-breakfast"></span>
                <h5>Complimentary Breakfast</h5>
                <p>Start your day right with a delicious complimentary breakfast featuring a variety of fresh and flavorful options.</p>
                <div className="facility-shape"><span className="flaticon-breakfast"></span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="services section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-6 p-0">
              <div className="img left">
                <img src="/img/home/cafe.png" alt="sintra" />
              </div>
            </div>
            <div className="col-md-6 p-0 bg-cream valign">
              <div className="content">
                <div className="cont text-left">
                  <h4>Café SOIR – A Culinary Delight</h4>
                  <p>Savour the essence of gourmet dining at Café SOIR. Whether you’re starting your day with a hearty breakfast or winding down with a delectable dinner, we offer a diverse menu that celebrates both local flavours and international cuisines, all crafted by our talented chefs. If you’re in the mood for a more laid-back experience, our café is the ideal spot to enjoy aromatic coffee, delightful snacks, or a peaceful evening with friends. Come, indulge your senses and discover why Café SOIR is a culinary gem in the heart of Islamabad!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 bg-cream p-0 order2 valign">
              <div className="content">
                <div className="cont text-left">
                  <h4>Conference Rooms for Business Travellers</h4>
                  <p>Sintra Hotel Islamabad caters not only to leisure travellers but also to professionals. Our state-of-the-art conference rooms and business services ensure that your meetings and events run smoothly. Whether you’re hosting a small meeting or a large conference, our facilities are designed to meet all your business needs.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 p-0 order1">
              <div className="img">
                <img src="/img/home/conference.png" alt="sintra" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 p-0">
              <div className="img left">
                <img src="/img/home/hotel.jpg" alt="sintra" />
              </div>
            </div>
            <div className="col-md-6 p-0 bg-cream valign">
              <div className="content">
                <div className="cont text-left">
                  <h4>Best Family Hotel in Islamabad</h4>
                  <p>For families visiting Islamabad, Sintra Hotel offers spacious, family-friendly accommodations designed to make your stay as comfortable as possible. With connecting rooms, special kids’ meals, and child-friendly amenities, we ensure that every member of the family enjoys their stay with us.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="background bg-img bg-fixed section-padding pb-0" data-background="/img/slider/bg.jpg" data-overlay-dark="3">
          <div className="container">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="testimonials-box">
                  <div className="head-box">
                    <h6>Testimonials</h6>
                    <h4>What Client's Say?</h4>
                    <div className="line"></div>
                  </div>
                  <div className="owl-carousel owl-theme">
                    <div className="item">
                      <span className="quote"><img src="/img/quot.png" alt="sintra" /></span>
                      <p>Nice and cozy hotel at the heart of Islamabad, best location close to old Islamabad hotel and melody food street. Good professional and courteous staff, highly recommended for families. the only thing that bothered our kids was insects coming from windows, kindly take care of it. Maybe it requires more insulated material.</p>
                      <div className="info">
                        <div className="author-img">
                          <a href="https://maps.app.goo.gl/YWeBiPtxA2FR5SqF9" target="_blank" rel="noreferrer">
                            <img src="/img/home/google review.svg" alt="sintra" />
                          </a>
                        </div>
                        <div className="cont">
                          <span><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i></span>
                          <h6>Sohaib Khan</h6> <span>Guest review</span>
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <span className="quote"><img src="/img/quot.png" alt="sintra" /></span>
                      <p>Spent some quality days here. Rooms are neat with very good size. Staff is friendly and cooperative. They also offer good quality free breakfast buffet. Loved the location too!</p>
                      <div className="info">
                        <div className="author-img">
                          <a href="https://maps.app.goo.gl/YWeBiPtxA2FR5SqF9" target="_blank" rel="noreferrer">
                            <img src="/img/home/google review.svg" alt="sintra" />
                          </a>
                        </div>
                        <div className="cont">
                          <span><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i></span>
                          <h6>Ahmad Shaheen</h6> <span>Guest review</span>
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <span className="quote"><img src="/img/quot.png" alt="sintra" /></span>
                      <p>Great Customer Service, great location not too far from the mosque, and within 5 minutes drive of centaurus mall, staff are friendly and you have a choice of breakfast items. Will be returning again in the near future. Rooms: Nice clean rooms Safety: Security at the entrance 24 hours.</p>
                      <div className="info">
                        <div className="author-img">
                          <a href="https://maps.app.goo.gl/YWeBiPtxA2FR5SqF9" target="_blank" rel="noreferrer">
                            <img src="/img/home/google review.svg" alt="sintra" />
                          </a>
                        </div>
                        <div className="cont">
                          <span><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i></span>
                          <h6>Shakil Ahmed</h6> <span>Guest review</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="news section-padding bg-blck">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="section-title"><span>Latest News & Updates</span></h2>
              <p className="color-2">Stay connected with Sintra Hotel Islamabad! Our Latest News & Updates section is your go-to source for the freshest information on our hotel offerings, special promotions, and exciting events happening in and around Islamabad. Whether you're planning your next stay or simply curious about our latest developments, our updates will keep you in the loop. Be sure to check back regularly to make the most of your experience with us!</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="owl-carousel owl-theme">
                <div className="item">
                  <div className="position-re o-hidden">
                    <img src="/uploads/blog/3 star hotel in Islamabad - Sintra.png" alt="3 star hotel in Islamabad - Sintra" />
                    <div className="date"><span>Jun</span><i>24</i></div>
                  </div>
                  <div className="con">
                    <h5><a href="/blogs">3 star hotel in Islamabad - Sintra</a></h5>
                  </div>
                </div>
                <div className="item">
                  <div className="position-re o-hidden">
                    <img src="/uploads/blog/BEST PICNIC SPOTS IN ISLAMABAD.png" alt="Best Picnic Spots in Islamabad" />
                    <div className="date"><span>Apr</span><i>17</i></div>
                  </div>
                  <div className="con">
                    <h5><a href="/blogs">Best Picnic Spots in Islamabad</a></h5>
                  </div>
                </div>
                <div className="item">
                  <div className="position-re o-hidden">
                    <img src="/uploads/blog/Blog Image Sintra Hotel Islamabad (900 x 1200 px) (1).png" alt="Blog Image Sintra Hotel Islamabad" />
                    <div className="date"><span>Mar</span><i>14</i></div>
                  </div>
                  <div className="con">
                    <h5><a href="/blogs">Blog Image Sintra Hotel Islamabad</a></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="background bg-img bg-fixed section-padding pb-0" data-background="/img/slider/bg.jpg" data-overlay-dark="2">
          <div className="container">
            <div className="row">
              <div className="col-md-5 mb-30 mt-30">
                <p><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i><i className="star-rating"></i></p>
                <h5>Book Your Stay at Sintra Hotel Islamabad</h5>
                <p>Experience the epitome of luxury and comfort by booking your stay with Sintra Hotel. Whether you’re here for business or leisure, our exclusive offers and competitive Islamabad hotel rates ensure that your stay is affordable yet luxurious. Booking a hotel in Islamabad has never been easier with our seamless online reservation system.</p>
                <div className="reservations mb-30">
                  <div className="icon color-1"><span className="flaticon-call"></span></div>
                  <div className="text">
                    <p className="color-1">Reservation</p> <a className="color-1" href="tel:(051) 8736313">(051) 8736313</a>
                  </div>
                </div>
              </div>
              <div className="col-md-5 offset-md-2">
                <div className="booking-box">
                  <div className="head-box">
                    <h6>Rooms & Suites</h6>
                    <h4>Hotel Booking Form</h4>
                  </div>
                  <div className="booking-inner clearfix">
                    <form className="form1 clearfix">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="input1_wrapper">
                            <label>Check in</label>
                            <div className="input1_inner">
                              <input type="text" id="layoutCheckIn" className="form-control input datepicker" placeholder="Check in" defaultValue={formatDate(today)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input1_wrapper">
                            <label>Check out</label>
                            <div className="input1_inner">
                              <input type="text" id="layoutCheckOut" className="form-control input datepicker" placeholder="Check out" defaultValue={formatDate(tomorrow)} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="select1_wrapper">
                            <label>Adults</label>
                            <div className="select1_inner">
                              <select className="select2 adults-select" style={{ width: '100%' }}>
                                <option value="0">Adults</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="select1_wrapper">
                            <label>Children</label>
                            <div className="select1_inner">
                              <select className="select2 children-select" style={{ width: '100%' }}>
                                <option value="0">Children</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <button type="button" onClick={handleSharedBookingSearch} className="btn-form1-submit mt-15">Check Availability</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="clients">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <div className="owl-carousel owl-theme">
                <div className="clients-logo">
                  <a href="https://www.booking.com/" target="_blank" rel="noreferrer"><img src="/img/clients/bokking.jpg" alt="sintra" /></a>
                </div>
                <div className="clients-logo">
                  <a href="https://www.expedia.com/" target="_blank" rel="noreferrer"><img src="/img/clients/expedia.jpg" alt="sintra" /></a>
                </div>
                <div className="clients-logo">
                  <a href="https://www.tripadvisor.com/Hotel_Review-g293960-d25078201-Reviews-Sintra_Hotel-Islamabad_Islamabad_Capital_Territory.html" target="_blank" rel="noreferrer"><img src="/img/clients/tripadvisor.jpg" alt="sintra" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="footer-column footer-about">
                  <h3 className="footer-title">Sintra Hotel Islamabad</h3>
                  <p className="footer-about-text">
                    Sintra Hotel in Islamabad combines comfort and elegance for families, tourists, and business travellers. Enjoy exquisite rooms, outstanding amenities, and delectable dining at Café SOIR. With a prime location near Blue Area, we provide easy access to the city’s attractions. Book now for an unforgettable stay at one of Islamabad’s top luxury hotels!
                  </p>
                  <div className="footer-language"></div>
                </div>
              </div>
              <div className="col-md-2 offset-md-1">
                <div className="footer-column footer-explore clearfix">
                  <h3 className="footer-title">Links</h3>
                  <ul className="footer-explore-list list-unstyled">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/restaurant">Restaurant</Link></li>
                    <li><Link to="/gallery">Gallery</Link></li>
                    <li><Link to="/">Terms & Conditions</Link></li>
                    <li><Link to="/">Privacy Policy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-3">
                <div className="footer-column footer-contact">
                  <h3 className="footer-title">Contact Us</h3>
                  <p className="footer-contact-text">
                    <a href="https://maps.app.goo.gl/YWeBiPtxA2FR5SqF9" target="_blank" rel="noreferrer">
                      <span className="flaticon-location-pin"></span>Sintra Hotel, G-6 Markaz, Sector G-6, Islamabad, 44000
                    </a>
                  </p>
                  <div className="footer-contact-info">
                    <p className="footer-contact-phone">
                      <span className="flaticon-call"></span> <a href="tel:+92518736313" target="_blank" rel="noreferrer">Call (051) 8736313</a>
                    </p>
                    <p className="footer-contact-mail">
                      <a href="mailto:Info@thesintrahotel.com" target="_blank" rel="noreferrer">Info@thesintrahotel.com</a>
                    </p>
                  </div>
                  <div className="footer-about-social-list">
                    <a href="https://www.instagram.com/sintrahotel/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                    <a href="https://www.tiktok.com/@sintrahotelislamabad" target="_blank" rel="noreferrer" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
                    <a href="https://www.youtube.com/@SintraHotelIslamabad" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
                    <a href="https://www.facebook.com/profile.php?id=61565952192884" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="ti-facebook"></i></a>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="footer-column footer-contact">
                  <h3 className="footer-title">Payment Methods</h3>
                  <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '10px', flexWrap: 'wrap' }}>
                    <li><img src="/img/bank.svg" style={{ width: '35px', height: '30px' }} alt="bank" /></li>
                    <li><img src="/img/visa.svg" style={{ width: '35px', height: '30px' }} alt="visa" /></li>
                    <li><img src="/img/mastercard.svg" style={{ width: '35px', height: '30px' }} alt="mastercard" /></li>
                    <li><img src="/img/easypaisa.svg" style={{ width: '35px', height: '30px' }} alt="easypaisa" /></li>
                    <li><img src="/img/Jazzcash.svg" style={{ width: '35px', height: '30px' }} alt="jazzcash" /></li>
                    <li><img src="/img/upasia.svg" style={{ width: '35px', height: '30px' }} alt="upaisa" /></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="footer-bottom-inner">
                  <p className="footer-bottom-copy-right">
                    © Copyright 2024 by <a href="https://growbiztech.com/" target="_blank" rel="noreferrer">Growbiz Technology & Marketing.</a>.All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="progress-wrap cursor-pointer">
        <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div>

      <a href="https://wa.me/+923334870007?text=Hi! Sintra Hotel In Islamabad." className="float" target="_blank" rel="noopener noreferrer">
        <i className="fa-brands fa-whatsapp my-float"></i>
      </a>
      <a href="tel:+920518736313" className="floatp" target="_blank" rel="noopener noreferrer">
        <i className="fa-solid fa-phone my-float"></i>
      </a>
    </>
  );
};

export default Footer;
