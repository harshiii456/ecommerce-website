import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import toastReducer from "../features/toast/toastSlice";
import productReducer from "../features/product/productSlice";

export const store = configureStore({
  reducer: {
    auth:authReducer,
    toast:toastReducer,
    product: productReducer,
  },
});
