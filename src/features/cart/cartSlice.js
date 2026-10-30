import { createSlice } from "@reduxjs/toolkit";

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("nova-cart") || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item?.id && Number.isFinite(item.quantity) && item.quantity > 0) : [];
  } catch (error) {
    console.warn("Could not restore the saved cart.", error);
    return [];
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: readCart() },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) existing.quantity += Math.max(1, Number(action.payload.quantity) || 1);
      else state.items.push({ ...action.payload, quantity: Math.max(1, Number(action.payload.quantity) || 1) });
    },
    incrementQuantity(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action) {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export default cartSlice.reducer;
