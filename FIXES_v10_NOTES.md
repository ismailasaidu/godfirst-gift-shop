# v10 fixes

- Checkout: moved the country selector before the phone field so the destination and dial-code context are visible first; postal/ZIP is optional and no longer blocks checkout due to a country-specific format mismatch; phone validation now checks for a reasonable 7–15 digit number and normalizes it with the selected country dial code where available.
- Homepage: moved the testimonial section directly below the trust strip so it is much easier to find. It continues to display only real testimonials saved by an administrator; no fabricated reviews were added. If none are saved, it shows the invitation to submit genuine feedback.
- AI assistant: changed the request to the Chat Completions API with plain string message content, removing the unsupported `input_text` content format that appeared in the logs. Added model fallback from the configured model to `gpt-4.1-mini` and `gpt-4o-mini` for model/request errors.

## Important configuration still required
- Brevo local testing may still be blocked by its authorised-IP security settings.
- `FIREBASE_SERVICE_ACCOUNT_JSON` is still required by the payment verification function to save verified orders to the shared Firestore database. This ZIP does not contain credentials.
- A production build could not be verified in this environment because dependency installation timed out. Run `npm ci` and `npm run build` locally before deployment.
