# Final-touch deployment notes

## Changes in this package
- Added a secure ImageKit upload control for subcategory images in Admin → Categories. It uses the existing server-side ImageKit signing function and saves the resulting URL with the subcategory, so the image can sync with the shared category document.
- Improved the category deletion guard so it tells the administrator how many products must be reassigned or removed first. Product-referenced subcategories remain protected against accidental deletion.
- Updated email-verification continuation links to `https://godfirstgiftshopworldwide.com`.
- Added page-aware browser titles, meta descriptions and canonical URLs, plus social title/description updates.
- Added `public/robots.txt` and `public/sitemap.xml`.
- Added optional Brevo transactional email sends after the Paystack server verifies a payment and successfully saves the order: customer payment/order confirmation and admin new-order alert. Email delivery is best-effort and does not invalidate a verified payment.

## Required live configuration
1. Keep `VITE_IMAGEKIT_PUBLIC_KEY` in the site's build environment, and keep `IMAGEKIT_PRIVATE_KEY`, `FIREBASE_PROJECT_ID`, and the admin allowlist (`IMAGEKIT_ADMIN_EMAILS` or supported legacy variable) server-side in Netlify. Do not prefix private values with `VITE_`.
2. Keep `PAYSTACK_SECRET_KEY` and `FIREBASE_SERVICE_ACCOUNT_JSON` server-side in Netlify for server verification and shared order storage.
3. To enable transactional email, configure `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, and `STORE_ADMIN_EMAIL` in Netlify. Verify/authenticate the sender domain in Brevo first. A domain added to Firebase Authentication is not automatically authenticated in Brevo, and an email forwarder alone does not provide an outbound mailbox.
4. In Firebase Authentication → Settings → Authorized domains, ensure `godfirstgiftshopworldwide.com` is present. Keep the Netlify domain temporarily while older links may still be in circulation.
5. Confirm Netlify's HTTPS certificate is active for the root and `www` hostnames before announcing the custom domain.

## Important test status
The Netlify function files passed Node's syntax check. A production Vite build could not be run in this environment because dependency installation timed out and the Vite executable was unavailable. Run `npm ci` and `npm run build` in the project before deploying. Then test a real low-value Paystack test transaction, shared order visibility, category/subcategory image upload from a second device, verification email links, and Brevo delivery in the deployed environment.

## Admin fixes included in the follow-up package
- The subcategory image picker is explicitly visible in the Categories tab. Select a file, wait for the ImageKit success toast, then click Add subcategory. The uploaded URL is saved on the category/subcategory record and the storefront's subcategory cards use that image.
- Removing a subcategory now asks for confirmation and keeps its products under the parent category by clearing only the subcategory assignment.
- Removing a category that contains products asks before moving those products to another existing category, then removes the category. It does not silently delete products.
- The Products tab includes a search field for product name, category, and subcategory.

## Why an order may have no branded email
Paystack confirms payment; it does not automatically send a God First branded receipt. The server function only sends branded transactional emails when the order is saved through its configured Firebase Admin service account and Brevo is configured. Set these in Netlify site environment variables (not `VITE_` variables):
- `FIREBASE_SERVICE_ACCOUNT_JSON` — full Firebase service-account JSON for the same Firebase project; keep private.
- `BREVO_API_KEY` — API key from Brevo.
- `BREVO_SENDER_EMAIL` — sender address verified/authenticated in Brevo.
- `BREVO_SENDER_NAME` — `God First Gift Shop Worldwide`.
- `STORE_ADMIN_EMAIL` — inbox that should receive new-order alerts.

Deploy the Netlify function after setting variables, then run a new test payment and inspect the function logs and the verify response's `emailNotifications` status. This does not retroactively send an email for an older order. If a real payment has already been made, do not pay again just to test; reconcile that existing order and reference first.
