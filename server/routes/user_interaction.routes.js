import { Router } from "express";
import {
  getCart,
  addProductToCart,
  removeProductFromCart,
  getWishlist,
  toggleWishlist
} from "../controllers/user_interaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Cart Routes
router.route("/cart").get(getCart).post(addProductToCart);
router.route("/cart/:product_id").delete(removeProductFromCart);

// Wishlist Routes
router.route("/wishlist").get(getWishlist).post(toggleWishlist);

export default router;
