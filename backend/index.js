import express from "express";
import { PORT ,mongoDBURL} from "./config.js";
import mongoose from "mongoose";

//Create the app
const app = express();

//Middlewares
app.use(express.json());


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