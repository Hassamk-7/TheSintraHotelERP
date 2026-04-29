import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isSearchResultsPage = location.pathname === '/search-results' || location.pathname === '/SearchResult/SearchResults';

  // Debug: Check if cart icon should display
  console.log('Debug - Path:', location.pathname);
  console.log('Debug - Is search results:', isSearchResultsPage);
  console.log('Debug - Total items:', totalItems);
  console.log('Debug - Should show cart:', isSearchResultsPage && totalItems > 0);

  // Debug: Log current path and cart display status
  console.log('Current path:', location.pathname);
  console.log('Is search results page:', isSearchResultsPage);
  console.log('Cart total items:', totalItems);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${isScrolled ? 'nav-scroll' : ''}`}>
      <div className="container">
        {/* Mobile View - Menu Left, Logo Center, Cart Right */}
        {isMobile ? (
          <>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbar" 
              aria-controls="navbar" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
              style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <span className="navbar-toggler-icon" style={{ width: '2.5em', height: '3.5em' }}>
                <i className="ti-menu" style={{ fontSize: 'large', color: isScrolled ? '#333' : '#fff' }}></i>
              </span>
            </button>
            
            <div className="logo-wrapper" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
              <Link className="logo" to="/">
                <img src={isScrolled ? '/img/logos/brown logo.png' : '/img/whitelogo.png'} className="logo-img" alt="Sintra Hotel" />
              </Link>
            </div>
            
            {/* Cart Icon - Only on Search Results Page */}
            {/* {isSearchResultsPage && ( */}
              <button
                onClick={() => window.dispatchEvent(new Event('openCart'))}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '20%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                <i className="ti-shopping-cart" style={{ fontSize: '18px', color: isScrolled ? '#333' : '#fff' }}></i>
                {totalItems > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#dc3545',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
           
          </>
        ) : (
          /* Desktop View - Original Layout with Cart */
          <>
            <div className="logo-wrapper">
              <Link className="logo" to="/">
                <img src={isScrolled ? '/img/logos/brown logo.png' : '/img/whitelogo.png'} className="logo-img" alt="Sintra Hotel" />
              </Link>
            </div>
            
            {/* Cart Icon for Desktop */}
            <button
              onClick={() => window.dispatchEvent(new Event('openCart'))}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              <i className="ti-shopping-cart" style={{ fontSize: '18px', color: isScrolled ? '#333' : '#fff' }}></i>
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#dc3545',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </>
        )}
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
              >
                Rooms & Suites<i className="ti-angle-down"></i>
              </a>
              <ul className="dropdown-menu">
                <li className="nav-item">
                  <Link className="dropdown-item" to="/rooms/executive">
                    <span>Executive Room</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="dropdown-item" to="/rooms/twin-executive">
                    <span>Twin Executive Room</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="dropdown-item" to="/rooms/super-deluxe">
                    <span>Super Deluxe Room</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gallery">Gallery</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/decor">Decor</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/places-activities">Places</Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                data-bs-auto-close="outside" 
                aria-expanded="false"
              >
                Cafe & Restaurant<i className="ti-angle-down"></i>
              </a>
              <ul className="dropdown-menu">
                <li className="nav-item">
                  <Link className="dropdown-item" to="/restaurant">
                    Spice Fusion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="dropdown-item" to="/restaurant">
                    Cafe SOIR
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
