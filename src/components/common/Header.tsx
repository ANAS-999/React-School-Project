import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import './Header.css';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <Icon icon="fa-solid fa-gem" size="lg" className="logo-icon" />
          <span className="logo-text">NeonHub</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={handleNavClick}>Home</Link>
          <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''} onClick={handleNavClick}>Games</Link>
          <Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''} onClick={handleNavClick}>Movies</Link>
          <Link to="/animes" className={location.pathname === '/animes' ? 'active' : ''} onClick={handleNavClick}>Animes</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={handleNavClick}>About</Link>
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
