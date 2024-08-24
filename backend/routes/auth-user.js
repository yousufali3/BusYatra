import express from "express";
import {
  signup,
  signin,
  socialLogin,
  forgotPassword,
  resetPassword,
} from "../controller/auth-user.js";
import {
  userSignupValidator,
  passwordResetValidator,
} from "../validator/index.js";

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.post("/social-login", socialLogin);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);

export default router;
