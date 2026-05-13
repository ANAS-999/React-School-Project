# 🌟 NeonHub: Games, Movies, & Anime

Welcome to **NeonHub**, a comprehensive React-based platform where you can discover, explore, and track your favorite games, movies, and anime all in one place. With an elegant UI, responsive design, and robust API integrations, this project centralizes your entertainment experience.

---

## 🚀 Advantages & Key Features
- **All-in-One Discovery**: Browse high-quality catalogs for Video Games, Movies, and Anime.
- **Unified Library System**: Authenticate via Firebase to save your favorite media across all categories into a personalized "My Library".
- **Responsive UI/UX**: Built with modern CSS (glassmorphism, glossy hover effects, smooth transitions) and fully mobile-friendly layouts for all devices.
- **State-of-the-Art Animations**: Uses GSAP and Spline for fluid, engaging 3D interactions and page transitions.
- **Smart Navigation**: Smooth scroll-to-top behaviors, intelligent routing, and seamless redirection after authentication flows.

---

## 📋 Requirements Specification

### Functional Requirements
- **Media Exploration**: Users can browse, search, and dynamically filter vast catalogs of games, movies, and anime based on genres, release years, platforms, and popularity.
- **Detailed Insights**: Users can view comprehensive details for each item, including synopses, system requirements, cast, related media, and embedded playable trailers.
- **User Authentication**: Secure sign-up, sign-in, and password reset functionalities using email/password or third-party providers (Google, GitHub).
- **Personalized Library**: Authenticated users can add or remove items from their personal collection, which is categorized intelligently by media type.
- **Streaming Availability**: For movies and anime, users can see where to legally watch the content via integrated streaming provider links.

### Non-Functional Requirements
- **Performance**: The application utilizes Vite for ultra-fast hot module replacement (HMR) during development and highly optimized static builds for production.
- **Security**: Strict route protection for authenticated areas and secure environment variable handling for all sensitive API keys. Database privacy is enforced via Backend-as-a-Service (BaaS) security rules.
- **Usability**: Intuitive user interface with interactive feedback (hover states, loaders) and graceful error handling (NotFound/ConfigError pages).
- **Scalability**: Component-driven architecture using React 19 and strict typing via TypeScript ensures the codebase remains maintainable as new features are added.

---

## 🏗️ Application Architecture

NeonHub follows a modern **Client-Side Rendering (CSR)** architecture built as a Single Page Application (SPA):

1. **Presentation Layer (Frontend)**: Developed with React 19 and TypeScript. It handles the user interface, state management, complex 3D/GSAP animations, and client-side routing via React Router v7.
2. **Data Fetching Layer**: Utilizes asynchronous API calls to aggregate data from three distinct external RESTful APIs (IGDB, TMDB, Jikan) to populate the frontend in real-time.
3. **Backend-as-a-Service (BaaS) Layer**: Powered by Firebase v12. 
   - *Firebase Auth* acts as the identity provider, issuing secure session tokens.
   - *Cloud Firestore* acts as the real-time NoSQL database, storing personalized user data (the "My Library" collections) linked to unique User IDs.

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

### Backend & Cloud
- **Firebase Authentication**: Supports Email/Password, Google, and GitHub providers.
- **Cloud Firestore**: Real-time NoSQL database used to store users' personalized media libraries.

---

## 🔌 APIs Integrated
This application pulls extensive data from three major external APIs to keep content up to date:
1. **IGDB API (Twitch)**: Provides comprehensive video game data, screenshots, ratings, and release information.
2. **TMDB API (The Movie Database)**: Delivers detailed movie synopses, cast details, trailers, and streaming provider availability ("Watch On").
3. **Jikan API (MyAnimeList)**: Unofficial MyAnimeList API supplying anime statistics, trailer links, and related media.

---

## 📁 Folder Structure

```text
📦 neonhub
 ┣ 📂 public           # Static public assets (favicon, icons, etc.)
 ┣ 📂 src
 ┃ ┣ 📂 api            # External API integrations (IGDB, TMDB, Jikan)
 ┃ ┣ 📂 assets         # Local images, SVG icons, and global styling variables
 ┃ ┣ 📂 components     # Reusable UI components
 ┃ ┃ ┣ 📂 common       # Shared components (Header, Footer, Icon, EmptyState, etc.)
 ┃ ┃ ┣ 📂 discover     # Discover page components (Cards, Filters, Heroes)
 ┃ ┃ ┗ 📂 home         # Home page components (Hero, Contact, ContentGrid)
 ┃ ┣ 📂 firebase       # Firebase configuration and authentication service
 ┃ ┣ 📂 models         # TypeScript type definitions and models
 ┃ ┣ 📂 Pages          # Page-level components (Home, Discover, Details, Library, etc.)
 ┃ ┣ 📂 Sign           # Authentication components (SignIn, SignUp, ResetPassword)
 ┃ ┣ 📂 utils          # Helper functions (imageUtils, discoverCache)
 ┃ ┣ 📜 App.tsx        # Main application component and Router configuration
 ┃ ┣ 📜 App.css        # Global application styles
 ┃ ┣ 📜 index.css      # Global CSS variables and base styles
 ┃ ┣ 📜 main.tsx       # Application entry point
 ┃ ┣ 📜 types.ts       # Global TypeScript interfaces and types
 ┃ ┗ 📜 ICONS_REFERENCE.ts  # FontAwesome icon reference guide
 ┣ 📜 .env             # Environment variables (API keys, Firebase config)
 ┣ 📜 .env.example     # Template for environment variables
 ┣ 📜 .gitignore       # Git ignore rules
 ┣ 📜 eslint.config.js # ESLint configuration
 ┣ 📜 index.html       # HTML template
 ┣ 📜 package.json     # Project dependencies and scripts
 ┣ 📜 tsconfig.json    # TypeScript configuration
 ┗ 📜 vite.config.ts   # Vite bundler configuration