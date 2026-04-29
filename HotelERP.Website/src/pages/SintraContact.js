import React, { useState } from 'react';
import axios from 'axios';
import Seo from '../components/Seo';
import { apiConfig } from '../config/api';

const API_BASE_URL = apiConfig.baseURL;

const SintraContact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await axios.post(`${API_BASE_URL}/ContactMessage`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
        hotelId: 1,
        location: 'islamabad'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Us"
        description="Reach Sintra Hotel Islamabad for reservations, inquiries, location details, and booking assistance."
        keywords="Sintra Hotel Islamabad contact number, hotel contact Islamabad, hotel reservation contact, Islamabad hotel address"
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
              <h5>Get in touch</h5>
              <h2>Contact Us</h2>
            </div>
          </div>
        </div>
      </div>

      <section className="contact section-padding">
        <div className="container">
          <div className="row mb-90">
            <div className="col-md-6 mb-60">
              <h1 className="section-title" style={{ fontSize: '46px', lineHeight: '1.25em', marginBottom: '20px', maxWidth: '520px' }}>Dial Sintra Hotel Islamabad Contact Number</h1>
              <p style={{ fontSize: '15px', lineHeight: '1.95em', maxWidth: '520px', marginBottom: '28px' }}>
                Looking to book your stay at Sintra Hotel Islamabad or have any inquiries? We’re here to assist you! Whether you're a business traveller, a tourist, or a family looking for a comfortable stay, Sintra Hotel is your ideal choice for luxury accommodations in the heart of Islamabad. With a prime location in Melody, near Blue Area, we're easily accessible for all your travel needs. Need assistance with booking or event arrangements? Call us today at our Sintra Hotel Islamabad Contact Number (051 8736313) to speak with our friendly staff. We’re also available on WhatsApp for your convenience! Just send us a message at 03334870007, and we’ll handle all your queries.
              </p>
              <div className="reservations mb-30">
                <div className="icon"><span className="flaticon-call"></span></div>
                <div className="text">
                  <p>Reservation</p>
                  <a href="tel:(051)8736313">(051) 8736313</a>
                </div>
              </div>
              <div className="reservations mb-30">
                <div className="icon"><span className="flaticon-envelope"></span></div>
                <div className="text">
                  <p>Email Info</p>
                  <a href="mailto:info@thesintrahotel.com">info@thesintrahotel.com</a>
                </div>
              </div>
              <div className="reservations">
                <div className="icon"><span className="flaticon-location-pin"></span></div>
                <div className="text">
                  <p>Address</p>
                  <a href="https://maps.app.goo.gl/YWeBiPtxA2FR5SqF9" target="_blank" rel="noreferrer">Sintra Hotel, G-6 Markaz, Sector G-6, Islamabad, 44000</a>
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-30 offset-md-1">
              <h3>Get in touch</h3>
              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12">
                    {success ? <div className="alert alert-success" role="alert">Your message was sent successfully.</div> : null}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input name="name" type="text" placeholder="Your Name *" required value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 form-group">
                    <input name="email" type="email" placeholder="Your Email *" required value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 form-group">
                    <input name="phone" type="text" placeholder="Your Number *" required value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 form-group">
                    <input name="subject" type="text" placeholder="Subject *" required value={formData.subject} onChange={handleChange} />
                  </div>
                  <div className="col-md-12 form-group">
                    <textarea name="message" cols="30" rows="4" placeholder="Message *" required value={formData.message} onChange={handleChange}></textarea>
                  </div>
                  <div className="col-md-12">
                    <button type="submit" className="butn-dark2" disabled={submitting}><span>{submitting ? 'Sending...' : 'Send Message'}</span></button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 map" style={{ opacity: 1, visibility: 'visible', display: 'block' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13274.973616397794!2d73.0848451!3d33.715588!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf4eb4ff030b%3A0xc101bff92da0ee59!2sSintra%20Hotel%20Islamabad!5e0!3m2!1sen!2s!4v1729324813818!5m2!1sen!2s" width="100%" height="600" style={{ border: 0, display: 'block', width: '100%', minHeight: '600px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Sintra Hotel Islamabad Map"></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SintraContact;
