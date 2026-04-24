import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContentGrid } from './components/ContentGrid';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import './App.css';

// Sample data for games
const GAMES = [
  {
    id: 1020,
    title: "Grand Theft Auto V",
    image: "https://images.igdb.com/igdb/image/upload/t_1080p/co2lbd.jpg",
    rating: 89.6,
    year: 2013,
    genre: "Action-Adventure",
    hypes: 500
  },
  {
    id: 115,
    title: "League of Legends",
    image: "https://images.igdb.com/igdb/image/upload/t_1080p/co49wj.jpg",
    rating: 85.0,
    year: 2009,
    genre: "MOBA",
    hypes: 200
  },
  {
    id: 121,
    title: "Minecraft",
    image: "https://images.igdb.com/igdb/image/upload/t_1080p/co49x5.jpg",
    rating: 88.0,
    year: 2011,
    genre: "Sandbox",
    hypes: 150
  },
];

// Sample data for movies
const MOVIES = [
  {
    id: '1',
    title: 'Inception',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    rating: 8.8,
    year: 2010,
    genre: 'Sci-Fi',
    description: 'A mind-bending thriller about dreams within dreams',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    rating: 9.0,
    year: 2008,
    genre: 'Action',
    description: 'Batman faces the Joker in a battle for Gotham City',
  },
  {
    id: '3',
    title: 'Interstellar',
    image: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10543523_p_v8_as.jpg',
    rating: 8.6,
    year: 2014,
    genre: 'Sci-Fi',
    description: 'A team of explorers travel through a wormhole in space',
  },
];

// Sample data for animes
const ANIMES = [
  {
    id: '1',
    title: 'Demon Slayer',
    image: 'https://demonslayer-hinokami.sega.com/img/purchase/digital-deluxe.jpg',
    rating: 8.7,
    year: 2019,
    genre: 'Action',
    description: 'A young man seeks to save his sister cursed by demons',
  },
  {
    id: '2',
    title: 'Attack on Titan',
    image: 'https://images.wall-art.de/format:webp/q:90/rs:fit:332:/_img/out/pictures/master/product/1/66601.jpg',
    rating: 9.0,
    year: 2013,
    genre: 'Action',
    description: 'Humanity fights giant humanoid creatures threatening extinction',
  },
  {
    id: '3',
    title: 'One Piece',
    image: 'https://preview.redd.it/what-is-it-that-makes-one-piece-so-popular-v0-0u2aefrzacmc1.jpeg?auto=webp&s=43de34e87b70807ecd9f720e44ca6993656f7258',
    rating: 8.7,
    year: 1999,
    genre: 'Adventure',
    description: 'A young pirate sets sail to find the ultimate treasure',
  },
];

function App() {
  const handleDiscoverClick = (type: string) => {
    console.log(`Navigating to discover page for ${type}`);
    // In the future, this will navigate to the discover page
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ContentGrid
          id="games"
          title="Top Games"
          subtitle="Discover the most played and highly-rated games"
          items={GAMES}
          type="games"
          onDiscoverClick={handleDiscoverClick}
        />
        <ContentGrid
          id="movies"
          title="Top Movies"
          subtitle="Find your next favorite movie to watch"
          items={MOVIES}
          type="movies"
          onDiscoverClick={handleDiscoverClick}
        />
        <ContentGrid
          id="animes"
          title="Top Animes"
          subtitle="Explore the best anime series and movies"
          items={ANIMES}
          type="animes"
          onDiscoverClick={handleDiscoverClick}
        />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;

