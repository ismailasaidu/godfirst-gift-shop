GOD FIRST GIFT SHOP — REVIEW + HEADER FIX V5

IMPORTANT: This is a new project folder/archive. Stop the old Netlify/Vite server and run the commands from THIS extracted folder, not from a previous v2/v3/v4 folder.

Homepage changes:
- The delivery/review-style card is placed immediately after “Shop by destination”.
- It uses a delivery/gift-preparation photo and an honest shop promise until approved genuine customer feedback exists.
- If approved reviews are configured in the homepage content, the card shows them with working previous/next controls.
- The separate duplicate custom-gift promo section is not inserted at this position.

Header changes:
- Wide screens keep the horizontal desktop header.
- At laptop/zoomed widths up to 1760 CSS pixels, the existing left-opening navigation drawer is used so links do not crush search, account, wishlist or bag controls.

To test:
1. Extract this ZIP into a NEW folder.
2. Copy any local .env values needed for your own development into this folder only; never commit secrets.
3. In PowerShell, cd into this exact folder.
4. Run: npm install
5. Run: npm run build
6. Run: npx netlify dev
7. Open http://localhost:8888, then scroll past “Shop by destination” to see the review/promise card.

Do not force-push. Keep your previous folder as a backup until this build and UI are confirmed.
