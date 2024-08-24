import express from "express";
import { body, validationResult } from "express-validator"; // Updated import for express-validator
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./utils/connectDB.js";
// import { runSeed } from "./seeds/index.js"; // Uncomment if needed

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

import userRoute from "./routes/user.js";
import authOwnerRoutes from "./routes/auth-owner.js";
import authUserRoutes from "./routes/auth-user.js";
import bookingRoutes from "./routes/booking.js";
import busRoutes from "./routes/bus.js";
import guestRoutes from "./routes/guest.js";
import locationRoutes from "./routes/location.js";
import ownerRoutes from "./routes/owner.js";
import travelRoutes from "./routes/travel.js";

app.use("/api/auth-owner", authOwnerRoutes);
app.use("/api/auth-user", authUserRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/travels", travelRoutes);
app.use("/api/users", userRoute);
// Port and server setup
const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
