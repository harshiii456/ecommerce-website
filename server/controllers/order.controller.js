import {
  createOrderModal,
  createOrderItemModal,
  getOrdersByUserId,
  getOrderItemsByOrderId,
  getAllOrdersAdmin,
  updateOrderStatusModal
} from "../modals/order.modal.js";
import { getCartByUserId, findOrCreateCart } from "../modals/user_interaction.modal.js";
import { databaseInstance } from "../database/database.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const placeOrder = asyncHandler(async (req, res, next) => {
  const { shipping_address, payment_method = "CARD" } = req.body;
  const user_id = req.user.user_id;

  if (!shipping_address) {
    throw new ErrorHandler(400, "Shipping address is required");
  }

  const cartItems = await getCartByUserId(user_id);
  if (cartItems.length === 0) {
    throw new ErrorHandler(400, "Cannot place order with an empty cart");
  }

  let total_amount = 0;
  cartItems.forEach(item => {
    total_amount += (item.discount_price || item.price) * item.quantity;
  });

  const order_id = await createOrderModal({
    user_id,
    total_amount,
    shipping_address,
    payment_method
  });

  for (const item of cartItems) {
    await createOrderItemModal({
      order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.discount_price || item.price
    });

    // Decrement stock
    await databaseInstance.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?",
      [item.quantity, item.product_id]
    );
  }

  // Clear cart
  const cart_id = await findOrCreateCart(user_id);
  await databaseInstance.query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);

  res.status(201).json(new ApiResponse(201, { order_id }, "Order placed successfully"));
});

const getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await getOrdersByUserId(req.user.user_id);
  
  // Optionally fetch items for each order or let frontend fetch per order
  res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

const getOrderDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const items = await getOrderItemsByOrderId(id);
  res.status(200).json(new ApiResponse(200, items, "Order details fetched successfully"));
});

// Admin Controllers
const adminGetAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await getAllOrdersAdmin();
  res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

const adminUpdateStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) throw new ErrorHandler(400, "Status is required");

  await updateOrderStatusModal(id, status);
  res.status(200).json(new ApiResponse(200, {}, "Order status updated successfully"));
});

export {
  placeOrder,
  getMyOrders,
  getOrderDetails,
  adminGetAllOrders,
  adminUpdateStatus
};
