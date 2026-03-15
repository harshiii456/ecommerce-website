import { Router } from "express";
import {
  getCategories,
  getSingleCategory,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
} from "../controllers/category.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getCategories);
router.route("/:id").get(getSingleCategory);

// Admin Routes
router.route("/admin").post(verifyJWT, isAdmin, adminCreateCategory);
router.route("/admin/:id")
  .put(verifyJWT, isAdmin, adminUpdateCategory)
  .delete(verifyJWT, isAdmin, adminDeleteCategory);

export default router;
