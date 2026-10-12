# Admin workspace, stock visibility, and notification update

## Changes
- Admin is presented as a full workspace page instead of a modal overlay over the storefront.
- Removed the Homepage tab from admin navigation. Existing homepage content and storefront behavior are otherwise untouched.
- Product form uses a single image upload control; removed extra image URL/gallery URL and image-tone controls.
- Numeric price/stock/threshold fields use numeric input types, suitable input modes, integer steps for stock, and block common non-numeric keys. WhatsApp input filters invalid characters. Browser form validation still applies.
- Stock quantity zero sets `published: false`, so the product remains in the admin catalogue/inventory but is hidden from the customer storefront. Replenishing stock through the inventory controls republishes a previously out-of-stock item.
- Payment confirmation reduces stock and hides products that reach zero. Returning stock on an eligible cancellation republishes products whose stock is restored.
- Settings now include low-stock/payment-review alert switches and a browser notification permission action. Preferences are stored in Firestore; browser order notification preference is also mirrored locally.
- Admin listens for new documents in the Firestore `orders` collection while signed in as an admin and displays an in-app toast. If browser notifications are enabled and permission is granted, it also raises a desktop notification.
- Notifications panel summarizes pending order reviews, out-of-stock items, and low-stock items.

## Important limitations
- Browser/in-app new-order alerts work for orders that are actually written to the shared Firestore `orders` collection. Current guest checkout flow does not reliably persist guest orders to Firestore; do not treat these alerts as a guaranteed notification channel for every guest checkout.
- Email/SMS/push delivery is not configured. That requires a trusted server-side notification provider and credentials.
- The app's current Paystack status is not server-side verified by this UI update. Manual payment confirmation remains a separate admin action.
- A full production build/browser test could not be completed in this environment because Vite dependencies were unavailable after the package install timed out. Test the project locally before deploying.
