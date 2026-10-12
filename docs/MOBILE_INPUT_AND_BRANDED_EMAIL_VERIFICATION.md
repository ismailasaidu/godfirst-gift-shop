# Mobile inputs and branded email verification

## Mobile form zoom

All input, select and textarea controls are forced to a 16px minimum font size on screens up to 767px wide. This prevents iOS Safari from automatically zooming when a user focuses a small-font form field. Desktop styles remain unchanged.

## Branded verification page

The app now handles Firebase email action URLs with `mode=verifyEmail` and `oobCode`, verifies the one-time code with Firebase `applyActionCode`, and presents a branded God First Gift Shop Worldwide success/error screen. On success, the customer can continue to the site's account page; expired/used links receive a useful explanation and route back to the store.

### Required Firebase Console setup (one-time)

The code alone cannot change the sender name, subject, email copy, or action URL in the Firebase project. To make links open the new branded page rather than Firebase's default bland handler:

1. Deploy the site first and confirm its public HTTPS domain works. Do not use localhost or a LAN IP for customer emails.
2. Firebase Console → Authentication → Settings → Authorized domains: add the exact production domain (for example, `your-domain.com` and `www.your-domain.com` if both are used).
3. Firebase Console → Authentication → Templates → Email address verification → Edit.
4. Set the action URL to `https://YOUR-PRODUCTION-DOMAIN/auth-action` (replace with the real live domain). Save it. The app is configured to handle Firebase's `mode` and `oobCode` parameters on this path.
5. In the same template, use a professional subject such as `Verify your email for God First Gift Shop Worldwide`, use `God First Gift Shop Worldwide` as the public-facing app name/sender display name where the Firebase console offers it, and rewrite the body in the store's voice. Keep Firebase's `%LINK%` placeholder intact in the verification button/link.
6. In Authentication → Settings, set the public-facing project name to `God First Gift Shop Worldwide` if available. To send from a branded address on your own domain, configure and verify a custom sender domain using Firebase's email template settings; a Gmail address alone will not make Firebase send from the store's domain.
7. Test a brand-new account on the deployed HTTPS site, click the email link on mobile and desktop, confirm the branded success screen appears, then return to Account and confirm the verified state refreshes.

Firebase's email-template sender settings are project-level settings and must be saved in the Firebase Console; they cannot be changed by a frontend ZIP. The existing signup flow still uses Firebase Authentication and `sendEmailVerification`.
