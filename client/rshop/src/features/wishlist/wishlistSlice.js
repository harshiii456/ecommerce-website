import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistAPI from './wishlistAPI';
import { toast } from 'react-hot-toast';

export const getWishlist = createAsyncThunk('wishlist/getWishlist', async (_, { rejectWithValue }) => {
    try {
        return await wishlistAPI.fetchWishlistItems();
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const toggleWishlistTask = createAsyncThunk('wishlist/toggleWishlist', async (productId, { rejectWithValue, dispatch }) => {
    try {
        const response = await wishlistAPI.toggleWishlistItem(productId);
        const added = response.data.added;
        if (added) {
            toast.success('Added to wishlist!');
        } else {
            toast.success('Removed from wishlist');
        }
        dispatch(getWishlist());
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || 'Error updating wishlist';
        toast.error(message);
        return rejectWithValue(error.response.data);
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlistItems: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearWishlist: (state) => {
            state.wishlistItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
