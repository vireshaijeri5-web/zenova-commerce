import assert from "node:assert/strict";
import { test } from "node:test";

const storage = new Map();
globalThis.localStorage = {
  getItem(key) {
    return storage.get(key) ?? null;
  },
  setItem(key, value) {
    storage.set(key, String(value));
  },
  removeItem(key) {
    storage.delete(key);
  },
  clear() {
    storage.clear();
  }
};

const [
  { configureStore },
  cart,
  products,
  wishlist,
  offer,
  { fallbackProducts }
] = await Promise.all([
  import("@reduxjs/toolkit"),
  import("../src/features/cart/cartSlice.js"),
  import("../src/features/products/productsSlice.js"),
  import("../src/features/wishlist/wishlistSlice.js"),
  import("../src/features/offers/offerSlice.js"),
  import("../src/services/productService.js")
]);

const reducers = {
  cart: cart.default,
  products: products.default,
  wishlist: wishlist.default,
  offer: offer.default
};

function createStore() {
  return configureStore({ reducer: reducers });
}

function product(id = 1, price = 250) {
  return { id, title: `Product ${id}`, category: "Technology", price, thumbnail: "" };
}

test("cart actions update quantities, count, subtotal, and removal", () => {
  const store = createStore();
  store.dispatch(cart.addToCart({ ...product(), quantity: 2 }));
  store.dispatch(cart.addToCart(product()));
  store.dispatch(cart.incrementQuantity(1));
  store.dispatch(cart.decrementQuantity(1));

  assert.equal(cart.selectCartCount(store.getState()), 3);
  assert.equal(cart.selectCartSubtotal(store.getState()), 750);
  assert.equal(cart.selectCartItems(store.getState())[0].quantity, 3);

  store.dispatch(cart.decrementQuantity(1));
  store.dispatch(cart.decrementQuantity(1));
  store.dispatch(cart.decrementQuantity(1));
  assert.equal(cart.selectCartItems(store.getState())[0].quantity, 1);

  store.dispatch(cart.removeFromCart(1));
  assert.deepEqual(cart.selectCartItems(store.getState()), []);
  store.dispatch(cart.addToCart(product(2)));
  store.dispatch(cart.clearCart());
  assert.deepEqual(cart.selectCartItems(store.getState()), []);
  assert.equal(cart.selectCartSubtotal(store.getState()), 0);
});

test("wishlist toggle and remove actions keep the selector in sync", () => {
  const store = createStore();
  const firstProduct = product();

  store.dispatch(wishlist.toggleWishlist(firstProduct));
  assert.deepEqual(wishlist.selectWishlistItems(store.getState()), [firstProduct]);
  store.dispatch(wishlist.toggleWishlist(firstProduct));
  assert.deepEqual(wishlist.selectWishlistItems(store.getState()), []);
  store.dispatch(wishlist.toggleWishlist(firstProduct));
  store.dispatch(wishlist.removeFromWishlist(firstProduct.id));
  assert.deepEqual(wishlist.selectWishlistItems(store.getState()), []);
});

test("offer actions calculate ten percent from the current cart subtotal", () => {
  const store = createStore();
  store.dispatch(cart.addToCart({ ...product(1, 1000), quantity: 2 }));

  store.dispatch(offer.applyOffer("FESTIVE10"));
  assert.equal(offer.selectOfferCode(store.getState()), "FESTIVE10");
  assert.equal(offer.selectOfferDiscount(store.getState()), 200);

  store.dispatch(offer.applyOffer("INVALID"));
  assert.equal(offer.selectOfferDiscount(store.getState()), 0);
  store.dispatch(offer.clearOffer());
  assert.equal(offer.selectOfferCode(store.getState()), null);
});

test("product thunk loads, normalizes, and dispatches catalogue data", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      products: [{
        id: 10,
        title: "Test headphones",
        category: "smartphones",
        price: 10,
        discountPercentage: 10,
        rating: 4.5,
        thumbnail: "https://example.test/product.jpg",
        images: ["https://example.test/product.jpg"]
      }]
    })
  });

  try {
    const store = createStore();
    const result = await store.dispatch(products.loadProducts());

    assert.equal(result.meta.requestStatus, "fulfilled");
    assert.equal(store.getState().products.status, "succeeded");
    assert.equal(store.getState().products.source, "api");
    assert.equal(store.getState().products.items[0].title, "Test headphones");
    assert.equal(store.getState().products.items[0].category, "Technology");
    assert.equal(store.getState().products.items[0].price, 752);
    assert.equal(store.getState().products.items[0].originalPrice, 835);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("product thunk uses the curated fallback catalogue after a request failure", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("offline");
  };

  try {
    const store = createStore();
    const result = await store.dispatch(products.loadProducts());

    assert.equal(result.meta.requestStatus, "rejected");
    assert.equal(store.getState().products.status, "succeeded");
    assert.equal(store.getState().products.source, "fallback");
    assert.equal(store.getState().products.items.length, fallbackProducts.length);
    assert.match(store.getState().products.error, /Live catalogue unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("product thunk prevents duplicate requests while one is already loading", async () => {
  const originalFetch = globalThis.fetch;
  let resolveResponse;
  globalThis.fetch = () => new Promise((resolve) => {
    resolveResponse = resolve;
  });

  try {
    const store = createStore();
    const firstRequest = store.dispatch(products.loadProducts());
    const duplicateRequest = await store.dispatch(products.loadProducts());

    assert.equal(store.getState().products.status, "loading");
    assert.equal(duplicateRequest.meta.condition, true);

    resolveResponse({
      ok: true,
      json: async () => ({ products: [product(3)] })
    });
    await firstRequest;
    assert.equal(store.getState().products.status, "succeeded");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("configured store persists cart, wishlist, and active offer", async () => {
  storage.clear();
  const { store } = await import("../src/app/store.js");

  store.dispatch(cart.addToCart(product(9, 400)));
  store.dispatch(wishlist.toggleWishlist(product(9, 400)));
  store.dispatch(offer.applyOffer("FESTIVE10"));

  assert.deepEqual(JSON.parse(storage.get("nova-cart")), [{ ...product(9, 400), quantity: 1 }]);
  assert.deepEqual(JSON.parse(storage.get("nova-wishlist")), [product(9, 400)]);
  assert.equal(storage.get("nova-offer"), "FESTIVE10");

  store.dispatch(cart.clearCart());
  store.dispatch(wishlist.removeFromWishlist(9));
  store.dispatch(offer.clearOffer());
  assert.deepEqual(JSON.parse(storage.get("nova-cart")), []);
  assert.deepEqual(JSON.parse(storage.get("nova-wishlist")), []);
  assert.equal(storage.has("nova-offer"), false);
});
