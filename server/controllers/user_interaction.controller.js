import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  moveToCart
} from "../modals/user_interaction.modal.sequelize.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Cart Controllers
const getCart = asyncHandler(async (req, res, next) => {
  const cart = await getUserCart(req.user.user_id);
  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addProductToCart = asyncHandler(async (req, res, next) => {
  const { product_id, quantity = 1 } = req.body;
  if (!product_id) throw new ErrorHandler(400, "Product ID is required");

  const cart = await addToCart(req.user.user_id, product_id, quantity);
  res.status(200).json(new ApiResponse(200, cart, "Product added to cart successfully"));
});

const updateProductQuantity = asyncHandler(async (req, res, next) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) throw new ErrorHandler(400, "Product ID and quantity are required");

  const cart = await updateCartItem(req.user.user_id, product_id, quantity);
  res.status(200).json(new ApiResponse(200, cart, "Cart updated successfully"));
});

const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) throw new ErrorHandler(400, "Product ID is required");

  const cart = await removeFromCart(req.user.user_id, product_id);
  res.status(200).json(new ApiResponse(200, cart, "Product removed from cart successfully"));
});

const clearUserCart = asyncHandler(async (req, res, next) => {
  const cart = await clearCart(req.user.user_id);
  res.status(200).json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

// Wishlist Controllers
const getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await getUserWishlist(req.user.user_id);
  res.status(200).json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

const toggleWishlist = asyncHandler(async (req, res, next) => {
  const { product_id } = req.body;
  if (!product_id) throw new ErrorHandler(400, "Product ID is required");

  const isPresent = await isInWishlist(req.user.user_id, product_id);

  if (isPresent) {
    const wishlist = await removeFromWishlist(req.user.user_id, product_id);
    res.status(200).json(new ApiResponse(200, { added: false, wishlist }, "Item removed from wishlist"));
  } else {
    const wishlist = await addToWishlist(req.user.user_id, product_id);
    res.status(200).json(new ApiResponse(200, { added: true, wishlist }, "Item added to wishlist"));
  }
});

export {
  getCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  clearUserCart,
  getWishlist,
  toggleWishlist
};
