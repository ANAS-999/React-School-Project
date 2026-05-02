import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import GameDetails from "./Pages/GameDetails";
import AnimeDiscover from "./Pages/AnimeDiscover";
import AnimeDetails from "./Pages/AnimeDetails";
import About from "./Pages/About";
import UnderDevelopment from "./Pages/UnderDevelopment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/animes" element={<AnimeDiscover />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/movies" element={<UnderDevelopment />} />
    </Routes>
  );
}

export default App;
