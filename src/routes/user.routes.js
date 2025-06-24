import express from "express";

const router = express.Router();

import {
  getMe,
  login,
  logout,
  registerUser,
  verifyUser,
  forgotPassword,
  resetPassword,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

router.post("/register", registerUser);
router.get("/verify/:token", verifyUser);
router.post("/login", login);
router.get("/profile", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logout);
router.get("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
