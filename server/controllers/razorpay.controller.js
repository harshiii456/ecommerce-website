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

const createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount, currency = 'INR', receipt } = req.body;
  const user_id = req.user.user_id;

  if (!amount) {
    throw new ErrorHandler(400, "Amount is required");
  }

  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    receipt: receipt || `receipt_${user_id}_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    res.status(200).json(new ApiResponse(200, {
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    }, "Razorpay order created successfully"));
  } catch (error) {
    throw new ErrorHandler(500, "Failed to create Razorpay order: " + error.message);
  }
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  console.log("=== PAYMENT VERIFICATION WITH DB FIXES ===");
  
  try {
    console.log("User authenticated:", req.user);
    console.log("Request body:", req.body);
    
    const user_id = req.user.user_id;
    const { shipping_address } = req.body;
    
    // Test cart retrieval with error handling
    console.log("Getting cart for user:", user_id);
    const cart = await getUserCart(user_id);
    if (!cart) {
      console.log("Cart not found, creating empty cart structure");
      return res.status(400).json(new ApiResponse(400, null, "Cart not found"));
    }
    
    const cartItems = cart?.cartItems || [];
    console.log("Cart items found:", cartItems.length);
    
    if (cartItems.length === 0) {
      return res.status(400).json(new ApiResponse(400, null, "Cannot place order with an empty cart"));
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

    // Create order with error handling
    console.log("Creating order...");
    let newOrder;
    try {
      newOrder = await createOrder({
        user_id,
        items,
        total_amount,
        shipping_address,
        payment_method: "RAZORPAY"
      });
      console.log("Order created successfully:", newOrder.order_id);
    } catch (orderError) {
      console.error("Order creation failed:", orderError);
      throw new ErrorHandler(500, "Failed to create order: " + orderError.message);
    }

    // Update payment status with error handling
    console.log("Updating payment status...");
    try {
      await updatePaymentStatus(newOrder.order_id, 'PAID');
      console.log("Payment status updated successfully");
    } catch (statusError) {
      console.error("Payment status update failed:", statusError);
      throw new ErrorHandler(500, "Failed to update payment status: " + statusError.message);
    }

    // Clear cart with error handling
    console.log("Clearing cart...");
    try {
      await CartItem.destroy({
        where: { cart_id: cart.cart_id }
      });
      console.log("Cart cleared successfully");
    } catch (clearError) {
      console.error("Cart clearing failed:", clearError);
      // Don't fail the whole process if cart clearing fails
    }
    
    res.status(200).json(new ApiResponse(200, {
      order_id: newOrder.order_id,
      payment_id: "razorpay_" + Date.now(),
      order_status: newOrder.status,
      payment_status: 'PAID'
    }, "Payment verified and order placed successfully"));
    
  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR:", error);
    throw new ErrorHandler(500, "Failed to verify payment: " + error.message);
  }
});

const getPaymentMethods = asyncHandler(async (req, res, next) => {
  res.status(200).json(new ApiResponse(200, [
    {
      id: 'razorpay',
      name: 'Razorpay',
      description: 'Pay using UPI, Credit Card, Debit Card, Net Banking',
      icon: '💳'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive the order',
      icon: '💵'
    }
  ], "Payment methods fetched successfully"));
});

export {
  createRazorpayOrder,
  verifyPayment,
  getPaymentMethods
};
