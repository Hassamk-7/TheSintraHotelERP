# HotelERP Customer Website

## Overview
This is the **customer-facing hotel booking website** for the HotelERP System. It allows guests to:
- Search and browse available rooms
- Make online reservations
- View room details and amenities
- Make online payments or choose cash payment at counter
- Receive booking confirmation emails
- View restaurant menu and services
- Contact the hotel
- View gallery and blog posts

## Project Structure

```
HotelERP.Website/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navbar.js      # Navigation bar
│   │   ├── Footer.js      # Footer component
│   │   ├── SearchForm.js  # Room search form
│   │   └── RoomCard.js    # Room display card
│   ├── pages/             # Page components
│   │   ├── HomePage.js    # Landing page
│   │   ├── Rooms.js       # Room listing
│   │   ├── RoomDetails.js # Individual room details
│   │   ├── Reservation.js # Booking form
│   │   ├── Payment.js     # Payment processing
│   │   ├── ThankYou.js    # Booking confirmation
│   │   ├── Restaurant.js  # Restaurant menu
│   │   ├── Gallery.js     # Photo gallery
│   │   ├── Blogs.js       # Blog listing
│   │   ├── BlogDetails.js # Individual blog post
│   │   ├── Contact.js     # Contact form
│   │   └── SearchResults.js # Search results
│   ├── config/            # Configuration files
│   │   └── api.js         # API configuration
│   ├── utils/             # Utility functions
│   │   └── axios.js       # Axios instance
│   ├── App.js             # Main app component
│   ├── theme.js           # Material-UI theme
│   └── index.js           # Entry point
└── package.json           # Dependencies

```

## Technology Stack

- **React 19** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **React Router** - Navigation
- **Axios** - API calls
- **Day.js** - Date handling
- **Lucide React** - Icons
- **React DatePicker** - Date selection

## Ports

- **Admin Dashboard (HotelERP.Admin)**: http://localhost:5173 (Vite)
- **Customer Website (HotelERP.Website)**: http://localhost:3001 (React Scripts)
- **API Server (HotelERP.API)**: http://localhost:5146

## Installation

```bash
cd E:\HotelERP\HotelERP.Website
npm install
```

## Running the Application

```bash
# Development mode
npm start

# Build for production
npm run build
```

## API Integration

The website connects to the HotelERP API for:
- Room availability and booking
- Restaurant menu
- Gallery images
- Contact form submissions
- Payment processing

API configuration is in `src/config/api.js`

## Features

### 1. Room Search & Booking
- Search rooms by date, guests, and room type
- View available rooms with pricing
- Real-time availability checking
- Detailed room information with images
- Amenities and features display

### 2. Online Reservation
- Multi-step booking process
- Guest information collection
- Special requests handling
- Booking summary and confirmation

### 3. Payment Options
- Online payment integration
- Cash payment at counter option
- Secure payment processing
- Payment confirmation

### 4. Email Notifications
- Booking confirmation emails
- Payment receipts
- Booking reminders

### 5. Restaurant
- Browse menu items
- View prices and descriptions
- Category filtering

### 6. Gallery
- Hotel photos
- Room images
- Facility showcase

### 7. Blog
- Travel tips
- Hotel news
- Local attractions

### 8. Contact
- Contact form
- Hotel information
- Location map

## Deployment

### Development
```bash
npm start
```
Runs on http://localhost:3001

### Production Build
```bash
npm run build
```
Creates optimized build in `build/` folder

### Deploy to Live Server
Copy the `build/` folder contents to your web server's public directory.

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
REACT_APP_API_URL=https://apisintra.clouddevnest.com/api
REACT_APP_PAYMENT_KEY=your_payment_gateway_key
```

## Notes

- This is a **separate project** from the admin dashboard (HotelERP.Admin)
- Admin dashboard is for hotel staff management
- Customer website is for guest bookings and information
- Both connect to the same HotelERP API backend
- Uses Material-UI for consistent, professional design
- Fully responsive for mobile, tablet, and desktop

## Support

For issues or questions, contact the development team.
