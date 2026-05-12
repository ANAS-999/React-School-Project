# 🌟 Entertainment Hub: Games, Movies, & Anime

Welcome to the **Entertainment Hub**, a comprehensive React-based platform where you can discover, explore, and track your favorite games, movies, and anime all in one place. With an elegant UI, responsive design, and robust API integrations, this project centralizes your entertainment experience.

---

## 🚀 Advantages & Key Features
- **All-in-One Discovery**: Browse high-quality catalogs for Video Games, Movies, and Anime.
- **Unified Library System**: Authenticate via Firebase to save your favorite media across all categories into a personalized "My Library".
- **Responsive UI/UX**: Built with modern CSS (glassmorphism, glossy hover effects, smooth transitions) and fully mobile-friendly layouts for all devices.
- **State-of-the-Art Animations**: Uses GSAP and Spline for fluid, engaging 3D interactions and page transitions.
- **Smart Navigation**: Smooth scroll-to-top behaviors, intelligent routing, and seamless redirection after authentication flows.

---

## 🛠️ Tools & Technologies Used
### Frontend Architecture
- **React 19**: Modern UI component architecture with hooks.
- **TypeScript**: Strict typing for highly reliable, bug-free code.
- **Vite**: Ultra-fast hot module replacement (HMR) and optimized builds.
- **React Router v7**: Advanced client-side routing.

### Styling & Animation
- **CSS3 Modules / Scoped CSS**: Each page uses its own dedicated CSS file to prevent global style conflicts (`GameDetails.css`, `AnimeDetails.css`, etc.).
- **GSAP (GreenSock)**: Powerful JavaScript animations.
- **@splinetool/react-spline**: Interactive 3D graphics integration.
- **FontAwesome (v7)**: Extensive icon library.

### Backend & Cloud (Firebase v12)
- **Firebase Authentication**: Supports Email/Password, Google, and GitHub providers.
- **Cloud Firestore**: Real-time NoSQL database used to store users' personalized media libraries.

---

## 🔌 APIs Integrated
This application pulls extensive data from three major external APIs to keep content up to date:
1. **IGDB API (Twitch)**: Provides comprehensive video game data, screenshots, ratings, and release information.
2. **TMDB API (The Movie Database)**: Delivers detailed movie synopses, cast details, trailers, and streaming provider availability ("Watch On").
3. **Jikan API (MyAnimeList)**: Unofficial MyAnimeList API supplying anime statistics, trailer links, and related media.

---

## 🗺️ Navigation & Pages
The application utilizes a robust routing system mapped in `App.tsx`:

- **`/` (Home)**: The landing page featuring a 3D Spline interactive hero section and top-level statistics for the platform.
- **`/discover` (Game Discover)**: Browse, search, and filter the video game database.
- **`/games/:id` (Game Details)**: Deep dive into a specific game, showcasing media, requirements, and an "Add to Library" capability.
- **`/movies` & `/movies/:id`**: Dedicated discovery and detail pages for movies. Features a glassmorphic "Watch On" streaming provider section and cast information.
- **`/animes` & `/anime/:id`**: Dedicated discovery and detail pages for anime. Includes standardized embedded trailers and quick external links.
- **`/library` (My Library)**: A secured route displaying saved items. Features custom glossy delete buttons on hover and distinct UI categorizations for games, movies, and anime.
- **`/signin`, `/signup`, `/signin/reset`**: Authentication flows. Integrates smart redirects (returns you to the page you were originally browsing after logging in).
- **`/about`**: Details about the platform and its creators.
- **`/` (NotFound / ConfigError)**: Graceful error handling for missing routes or unconfigured Firebase environments.

---

## 🔒 Firebase Security & Privacy
Security is a top priority in handling user libraries and authentication.

1. **Authentication Protection**:
   - Routes like `/library` require an active user session. Unauthenticated users are redirected to `/signin`.
   - Loading states (`authLoading`) prevent UI flickering while Firebase verifies the user's session token.
2. **Firestore Rules (Privacy)**:
   - Data is scoped to the user ID (`uid`). Users can only Read, Update, or Delete (RUD) items inside their own dedicated Firestore document/collection.
   - The frontend queries Firestore using the authenticated user's `uid` to guarantee privacy of their "My Library" contents.
3. **Environment Security**:
   - API keys and secrets (Firebase config, IGDB Client ID, TMDB Key) are strictly maintained in `.env` variables and never committed to the repository. The `ConfigError` page intercepts the UI gracefully if these keys are missing.

---

## 💻 Setup & Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file based on `.env.example` and populate it with your Firebase, IGDB, and TMDB keys.
4. Run `npm run dev` to start the Vite development server.
5. Visit `http://localhost:5173`.
