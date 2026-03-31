import { adminGetAllUsers } from "./modals/user.modal.sequelize.js";

// Test endpoint without authentication
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Temporary test endpoint without auth
app.get("/api/v1/user/admin/all-users-test", async (req, res) => {
  try {
    console.log("=== TEST ENDPOINT CALLED (NO AUTH) ===");
    const users = await adminGetAllUsers();
    res.json({
      success: true,
      data: users,
      message: "Users fetched successfully (test endpoint)"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const port = 8001;
app.listen(port, () => {
  console.log(`Test server running on http://localhost:${port}`);
  console.log(`Test endpoint: http://localhost:${port}/api/v1/user/admin/all-users-test`);
});
