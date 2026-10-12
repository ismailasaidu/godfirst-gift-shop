# ImageKit product photo uploads

This project now supports choosing a product photo directly inside the existing admin product form. The browser uploads the photo to ImageKit, and the returned URL is saved in the product's `image` field. The existing optional image URL field remains available as a fallback. No Firebase Storage upload is used by this flow.

## 1. Create ImageKit account and get keys

1. Create a free account at https://imagekit.io/registration/.
2. Open the ImageKit Developer Options / API keys area.
3. Copy the **Public key** and **Private key**. Never put the private key in frontend code or a variable beginning with `VITE_`.

## 2. Set environment variables

In your local `.env.local`, set:

```env
VITE_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxxx
```

In Netlify site settings → Environment variables, set:

- `VITE_IMAGEKIT_PUBLIC_KEY` = your ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` = your ImageKit private key
- `IMAGEKIT_ADMIN_EMAIL` = the exact email address used to sign in to the store admin
- `FIREBASE_PROJECT_ID` = the Firebase project ID used by this site

The last three variables are server-side only. Do not prefix them with `VITE_` and do not commit their values to Git. Redeploy after changing environment variables.

## 3. Authentication requirement

The upload-signature function is `netlify/functions/imagekit-auth.mjs`. It verifies the Firebase ID token and only issues a short-lived ImageKit signature when the signed-in email matches `IMAGEKIT_ADMIN_EMAIL`. The function requires Firebase Email/Password sign-in to be configured for the same Firebase project. Do not make the upload-signature endpoint public without authentication.

## 4. Using it

Open the admin dashboard → Products → Add a product. Choose a photo in **Product photo**. It uploads automatically; once the thumbnail says **Photo attached**, complete the product details and publish. The image URL field remains editable if you already have a hosted image URL.

The upload control currently limits files to 5 MB. For the best free-plan usage, upload reasonably sized product photos and avoid unnecessary duplicate images.

## 5. Local development

`npm run dev` runs Vite only and does not serve Netlify Functions. To test uploads locally, install Netlify CLI and run `netlify dev` with the environment variables above. Otherwise, test after deploying a preview to Netlify.

## Scope note

This integration handles product-image hosting only. Product catalogue, categories, and orders in the current app are still stored in browser localStorage until the separate shared Firestore integration is completed. ImageKit does not provide a shared database or secure order/payment processing.
