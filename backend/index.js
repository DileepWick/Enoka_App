import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

// Create the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
import gasketRoutes from './routes/gasketRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import engineRoutes from './routes/engineRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import deliveryItemRoutes from './routes/deliveryItemRoutes.js';

// Production-specific settings
if (process.env.NODE_ENV === "production") {
  // Serve frontend static files
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Serve index.html for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Root API route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to ENOKA MOTORS");
});

// Use API routes
app.use('/api/gaskets', gasketRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/engines', engineRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/deliveryItems', deliveryItemRoutes);

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// Connect to MongoDB
mongoose
  .connect(mongoDBURL)
  .then(() => console.log("Database connected."))
  .catch((err) => console.error("Error connecting to MongoDB", err));
