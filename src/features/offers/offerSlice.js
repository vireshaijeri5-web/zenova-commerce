import { createSlice } from "@reduxjs/toolkit";

function readOffer() {
  try {
    const savedCode = localStorage.getItem("nova-offer");
    return savedCode === "FESTIVE10" ? savedCode : null;
  } catch (error) {
    console.warn("Could not restore the saved offer.", error);
    return null;
  }
}

const offerSlice = createSlice({
  name: "offer",
  initialState: { code: readOffer() },
  reducers: {
    applyOffer(state, action) {
      state.code = action.payload;
    },
    clearOffer(state) {
      state.code = null;
    }
  }
});

export const { applyOffer, clearOffer } = offerSlice.actions;
export const selectOfferCode = (state) => state.offer.code;
export const selectOfferDiscount = (state) => state.offer.code === "FESTIVE10" ? Math.round(state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.1) : 0;
export default offerSlice.reducer;
