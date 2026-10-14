# Paystack checkout verification setup

The checkout now sends Paystack's transaction reference to the Netlify function `/.netlify/functions/verify-paystack` after the customer completes the popup. The function verifies the transaction using Paystack's server API and checks the expected NGN amount and currency before the storefront treats it as verified.

## Required Netlify environment variable

In Netlify, open **Site configuration → Environment variables** and add:

- `PAYSTACK_SECRET_KEY`: the secret key from the same Paystack mode as the public key. Keep this key server-side only; do not prefix it with `VITE_`, commit it, or put it in React code.
- `VITE_PAYSTACK_PUBLIC_KEY`: the matching public key, e.g. `pk_test_...` for test mode or `pk_live_...` for live mode.

After saving environment variables, trigger a fresh deploy. Do not test with real customer money until test mode works end-to-end.

## Current scope and important limitation

The storefront only shows a successful payment after the server verification function confirms the Paystack reference, transaction status, amount, and currency. The current app still stores guest orders in the browser's local order list; authenticated customer orders are saved to Firestore under the existing security rules, where the persisted status remains pending verification. Durable server-side order creation for guest checkouts, automatic stock decrement, and admin notifications for guest orders require a separate authenticated server-side order-persistence workflow before the shop should be treated as fully production-ready.
