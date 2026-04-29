import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import './Header.css';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <Icon icon="fa-gamepad" size="lg" className="logo-icon" />
          <span className="logo-text">EntertainHub</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Games</Link>
          <Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Movies</Link>
          <Link to="/animes" className={location.pathname === '/animes' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Animes</Link>
        </nav>

        <div className="header-actions">
          <button className="btn btn-secondary">Sign In</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>

        <button 
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};
