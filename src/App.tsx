import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import GameDetails from "./Pages/GameDetails";
import AnimeDiscover from "./Pages/AnimeDiscover";
import AnimeDetails from "./Pages/AnimeDetails";
import MovieDiscover from "./Pages/MovieDiscover";
import MovieDetails from "./Pages/MovieDetails";
import SignIn from "./Sign/SignIn";
import SignUp from "./Sign/SignUp";
import ResetPassword from "./Sign/ResetPassword";
import NotFound from "./Pages/NotFound";
import Library from "./Pages/Library";
import ConfigError from "./Pages/ConfigError";

import About from "./Pages/About";
import { clearDiscoverCache } from "./utils/discoverCache";
import { isFirebaseConfigured } from "./firebase/FirebaseConfig";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currPath = location.pathname;

    const isLeavingGames =
      (prevPath.startsWith("/discover") || prevPath.startsWith("/games")) &&
      !(currPath.startsWith("/discover") || currPath.startsWith("/games"));

    if (isLeavingGames) {
      clearDiscoverCache();
    }

    prevPathRef.current = currPath;
  }, [location.pathname]);

  if (!isFirebaseConfigured) {
    return <ConfigError />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/about" element={<About />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/animes" element={<AnimeDiscover />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/movies" element={<MovieDiscover />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin/reset" element={<ResetPassword />} />
      {/* <Route path="/test" element={<Test />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}

export default App;
