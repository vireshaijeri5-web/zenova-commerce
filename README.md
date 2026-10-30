# ZENOVA — Everything You Need. One Place.

A responsive React storefront demonstration for ZENOVA with a festival edit, product discovery, verifiable sale markdowns, a demo coupon, Redux Toolkit cart and wishlist state, persistent browser storage, and a frontend-only checkout flow.

## Features

- Animated festival homepage with responsive category links, featured products, and a product-led brand experience
- Responsive ZENOVA logo and standalone emblem favicon, rendered from scalable SVG assets in `public/`
- Offers page with a working `FESTIVE10` demo coupon for 10% off the local checkout total
- Sale prices and badges only when supported by a valid discount in the product API response
- Product catalogue with search, category filters, sorting, result counts, and empty states
- Product detail pages with gallery, quantity selection, wishlist, and add-to-bag actions
- Redux Toolkit cart with quantity controls, removal, clear confirmation, and calculated totals
- Wishlist with Local Storage persistence and move-to-cart actions
- Demo checkout and locally rendered order confirmation; no payments or actual orders
- Demo login/register forms with validation; credentials are not persisted
- API failure fallback catalogue, image fallbacks, loading skeletons, and action feedback
- Responsive layouts, keyboard focus states, reduced-motion support, and Lucide icons

## Technology

React 18, Vite, JavaScript/JSX, React Router, Redux Toolkit, React Redux, Lucide React, regular CSS, and Local Storage.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL when the development server starts (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## GitHub Pages deployment

This project is configured for the `vireshaijeri5-web/zenova-commerce` GitHub Pages project site. The GitHub Actions workflow at `.github/workflows/pages.yml` builds the app on pushes to `main`, preserves client-side route refreshes, and deploys `dist/`. Enable GitHub Pages with **Build and deployment → GitHub Actions** in the repository settings if it is not already enabled. The expected public site address is `https://vireshaijeri5-web.github.io/zenova-commerce/` after a successful deployment.

Vite uses a repository subpath base only in GitHub Actions; local development keeps the root URL.

## Product data

The application requests products from DummyJSON by default. It normalizes product records to the NOVA catalogue shape and converts API dollar prices to approximate INR display values. If the request fails or returns invalid data, the app uses the curated dataset in `src/data/fallbackProducts.js`; the shop remains usable. API availability and image hosts require an internet connection.

To configure another compatible endpoint, copy `.env.example` to `.env` and set `VITE_PRODUCTS_API` to a URL returning either an array of products or an object with a `products` array. API key secrets must not be put in a client-side Vite environment variable.

## State management

`src/app/store.js` configures the Redux Toolkit store. `productsSlice` loads/normalizes API data through an async thunk; `cartSlice`, `wishlistSlice`, and `offerSlice` own their respective global data. The store subscription persists cart, wishlist, and the demo offer code to Local Storage, and each slice hydrates saved values before the UI renders. Counts, cart subtotal, and the offer discount are derived by selectors rather than separately stored.

## Project structure

```text
src/
  app/store.js
  components/
    common/
    layout/
    products/
  data/fallbackProducts.js
  features/
    cart/cartSlice.js
    products/productsSlice.js
    wishlist/wishlistSlice.js
    offers/offerSlice.js
  hooks/useToast.jsx
  pages/
  services/productService.js
  App.jsx
  main.jsx
  styles.css
```

## Screenshots

Add genuine screenshots captured from your running app to a `screenshots/` directory, then link them here. No screenshots are bundled with this project.

## Demo limitations

- Authentication forms validate inputs locally only. No account is created, and no password is stored.
- Checkout is a local demonstration. It does not collect payment details, contact a backend, or place a real order.
- `FESTIVE10` is a local demonstration coupon, not a live promotion.
- Delivery, tracking, customer-support, and contact details are illustrative demo content.
- The displayed INR price for API products uses an approximate conversion and is not a live exchange-rate quote.

## Deployment

Run `npm run build` and deploy the generated `dist/` directory to a static hosting provider. Configure SPA fallback/rewrite behavior so direct requests to routes such as `/shop` and `/product/:id` serve `index.html`. Set `VITE_PRODUCTS_API` at build time only if using a different public product endpoint.

## Future improvements

- Add a secure backend for authentication, orders, payments, and support
- Add automated unit and browser tests
- Add a maintained exchange-rate source and richer, verified catalogue metadata
- Add a production image pipeline and locally hosted product photography
