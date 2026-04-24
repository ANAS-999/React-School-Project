import { useState } from 'react';
import { Icon } from './Icon';
import './Header.css';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Icon icon="fa-gamepad" size="lg" className="logo-icon" />
          <span className="logo-text">EntertainHub</span>
        </div>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#games" onClick={() => setMobileMenuOpen(false)}>Games</a>
          <a href="#movies" onClick={() => setMobileMenuOpen(false)}>Movies</a>
          <a href="#animes" onClick={() => setMobileMenuOpen(false)}>Animes</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
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
