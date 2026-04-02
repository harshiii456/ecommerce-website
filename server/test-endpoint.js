import { Router } from "express";
import { ApiResponse } from "./utils/ApiResponse.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { 
      status: "OK", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }, "Server is running")
  );
});

router.get("/api-test", (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { 
      message: "API is working",
      method: req.method,
      url: req.url
    }, "Test endpoint successful")
  );
});

export default router;
