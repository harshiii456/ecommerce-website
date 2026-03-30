import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createRazorpayOrder, verifyPayment, getPaymentMethods } from "../controllers/razorpay.controller.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Create Razorpay order
router.post("/create-order", createRazorpayOrder);

// Verify payment and place order
router.post("/verify-payment", verifyPayment);

// Get available payment methods
router.get("/methods", getPaymentMethods);

export default router;
