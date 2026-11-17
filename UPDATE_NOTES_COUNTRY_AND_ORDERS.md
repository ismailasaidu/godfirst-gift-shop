# Account country and order history update

## Changes
- Account regional settings now ask for country only; the display currency is derived automatically from the selected country.
- Country selection is available only to signed-in users.
- The selected country and derived currency are saved to the signed-in user's Firestore profile and restored on sign-in.
- The latest order remains the primary featured card. Older orders are selectable and expand into the same card design.

## Important: deploy the Firestore rules
The updated account preference save flow preserves the existing user role. The accompanying `firestore.rules` file allows a signed-in user to update only their own regional preference fields (and the existing wishlist field) without changing their role.

Deploy the rules from the project root after confirming the Firebase project is the correct one:

```bash
firebase deploy --only firestore:rules
```

If you do not deploy the updated rules, Firestore may continue rejecting preference saves under the previously deployed rules.

## Local testing
```bash
npm install
npx netlify dev
```
Open `http://localhost:8888`, sign in, choose a country, save, refresh, and confirm the selection is restored. Also test expanding an older order in My Orders.
