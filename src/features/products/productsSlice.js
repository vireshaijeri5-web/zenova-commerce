import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fallbackProducts, fetchProducts } from "../../services/productService";

export const loadProducts = createAsyncThunk(
  "products/load",
  async ({ retry } = {}, { signal }) => fetchProducts({ signal }),
  {
    condition: ({ retry } = {}, { getState }) => {
      const { status } = getState().products;
      return retry ? status !== "loading" : status === "idle";
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null, source: null },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.source = "api";
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.items = fallbackProducts;
        state.status = "succeeded";
        state.source = "fallback";
        state.error = action.error.name === "AbortError" ? null : "Live catalogue unavailable. Showing our curated local edit.";
      });
  }
});

export default productsSlice.reducer;
