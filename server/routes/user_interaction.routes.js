import { Router } from "express";
import {
  getCart,
  addToCart,
  removeFromCartController,
  getWishlist,
  toggleWishlist
} from "../controllers/user_interaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Cart Routes
router.route("/cart").get(getCart).post(addToCart);
router.route("/cart/:cart_item_id").delete(removeFromCartController);

// Wishlist Routes
router.route("/wishlist").get(getWishlist).post(toggleWishlist);

export default router;
