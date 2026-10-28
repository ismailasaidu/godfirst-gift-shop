# Homepage review carousel

The review-style card appears immediately before **Shop by destination** in `src/pages/HomePage.jsx`.

- Approved testimonials from homepage settings are shown when available.
- While no approved reviews are configured, the carousel uses sample preview copy (marked as sample) so fictional text is not misrepresented as genuine customer feedback.
- Sample slide imagery matches the topic: personalised mug, custom T-shirt, and flowers.
- Approved review images can be provided through `photo`, `photoURL`, or `image`; if none is provided, the image is selected using relevant words in the review text.
- The carousel advances automatically every 5.2 seconds, has previous/next buttons and direct indicator dots, and supports keyboard focus. Automatic movement pauses while its controls have focus.

Replace sample preview content with genuine customer-approved reviews before presenting them as real testimonials.
