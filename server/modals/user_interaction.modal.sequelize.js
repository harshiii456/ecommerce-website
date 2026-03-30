import { ErrorHandler } from "../utils/ErrorHandler.js";
import models from "../database/models/index.js";

const { Cart, CartItem, Wishlist, WishlistItem, Product, User } = models;

// ===== CART FUNCTIONS =====

// Get or create user cart
const getUserCart = async (userId) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['product_id', 'product_name', 'main_image_url', 'price', 'discount_price', 'stock_quantity', 'is_active']
            }
          ]
        }
      ]
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
      cart.cartItems = []; // Empty cart items array
    }

    // Filter out inactive products
    if (cart.cartItems) {
      cart.cartItems = cart.cartItems.filter(item => 
        item.product && item.product.is_active
      );
    }

    return cart;
  } catch (error) {
    console.error("DB Error in getUserCart:", error);
    throw new ErrorHandler(500, "Error fetching cart");
  }
};

// Add item to cart
const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Check if product exists and is active
    const product = await Product.findByPk(productId);
    if (!product || !product.is_active) {
      throw new ErrorHandler(404, "Product not available");
    }

    if (product.stock_quantity < quantity) {
      throw new ErrorHandler(400, "Insufficient stock");
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({
      where: { cart_id: cart.cart_id, product_id: productId }
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock_quantity < newQuantity) {
        throw new ErrorHandler(400, "Insufficient stock");
      }
      await existingItem.update({ quantity: newQuantity });
    } else {
      // Add new item
      await CartItem.create({
        cart_id: cart.cart_id,
        product_id: productId,
        quantity
      });
    }

    return await getUserCart(userId);
  } catch (error) {
    console.error("DB Error in addToCart:", error);
    throw error;
  }
};

// Update cart item quantity
const updateCartItem = async (userId, productId, quantity) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new ErrorHandler(404, "Cart not found");
    }

    const cartItem = await CartItem.findOne({
      where: { cart_id: cart.cart_id, product_id: productId },
      include: [{ model: Product, as: 'product' }]
    });

    if (!cartItem) {
      throw new ErrorHandler(404, "Item not found in cart");
    }

    if (cartItem.product.stock_quantity < quantity) {
      throw new ErrorHandler(400, "Insufficient stock");
    }

    if (quantity <= 0) {
      await cartItem.destroy();
    } else {
      await cartItem.update({ quantity });
    }

    return await getUserCart(userId);
  } catch (error) {
    console.error("DB Error in updateCartItem:", error);
    throw error;
  }
};

// Remove item from cart
const removeFromCart = async (userId, productId) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new ErrorHandler(404, "Cart not found");
    }

    const affectedCount = await CartItem.destroy({
      where: { cart_id: cart.cart_id, product_id: productId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Item not found in cart");
    }

    return await getUserCart(userId);
  } catch (error) {
    console.error("DB Error in removeFromCart:", error);
    throw error;
  }
};

// Clear cart
const clearCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: userId } });
    if (!cart) {
      throw new ErrorHandler(404, "Cart not found");
    }

    await CartItem.destroy({
      where: { cart_id: cart.cart_id }
    });

    return await getUserCart(userId);
  } catch (error) {
    console.error("DB Error in clearCart:", error);
    throw error;
  }
};

// ===== WISHLIST FUNCTIONS =====

// Get user wishlist
const getUserWishlist = async (userId) => {
  try {
    const items = await Wishlist.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['product_id', 'product_name', 'main_image_url', 'price', 'discount_price', 'stock_quantity', 'is_active']
        }
      ]
    });

    // Return in a structure consistent with frontend expectations
    return {
      user_id: userId,
      wishlistItems: items.filter(item => item.product && item.product.is_active)
    };
  } catch (error) {
    console.error("DB Error in getUserWishlist:", error);
    throw new ErrorHandler(500, "Error fetching wishlist");
  }
};

// Add item to wishlist
const addToWishlist = async (userId, productId) => {
  try {
    // Check if product exists and is active
    const product = await Product.findByPk(productId);
    if (!product || !product.is_active) {
      throw new ErrorHandler(404, "Product not available");
    }

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId }
    });

    if (existingItem) {
      throw new ErrorHandler(400, "Item already in wishlist");
    }

    // Add new item
    await Wishlist.create({
      user_id: userId,
      product_id: productId
    });

    return await getUserWishlist(userId);
  } catch (error) {
    console.error("DB Error in addToWishlist:", error);
    throw error;
  }
};

// Remove item from wishlist
const removeFromWishlist = async (userId, productId) => {
  try {
    const affectedCount = await Wishlist.destroy({
      where: { user_id: userId, product_id: productId }
    });

    if (affectedCount === 0) {
      throw new ErrorHandler(404, "Item not found in wishlist");
    }

    return await getUserWishlist(userId);
  } catch (error) {
    console.error("DB Error in removeFromWishlist:", error);
    throw error;
  }
};

// Check if item is in wishlist
const isInWishlist = async (userId, productId) => {
  try {
    const item = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId }
    });

    return !!item;
  } catch (error) {
    console.error("DB Error in isInWishlist:", error);
    throw new ErrorHandler(500, "Error checking wishlist");
  }
};

// Move item from wishlist to cart
const moveToCart = async (userId, productId, quantity = 1) => {
  try {
    // Remove from wishlist
    await Wishlist.destroy({
      where: { user_id: userId, product_id: productId }
    });
    
    // Add to cart
    return await addToCart(userId, productId, quantity);
  } catch (error) {
    console.error("DB Error in moveToCart:", error);
    throw error;
  }
};

export {
  // Cart functions
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  
  // Wishlist functions
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  moveToCart
};
