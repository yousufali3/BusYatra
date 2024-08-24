import express from "express";
import { body, validationResult } from "express-validator"; // Updated import for express-validator
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectDB.js";
// import { runSeed } from "./seeds/index.js"; // Uncomment if needed

import userRoute from "./routes/userRoute.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(body()); // Added for express-validator body parsing
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();
// runSeed();

app.get("/", (req, res) => {
  res.redirect("/api/users");
});

app.use("/api/users", userRoute);
// Port and server setup
const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
