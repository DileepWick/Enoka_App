import express from "express";
import { PORT ,mongoDBURL} from "./config.js";
import mongoose from "mongoose";

//Routes
import gasketRoutes from './routes/gasketRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import engineRoutes from './routes/engineRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import deliveryRoutes from './routes/delivery_list_routes.js';


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

// Routes
app.use('/api/gaskets', gasketRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/engines', engineRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/deliveries', deliveryRoutes);