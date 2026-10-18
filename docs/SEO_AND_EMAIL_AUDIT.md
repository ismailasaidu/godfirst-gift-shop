# SEO and transactional email deployment notes

## SEO changes in this release
- The homepage FAQ was already replaced with the customer testimonial section in the supplied v8 baseline; this release keeps that section and adds a supporting gift-guide copy block.
- Route-specific document titles, descriptions, canonical URLs and Open Graph/Twitter metadata.
- Product structured data (`Product` + `Offer`) and store structured data.
- Product names are crawlable links with real `/product/{id}` URLs.
- `/sitemap.xml` is routed to a Netlify function that lists core public routes and currently published/in-stock Firestore products when `FIREBASE_SERVICE_ACCOUNT_JSON` is configured.
- `robots.txt` allows public content and excludes private account/checkout/admin pages.

## Search engine launch checklist
1. Deploy the site to `https://godfirstgiftshopworldwide.com`.
2. Open `https://godfirstgiftshopworldwide.com/robots.txt` and `https://godfirstgiftshopworldwide.com/sitemap.xml` and confirm both return valid text/XML.
3. In Google Search Console, verify the domain property (DNS verification through Namecheap is recommended), submit the sitemap URL, then inspect the homepage, `/shop`, and several product URLs and request indexing.
4. Use Search Console's URL Inspection and Google's Rich Results Test to check product structured data after deployment.
5. Ranking for a few keywords is not immediate or guaranteed. Build useful product descriptions, distinct category content, internal links, accurate delivery/policy pages, and genuine customer reviews over time. Do not add fake reviews or keyword-stuff pages.

## Email prerequisites
- `BREVO_API_KEY`: Brevo REST API key (not an SMTP key).
- `BREVO_SENDER_EMAIL`: verified sender in Brevo.
- `BREVO_SENDER_NAME`: store display name.
- `STORE_ADMIN_EMAIL`: inbox for admin order and stock alerts.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: full Firebase service-account JSON stored as a server-only Netlify secret. Required to authenticate admin-only test/status/stock email functions and save verified orders. Do not commit this secret or use a `VITE_` prefix.
- `PAYSTACK_SECRET_KEY`: server-side Paystack secret; never expose to browser code.
- `OPENAI_API_KEY`: server-side OpenAI API key whose project permissions allow Responses API requests. Optional `OPENAI_MODEL` defaults to `gpt-4.1`.

## Email test procedure
1. Deploy and open Admin → Settings → Send test email to admin inbox.
2. The UI should say Brevo accepted the request; this is not the same as delivery.
3. Open Brevo → Transactional → Logs and check the message event for Delivered, Deferred, Blocked or Bounced.
4. Run a Paystack test-mode transaction and check both the customer's order confirmation and admin new-order alert in logs. Never use a real payment solely to test email.
5. Change an existing test order's status and check the order-status log. Update a test product from above the low-stock threshold to at/below the threshold and check the stock-alert log.
6. Firebase verification/password reset emails are handled by Firebase Authentication, not Brevo; test those separately.

## What this code can and cannot prove
Code-level checks can confirm that a function calls Brevo and reports provider acceptance. Actual inbox delivery depends on live Netlify secrets, Brevo account/sender/domain configuration, recipient reputation and Brevo delivery events. Always use Transactional → Logs as the source of truth for delivery status.
