import { createSlice } from "@reduxjs/toolkit";
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetAllUsers,
  adminDeleteUser,
  adminUpdateUserRole,
  adminGetAllOrders,
  adminUpdateOrderStatus,
} from "./adminAPI";

const initialState = {
  products: [],
  users: [],
  orders: [],
  isLoading: false,
  error: null,
  message: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Products
    builder
      .addCase(adminGetAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminGetAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(adminGetAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to fetch products");
      });

    builder
      .addCase(adminCreateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminCreateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to create product");
      });

    builder
      .addCase(adminUpdateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(adminDeleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminDeleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Users
    builder
      .addCase(adminGetAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminGetAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
      })
      .addCase(adminGetAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to fetch users");
      });

    builder
      .addCase(adminDeleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to delete user");
      });

    builder
      .addCase(adminUpdateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminUpdateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to update role");
      });

    // Orders
    builder
      .addCase(adminGetAllOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminGetAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.data;
      })
      .addCase(adminGetAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to fetch orders");
      });

    builder
      .addCase(adminUpdateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminUpdateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to update order");
      });
  },
});

export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
