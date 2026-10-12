# ImageKit upload admin-role fix

The upload function now checks the canonical `admins/{Firebase UID}` role document first, then supports a legacy `admins/{email}` document only when `active` is the Boolean `true` and its stored email matches the verified Firebase account email.

## Apply
1. Keep your existing `.env` and `.env.local` files private and copy them beside `package.json`.
2. Publish the included `firestore.rules` in Firebase Console → Firestore Database → Rules.
3. Restart `netlify dev`.
4. Test product image upload.

Preferred setup remains `admins/{UID}` with `active: true` (Boolean) and the exact matching `email` string. The legacy email path is compatibility-only. These rules do not let users create, update, delete, or list admin role documents.
