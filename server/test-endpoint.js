// Simple test endpoint to verify server is working
import express from 'express';
import { verifyJWT } from "./middlewares/auth.middleware.js";

const router = express.Router();

// Test endpoint without auth
router.get("/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});

// Test endpoint with auth
router.get("/test-auth", verifyJWT, (req, res) => {
  res.json({ 
    message: "Auth is working!", 
    user: req.user,
    timestamp: new Date().toISOString() 
  });
});

export default router;
