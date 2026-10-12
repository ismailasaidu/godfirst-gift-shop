# Firebase setup — God First Gift Shop Worldwide

This project includes Firebase client configuration support. These steps connect the app to your Firebase project; they do not automatically create a Firebase project or grant admin permissions.

## 1. Create / open your Firebase project
1. Open https://console.firebase.google.com/ and create a project for God First Gift Shop Worldwide (or select the existing store project).
2. In Project settings → General → Your apps, add a Web app.
3. Copy the web app config values into a local `.env.local` file using `.env.example` as the template. Do not commit `.env.local`.
4. In Build → Authentication → Sign-in method, enable Email/Password.
5. In Build → Firestore Database, create a database in production mode.
6. Deploy the `firestore.rules` file in this project from Firestore → Rules after reviewing it.

## 2. Create the first administrator securely
The rules require the Firebase custom claim `admin: true`. A matching email in `VITE_ADMIN_EMAIL` only controls the UI; it does not grant database permissions by itself.
Use a trusted server/admin environment with Firebase Admin SDK to assign the claim to the intended user's Firebase Auth UID. Never place a service-account JSON key or Paystack secret in frontend code or a `VITE_` variable. If you don't have a trusted backend set up, pause here rather than opening database writes to everyone.

Example to run only in a trusted, private Node.js admin environment (never in the browser):
```js
import admin from 'firebase-admin';
admin.initializeApp({ credential: admin.credential.applicationDefault() });
await admin.auth().setCustomUserClaims('FIREBASE_AUTH_UID_HERE', { admin: true });
```
After assigning the claim, the user must sign out and sign back in to refresh the token.

## 3. Paystack verification
The browser's Paystack public key is safe to use in the checkout widget; the Paystack secret key is not. A successful browser callback is not proof of payment. Before the store treats an order as paid or deducts stock, a trusted server endpoint must:
- verify the transaction reference with Paystack's transaction verification API using a secret stored server-side;
- validate status, expected NGN amount and currency;
- create/update the order and reserve/deduct inventory transactionally in Firestore;
- make verification idempotent so callback retries cannot create duplicate orders or deduct stock twice.

Do not enable real payments or open order-write permissions until this server-side flow is deployed and tested.

## 4. Current app limitation
The current UI still stores much of its state in browser local storage. Firebase client configuration alone does not migrate that data into Firestore or make it shared between devices. Export/back up the current catalogue first, then migrate it through an authenticated admin-only import or script. Do not overwrite the catalogue until the existing products and categories are backed up.

## 5. Environment template
Use `.env.example` as the starting point. Values beginning with `VITE_` are included in the public browser bundle, so only Firebase web-app configuration and the Paystack public key belong there. Never place secrets there.
