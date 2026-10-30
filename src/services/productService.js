import fallbackProducts from "../data/fallbackProducts.js";

const apiUrl = import.meta.env?.VITE_PRODUCTS_API || "https://dummyjson.com/products?limit=100";
const categoryMap = {
  smartphones: "Technology",
  laptops: "Technology",
  tablets: "Technology",
  "mobile-accessories": "Technology",
  "sports-accessories": "Technology",
  fragrances: "Lifestyle",
  beauty: "Lifestyle",
  "skin-care": "Lifestyle",
  groceries: "Lifestyle",
  "home-decoration": "Home Essentials",
  furniture: "Home Essentials",
  "kitchen-accessories": "Home Essentials",
  "mens-watches": "Accessories",
  "womens-watches": "Accessories",
  "mens-bags": "Accessories",
  "womens-bags": "Accessories",
  "womens-jewellery": "Accessories",
  "mens-jewellery": "Accessories",
  sunglasses: "Accessories",
  tops: "Lifestyle",
  "womens-dresses": "Lifestyle",
  "womens-shoes": "Lifestyle",
  "mens-shirts": "Lifestyle",
  "mens-shoes": "Lifestyle",
  motorcycle: "Lifestyle",
  vehicle: "Lifestyle"
};

function normalizeProduct(product) {
  const image = product.thumbnail || product.images?.[0] || "";
  const sourceCategory = String(product.category || "").toLowerCase();
  const discountPercentage = Number(product.discountPercentage);
  const hasDiscount = Number.isFinite(discountPercentage) && discountPercentage >= 1 && discountPercentage < 90;
  const originalPrice = Math.round(Number(product.price) * 83.5);
  return {
    id: product.id,
    title: product.title || "Untitled product",
    category: categoryMap[sourceCategory] || "Lifestyle",
    price: hasDiscount ? Math.round(originalPrice * (1 - discountPercentage / 100)) : originalPrice,
    originalPrice: hasDiscount ? originalPrice : null,
    discountPercentage: hasDiscount ? Math.round(discountPercentage) : null,
    rating: Number(product.rating) || null,
    reviewCount: Number(product.reviews?.length) || null,
    description: product.description || "A thoughtfully selected everyday essential.",
    thumbnail: image,
    images: product.images?.length ? product.images : [image],
    brand: product.brand || "NOVA edit"
  };
}

export async function fetchProducts({ signal } = {}) {
  const response = await fetch(apiUrl, { signal });
  if (!response.ok) throw new Error(`Product service returned ${response.status}`);
  const payload = await response.json();
  const records = Array.isArray(payload) ? payload : payload.products;
  if (!Array.isArray(records) || records.length === 0) throw new Error("The product service returned no products.");
  return records.map(normalizeProduct).filter((product) => product.id && Number.isFinite(product.price));
}

export { fallbackProducts };
