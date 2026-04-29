import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import HomePage from './pages/HomePage';
import SearchResults from './pages/SearchResults';
import RoomDetails from './pages/RoomDetails';
import Payment from './pages/Payment';
import Rooms from './pages/Rooms';
import GalleryDynamic from './pages/GalleryDynamic';
import RestaurantDynamic from './pages/RestaurantDynamic';
import BlogsDynamic from './pages/BlogsDynamic';
import BlogDetailsDynamic from './pages/BlogDetailsDynamic';

// Sintra Hotel Design Pages
import SintraLayout from './components/Layout/SintraLayout';
import Home from './pages/Home';
import SintraAbout from './pages/SintraAbout';
import SintraDecor from './pages/SintraDecor';
import SintraPlacesActivities from './pages/SintraPlacesActivities';
import SintraRoomDetails from './pages/SintraRoomDetails';
import SintraContact from './pages/SintraContact';
import SintraSearchResults from './pages/SintraSearchResults';
import SintraReservation from './pages/SintraReservation';
import SintraThankYou from './pages/SintraThankYou';
import SintraCart from './pages/SintraCart';
import { CartProvider } from './context/CartContext';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <div style={{ minHeight: '100vh' }}>
          <main>
            <Routes>
              {/* Sintra Hotel Design Routes - Now Primary */}
              <Route path="/" element={<SintraLayout><Home /></SintraLayout>} />
              <Route path="/about" element={<SintraLayout><SintraAbout /></SintraLayout>} />
              <Route path="/decor" element={<SintraLayout><SintraDecor /></SintraLayout>} />
              <Route path="/places-activities" element={<SintraLayout><SintraPlacesActivities /></SintraLayout>} />
              <Route path="/rooms/:slug" element={<SintraLayout><SintraRoomDetails /></SintraLayout>} />
              <Route path="/contact" element={<SintraLayout><SintraContact /></SintraLayout>} />
              <Route path="/search-results" element={<SintraLayout><SintraSearchResults /></SintraLayout>} />
              <Route path="/SearchResult/SearchResults" element={<SintraLayout><SintraSearchResults /></SintraLayout>} />
              <Route path="/reservation" element={<SintraLayout><SintraReservation /></SintraLayout>} />
              <Route path="/thank-you" element={<SintraLayout><SintraThankYou /></SintraLayout>} />
              <Route path="/gallery" element={<SintraLayout><GalleryDynamic /></SintraLayout>} />
              <Route path="/restaurant" element={<SintraLayout><RestaurantDynamic /></SintraLayout>} />
              <Route path="/blogs" element={<SintraLayout><BlogsDynamic /></SintraLayout>} />
              <Route path="/blog" element={<SintraLayout><BlogsDynamic /></SintraLayout>} />
              <Route path="/blog/:slug" element={<SintraLayout><BlogDetailsDynamic /></SintraLayout>} />
              
              {/* Keep old HotelERP routes for backward compatibility */}
              <Route path="/old" element={<><Navbar /><HomePage /><Footer /><FloatingButtons /></>} />
              <Route path="/search" element={<><Navbar /><SearchResults /><Footer /><FloatingButtons /></>} />
              <Route path="/room/:id" element={<><Navbar /><RoomDetails /><Footer /><FloatingButtons /></>} />
              <Route path="/payment" element={<><Navbar /><Payment /><Footer /><FloatingButtons /></>} />
              <Route path="/rooms" element={<><Navbar /><Rooms /><Footer /><FloatingButtons /></>} />
            </Routes>
          </main>
        </div>
      </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
