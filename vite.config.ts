import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 1. Vite intercepts any request starting with '/api/igdb'
      '/api/igdb': {
        // 2. It magically points it to the real IGDB server
        target: 'https://api.igdb.com/v4', 
        changeOrigin: true,
        // 3. It strips away the '/api/igdb' part before sending it to IGDB
        rewrite: (path) => path.replace(/^\/api\/igdb/, ''), 
      },
    },
  },
});
