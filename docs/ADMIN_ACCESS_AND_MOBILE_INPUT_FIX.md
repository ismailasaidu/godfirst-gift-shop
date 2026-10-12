# Admin access visibility and mobile input zoom fix

## What changed
- Admin role detection checks the signed-in user's `admins/{uid}` document first. The active flag must be the Firestore Boolean `true`; a supplied email is compared case-insensitively after trimming whitespace.
- If the UID document does not grant access, the app attempts a fallback lookup for an active admin document matching the signed-in email. This fallback requires Firestore rules to permit that query. The UID-based document remains the recommended setup.
- My Account now shows whether admin access was detected, the role-check failure reason when available, and a Check admin access action. Confirmed admins get an Open Admin action.
- On screens 820px wide or less, editable text fields, selects and textareas use a minimum 16px font size to prevent automatic focus zoom in mobile Safari/iOS. The desktop styles and overall storefront layout are unchanged.

## Admin record
In Firestore, create `admins/{Firebase Authentication UID}` with `active` set to Boolean `true` and optionally `email` set to the account email. If the Admin link is still absent, open My Account and use Check admin access; the message explains what the app could not verify. A `permission-denied` message means Firestore security rules need to allow the signed-in user to read their own role document. Do not grant admin access to arbitrary users.

## Validation status
Package JSON parsed successfully. A Vite production build could not be run in this environment because the `vite` executable is unavailable in `node_modules`. Please validate with `npm install` and `npm run build` in the project folder before deploying.
