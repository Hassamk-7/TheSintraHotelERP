# 🏨 LuxuryHotel - Hotel Management System

A modern, responsive hotel management system built with React and Tailwind CSS. This comprehensive web application provides a complete booking experience for customers with beautiful UI/UX design and all essential hotel management features.

## ✨ Features

### 🏠 **Home Page**
- Hero section with image slider
- Advanced search functionality with date picker
- Location-based search (Islamabad, Lahore, Karachi, All)
- Guest and room selection (Adults, Children, Number of rooms)
- Featured rooms showcase
- Blog section with latest updates
- Responsive design for all devices

### 🔍 **Search & Booking**
- **Smart Search**: Date-wise availability checking
- **Location Filter**: All locations or specific cities
- **Guest Management**: Adult (default: 1), Children (default: 0), Rooms (default: 1)
- **Advanced Filters**: Price range, amenities, room categories
- **Multiple Room Selection**: Add multiple rooms from different categories
- **Real-time Availability**: Shows available room count

### 🛏️ **Room Categories**
- **Standard Studio**: Comfortable and affordable (PKR 8,000 - 12,000)
- **Deluxe Studio**: Premium amenities and views (PKR 15,000 - 22,000)
- **Executive Room**: Business-class accommodation (PKR 25,000 - 35,000)
- **VVIP Room**: Ultimate luxury experience (PKR 45,000 - 80,000)
- **Primary Room**: Well-appointed modern rooms (PKR 12,000 - 18,000)

### 📋 **Booking Process**
1. **Room Selection**: Choose from available rooms with quantity options
2. **Guest Information**: Complete guest details form
3. **Payment Options**: Credit card or pay at hotel
4. **Confirmation**: Booking confirmation with reference number
5. **Thank You Page**: Complete booking summary and next steps

### 🍽️ **Restaurant & Dining**
- **Multiple Restaurants**: Different locations with unique specialties
- **Diverse Menu**: Pakistani, Continental, and Chinese cuisine
- **Visual Menu**: High-quality food images with descriptions
- **Price Display**: Clear pricing in PKR
- **Dietary Options**: Vegetarian and spicy food indicators
- **Location-based Availability**: Menu items available by location

### 🖼️ **Gallery**
- **Categorized Images**: Rooms, Restaurant, Facilities, Exterior
- **Lightbox View**: Full-screen image viewing with navigation
- **High-Quality Images**: Professional photography showcase
- **Interactive Navigation**: Easy browsing between categories

### 📞 **Contact & Support**
- **Multiple Locations**: Contact details for all hotel branches
- **Contact Form**: Direct messaging system
- **Interactive Maps**: Google Maps integration
- **24/7 Support**: Emergency contact information
- **Live Chat**: Instant customer support

## 🛠️ **Technology Stack**

- **Frontend**: React 19.1.1
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: React DatePicker
- **Build Tool**: Create React App
- **Package Manager**: npm

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 📁 **Project Structure**

```
hotel-management-system/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── Navbar.js          # Navigation component
│   │   ├── Footer.js          # Footer component
│   │   ├── SearchForm.js      # Search functionality
│   │   └── RoomCard.js        # Room display component
│   ├── pages/
│   │   ├── HomePage.js        # Landing page
│   │   ├── SearchResults.js   # Search results page
│   │   ├── RoomDetails.js     # Individual room details
│   │   ├── Reservation.js     # Booking process
│   │   ├── Payment.js         # Payment processing
│   │   ├── ThankYou.js        # Booking confirmation
│   │   ├── Contact.js         # Contact page
│   │   ├── Rooms.js           # All rooms listing
│   │   ├── Gallery.js         # Image gallery
│   │   └── Restaurant.js      # Restaurant & menu
│   ├── App.js                 # Main app component
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Dependencies and scripts
```

## 🎨 **Design Features**

### **Color Scheme**
- **Primary**: Blue tones for trust and professionalism
- **Gold**: Accent color for luxury and premium features
- **Neutral**: Gray scale for content and backgrounds

### **Typography**
- **Headings**: Playfair Display (serif) for elegance
- **Body**: Inter (sans-serif) for readability

### **Components**
- **Cards**: Consistent card design with shadows and hover effects
- **Buttons**: Primary and secondary button styles
- **Forms**: Styled input fields with focus states
- **Navigation**: Sticky header with mobile-responsive menu

## 🌟 **Key Features Implemented**

### ✅ **Search Functionality**
- Date range selection with validation
- Location filtering (All, Islamabad, Lahore, Karachi)
- Guest count selection (Adults: 1-6, Children: 0-4)
- Room quantity selection (1-5 rooms)
- Real-time search results

### ✅ **Room Management**
- Multiple room categories with detailed information
- High-quality room images and descriptions
- Amenity listings with icons
- Pricing display in PKR
- Availability status

### ✅ **Booking System**
- Multi-step booking process
- Guest information collection
- Payment method selection (Credit Card / Pay at Hotel)
- Booking confirmation with reference number
- Email confirmation simulation

### ✅ **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Accessible navigation

## 🔮 **Future Enhancements**

### **Backend Integration Ready**
- API endpoints structure prepared
- Data models designed for SQL Server
- Authentication system ready for implementation
- Payment gateway integration points identified

### **Planned Features**
- User authentication and profiles
- Real-time availability checking
- Email notifications
- Admin dashboard
- Inventory management
- Reporting and analytics
- Multi-language support
- Currency conversion

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

For support and questions:
- Email: support@luxuryhotel.com
- Phone: +92 300 1234567
- Website: [LuxuryHotel.com](https://luxuryhotel.com)

## 🙏 **Acknowledgments**

- **Unsplash** for high-quality images
- **Lucide** for beautiful icons
- **Tailwind CSS** for the utility-first CSS framework
- **React** community for excellent documentation and support

---

**Built with ❤️ for the hospitality industry in Pakistan**
