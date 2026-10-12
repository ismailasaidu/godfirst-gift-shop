# Admin-to-storefront integration audit

## Fixes applied in this audit

- Product saves now reject non-numeric/negative prices, negative stock, and fractional stock counts; newly saved products are explicitly marked as published.
- Payment confirmation and cancellation stock adjustments aggregate repeated order lines for the same product, avoiding under-deduction/under-restocking when an order contains duplicate lines.
- A cancelled order cannot be payment-confirmed, and an order whose stock has already been returned cannot be reopened and fulfilled a second time through the status selector.
- Dashboard order value converts totals to numbers before summing, avoiding string concatenation when older records store totals as strings.
- Analytics handles Firestore Timestamp values as well as ISO date strings, and best-selling units/revenue exclude unverified and cancelled orders.
- The low-stock threshold correctly supports `0` instead of silently treating it as the default `5`.
- The settings screen now explicitly labels the delivery amount as a reference estimate because checkout currently confirms delivery charges separately and does not include the setting in the Paystack charge. This avoids silently charging an unconfirmed flat fee for different delivery destinations.

## Integration paths reviewed

- Admin product/category/order state updates pass through the App callbacks, which persist to local storage and attempt Firestore synchronisation for an active admin.
- The homepage reads the `homeContent` state; the admin homepage editor writes that content to `storeSettings/main`.
- Product/category IDs are used by the shop/category filters; products are assigned to category IDs, not category display names.
- Admin visibility is controlled by the active Firestore `admins/{uid}` role check.

## Known blockers / items that cannot honestly be marked complete

1. **Guest orders are not reliably shared with the admin panel.** The checkout flow only writes the order to Firestore when a customer is signed in; guest orders remain in browser state/local storage. A secure server-side guest-order endpoint is required if guest checkout is to remain supported.
2. **Paystack is not server-verified.** The browser callback records a payment reference with `pending_server_verification`; the admin currently has to independently check Paystack before manually marking it confirmed. Do not treat the browser callback as proof of payment.
3. **Delivery fee is not included in the checkout amount.** It is explicitly a reference setting until destination-based delivery rules are defined and wired to both checkout display and payment amount.
4. **Cloud writes are asynchronous and not transactional.** Stock deduction/order updates are separate writes; simultaneous admin actions or purchases can race. Production inventory needs trusted server-side transactions/reservations.
5. **Shared catalogue migration may be needed.** Public product queries require `published: true`; older Firestore product records without that field may not appear until an admin republishes/migrates them.
6. **Build/browser testing is outstanding.** Dependency installation could not complete in this environment because the npm registry package was unavailable/timed out, so a full Vite production build and live Firebase/browser test were not possible here.

## Required acceptance tests before production

- Add/edit/delete a product in admin; verify shop listing, featured products, category filtering, cart and a second browser/device after refresh.
- Add/edit/delete a category and subcategory; verify assigned products and storefront filters.
- Test stock values `0`, `1`, and a normal quantity; ensure no negative/fractional inventory can be saved.
- Confirm a test order with two separate lines for the same product; verify stock is reduced by the sum of quantities exactly once.
- Cancel a confirmed test order; verify stock is restored exactly once and the order cannot be reconfirmed/reopened accidentally.
- Verify a test Paystack transaction directly in the Paystack dashboard before marking it manually confirmed.
- Test both signed-in and guest checkout and confirm which orders appear in the admin panel.
- Test Firestore rules with a regular customer and an admin; customers must not write products/categories/settings or update orders.
- Run `npm ci`, `npm run build`, then test `netlify dev` and the deployed Netlify site with the real Firebase project.
