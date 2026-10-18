# God First Gift Shop Worldwide — Final Touches & Deployment Checklist

This package keeps the existing storefront/admin visual design and adds the dedicated Firebase action page, a gift assistant, and transactional order-status email support. A successful local build does not by itself prove live email delivery or live Firebase configuration.

## 1. Local test

1. Extract this ZIP into a new folder so the previous copy remains untouched.
2. In that folder run `npm ci`, then `npm run build`.
3. Link the folder to the existing Netlify site once with `npx netlify link`, then run `npx netlify dev` for local tests. Do not run `npm run dev` when testing Netlify functions.
4. Test category emoji selection, subcategory image upload, safe deletion/reassignment, product search, product description display, account action links, and the gift assistant.

## 2. Firebase: dedicated branded email action pages

The app now has its own branded action page for Firebase email verification and password reset. Firebase must be configured to direct its action links to the app for these pages to be used.

1. Firebase Console → Authentication → Settings → Authorized domains: ensure `godfirstgiftshopworldwide.com` and `www.godfirstgiftshopworldwide.com` are listed.
2. Firebase Console → Authentication → Templates. Open the **Email address verification** template and use the custom action URL option to set `https://godfirstgiftshopworldwide.com/auth/action` if that option is available in your project.
3. Repeat for the **Password reset** template, using the same custom action URL.
4. Save the templates. Use the real delivered link to test each action. The app processes the Firebase `mode` and `oobCode` query parameters on the branded page and removes sensitive action-code parameters from the visible URL after use.
5. If your Firebase Console does not offer a custom action URL for a template, do not assume the app page is being used: Firebase's hosted handler may still be shown. Check the actual email link and Firebase template configuration.

The `url` passed by the app in `sendEmailVerification` is the continuation URL; it is not, by itself, a guarantee that Firebase will replace its hosted action handler with the custom page.

## 3. Netlify environment variables

Keep all secret values server-side (never use `VITE_` for secrets):

- `PAYSTACK_SECRET_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON` — service account JSON for the same Firebase project, including the private key; store as a single Netlify environment variable.
- `FIREBASE_PROJECT_ID`
- `BREVO_API_KEY`
- `BREVO_SENDER_EMAIL=support@godfirstgiftshopworldwide.com`
- `BREVO_SENDER_NAME=God First Gift Shop Worldwide`
- `STORE_ADMIN_EMAIL` — the inbox that should receive new paid-order alerts.
- Optional `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-4.1-mini` for AI-powered gift recommendations.
- Existing ImageKit server credentials and `VITE_IMAGEKIT_PUBLIC_KEY` are still needed for image uploads.

After changing Netlify variables, restart `npx netlify dev`; redeploy after production variable/code changes.

## 4. Email coverage

- Account verification and password reset: Firebase Authentication templates, not Brevo.
- Successful Paystack payment: `verify-paystack` saves the order first, then attempts a customer confirmation and admin paid-order alert through Brevo.
- Admin order status change: `order-status-email` verifies the Firebase ID token and active admin role before sending the customer an update through Brevo.
- Email delivery is best-effort. A verified payment must not be treated as failed just because an email provider is unavailable. Check the Netlify function logs and Brevo transactional logs for delivery failures.
- No real payment is required to test email troubleshooting. Inspect an existing order/log first, or use Paystack test credentials in a separate test setup.

## 5. Gift assistant

The storefront assistant is connected to `/.netlify/functions/gift-assistant`. If `OPENAI_API_KEY` is configured, it uses the OpenAI API and can recommend only products supplied by the live catalogue. Without the key or when the API is unavailable, it falls back to local catalogue matching. It does not invent prices or claim out-of-stock products are available.

## 6. Important final checks

- Ensure Firebase Firestore rules and the `admins/{uid}` document still grant only approved admins access.
- Verify an order is present in the shared Firestore `orders` collection before fulfilment.
- Confirm that the Brevo sender is verified/authenticated and that the account is permitted to send transactional messages.
- Test customer emails using an address you control, check Spam/Junk, and inspect Brevo transactional logs.
- Do not publish until the production build passes and the key flows above have been tested.
