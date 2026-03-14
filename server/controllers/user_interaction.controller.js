import {
  getCartByUserId,
  findOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  getWishlistByUserId,
  addToWishlist,
  removeFromWishlist
} from "../modals/user_interaction.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cart Controllers
const getCart = asyncHandler(async (req, res, next) => {
  const cartItems = await getCartByUserId(req.user.user_id);
  res.status(200).json(new ApiResponse(200, cartItems, "Cart fetched successfully"));
});

const addToCart = asyncHandler(async (req, res, next) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) throw new ErrorHandler(400, "Product ID is required");

  const cart_id = await findOrCreateCart(req.user.user_id);
  await addItemToCart(cart_id, product_id, quantity);

  res.status(200).json(new ApiResponse(200, {}, "Item added to cart"));
});

const removeFromCartController = asyncHandler(async (req, res, next) => {
  const { cart_item_id } = req.params;
  const cart_id = await findOrCreateCart(req.user.user_id);
  await removeItemFromCart(cart_id, cart_item_id);
  res.status(200).json(new ApiResponse(200, {}, "Item removed from cart"));
});

// Wishlist Controllers
const getWishlist = asyncHandler(async (req, res, next) => {
  const wishlistItems = await getWishlistByUserId(req.user.user_id);
  res.status(200).json(new ApiResponse(200, wishlistItems, "Wishlist fetched successfully"));
});

const toggleWishlist = asyncHandler(async (req, res, next) => {
  const { product_id } = req.body;
  if (!product_id) throw new ErrorHandler(400, "Product ID is required");

  const wishlist = await getWishlistByUserId(req.user.user_id);
  const isPresent = wishlist.some(item => item.product_id === product_id);

  if (isPresent) {
    await removeFromWishlist(req.user.user_id, product_id);
    res.status(200).json(new ApiResponse(200, { added: false }, "Item removed from wishlist"));
  } else {
    await addToWishlist(req.user.user_id, product_id);
    res.status(200).json(new ApiResponse(200, { added: true }, "Item added to wishlist"));
  }
});

export {
  getCart,
  addToCart,
  removeFromCartController,
  getWishlist,
  toggleWishlist
};
