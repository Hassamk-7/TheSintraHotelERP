# Sintra Hotel Design Implementation

This document describes the implementation of the Sintra Hotel design in the HotelERP.Website React application.

## Overview

The Sintra Hotel design has been successfully converted from the old .NET MVC project to React components. The design maintains the original look and feel while being fully functional in React.

## What Was Done

### 1. Assets Migration
All assets from the old Sintra Hotel project have been copied to the React project:

- **CSS Files**: `/public/css/`
  - `plugins.css` - Plugin styles
  - `style.css` - Main Sintra Hotel styles (155KB)
  - `Checkout.css` - Reservation/checkout page styles
  - `Thankyou.css` - Thank you page styles

- **JavaScript Files**: `/public/js/`
  - jQuery and plugins (owl carousel, datepicker, select2, etc.)
  - Custom Sintra Hotel scripts

- **Images**: `/public/img/`
  - Slider images
  - Room images
  - Logo and branding assets
  - All other visual assets

- **Fonts**: `/public/fonts/`
  - Flaticon font files
  - Themify icons

### 2. React Components Created

#### Layout Components
- **`src/components/Layout/Navbar.js`**
  - Sintra Hotel navigation bar
  - Dropdown menus for Rooms & Suites, Cafe & Restaurant
  - Responsive mobile menu
  - Logo and navigation links

- **`src/components/Layout/Footer.js`**
  - Virtual tour iframe
  - Prime location section
  - Key features and business services
  - Amenities section
  - Contact information
  - WhatsApp and phone floating buttons
  - Scroll to top button

- **`src/components/Layout/SintraLayout.js`**
  - Wrapper component combining Navbar and Footer

#### Page Components
- **`src/pages/Home.js`**
  - Hero slider with 3 slides
  - Booking search form with date pickers
  - About section
  - Room showcase carousel
  - Reservation phone number display

- **`src/pages/SintraSearchResults.js`**
  - Banner header
  - Room listing with alternating left/right layout
  - Room images and facilities
  - Price display (normal and discounted)
  - "Rooms Left" indicator
  - Book Now buttons

- **`src/pages/SintraReservation.js`**
  - Personal information form
  - Reservation summary sidebar (dark theme)
  - Payment method selection (Online Payment / 25% Deposit)
  - Terms and conditions checkbox
  - Check-in/check-out details display
  - Guest and night count display

- **`src/pages/SintraThankYou.js`**
  - Thank you message
  - Booking receipt summary
  - Room image and details
  - Guest information
  - Tax breakdown
  - Important notes section
  - Print button

### 3. Routing Configuration

Routes have been added to `src/App.js`:

```javascript
/sintra                    → Home page (Sintra design)
/sintra/search-results     → Search results page
/sintra/reservation        → Reservation/booking page
/sintra/thank-you          → Thank you/confirmation page
```

The original HotelERP routes remain unchanged and continue to work at their original paths.

### 4. HTML Integration

Updated `public/index.html` to include:
- Google Fonts (Barlow, Barlow Condensed, Gilda Display)
- Font Awesome icons
- Sintra Hotel CSS files
- Sintra Hotel JavaScript files (jQuery, plugins, custom scripts)

## How to Use

### Accessing the Sintra Design

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Navigate to Sintra Hotel pages:**
   - Home: `http://localhost:3001/sintra`
   - Search Results: `http://localhost:3001/sintra/search-results?checkIn=04/01/2026&checkOut=04/02/2026&adults=1&children=0&rooms=1`
   - Reservation: `http://localhost:3001/sintra/reservation?roomId=1&checkIn=04/01/2026&checkOut=04/02/2026&adults=1&children=0`
   - Thank You: `http://localhost:3001/sintra/thank-you?bookingRef=TSH-2205&total=21735`

### Design Features

#### Home Page
- **Hero Slider**: Owl Carousel with 3 slides showcasing the hotel
- **Booking Form**: Date pickers, guest selection, room selection
- **Search Functionality**: Validates inputs and navigates to search results
- **About Section**: Hotel description with images
- **Room Carousel**: Flip cards showing room types

#### Search Results Page
- **Room Cards**: Alternating left/right layout
- **Room Information**: Image, name, price, facilities
- **Availability**: Shows rooms left count
- **Booking**: Direct booking button with parameters

#### Reservation Page
- **Two-Column Layout**: Form on left, summary on right
- **Personal Info Form**: Title, name, email, phone, address
- **Payment Options**: Online payment or 25% deposit
- **Reservation Summary**: Dark-themed sidebar with room details
- **Visual Indicators**: Check-in/out dates, nights, guests

#### Thank You Page
- **Confirmation Message**: Large thank you heading
- **Receipt Summary**: Complete booking details
- **Tax Breakdown**: Bed tax and GST
- **Important Notes**: Hotel policies and contact info
- **Print Function**: Print button for receipt

## Current Status

### ✅ Completed
- All CSS, JS, images, and fonts copied from old project
- Navbar component with full navigation
- Footer component with all sections
- Home page with slider and booking form
- Search results page with room listings
- Reservation page with form and summary
- Thank you page with receipt
- Routing configuration
- Layout wrapper component

### 🔄 Next Steps (For Later)
- Connect to actual HotelERP API endpoints
- Implement real date picker functionality (currently using text inputs)
- Add form validation
- Implement payment gateway integration
- Add loading states and error handling
- Make owl carousel and other jQuery plugins work properly in React
- Add responsive design improvements
- Implement actual room availability checking
- Add booking confirmation emails

## Design Consistency

The implementation maintains the original Sintra Hotel design:
- **Colors**: Blue (#2c5aa0), Teal (#00bcd4), Dark backgrounds
- **Typography**: Barlow, Barlow Condensed, Gilda Display fonts
- **Icons**: Flaticon and Themify icons
- **Layout**: Same structure as original .NET MVC views
- **Styling**: All original CSS preserved

## Notes

1. **Static Data**: Currently using mock/placeholder data. API integration needed.
2. **jQuery Plugins**: Some jQuery plugins may need React-specific initialization.
3. **Date Pickers**: Using text inputs; need proper React date picker integration.
4. **Images**: Ensure all image paths in `/public/img/` are correct.
5. **Responsive**: Original design is responsive; test on mobile devices.

## File Structure

```
HotelERP.Website/
├── public/
│   ├── css/           # Sintra Hotel CSS files
│   ├── js/            # Sintra Hotel JavaScript files
│   ├── img/           # All images (slider, rooms, etc.)
│   ├── fonts/         # Icon fonts
│   └── index.html     # Updated with Sintra assets
├── src/
│   ├── components/
│   │   └── Layout/
│   │       ├── Navbar.js
│   │       ├── Footer.js
│   │       └── SintraLayout.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── SintraSearchResults.js
│   │   ├── SintraReservation.js
│   │   └── SintraThankYou.js
│   └── App.js         # Routes configured
└── SINTRA_DESIGN_README.md
```

## Contact

For questions or issues with the Sintra Hotel design implementation, refer to the original project at:
`E:\GrowBiz Project\GrowBizLatestProects\TheSintraHotelUpd\SintraHotelProject`
