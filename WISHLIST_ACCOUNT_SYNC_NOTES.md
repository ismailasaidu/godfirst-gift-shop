Wishlist account sync update

- Guest wishlist stays in localStorage under gfg_guest_wishlist.
- After sign-in, the guest wishlist is merged with users/{uid}.wishlist in Firestore and then associated with that account.
- Signed-in wishlist changes sync back to the same user's Firestore profile document.
- Signing out clears the signed-in wishlist cache and restores the guest wishlist, preventing one user's wishlist from being left visible to the next account on the same browser.
- This uses the existing users/{uid} profile document and its customer-only Firestore rules; it does not add any admin permissions.

Deployment note: ensure the deployed Firestore rules permit the signed-in user to read/update their own users/{uid} profile while keeping role='customer'. The provided firestore.rules has that behavior.
