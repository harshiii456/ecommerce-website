import { createOrder } from "./modals/order.modal.sequelize.js";
import { getUserCart } from "./modals/user_interaction.modal.sequelize.js";
import { updatePaymentStatus } from "./modals/order.modal.sequelize.js";
import models from "./database/models/index.js";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

const { CartItem } = models;

const testOrderCreation = async () => {
  try {
    console.log("=== TESTING ORDER CREATION SEPARATELY ===");
    
    // Test with sample data
    const sampleOrder = {
      user_id: 1,
      items: [
        { product_id: 1, quantity: 2 }
      ],
      total_amount: 999,
      shipping_address: {
        fullName: "Test User",
        phone: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
      },
      payment_method: "RAZORPAY"
    };

    console.log("Creating sample order...");
    const newOrder = await createOrder(sampleOrder);
    console.log("Order created successfully:", newOrder.order_id);
    
    console.log("Updating payment status...");
    await updatePaymentStatus(newOrder.order_id, 'PAID');
    console.log("Payment status updated successfully");
    
  } catch (error) {
    console.error("ORDER CREATION TEST ERROR:", error);
  }
  
  process.exit(0);
};

testOrderCreation();
