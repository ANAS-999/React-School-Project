import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import "./Header.css";

import { auth } from "../../firebase/FirebaseConfig";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      console.log("User : " + u?.displayName);
      
    });
    return unsubscribe;
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const userName = user?.displayName || (user?.email && user.email.split("@")[0]);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo" onClick={handleLogoClick}>
          <Icon icon="fa-solid fa-gem" size="lg" className="logo-icon" />
          <span className="logo-text">NeonHub</span>
        </Link>

        <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
            onClick={handleNavClick}
          >
            Home
          </Link>
          <Link
            to="/discover"
            className={location.pathname === "/discover" ? "active" : ""}
            onClick={handleNavClick}
          >
            Games
          </Link>
          <Link
            to="/movies"
            className={location.pathname === "/movies" ? "active" : ""}
            onClick={handleNavClick}
          >
            Movies
          </Link>
          <Link
            to="/animes"
            className={location.pathname === "/animes" ? "active" : ""}
            onClick={handleNavClick}
          >
            Animes
          </Link>
          <Link
            to="/library"
            className={location.pathname === "/library" ? "active" : ""}
            onClick={handleNavClick}
          >
            Library
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
            onClick={handleNavClick}
          >
            About
          </Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <Icon icon="fa-solid fa-user" className="user-icon" />
                <span className="user-name">{userName}</span>
                <Icon 
                  icon={userMenuOpen ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"} 
                  className="chevron-icon" 
                />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); navigate("/library"); }}>
                    <Icon icon="fa-solid fa-bookmark" />
                    <span>My Library</span>
                  </button>
                  <button className="dropdown-item sign-out" onClick={handleSignOut}>
                    <Icon icon="fa-solid fa-sign-out-alt" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <button
          className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
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
