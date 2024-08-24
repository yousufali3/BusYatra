import express from "express";
import { signup, signin, refreshToken } from "../controller/auth-owner.js";
import { userSignupValidator } from "../validator/index.js";

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.post("/refreshtoken", refreshToken);

export default router;
