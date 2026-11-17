# Currency checkout and account prompts update

## Changes
- Checkout now presents the converted total in the customer's saved display currency first.
- The equivalent NGN amount appears immediately below in brackets and explicitly states that Paystack will charge that NGN amount.
- The Paystack transaction remains NGN; the public key, amount calculation, verification request, and order processing flow were not changed.
- The payment button now labels the amount in the customer's selected display currency.
- Added a compact homepage prompt linking customers to Account so they can set their home country.
- Added a matching prompt to the full cart page.
- The prompts distinguish signed-in users from visitors; visitors are directed to sign in through the Account page before saving a country.

## Validation
- TypeScript JSX parser syntax checks passed for CheckoutPage.jsx, HomePage.jsx, CartPage.jsx, and App.jsx.
- A full Vite production build could not be run in this environment because dependency installation timed out and required npm packages were not available locally.

## Payment behaviour
The checkout's actual Paystack amount remains the existing NGN `grandTotal` multiplied by 100, with `currency: 'NGN'` and server verification expecting `NGN`. The converted display amount is presentation only and does not alter payment processing.
