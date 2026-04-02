import axios from "axios";

const API_URL = "/api/v1/interaction/wishlist";

// Get wishlist items
export const fetchWishlistItems = async () => {
    const response = await axios.get(API_URL, {
        withCredentials: true,
    });
    return response.data.data;
};

// Toggle item in wishlist (add/remove)
export const toggleWishlistItem = async (productId) => {
    const response = await axios.post(API_URL, { product_id: productId }, {
        withCredentials: true,
    });
    return response.data;
};
