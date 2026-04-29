import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import GameDetails from "./Pages/GameDetails";
import UnderDevelopment from "./Pages/UnderDevelopment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/movies" element={<UnderDevelopment />} />
      <Route path="/animes" element={<UnderDevelopment />} />
    </Routes>
  );
}

export default App;
