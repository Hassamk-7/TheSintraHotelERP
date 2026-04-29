import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartModal from '../CartModal';

const SintraLayout = ({ children }) => {
  const [cartModalOpen, setCartModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenCart = () => setCartModalOpen(true);
    const handleCloseCart = () => setCartModalOpen(false);

    window.addEventListener('openCart', handleOpenCart);
    window.addEventListener('closeCart', handleCloseCart);

    return () => {
      window.removeEventListener('openCart', handleOpenCart);
      window.removeEventListener('closeCart', handleCloseCart);
    };
  }, []);

  return (
    <div className="sintra-layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartModal 
        open={cartModalOpen} 
        onClose={() => setCartModalOpen(false)} 
      />
    </div>
  );
};

export default SintraLayout;
