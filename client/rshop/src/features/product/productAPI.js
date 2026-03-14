import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (filters, thunkApi) => {
    try {
      const response = await api.get(`api/v1/product`, {
        params: filters,
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, thunkApi) => {
    try {
      const response = await api.get(`api/v1/product/${id}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);
