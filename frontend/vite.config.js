import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
  plugins: [
    react(),
    EnvironmentPlugin({
      VITE_FIREBASE_API_KEY: "",
      VITE_FIREBASE_AUTH_DOMAIN: "",
      VITE_FIREBASE_DATABASE_URL: "",
      VITE_FIREBASE_PROJECT_ID: "",
      VITE_FIREBASE_STORAGE_BUCKET: "",
      VITE_FIREBASE_MESSAGING_SENDER_ID: "",
      VITE_FIREBASE_APP_ID: "",
      VITE_FIREBASE_MEASUREMENT_ID: "",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ['firebase/app', 'firebase/auth', 'firebase/analytics']
    }
  }
});
