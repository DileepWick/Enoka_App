import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from 'fs';

console.log("Vite config loaded!");

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'http-to-https-hsts',
      configureServer(server) {
        // Middleware for HTTP to HTTPS redirection and setting HSTS
        server.middlewares.use((req, res, next) => {
          // Redirect HTTP to HTTPS if necessary
          if (req.headers['x-forwarded-proto'] !== 'https' && req.connection.encrypted !== true) {
            res.writeHead(301, {
              Location: `https://${req.headers.host}${req.url}`,
            });
            res.end();
            return;
          }

          // Set HSTS header for HTTPS connections
          res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
          next();
        });
      },
    },
  ],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "./.cert/private.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "./.cert/certificate.crt")),
    },
    host: true, // Allow access from network devices
    port: 443, // Specify your desired port
    // middlewareMode: true, // Enable middleware mode
  },
  envPrefix: 'VITE_', // Vite defaults to this, but it's good to be explicit
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@@": path.resolve(__dirname, "./"),
    },
  }
});
