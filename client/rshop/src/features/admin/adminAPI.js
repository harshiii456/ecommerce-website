import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "An unexpected error occurred";
};

// Admin Product Management
export const adminGetAllProducts = createAsyncThunk(
  "admin/getAllProducts",
  async (_, thunkApi) => {
    try {
      const response = await api.get(`api/v1/product/admin/all`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminCreateProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, thunkApi) => {
    try {
      const response = await api.post(`api/v1/product/admin`, productData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminUpdateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }, thunkApi) => {
    try {
      const response = await api.put(`api/v1/product/admin/${id}`, productData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminDeleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, thunkApi) => {
    try {
      const response = await api.delete(`api/v1/product/admin/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Admin User Management
export const adminGetAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, thunkApi) => {
    try {
      const response = await api.get(`api/v1/user/admin/all-users`, {
        withCredentials: true,
      });
      console.log("API Response adminGetAllUsers:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error adminGetAllUsers:", error);
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminDeleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, thunkApi) => {
    try {
      const response = await api.delete(`api/v1/user/admin/user/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminUpdateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, thunkApi) => {
    try {
      const response = await api.put(`api/v1/user/admin/user/${id}/role`, { role }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Admin Order Management
export const adminGetAllOrders = createAsyncThunk(
  "admin/getAllOrders",
  async (_, thunkApi) => {
    try {
      const response = await api.get(`api/v1/order/admin/all`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminUpdateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, thunkApi) => {
    try {
      const response = await api.put(`api/v1/order/admin/status/${id}`, { status }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Admin Category Management
export const adminGetAllCategories = createAsyncThunk(
  "admin/getAllCategories",
  async (_, thunkApi) => {
    try {
      const response = await api.get(`api/v1/category`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminCreateCategory = createAsyncThunk(
  "admin/createCategory",
  async (categoryData, thunkApi) => {
    try {
      const response = await api.post(`api/v1/category/admin`, categoryData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminUpdateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ id, categoryData }, thunkApi) => {
    try {
      const response = await api.put(`api/v1/category/admin/${id}`, categoryData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminDeleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id, thunkApi) => {
    try {
      const response = await api.delete(`api/v1/category/admin/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);
