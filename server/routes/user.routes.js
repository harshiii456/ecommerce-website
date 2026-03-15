import { Router } from "express";
import {
  createUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  userStatus,
  sendOTP,
  forgotPassword,
  resetPassword,
  adminGetAllUsers,
  adminDeleteUser,
  adminUpdateUserRole
} from "../controllers/user.controller.js";

import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { verifyOTP } from "../middlewares/verifyUser.middleware.js";

const router = Router();

router.route("/userstatus").post(userStatus);
router.route("/sendotp").post(sendOTP);
router.route("/createuser").post(verifyOTP, createUser);
router.route("/login").post(verifyOTP, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// Admin Routes
router.route("/admin/all-users").get(verifyJWT, isAdmin, adminGetAllUsers);
router.route("/admin/user/:id").delete(verifyJWT, isAdmin, adminDeleteUser);
router.route("/admin/user/:id/role").put(verifyJWT, isAdmin, adminUpdateUserRole);

export default router;
