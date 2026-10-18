# Firebase verification and password-reset continuation URL fix

The signup, resend-verification, and password-reset actions now use a single canonical production continuation origin:
`https://godfirstgiftshopworldwide.com`

When running on `localhost` / `127.0.0.1`, the current local origin is retained for local testing.

## Firebase Console checks still required

1. Authentication → Settings → Authorized domains: confirm `godfirstgiftshopworldwide.com` exists exactly, with no backslash or extra characters. If using `www`, add `www.godfirstgiftshopworldwide.com` as a separate domain.
2. Authentication → Sign-in method: ensure Email/Password is enabled.
3. Request a new verification email after deploying this code. Old emails may contain the old continuation URL.
4. If email delivery still fails, inspect the exact Firebase error code in the browser console. This code change fixes the continuation URL selection; it cannot override project-level Firebase configuration or email quotas.

Firebase verification and password-reset emails are sent by Firebase Authentication, not Brevo. Brevo is used for the shop's server-side transactional emails.
