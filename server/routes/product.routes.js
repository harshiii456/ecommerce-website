import { Router } from "express";
import {
  getProducts,
  adminGetProducts,
  getSingleProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from "../controllers/product.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getProducts);
router.route("/:id").get(getSingleProduct);

// Admin Routes
router.route("/admin/all").get(verifyJWT, isAdmin, adminGetProducts);
router.route("/admin").post(verifyJWT, isAdmin, adminCreateProduct);
router.route("/admin/:id")
  .put(verifyJWT, isAdmin, adminUpdateProduct)
  .delete(verifyJWT, isAdmin, adminDeleteProduct);

export default router;
