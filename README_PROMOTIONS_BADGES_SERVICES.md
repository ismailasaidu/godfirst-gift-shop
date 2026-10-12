# Promotions, automatic badges and WhatsApp service enquiries

This update is based on the existing God First Gift Shop project and preserves its current design system and Firebase/ImageKit integrations.

## Changes
- Replaced the manual Previous Price field with a Regular Price field. Product badge selection is no longer part of product creation.
- Added a Promotions admin tab. Admins can create a percentage or fixed-amount promotion targeting one product or one category, pause/reactivate it, and remove it.
- Promotion prices are applied to the existing product records so the same effective price is used by product cards, product details and the cart. Existing product synchronisation remains in use.
- Prevents discount stacking on products that already have an active promotion. Fixed discounts are checked against the least expensive target product.
- Automatically displays badges for active promotions, low stock, new arrivals (first 14 days), and bestsellers (at least 3 units across verified, non-cancelled orders). Legacy manually entered labels are not used when the automatic badge calculation is available.
- Each Services page card opens WhatsApp with a prefilled message naming the selected service. It uses the existing WhatsApp contact already referenced elsewhere in this website: +233 27 703 1930.

## Run locally
1. Keep the existing `.env` and `.env.local` files private and copy them beside `package.json` in this project folder.
2. Run `npm install` if dependencies are not already installed.
3. Run `netlify dev` from the folder containing `package.json` and `netlify.toml`.
4. Open `http://localhost:8888`.

## Notes
- Promotions are stored in the existing `storeSettings/main` Firestore document and product price changes use the existing product synchronisation path. If Firestore rules have been customised, admin write access to `storeSettings/main` and `products` must remain enabled.
- This implementation supports active/paused promotions. It does not schedule future start/end times or automatically expire campaigns.
- Bestseller badges use only orders whose recorded payment status is `manually_confirmed`, `verified`, `success`, or `successful`, and excludes cancelled orders.
- The WhatsApp link opens a draft only. The customer must press Send in WhatsApp.

## Delivery fee and speed options
- The product form now has normal and express delivery fees plus editable estimated durations.
- At checkout, customers choose normal or express delivery and see each option's duration and calculated fee.
- Delivery fees are set per product and charged per unit quantity; the chosen fee is added to the Paystack amount and stored on the order with its delivery method.
- Older products default to ₦0 delivery fees until the owner edits them and enters fees/durations.
