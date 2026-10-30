import { createSlice } from "@reduxjs/toolkit";

function readWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("nova-wishlist") || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item?.id) : [];
  } catch (error) {
    console.warn("Could not restore the saved wishlist.", error);
    return [];
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: readWishlist() },
  reducers: {
    toggleWishlist(state, action) {
      const exists = state.items.some((item) => item.id === action.payload.id);
      state.items = exists ? state.items.filter((item) => item.id !== action.payload.id) : [...state.items, action.payload];
    },
    removeFromWishlist(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    }
  }
});

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist.items;
export default wishlistSlice.reducer;
