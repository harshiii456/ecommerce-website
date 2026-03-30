import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartAPI from './cartAPI';
import { toast } from 'react-hot-toast';

export const getCart = createAsyncThunk('cart/getCart', async (_, { rejectWithValue }) => {
    try {
        return await cartAPI.fetchCartItems();
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
        const response = await cartAPI.addItemToCart(productId, quantity);
        toast.success('Added to cart!');
        dispatch(getCart());
        return response;
    } catch (error) {
        const message = error.response?.data?.message || 'Please login first';
        toast.error(message);
        return rejectWithValue(error.response.data);
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue, dispatch }) => {
    try {
        const response = await cartAPI.removeItemFromCart(productId);
        toast.success('Removed from cart');
        dispatch(getCart());
        return response;
    } catch (error) {
        toast.error('Failed to remove item');
        return rejectWithValue(error.response.data);
    }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
        const response = await cartAPI.updateItemQuantity(productId, quantity);
        dispatch(getCart());
        return response;
    } catch (error) {
        toast.error('Failed to update quantity');
        return rejectWithValue(error.response.data);
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
