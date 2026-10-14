# Payment, order visibility, and responsive update

## What changed
- After Paystack server verification, the function attempts to write the verified order to Firestore `orders` using Firebase Admin SDK, including guest checkouts.
- The order document ID is the Paystack reference so the transaction and store order can be reconciled.
- The admin live-order listener now merges Firestore orders into locally stored orders instead of overwriting local orders. This helps preserve guest orders already saved in this browser.
- Admin payment badges now distinguish Paystack-verified payments from payments that have not been verified. Stock is still deducted only when an admin confirms fulfilment/payment handling.
- Added responsive safeguards for checkout, product grids, admin panels, order cards, form fields, and horizontally scrollable tables at tablet/mobile widths.

## Required server-side setting for shared orders
For guest orders to be saved to the shared Firestore database, configure `FIREBASE_SERVICE_ACCOUNT_JSON` in the local server environment and in Netlify environment variables. It must be the full Firebase service-account JSON encoded as a single environment-variable value. Never prefix it with `VITE_`, put it in frontend code, commit it, or share it in chat.

For local testing, place this variable in `.env` (not `.env.local` if Netlify Dev says it is overridden there) and restart with `npx netlify dev`. Keep `PAYSTACK_SECRET_KEY` server-side and `VITE_PAYSTACK_PUBLIC_KEY` client-side. Ensure the Firebase service account belongs to the same Firebase project as `VITE_FIREBASE_PROJECT_ID`.

If `FIREBASE_SERVICE_ACCOUNT_JSON` is missing or invalid, Paystack verification can still succeed but the response marks `orderSaved: false` and warns that the verified order needs reconciliation. Do not fulfil an order until it is visible in the shared admin Orders tab or has been manually reconciled.

## Paystack Dashboard
Test payments appear in the Paystack **Test Mode** dashboard for the account whose test keys were used. They do not appear in Live Mode and do not represent real-money payments. The store's Admin > Orders list is separate from Paystack's Transactions list.

## Existing order from before this update
If the old order is still present in the same browser's local storage, the admin order listener now preserves it rather than replacing it with the Firestore list. In Admin > Settings, use “Publish catalogue to shared database” to copy locally available orders into Firestore after confirming the correct project is selected. If the order isn't present locally, reconcile it from the Paystack reference; this code cannot reconstruct a missing cart/customer payload from the reference alone.

## Validation status
`node --check netlify/functions/verify-paystack.mjs` passes. A full Vite build was not run because dependencies were not available in this build environment. Test the complete checkout in Paystack Test Mode before deployment.
