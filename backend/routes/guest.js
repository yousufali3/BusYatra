import express from "express";
import { getAllGuests } from "../controller/guest.js";

const router = express.Router();

router.get("/", getAllGuests);

export default router;
