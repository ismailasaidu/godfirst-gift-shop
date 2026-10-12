# Customer authentication and administrator access

This project uses Firebase Authentication for customer accounts and a protected Firestore role record for the admin navigation/dashboard. A user's email address or a frontend environment variable alone does **not** grant admin access.

## 1. Enable customer sign-in

1. Open Firebase Console and select `god-first-gift-shop-worldwide`.
2. Go to **Authentication → Sign-in method**.
3. Enable **Email/Password**.
4. Under **Authentication → Settings → Authorized domains**, ensure `localhost` is listed for local development. Add the final site domain after hosting.
5. Under **Project settings → General → Your apps**, copy the web app config into `.env.local` using the names in `.env.example`. Restart `netlify dev` after editing environment files.

Customer sign-up, sign-in, password-reset email, sign-out, and a verification email on registration are implemented in the site. A new customer profile is stored under `users/{uid}` when Firestore rules allow it. A newly created customer account does not get administrator rights. The Admin tab is hidden unless the signed-in UID has an active matching document in `admins/{uid}`.

## 2. Deploy Firestore rules

In Firebase Console open **Firestore Database → Rules** and publish the contents of the project-root `firestore.rules`. These rules allow public reads of published products/categories, deny public catalogue writes, and protect orders and the admin role registry. Do not skip this step.

## 3. Grant the first admin account (one-time setup)

The first admin must be granted manually by the project owner in Firebase Console. The site intentionally has no public “make me an admin” button. Do not grant roles using a frontend environment variable; the active Firestore role record is the access gate.

1. Open the website locally and use the account icon to create an account with the email you will use to administer the shop.
2. In Firebase Console go to **Authentication → Users** and copy that account's **UID** exactly.
3. Go to **Firestore Database → Data** and create a collection named `admins` if it does not exist.
4. Create a document whose document ID is that exact Firebase Auth UID (not the email). Add fields:
   - `active` — Boolean `true`
   - `email` — String containing the admin email
   - `createdAt` — timestamp (optional)
5. Sign out and sign back in, or refresh the website. The `Admin` navigation tab appears only after the app reads this active record. Direct visits to `/admin` are also guarded.

To revoke access, set `active` to Boolean `false` or delete the admin document in Firebase Console. A customer cannot create or edit role documents from the app.

## 4. ImageKit upload permissions

For the current ImageKit signed-upload function, configure server-only variables in `.env` for local use and Netlify environment variables after deployment:

- `IMAGEKIT_PRIVATE_KEY` — the rotated ImageKit private key (never use a `VITE_` prefix).
- `IMAGEKIT_ADMIN_EMAIL` — the designated store-owner email allowed to request signed image uploads.
- `FIREBASE_PROJECT_ID=god-first-gift-shop-worldwide`

The ImageKit function uses this designated email check as an additional upload restriction. Keep it aligned with the intended store-owner account. Never put the private key in frontend code or share it in screenshots/ZIPs.

## 5. Shared catalogue and existing local data

The admin dashboard can publish the current browser catalogue to Firestore from **Admin → Settings → Publish catalogue to shared database**. Export a backup first if you have important local changes. The import updates documents with matching IDs and preserves unrelated Firestore documents. After publishing, admin product/category changes sync to Firestore; public visitors read published products.

Customer orders made while signed in are associated with the Firebase UID and stored in Firestore. Guest checkout remains possible, but guest-created orders are browser-local in this build and will not appear on another device until a secure server-side checkout/order endpoint is configured. Paystack payments still require independent payment verification; this admin panel's manual confirmation must only be used after checking the payment in Paystack/bank records.

## 6. Local development

Run from the folder containing `package.json`:

```bash
npm install
netlify dev
```

Open `http://localhost:8888`. Do not run a second server on the same port. `.env` and `.env.local` must stay out of Git and must not be included in ZIPs shared for code review.


## 7. Final acceptance checklist

Test from the website itself at `http://localhost:8888` after `netlify dev` is running:

- A visitor who is signed out does not see the Admin navigation item.
- A newly registered customer can sign in, request a password reset, and open My Account; they still do not see Admin.
- After an owner creates the `admins/{uid}` document described above and the user signs in again, the Admin tab appears.
- A regular customer who manually opens `/admin` is shown the access-required screen and cannot mount the admin dashboard.
- The admin can create/edit/delete products and categories, manage order statuses and stock, and export a backup.
- Publish `firestore.rules` before testing shared reads/writes. If the console says `permission-denied`, inspect the rules and admin document rather than making collections public.
- ImageKit uploads also require the server variables `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_ADMIN_EMAIL`, and `FIREBASE_PROJECT_ID`; the configured upload email must be the actual admin email.

Important limitations: the admin UI's manual payment confirmation is not a substitute for server-side Paystack verification. Do not fulfil orders based only on a browser callback. Guest checkout orders are not guaranteed to sync across devices in this version.


## 8. Admin operations additions

The admin panel now includes sales analytics with CSV export, inventory quick adjustments and low-stock alerts, customer summaries derived from orders, calculated order/payment notifications, a homepage messaging editor, and shared store settings. Homepage headline/subheadline/announcement content is saved to `storeSettings/main` and displayed on the storefront after it loads. The `storeSettings` Firestore rule allows public reads for storefront content and restricts writes to admins; do not put secrets in this document.

Admin activity history is currently stored in the browser that performed the action, not a tamper-proof server audit log. Customer summaries are based on orders loaded into the dashboard, not a full Firebase Authentication user export. Delivery fee is currently a saved setting only; checkout still tells customers that delivery charges are confirmed later. Automated email/SMS notifications and verified Paystack webhooks are not configured by this UI update.
