import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Discover from "./Pages/Discover";
import GameDetails from "./Pages/GameDetails";
import AnimeDiscover from "./Pages/AnimeDiscover";
import AnimeDetails from "./Pages/AnimeDetails";
import UnderDevelopment from "./Pages/UnderDevelopment";
import MovieHero from "./components/discover/MovieHero";
import MovieDiscover from "./Pages/MovieDiscover";
import MovieDetails from "./Pages/MovieDetails";
import SignIn from "./Sign/SignIn";
import SignUp from "./Sign/SignUp";
import ResetPassword from "./Sign/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/animes" element={<AnimeDiscover />} />
      <Route path="/anime/:id" element={<AnimeDetails />} />
      <Route path="/movies" element={<MovieDiscover />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/signin" element={<SignIn />}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/signin/reset" element={<ResetPassword/>}/>

    </Routes>
  );
}

export default App;
