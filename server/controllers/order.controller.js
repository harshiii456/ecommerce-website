import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  cancelOrder
} from "../modals/order.modal.sequelize.js";
import { getUserCart } from "../modals/user_interaction.modal.sequelize.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import models from "../database/models/index.js";

const { CartItem } = models;

const placeOrder = asyncHandler(async (req, res, next) => {
  const { shipping_address, payment_method = "CARD" } = req.body;
  const user_id = req.user.user_id;

  if (!shipping_address) {
    throw new ErrorHandler(400, "Shipping address is required");
  }

  // Get cart items
  const cart = await getUserCart(user_id);
  const cartItems = cart?.cartItems || [];
  if (cartItems.length === 0) {
    throw new ErrorHandler(400, "Cannot place order with an empty cart");
  }

  let total_amount = 0;
  const items = [];
  cartItems.forEach(item => {
    const price = item.product.discount_price || item.product.price;
    total_amount += price * item.quantity;
    items.push({
      product_id: item.product_id,
      quantity: item.quantity
    });
  });

  // Create order
  const order = await createOrder({
    user_id,
    items,
    total_amount,
    shipping_address,
    payment_method
  });

  // Clear cart
  await CartItem.destroy({
    where: { 
      cart_id: cart.cart_id,
      product_id: cartItems.map(item => item.product_id)
    }
  });

  res.status(201).json(new ApiResponse(201, { order_id: order.order_id }, "Order placed successfully"));
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await getOrdersByUser(req.user.user_id);
  
  // Optionally fetch items for each order or let frontend fetch per order
  res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const items = await getOrderItemsByOrderId(id);
  res.status(200).json(new ApiResponse(200, items, "Order details fetched successfully"));
});

// Admin Controllers
const adminGetAllOrdersController = asyncHandler(async (req, res, next) => {
  const orders = await adminGetAllOrders();
  res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const adminUpdateStatusController = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) throw new ErrorHandler(400, "Status is required");

  const result = await adminUpdateOrderStatus(id, status);
  res.status(200).json(new ApiResponse(200, result, "Order status updated successfully"));
});

export {
  placeOrder,
  getMyOrders,
  getOrderDetails,
  adminGetAllOrdersController,
  adminUpdateStatusController
};
