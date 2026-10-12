# Image upload troubleshooting and mobile admin improvements

## Image upload setup for local `netlify dev`

Keep secrets in the project's local `.env` file (not in the browser bundle or source control):

```env
IMAGEKIT_PRIVATE_KEY=your_ImageKit_private_key
IMAGEKIT_ADMIN_EMAIL=the_exact_admin_sign_in_email
FIREBASE_PROJECT_ID=your_Firebase_project_id
```

In `.env.local`, set the public ImageKit key and the Firebase web configuration already used by the project:

```env
VITE_IMAGEKIT_PUBLIC_KEY=your_ImageKit_public_key
VITE_FIREBASE_PROJECT_ID=your_Firebase_project_id
```

`VITE_ADMIN_EMAIL` may be used as the email identifier fallback if already configured, but `IMAGEKIT_ADMIN_EMAIL` is preferred. Never put `IMAGEKIT_PRIVATE_KEY` in a `VITE_` variable or in frontend code.

After changing environment variables, stop `netlify dev` with Ctrl+C and restart it. Use `netlify dev`, not `npm run dev`, because the upload signature endpoint is a Netlify Function.

The product photo form now shows a more specific message for a missing function, missing environment variables, rejected admin role, or ImageKit API failure. Images must be actual image files no larger than 5 MB.

## Mobile admin interface

The admin sidebar becomes a horizontally scrollable labelled navigation strip on smaller screens, instead of shrinking to unlabeled icons. Product forms become single-column on narrow phones, file upload controls fit the viewport, tables remain scrollable, and form controls use 16px mobile text to prevent iOS Safari focus zoom.

## Security notes

The private ImageKit key remains server-side. The signed upload endpoint still requires a Firebase ID token and an active admin role document. Do not make the endpoint public or remove its role check.
