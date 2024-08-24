import express from "express";

import { userById, read, getAllUsers } from "../controller/user.js";

const userRoute = express.Router();

userRoute.get("/", getAllUsers);

userRoute.get("/:userId", read);

userRoute.param("userId", userById);

export default userRoute;
