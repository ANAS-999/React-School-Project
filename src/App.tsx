import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import GameDetails from "./Pages/GameDetails";
import AnimeDiscover from "./Pages/AnimeDiscover";
import AnimeDetails from "./Pages/AnimeDetails";
import UnderDevelopment from "./Pages/UnderDevelopment";
import About from "./Pages/About";

function App() {
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
