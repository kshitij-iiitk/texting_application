import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server:{
    port: 3000, 
    proxy: { //this is used to proxy API requests to the backend server
      // Change the target to your backend server URL
      // For example, if your backend is running on localhost:5000, use: http://localhost:5000
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  }
});
