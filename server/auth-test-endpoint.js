import { Router } from "express";
import { ApiResponse } from "./utils/ApiResponse.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

const router = Router();

// Public endpoint - no auth required
router.get("/public", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { 
      message: "Public endpoint - no auth needed",
      user: req.user || "not authenticated"
    }, "Public test successful")
  );
});

// Protected endpoint - auth required
router.use(verifyJWT);
router.get("/protected", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { 
      message: "Protected endpoint - auth required",
      user: req.user,
      cookies: req.cookies,
      headers: req.headers
    }, "Protected test successful")
  );
});

export default router;
