# God First Gift Shop

A modular React + Vite gift shop frontend.

## Run locally

```bash
npm install
npm run dev
```

For a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

- `src/pages/HomePage.jsx`: homepage and destination discovery
- `src/pages/ShopPage.jsx`: destination, subcategory and product browsing
- `src/pages/ProductPage.jsx`: product detail view
- `src/pages/admin/AdminPage.jsx`: product, category, subcategory and order management
- `src/components/`: shared header, footer, product cards and toast notifications
- `src/data/catalog.js`: demo catalogue and starter categories
- `src/lib/`: Firebase initialization and repository utilities
- `src/App.jsx`: shared catalogue/order state and route coordination

## Category browsing

The intended shopping hierarchy is **destination/category → subcategory → products**. For example, selecting Asia opens the Flowers, Shoes & Footwear, Cakes & Treats, Gift Hampers, Fashion & Accessories and Electronics collections. Selecting Flowers then shows the flower products assigned to that subcategory.

## Admin-to-store behaviour

The admin panel and storefront use the same catalogue and order state in `App.jsx`. Product and category changes therefore update the homepage, shop, product detail views, wishlist, comparison and cart during the current browser session. Catalogue and order data are saved to `localStorage` for local development. The app also contains Firebase initialization/repository utilities, but this project version does **not** yet synchronise those changes to Firestore across devices. Configure Firebase and implement/verify secured Firestore writes before public launch.

Product management supports category and subcategory assignment, image URL, price, previous price, stock, description, feature flag and product label. Category IDs remain stable when a category is renamed so products stay linked. Deleting products also removes them from cart, wishlist and compare state.

## Firebase setup

Copy `.env.example` to `.env.local` and enter your Firebase web app settings. Enable Email/Password Authentication in Firebase Console. Review `firebase.rules.example`; do not deploy permissive rules. The current admin email check is a frontend gate and is not sufficient by itself for production authorization. Use server-enforced custom claims or equivalent security rules before launch.

## Notes

- Product images use remote image URLs and require an internet connection.
- Starter catalogue values and order records are demo data.
- A successful production build must be confirmed locally with `npm run build` before deployment.


## Additional storefront pages

The app includes dedicated About, FAQ, Contact, Account, and Delivery Information pages, linked from the footer. Contact enquiries open a prefilled email draft only when `VITE_CONTACT_EMAIL` is configured in `.env.local`; without that setting, the form displays a setup notice and does not claim to send anything. Account order history currently uses browser-local order data.

## Additional customer pages

- `/order-confirmation` displays the latest locally saved order request and its reference.
- `/privacy-policy` and `/terms` provide starter policy pages. Review these against the shop's real practices and applicable law before launch.
- Mobile navigation uses the shared responsive header and closes after selecting a route.

Order records are currently stored in localStorage. Order confirmation is a receipt of an order request only; it is not proof of payment or delivery. Connect and secure Firestore before production use.


## Checkout and payment setup

The checkout now collects delivery details, shows an order review, and opens the Paystack inline checkout for NGN payments. For local testing, copy `.env.example` to `.env.local` and set `VITE_PAYSTACK_PUBLIC_KEY` to your Paystack **test** public key (`pk_test_...`), then restart Vite. Never put a Paystack secret key in the frontend.

**Production requirement:** the current static frontend records a Paystack transaction reference as `Payment confirmation pending`; it does not securely verify payment. Before fulfilling live orders, implement a trusted server-side endpoint (for example, a Firebase Cloud Function) that verifies the reference with Paystack using a server-only secret key and confirms the amount, currency, and order. Do not mark orders paid based only on the browser callback.

Products can optionally include `gallery: [url1, url2, ...]` (or `images`) and `details` fields. The product detail page will display a thumbnail gallery when additional image URLs are supplied; it will not invent alternate angles when the catalogue has only one image.

## Brand colour system
The storefront interface uses the approved Electric Red (`#FF003D`), White (`#FFFFFF`), and Warm Cream (`#FFF4E6`) palette. A deeper red (`#C9002D`) is used for readable text and contrast within the red family. Product photography itself is intentionally unchanged.


## Firebase and secure checkout setup

See [`docs/FIREBASE_SETUP.md`](docs/FIREBASE_SETUP.md) before connecting a live store. The `firestore.rules` file intentionally denies client-side order creation; do not relax this rule for production. Payment verification and inventory changes must run on a trusted backend using the Paystack secret key and Firestore transactions.

## ImageKit product photo uploads

The product form supports direct photo selection and uploads to ImageKit, with the image URL attached automatically. See [`docs/IMAGEKIT_SETUP.md`](docs/IMAGEKIT_SETUP.md) for account setup and the required environment variables. The ImageKit private key must remain in Netlify server-side environment variables; never add it to a `VITE_` variable.


## Customer authentication and admin access

See `docs/AUTH_ADMIN_SETUP.md` for enabling Firebase Email/Password sign-in, publishing Firestore security rules, granting the first admin UID safely, and publishing the local catalogue to the shared database.
