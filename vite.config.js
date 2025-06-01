import { defineConfig } from "vite";

// if you use plugins like react, add them here
// import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // your config
  // plugins: [react()]
}));
