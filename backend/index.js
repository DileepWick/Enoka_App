import express from "express";
import mongoose from "mongoose";


//Routes
import gasketRoutes from './routes/gasketRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import engineRoutes from './routes/engineRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import userRoutes from './routes/userRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import deliveryItemRoutes from './routes/deliveryItemRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';


//Protected routes
import validateFirebaseToken from "./firebase/middlewareRoute.js";

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8098; // Default to 8098 if not defined
const mongoDBURL = process.env.MONGODB_URL; // MongoDB connection URL




//CORS
import cors from 'cors'

//Create the app
const app = express();

//Middlewares
app.use(express.json());

//CORS
app.use(cors())

//Configure app to run in port
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );

//Connect DB
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Database connected.");

    // Root Configuration
    app.get("/", (request, response) => {
      response.status(200).send("Welocome to ENOKA MOTORS");
    });
  })
  .catch(() => {
    console.error("Error connecting to MongoDB");
  });




// Protected route
// app.use("/api", validateFirebaseToken, (req, res) => {
//   res.json({ message: "Welcome to the protected route!", user: req.user });
// });

// Public route
app.get("/public", (req, res) => {
  res.json({ message: "This is a public route." });
});



// Routes
app.use('/api/gaskets', validateFirebaseToken, gasketRoutes);
app.use('/api/vendors', validateFirebaseToken, vendorRoutes);
app.use('/api/engines', validateFirebaseToken, engineRoutes);
app.use('/api/brands', validateFirebaseToken, brandRoutes);
app.use('/api/branches', validateFirebaseToken, branchRoutes); 
app.use('/api/users', validateFirebaseToken, userRoutes); 
app.use('/api/deliveries', validateFirebaseToken, deliveryRoutes);
app.use('/api/delivery', validateFirebaseToken, deliveryRoutes);
app.use('/api/deliveryItems', validateFirebaseToken, deliveryItemRoutes);

