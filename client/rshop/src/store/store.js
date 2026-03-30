import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import toastReducer from "../features/toast/toastSlice";
import productReducer from "../features/product/productSlice";
import adminReducer from "../features/admin/adminSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth:authReducer,
    toast:toastReducer,
    product: productReducer,
    admin: adminReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});
