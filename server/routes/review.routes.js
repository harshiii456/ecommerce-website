import { Router } from "express";
import {
  addReview,
  getProductReviews,
  removeReview
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/product/:product_id").get(getProductReviews);
router.route("/").post(verifyJWT, addReview);
router.route("/:id").delete(verifyJWT, removeReview);

export default router;
