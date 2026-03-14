import { databaseInstance } from "../database/database.js";

const createOrderModal = async (orderData) => {
  const { user_id, total_amount, shipping_address, payment_method } = orderData;
  const query = "INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)";
  
  try {
    const [res] = await databaseInstance.query(query, [user_id, total_amount, shipping_address, payment_method]);
    return res.insertId;
  } catch (error) {
    console.error("DB Error in createOrderModal:", error);
    throw new ErrorHandler(500, "Error creating order record");
  }
};

const createOrderItemModal = async (orderItemData) => {
  const query = "INSERT INTO order_items SET ?";
  try {
    const [res] = await databaseInstance.query(query, orderItemData);
    return res;
  } catch (error) {
    console.error("DB Error in createOrderItemModal:", error);
    throw new ErrorHandler(500, "Error creating order item");
  }
};

const getOrdersByUserId = async (user_id) => {
  const query = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
  try {
    const [res] = await databaseInstance.query(query, [user_id]);
    return res;
  } catch (error) {
    console.error("DB Error in getOrdersByUserId:", error);
    throw new ErrorHandler(500, "Error fetching user orders");
  }
};

const getOrderItemsByOrderId = async (order_id) => {
  const query = `
    SELECT oi.*, p.product_name, p.main_image_url 
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
  `;
  try {
    const [res] = await databaseInstance.query(query, [order_id]);
    return res;
  } catch (error) {
    console.error("DB Error in getOrderItemsByOrderId:", error);
    throw new ErrorHandler(500, "Error fetching order items");
  }
};

const getAllOrdersAdmin = async () => {
  const query = "SELECT * FROM orders ORDER BY created_at DESC";
  try {
    const [res] = await databaseInstance.query(query);
    return res;
  } catch (error) {
    console.error("DB Error in getAllOrdersAdmin:", error);
    throw new ErrorHandler(500, "Error fetching all orders");
  }
};

const updateOrderStatusModal = async (order_id, status) => {
  const query = "UPDATE orders SET order_status = ? WHERE order_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [status, order_id]);
    return res;
  } catch (error) {
    console.error("DB Error in updateOrderStatusModal:", error);
    throw new ErrorHandler(500, "Error updating order status");
  }
};

export {
  createOrderModal,
  createOrderItemModal,
  getOrdersByUserId,
  getOrderItemsByOrderId,
  getAllOrdersAdmin,
  updateOrderStatusModal
};

