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
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "./adminAPI";

const initialState = {
  products: [],
  users: [],
  orders: [],
  categories: [],
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
        // The API only returns the insertId, so we should trigger a re-fetch or 
        // handle it in the component. For now, let's just set the message.
        // Component will navigate back to list which triggers a fetch.
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
        // Update the local state with the new data
        const { id, productData } = action.meta.arg;
        const index = state.products.findIndex(p => p.product_id === parseInt(id));
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...productData };
        }
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
        state.products = state.products.filter(product => product.product_id !== action.meta.arg);
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
        console.log("Redux reducer adminGetAllUsers.fulfilled - action.payload:", action.payload);
        state.isLoading = false;
        // Handle both direct data and nested data structures
        state.users = action.payload.data || action.payload || [];
        console.log("Redux reducer - state.users after update:", state.users);
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
        state.users = state.users.filter(user => user.user_id !== action.meta.arg);
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
        const index = state.users.findIndex(user => user.user_id === action.meta.arg.id);
        if (index !== -1) {
          state.users[index].role = action.meta.arg.role;
        }
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
        const index = state.orders.findIndex(order => order.order_id === action.meta.arg.id);
        if (index !== -1) {
          state.orders[index].order_status = action.meta.arg.status;
        }
      })
      .addCase(adminUpdateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to update order");
      });

    // Categories
    builder
      .addCase(adminGetAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminGetAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data;
      })
      .addCase(adminGetAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to fetch categories");
      });

    builder
      .addCase(adminCreateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminCreateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(adminCreateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to create category");
      });

    builder
      .addCase(adminUpdateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        const { id, categoryData } = action.meta.arg;
        const index = state.categories.findIndex(c => c.category_id === parseInt(id));
        if (index !== -1) {
          state.categories[index] = { ...state.categories[index], ...categoryData };
        }
      })
      .addCase(adminUpdateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to update category");
      });

    builder
      .addCase(adminDeleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminDeleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.categories = state.categories.filter(c => c.category_id !== action.meta.arg);
      })
      .addCase(adminDeleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || "Failed to delete category");
      });
  },
});

export const { clearErrors } = adminSlice.actions;
export default adminSlice.reducer;
