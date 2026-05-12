import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import "./Header.css";

import { auth, isFirebaseConfigured } from "../../firebase/FirebaseConfig";
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
    if (!isFirebaseConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);
  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setUserMenuOpen(false);
    } catch (err) {}
  };

  const userName =
    user?.displayName || (user?.email && user.email.split("@")[0]);

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

          {!user && (
            <div className="mobile-auth-buttons">
              <button
                className="btn btn-secondary mobile-auth-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/signin", { state: { from: location.pathname } });
                }}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary mobile-auth-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/signup", { state: { from: location.pathname } });
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          {user && (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <Icon icon="fa-solid fa-user" className="mobile-user-icon" />
                <span className="mobile-user-name">{userName}</span>
              </div>
              <button
                className="btn sign-out-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
              >
                <Icon icon="fa-solid fa-sign-out-alt" />
                Sign Out
              </button>
            </div>
          )}
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
                  icon={
                    userMenuOpen
                      ? "fa-solid fa-chevron-up"
                      : "fa-solid fa-chevron-down"
                  }
                  className="chevron-icon"
                />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <button
                    className="dropdown-item sign-out"
                    onClick={handleSignOut}
                  >
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
                onClick={() => navigate("/signin", { state: { from: location.pathname } })}
              >
                Sign In
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/signup", { state: { from: location.pathname } })}
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
