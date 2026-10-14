God First Gift Shop — requested UI-only updates

Changes:
- Removed the Cancelled option from the admin Orders status selector and removed the related cancel/restock interaction from the status-change handler. Existing order status, payment verification, tracking, and inventory features remain otherwise unchanged.
- Replaced the lower-left hero photo card with the supplied cake photo at public/images/hero-cake.jpeg.
- Replaced the upper-right hero photo card with the supplied bouquet photo at public/images/hero-flowers.jpeg.
- Added desktop/tablet responsive CSS for admin layout, order cards, order item grids, status metadata, action controls, and forms. Existing mobile navigation/tab-strip rules were left in place.

Environment variables are not included. Restore your own .env/.env.local privately when using this project.

Validation note: ZIP integrity checked. A full Vite build could not be completed in this environment because dependencies were unavailable for installation. Please run npm install and npm run build locally before deploying.
