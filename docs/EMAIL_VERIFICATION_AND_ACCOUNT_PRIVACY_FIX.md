# Email verification and account-page privacy update

- New signups must successfully request a Firebase verification email before the UI reports success.
- After signup, the new account is signed out and the modal explains that the customer must verify their email before signing in.
- An unverified customer who attempts to sign in is immediately signed out. The app attempts to send a fresh verification email and displays a clear status instead of granting a signed-in session.
- Firebase email-send errors are surfaced with a helpful message instead of being swallowed.
- The Account page no longer exposes administrator-role checks, role errors, or a “Check admin access” button. Actual administrator authorization checks for protected admin functionality remain in place.

## Firebase deployment checklist

1. Confirm Email/Password is enabled in Firebase Authentication.
2. Confirm `godfirst-gift-shop-world-wide.netlify.app` is in Authentication → Settings → Authorized domains.
3. Add all production-required environment variables to Netlify and redeploy.
4. Test with a new email address. Check Spam/Junk. If no email arrives, inspect the browser console for the logged Firebase send error and check Firebase Authentication usage/quotas and email delivery status.

Firebase may limit template editing independently of sending verification emails. This code cannot override Firebase-side delivery restrictions or quota limits.
