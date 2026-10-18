# Fix `FIREBASE_SERVICE_ACCOUNT_JSON is not configured`

This is a server-side Firebase Admin SDK credential. It is separate from the public `VITE_FIREBASE_*` browser configuration.

1. Open the Firebase Console and select the project that contains this shop's Firestore `orders` collection.
2. Go to **Project settings → Service accounts → Firebase Admin SDK**.
3. Click **Generate new private key** and download the JSON file. Keep it private; do not commit it to GitHub or send it in chat.
4. In Netlify, open the linked site **godfirst-gift-shop-world-wide** → **Site configuration → Environment variables**.
5. Add `FIREBASE_SERVICE_ACCOUNT_JSON` and set its value to the **entire contents** of that downloaded JSON file. Store it as one environment-variable value, preserving the JSON quotes and escaped newlines. Do not put `VITE_` in the name.
6. Save the variable, then restart local Netlify Dev (`Ctrl+C`, then `npx netlify dev`) so the environment is reloaded. Redeploy the site after changing production environment variables.
7. Check the terminal logs after a payment-verification test. The `FIREBASE_SERVICE_ACCOUNT_JSON is not configured` message should disappear. If a different error appears, inspect that exact error; it may indicate invalid JSON, the wrong Firebase project, or permissions.

Security:
- Never expose this value in frontend code, a `VITE_` variable, Git, screenshots, or chat.
- Restrict access to the Netlify site and rotate/delete the key if it is exposed.
- Do not make another real payment merely to test the fix. Reconcile the existing Paystack reference and use Paystack test mode for further testing.
