# God First Gift Shop — v5 final-touch verification

## Important environment checks

- `BREVO_API_KEY` must be a **Brevo REST API key** (usually starts with `xkeysib-`), not an SMTP key (often starts with `xsmtpkey-`). The Netlify functions call Brevo over HTTPS using the `api-key` header; they do not log in to Brevo using SMTP.
- `BREVO_SENDER_EMAIL` must be a sender verified in Brevo.
- `STORE_ADMIN_EMAIL` must be the inbox that should receive paid-order alerts.
- `PAYSTACK_SECRET_KEY` must match the environment of `VITE_PAYSTACK_PUBLIC_KEY` (both test or both live).
- `FIREBASE_SERVICE_ACCOUNT_JSON` must be valid JSON for the same Firebase project. Order email sending is now attempted independently of the Firestore order-save attempt, but the shared Admin Orders view still requires the service account.
- `OPENAI_API_KEY` is server-side only. `OPENAI_MODEL` is optional; default is `gpt-4.1`.

## Firebase custom action handler

1. In Firebase Console, open **Authentication → Settings → Authorized domains** and add `godfirstgiftshopworldwide.com` and `www.godfirstgiftshopworldwide.com`.
2. In **Authentication → Templates**, set the custom action URL/handler to `https://godfirstgiftshopworldwide.com/auth/action` wherever the Firebase project exposes that option.
3. Use the verification and password-reset templates to send a fresh link after changing the handler. The app's branded page can process `verifyEmail`, `resetPassword`, and a generic `mode=action` link when the Firebase action code identifies the operation.
4. If the Firebase console does not expose a custom action handler, Firebase may continue to use its hosted action page; the app cannot force the Firebase-hosted page to become branded from frontend code alone.

## Safe test sequence

1. Run `npm ci`, then `npm run build`.
2. Run `npx netlify dev` (not `npm run dev`) to load Netlify Functions locally.
3. Create one test account with an email address you can access. Confirm Firebase sends a link, the link opens `/auth/action`, verification succeeds, and sign-in works.
4. Use the password-reset flow and verify that the branded reset page accepts a new password.
5. Ask the Gift Assistant follow-up questions (e.g. “gift for my mum under ₦20,000” then “make it more personal”) to verify conversational context.
6. Test phone country selection, country flag/dial code, and invalid postal codes before entering payment.
7. Test order emails only with Paystack test credentials and test-mode transaction. Do not make a live payment to test email delivery.
8. In Netlify function logs, look for `Brevo transactional API rejected a message` and its HTTP status. `401/403` usually indicates the wrong/invalid API key; `400` often means sender/recipient/payload validation; `429` means rate limiting. Never paste the API key into chat or logs.

## SMTP security warning

If Brevo sends an alert about an SMTP call, this project's Brevo integration is not the source of an SMTP protocol call: the code calls the HTTPS transactional API. Check whether Firebase Identity Platform or another service has Brevo SMTP credentials configured, and rotate/revoke any SMTP key you do not recognise. Do not use an SMTP key as `BREVO_API_KEY`.
