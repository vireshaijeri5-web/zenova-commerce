import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice.js";
import productsReducer from "../features/products/productsSlice.js";
import wishlistReducer from "../features/wishlist/wishlistSlice.js";
import offerReducer from "../features/offers/offerSlice.js";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    offer: offerReducer
  }
});

store.subscribe(() => {
  try {
    localStorage.setItem("nova-cart", JSON.stringify(store.getState().cart.items));
    localStorage.setItem("nova-wishlist", JSON.stringify(store.getState().wishlist.items));
    const offerCode = store.getState().offer.code;
    if (offerCode) localStorage.setItem("nova-offer", offerCode);
    else localStorage.removeItem("nova-offer");
  } catch (error) {
    console.warn("Could not save your cart or wishlist.", error);
  }
});
