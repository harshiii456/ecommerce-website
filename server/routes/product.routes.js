import { Router } from "express";
import {
  getProducts,
  adminGetProducts,
  getSingleProduct,
  adminCreateProductController,
  adminUpdateProductController,
  adminDeleteProductController
} from "../controllers/product.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getProducts);
router.route("/:id").get(getSingleProduct);

// Admin Routes
router.route("/admin/all").get(verifyJWT, isAdmin, adminGetProducts);
router.route("/admin").post(verifyJWT, isAdmin, adminCreateProductController);
router.route("/admin/:id")
  .put(verifyJWT, isAdmin, adminUpdateProductController)
  .delete(verifyJWT, isAdmin, adminDeleteProductController);

export default router;
