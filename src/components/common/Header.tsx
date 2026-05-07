import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import './Header.css';
import { auth } from '../../firebase/FirebaseConfig';
import { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleSignIn=()=>{
      navigate('/signin');
  }
  const handleSignUp=()=>{
      navigate('/signin');
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);
   const handleSignOut = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will update the UI; navigate home afterwards
      navigate('/');
    } catch (err) {
      console.error('Sign out error', err);
    }
  };
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <Icon icon="fa-gamepad" size="lg" className="logo-icon" />
          <span className="logo-text">EntertainHub</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => handleNavClick('/')}>Home</Link>
          <Link to="/discover" className={location.pathname === '/discover' ? 'active' : ''} onClick={() => handleNavClick('/discover')}>Games</Link>
          <Link to="/movies" className={location.pathname === '/movies' ? 'active' : ''} onClick={() => handleNavClick('/movies')}>Movies</Link>
          <Link to="/animes" className={location.pathname === '/animes' ? 'active' : ''} onClick={() => handleNavClick('/animes')}>Animes</Link>
        </nav>

        <div className="header-actions">
          {user ? (
            // When signed in show greeting with the user's display name or email prefix and a sign out button
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="header-greeting">Hello {user.displayName || (user.email && user.email.split('@')[0])}</div>
              <button className="btn SignOut-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
          ) : (
            <>
              <button className="btn btn-secondary"  onClick={()=>navigate("/signin")} >Sign In</button>
              <button className="btn btn-primary" onClick={()=>navigate("/signup")}>Sign Up</button>
            </>
          )}
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
