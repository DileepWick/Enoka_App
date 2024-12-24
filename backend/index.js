import express from "express";
import mongoose from "mongoose";

//Routes

import vendorRoutes from "./routes/vendorRoutes.js";
import engineRoutes from "./routes/engineRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import deliveryItemRoutes from "./routes/deliveryItemRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import whitelistRoutes from "./routes/wluserRoutes.js";
import cashBillRoutes from "./routes/cashBillRoute.js";
import cashBillItemRoutes from "./routes/cash_bill_item_route.js";

//Item Routes
import gasketRoutes from "./routes/gasketRoutes.js";
import ringRoutes from "./routes/ringsRoute.js";
import bearingRoutes from "./routes/bearingRoutes.js";

//Protected routes
import {
  validateAndVerifyWhitelist,
} from "./firebase/middlewareRoute.js";
import sessionRouter from "./firebase/middlewareRoute.js";

// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8098; // Default to 8098 if not defined
const mongoDBURL = process.env.MONGODB_URL; // MongoDB connection URL

//CORS
import cors from "cors";

//Create the app
const app = express();

//Middlewares
app.use(express.json());

//CORS
app.use(cors());

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
// app.use("/api", validateAndVerifyWhitelist, (req, res) => {
//   res.json({ message: "Welcome to the protected route!", user: req.user });
// });

// Public route
app.get("/public", (req, res) => {
  res.json({ message: "This is a public route." });
});

// Routes
// app.use('/api/gaskets', validateAndVerifyWhitelist, gasketRoutes);
// app.use('/api/vendors', validateAndVerifyWhitelist, vendorRoutes);
// app.use('/api/engines', validateAndVerifyWhitelist, engineRoutes);
// app.use('/api/brands', validateAndVerifyWhitelist, brandRoutes);
// app.use('/api/branches', validateAndVerifyWhitelist, branchRoutes);
// app.use('/api/users', validateAndVerifyWhitelist, userRoutes);
// app.use('/api/deliveries', validateAndVerifyWhitelist, deliveryRoutes);
// app.use('/api/delivery', validateAndVerifyWhitelist, deliveryRoutes);
// app.use('/api/deliveryItems', validateAndVerifyWhitelist, deliveryItemRoutes);
//app.use('/api/stocks', validateAndVerifyWhitelist, stockRoutes);

app.use("/api/stocks", stockRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/engines", engineRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/deliveryItems", deliveryItemRoutes);
app.use("/api/cashbills", cashBillRoutes);
app.use("/api/wlusers", whitelistRoutes);
app.use("/api/cashbillitems", cashBillItemRoutes);

//Item Routes
app.use("/api/gaskets", gasketRoutes);
app.use("/api/bearings", bearingRoutes);
app.use("/api/rings", ringRoutes);

// Use the sessionRouter for the /extend-session route
app.use('/api/extend', sessionRouter);