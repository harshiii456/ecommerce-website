import { Router } from "express";
import { ApiResponse } from "./utils/ApiResponse.js";

const router = Router();

// Test endpoint to check authentication
router.get("/auth-test", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { 
      cookies: req.cookies,
      headers: req.headers,
      message: "Auth test endpoint"
    }, "Auth test successful")
  );
});

export default router;
