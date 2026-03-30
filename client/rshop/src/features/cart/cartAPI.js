import axios from "axios";

const API_URL = "/api/v1/interaction/cart";

// Get cart items
export const fetchCartItems = async () => {
    const response = await axios.get(API_URL);
    return response.data.data;
};

// Add item to cart
export const addItemToCart = async (productId, quantity = 1) => {
    const response = await axios.post(API_URL, { product_id: productId, quantity });
    return response.data;
};

// Remove item from cart
export const removeItemFromCart = async (productId) => {
    const response = await axios.delete(`${API_URL}/${productId}`);
    return response.data;
};
// Update item quantity
export const updateItemQuantity = async (productId, quantity) => {
    const response = await axios.patch(API_URL, { product_id: productId, quantity });
    return response.data;
};
