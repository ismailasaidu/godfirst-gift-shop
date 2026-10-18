# God First Gift Shop — final touches v8

## Homepage testimonials
- The homepage's FAQ block has been replaced with a responsive testimonial section.
- No fabricated customer reviews are shown by default. The empty state invites customers to share genuine feedback.
- Admin → Settings → Homepage testimonials lets an administrator add/remove genuine feedback. Entries are saved to `storeSettings/main.homeContent.testimonials` in Firestore and shared to the storefront. Only mark a review as a verified purchase if the order was independently checked; this UI does not automatically verify purchases.

## Transactional email events
- Verified Paystack checkout: server function attempts a customer confirmation and an admin paid-order notification, returning individual send outcomes. This confirms API acceptance, not inbox delivery.
- Admin manually confirms payment: sends customer order-received status email.
- Admin changes order status: sends the customer a status email.
- Admin adds/changes tracking reference: sends the customer an email with the tracking reference.
- Admin product save crossing into low stock or becoming out of stock: attempts an admin email alert, unless low-stock alerts are disabled in store settings.
- Admin → Settings includes a Brevo test-email action.

## Required server-side Netlify variables
- `BREVO_API_KEY`: Brevo REST API key (commonly begins `xkeysib-`), not an SMTP key.
- `BREVO_SENDER_EMAIL`: verified sender address in Brevo.
- `BREVO_SENDER_NAME`: optional display name.
- `STORE_ADMIN_EMAIL`: destination for paid-order and stock alerts.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: Firebase Admin service-account JSON used by protected admin email functions and shared order saving.
- `PAYSTACK_SECRET_KEY`: secret key used only by server-side transaction verification.
- `OPENAI_API_KEY`: optional; enables full AI responses. Keep server-side only, never use a `VITE_` prefix.
- `OPENAI_MODEL`: optional; defaults to `gpt-4.1`.

## AI assistant scope
The assistant prompt is broadened beyond shopping to general questions, writing, planning, coding/debugging, calculations and troubleshooting while retaining store-specific truthfulness. It has no tools for performing arbitrary external actions: it must not claim to change orders/accounts, issue refunds, send messages or complete payments. More real actions require explicitly adding authenticated, permission-limited tools.

## Testing checklist
1. `npm ci` then `npm run build`.
2. Admin → Settings → Send test email to admin inbox; confirm both the inbox and Brevo transactional log.
3. Use Paystack test mode and confirm customer confirmation plus admin paid-order alert. Do not make a real payment for testing.
4. Change a test order's status and tracking reference; confirm customer emails.
5. In a test product, cross the low-stock threshold (or set stock to zero) and confirm the admin alert.
6. Add a real customer testimonial in Admin → Settings and confirm it appears on the homepage.
7. Set `OPENAI_API_KEY` in Netlify environment variables and restart `netlify dev` before testing broad AI queries.

## Important delivery note
A successful response from Brevo means the provider accepted the send request. Check Brevo transactional logs for delivered, deferred, bounced or blocked states to confirm inbox delivery.
