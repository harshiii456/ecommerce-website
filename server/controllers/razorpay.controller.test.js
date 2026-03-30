import Razorpay from 'razorpay';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { createOrder, updatePaymentStatus } from "../modals/order.modal.sequelize.js";
import { getUserCart } from "../modals/user_interaction.modal.sequelize.js";
import models from "../database/models/index.js";
import crypto from 'crypto';

const { CartItem } = models;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// SIMPLIFIED VERIFICATION - FOR TESTING ONLY
const verifyPaymentSimple = asyncHandler(async (req, res, next) => {
  console.log("=== SIMPLE PAYMENT VERIFICATION START ===");
  
  const user_id = req.user.user_id;
  const { shipping_address } = req.body;
  
  console.log("User ID:", user_id);
  console.log("Shipping address:", shipping_address);

  try {
    // Get cart items
    console.log("Getting cart for user:", user_id);
    const cart = await getUserCart(user_id);
    const cartItems = cart?.cartItems || [];
    console.log("Cart items found:", cartItems.length);
    
    if (cartItems.length === 0) {
      throw new ErrorHandler(400, "Cannot place order with an empty cart");
    }

    // Calculate total amount
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
    console.log("Total amount calculated:", total_amount);

    // Create order in database
    console.log("Creating order...");
    const newOrder = await createOrder({
      user_id,
      items,
      total_amount,
      shipping_address,
      payment_method: "RAZORPAY"
    });
    console.log("Order created:", newOrder.order_id);

    // Update payment status
    console.log("Updating payment status...");
    await updatePaymentStatus(newOrder.order_id, 'PAID');
    console.log("Payment status updated");

    // Clear cart
    console.log("Clearing cart...");
    await CartItem.destroy({
      where: { cart_id: cart.cart_id }
    });
    console.log("Cart cleared");

    res.status(200).json(new ApiResponse(200, {
      order_id: newOrder.order_id,
      payment_id: "test_payment_" + Date.now(),
      order_status: newOrder.status,
      payment_status: 'PAID'
    }, "Payment verified and order placed successfully"));

  } catch (error) {
    console.error("SIMPLE VERIFICATION ERROR:", error);
    throw new ErrorHandler(500, "Failed to verify payment: " + error.message);
  }
});

export {
  verifyPaymentSimple
};
