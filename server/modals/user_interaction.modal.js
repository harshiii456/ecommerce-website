import { databaseInstance } from "../database/database.js";

// Cart Modals
const getCartByUserId = async (user_id) => {
  const query = `
    SELECT c.cart_id, ci.cart_item_id, ci.product_id, ci.quantity, 
           p.product_name, p.price, p.discount_price, p.main_image_url
    FROM cart c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN products p ON ci.product_id = p.product_id
    WHERE c.user_id = ?
  `;
  try {
    const [res] = await databaseInstance.query(query, [user_id]);
    return res;
  } catch (error) {
    console.error("DB Error in getCartByUserId:", error);
    throw new ErrorHandler(500, "Error fetching cart");
  }
};

const findOrCreateCart = async (user_id) => {
  const selectQuery = "SELECT cart_id FROM cart WHERE user_id = ?";
  try {
    const [res] = await databaseInstance.query(selectQuery, [user_id]);
    if (res.length > 0) return res[0].cart_id;
    
    const insertQuery = "INSERT INTO cart SET user_id = ?";
    const [res2] = await databaseInstance.query(insertQuery, [user_id]);
    return res2.insertId;
  } catch (error) {
    console.error("DB Error in findOrCreateCart:", error);
    throw new ErrorHandler(500, "Error managing cart");
  }
};

const addItemToCart = async (cart_id, product_id, quantity) => {
  const query = `
    INSERT INTO cart_items (cart_id, product_id, quantity) 
    VALUES (?, ?, ?) 
    ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
  `;
  try {
    const [res] = await databaseInstance.query(query, [cart_id, product_id, quantity]);
    return res;
  } catch (error) {
    console.error("DB Error in addItemToCart:", error);
    throw new ErrorHandler(500, "Error adding to cart");
  }
};

const removeItemFromCart = async (cart_id, cart_item_id) => {
  const query = "DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [cart_id, cart_item_id]);
    return res;
  } catch (error) {
    console.error("DB Error in removeItemFromCart:", error);
    throw new ErrorHandler(500, "Error removing from cart");
  }
};

// Wishlist Modals
const getWishlistByUserId = async (user_id) => {
  const query = `
    SELECT w.wishlist_id, w.product_id, 
           p.product_name, p.price, p.discount_price, p.main_image_url
    FROM wishlist w
    JOIN products p ON w.product_id = p.product_id
    WHERE w.user_id = ?
  `;
  try {
    const [res] = await databaseInstance.query(query, [user_id]);
    return res;
  } catch (error) {
    console.error("DB Error in getWishlistByUserId:", error);
    throw new ErrorHandler(500, "Error fetching wishlist");
  }
};

const addToWishlist = async (user_id, product_id) => {
  const query = "INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)";
  try {
    const [res] = await databaseInstance.query(query, [user_id, product_id]);
    return res;
  } catch (error) {
    console.error("DB Error in addToWishlist:", error);
    throw new ErrorHandler(500, "Error adding to wishlist");
  }
};

const removeFromWishlist = async (user_id, product_id) => {
  const query = "DELETE FROM wishlist WHERE user_id = ? AND product_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [user_id, product_id]);
    return res;
  } catch (error) {
    console.error("DB Error in removeFromWishlist:", error);
    throw new ErrorHandler(500, "Error removing from wishlist");
  }
};

export {
  getCartByUserId,
  findOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  getWishlistByUserId,
  addToWishlist,
  removeFromWishlist
};

