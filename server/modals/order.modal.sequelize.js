import { ErrorHandler } from "../utils/ErrorHandler.js";
import models from "../database/models/index.js";

const { Order, OrderItem, Product, User } = models;

// Create new order
const createOrder = async (orderData) => {
  try {
    const { user_id, items, shipping_address, payment_method } = orderData;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product || !product.is_active) {
        throw new ErrorHandler(400, `Product ${item.product_id} not available`);
      }
      
      if (product.stock_quantity < item.quantity) {
        throw new ErrorHandler(400, `Insufficient stock for product ${product.product_name}`);
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: parseFloat(product.price)
      });
    }

    // Create order
    const order = await Order.create({
      user_id,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address,
      payment_method,
      payment_status: 'pending'
    });

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        order_id: order.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      });

      // Update product stock
      await Product.decrement('stock_quantity', {
        by: item.quantity,
        where: { product_id: item.product_id }
      });
    }

    return order;
  } catch (error) {
    console.error("DB Error in createOrder:", error);
    throw error;
  }
};

// Get orders by user
const getOrdersByUser = async (userId) => {
  try {
    console.log("Fetching orders for user:", userId);
    
    const orders = await Order.findAll({
      where: { user_id: userId }
    });

    console.log("Found orders:", orders.length);

    return orders;
  } catch (error) {
    console.error("DB Error in getOrdersByUser:", error);
    throw new ErrorHandler(500, "Error fetching user orders");
  }
};

// Get order by ID
const getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'user_first_name', 'user_last_name', 'email_id']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'product_name', 'product_image', 'price']
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new ErrorHandler(404, "Order not found");
    }

    return order;
  } catch (error) {
    console.error("DB Error in getOrderById:", error);
    throw error;
  }
};

// Get all orders (Admin)
const adminGetAllOrders = async (filters = {}) => {
  try {
    console.log("Fetching all orders for admin with filters:", filters);
    
    const whereCondition = {};
    
    if (filters.user_id) {
      whereCondition.user_id = filters.user_id;
    }

    const orders = await Order.findAll({
      where: whereCondition
    });

    console.log("Found orders:", orders.length);

    return orders;
  } catch (error) {
    console.error("DB Error in adminGetAllOrders:", error);
    throw new ErrorHandler(500, "Error fetching all orders");
  }
};

// Update order status (Admin)
const adminUpdateOrderStatus = async (orderId, status) => {
  try {
    const [affectedCount] = await Order.update(
      { status },
      { where: { order_id: orderId } }
    );

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Order not found");
    }

    const updatedOrder = await Order.findByPk(orderId);
    return updatedOrder;
  } catch (error) {
    console.error("DB Error in adminUpdateOrderStatus:", error);
    throw error;
  }
};

// Update payment status
const updatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const [affectedCount] = await Order.update(
      { payment_status: paymentStatus },
      { where: { order_id: orderId } }
    );

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Order not found");
    }

    const updatedOrder = await Order.findByPk(orderId);
    return updatedOrder;
  } catch (error) {
    console.error("DB Error in updatePaymentStatus:", error);
    throw new ErrorHandler(500, "Error updating payment status");
  }
};

// Cancel order
const cancelOrder = async (orderId, userId) => {
  try {
    const order = await Order.findOne({
      where: { order_id: orderId, user_id: userId },
      include: [
        {
          model: OrderItem,
          as: 'orderItems'
        }
      ]
    });

    if (!order) {
      throw new ErrorHandler(404, "Order not found");
    }

    if (order.status !== 'pending') {
      throw new ErrorHandler(400, "Cannot cancel order in current status");
    }

    // Update order status
    await Order.update(
      { status: 'cancelled' },
      { where: { order_id: orderId } }
    );

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.increment('stock_quantity', {
        by: item.quantity,
        where: { product_id: item.product_id }
      });
    }

    return true;
  } catch (error) {
    console.error("DB Error in cancelOrder:", error);
    throw error;
  }
};

export {
  createOrder,
  getOrdersByUser,
  getOrderById,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  updatePaymentStatus,
  cancelOrder
};
