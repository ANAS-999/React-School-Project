import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import GameDetails from "./Pages/GameDetails";
import AnimeDiscover from "./Pages/AnimeDiscover";
import AnimeDetails from "./Pages/AnimeDetails";
import UnderDevelopment from "./Pages/UnderDevelopment";
import About from "./Pages/About";
import { clearDiscoverCache } from "./utils/discoverCache";

function App() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currPath = location.pathname;

    // Check if we are leaving the Games context
    // The Games context includes "/discover" (Games page) and "/games/:id" (Game Details page)
    const isLeavingGames = 
      (prevPath.startsWith("/discover") || prevPath.startsWith("/games")) && 
      !(currPath.startsWith("/discover") || currPath.startsWith("/games"));

    if (isLeavingGames) {
      clearDiscoverCache();
    }

    prevPathRef.current = currPath;
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/animes" element={<AnimeDiscover />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/movies" element={<UnderDevelopment />} />
    </Routes>
  );
}

export default App;
