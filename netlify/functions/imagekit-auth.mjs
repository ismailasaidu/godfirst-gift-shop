import crypto from 'node:crypto';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405,
      headers: { ...jsonHeaders, Allow: 'GET' },
    });
  }

  const projectId = (process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || '').trim();
  // Accept a comma-separated allowlist. Keep the legacy single-email variables
  // working so existing Netlify deployments do not break during migration.
  const adminEmails = [
    process.env.IMAGEKIT_ADMIN_EMAILS,
    process.env.IMAGEKIT_ADMIN_EMAIL,
    process.env.VITE_ADMIN_EMAIL,
  ]
    .filter(Boolean)
    .flatMap(value => value.split(','))
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!projectId || adminEmails.length === 0 || !privateKey) {
    return new Response(JSON.stringify({ error: `Image uploads are not configured. Missing ${[!projectId ? 'FIREBASE_PROJECT_ID (or VITE_FIREBASE_PROJECT_ID)' : '', adminEmails.length === 0 ? 'IMAGEKIT_ADMIN_EMAILS (or legacy IMAGEKIT_ADMIN_EMAIL / VITE_ADMIN_EMAIL)' : '', !privateKey ? 'IMAGEKIT_PRIVATE_KEY' : ''].filter(Boolean).join(', ')}. Check the linked Netlify environment variables and restart netlify dev.` }), {
      status: 503,
      headers: jsonHeaders,
    });
  }

  const authorization = request.headers.get('authorization') || '';
  const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!idToken) {
    return new Response(JSON.stringify({ error: 'Sign in as the store administrator to upload images.' }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  try {
    // Verify the Firebase ID token on the server before issuing upload credentials.
    // Project ID is public configuration; the ImageKit private key remains server-only.
    const app = getApps()[0] || initializeApp({ projectId });
    const decoded = await getAuth(app).verifyIdToken(idToken);
    if (!decoded.email || !adminEmails.includes(decoded.email.trim().toLowerCase())) {
      return new Response(JSON.stringify({ error: 'This email is not in the configured ImageKit admin allowlist. Add it to IMAGEKIT_ADMIN_EMAILS in Netlify and redeploy.' }), {
        status: 403,
        headers: jsonHeaders,
      });
    }
    // Also check the active role document using the caller's Firebase token.
    // Firestore rules permit a user to read only their own admins/{uid} record.
    const firestoreDocumentUrl = (documentId) => `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/admins/${encodeURIComponent(documentId)}`;
    const roleHeaders = { Authorization: `Bearer ${idToken}` };
    // Prefer the canonical admins/{Firebase UID} record. Some existing setups used
    // admins/{email}; allow that legacy record only when its stored email matches the
    // verified Firebase token email. Firestore rules must allow the user to get their
    // own email-matching document (see firestore.rules).
    let roleResponse = await fetch(firestoreDocumentUrl(decoded.uid), { headers: roleHeaders });
    let roleDocument = roleResponse.ok ? await roleResponse.json() : null;
    const uidRoleIsActive = roleDocument?.fields?.active?.booleanValue === true &&
      (!roleDocument.fields?.email?.stringValue || roleDocument.fields.email.stringValue.trim().toLowerCase() === decoded.email.trim().toLowerCase());
    if (!uidRoleIsActive && decoded.email) {
      const emailRoleResponse = await fetch(firestoreDocumentUrl(decoded.email.trim().toLowerCase()), { headers: roleHeaders });
      if (emailRoleResponse.ok) {
        const emailRoleDocument = await emailRoleResponse.json();
        const emailRole = emailRoleDocument.fields?.email?.stringValue || '';
        const emailRoleIsActive = emailRoleDocument.fields?.active?.booleanValue === true && emailRole.trim().toLowerCase() === decoded.email.trim().toLowerCase();
        if (emailRoleIsActive) {
          roleResponse = emailRoleResponse;
          roleDocument = emailRoleDocument;
        }
      }
    }
    const roleEmail = roleDocument?.fields?.email?.stringValue || '';
    const roleIsActive = roleDocument?.fields?.active?.booleanValue === true &&
      (!roleEmail || roleEmail.trim().toLowerCase() === decoded.email.trim().toLowerCase());
    if (!roleIsActive) {
      return new Response(JSON.stringify({ error: 'The upload service could not confirm an active admin role for this account. Check that admins/{uid} (or the legacy admins/{email} record) has active as Boolean true and the matching email, and that Firestore rules allow reading that own role record.' }), {
        status: 403,
        headers: jsonHeaders,
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Your admin session could not be verified. Please sign in again.' }), {
      status: 401,
      headers: jsonHeaders,
    });
  }

  // ImageKit expects a short-lived signature over token + expiry.
  // The private key is never sent to the browser.
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 30 * 60;
  const signature = crypto.createHmac('sha1', privateKey).update(`${token}${expire}`).digest('hex');

  return new Response(JSON.stringify({ token, expire, signature }), {
    status: 200,
    headers: jsonHeaders,
  });
}
