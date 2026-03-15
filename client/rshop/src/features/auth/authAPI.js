import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || "An unexpected error occurred";
};

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkApi) => {
    try {
      const response = await api.get(`api/v1/user/me`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const userStatus = createAsyncThunk(
  "auth/userStatus",
  async (userData, thunkApi) => {
    try {
      const response = await api.post(`api/v1/user/userstatus`, userData, {
        withCredentials: true,
      });
      // thunkApi.fulfillWithValue(response.data)
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOtp",
  async (userData, thunkApi) => {
    try {
      const response = await api.post(`api/v1/user/sendotp`, userData, {
        withCredentials: true,
      });

      return await response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const LogIn = createAsyncThunk(
  "auth/LogIn",
  async (userData, thunkApi) => {
    try {
      const response = await api.post(`api/v1/user/login`, userData, {
        withCredentials: true,
      });

      return await response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData, thunkApi) => {
    try {
      const response = await api.post(`api/v1/user/createuser`, userData, {
        withCredentials: true,
      });

      return await response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, thunkApi) => {
    try {
      const response = await api.post(`api/v1/user/logout`, {}, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error));
    }
  }
);

// for axios errors

// if (axios.isAxiosError(error)) {
//   throw error;
// }

// export const userStatus = async (userData) => {
//   try {
//     const response = await api.post(`api/v1/user/userstatus`, userData, {
//       withCredentials: true,
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
