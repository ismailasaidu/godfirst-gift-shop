# Email audit and safe test checklist

## Code paths audited
- Firebase verification and password reset use Firebase Authentication (`sendEmailVerification`, `sendPasswordResetEmail`). They do not use Brevo.
- Successful Paystack verification attempts a customer payment confirmation and a store-admin new-paid-order alert through Brevo REST API (`https://api.brevo.com/v3/smtp/email`).
- Admin order status changes call `order-status-email`.
- Admin manual payment confirmation now also attempts the `Order received` customer email.
- Admin Settings now has a protected `Send test email to admin inbox` button using `test-email`.
- Low-stock alerts remain in-app/browser alerts; automatic low-stock email delivery is not implemented by this patch.

## Required Netlify environment variables
- `BREVO_API_KEY`: Brevo REST API key (not the SMTP key).
- `BREVO_SENDER_EMAIL`: verified sender address.
- `BREVO_SENDER_NAME`: optional display name.
- `STORE_ADMIN_EMAIL`: destination for new-order alerts and test email.
- `PAYSTACK_SECRET_KEY`: server-only Paystack secret.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: valid Firebase service-account JSON for order persistence and admin-protected email functions.
- `FIREBASE_PROJECT_ID`: optional fallback if project ID is present in the service account JSON.

## Test safely
1. Deploy/serve with `npx netlify dev`, not Vite alone, so Netlify Functions are available.
2. Sign in as the configured administrator and open Admin → Settings.
3. Click `Send test email to admin inbox`; check the toast, the destination inbox/spam, and Brevo transactional logs.
4. Use a test-mode Paystack transaction for checkout. Never make another real payment solely to test emails.
5. Change a test order status in Admin → Orders and confirm the customer email arrives.
6. Test Firebase verification and password reset separately; they are delivered by Firebase, not Brevo.

A successful HTTP/API acceptance is not proof of inbox delivery. Check the Brevo message status and the recipient mailbox.
