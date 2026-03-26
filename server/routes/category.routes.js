import { Router } from "express";
import {
  getCategories,
  getSingleCategory,
  adminCreateCategoryController,
  adminUpdateCategoryController,
  adminDeleteCategoryController
} from "../controllers/category.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getCategories);
router.route("/:id").get(getSingleCategory);

// Admin Routes
router.route("/admin").post(verifyJWT, isAdmin, adminCreateCategoryController);
router.route("/admin/:id")
  .put(verifyJWT, isAdmin, adminUpdateCategoryController)
  .delete(verifyJWT, isAdmin, adminDeleteCategoryController);

export default router;
