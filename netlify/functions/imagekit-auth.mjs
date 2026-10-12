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
  // IMAGEKIT_ADMIN_EMAIL is preferred. VITE_ADMIN_EMAIL is a non-secret email identifier
  // already used by this project and makes local setup less error-prone.
  const adminEmail = (process.env.IMAGEKIT_ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!projectId || !adminEmail || !privateKey) {
    return new Response(JSON.stringify({ error: `Image uploads are not configured. Missing ${[!projectId ? 'FIREBASE_PROJECT_ID (or VITE_FIREBASE_PROJECT_ID)' : '', !adminEmail ? 'IMAGEKIT_ADMIN_EMAIL (or VITE_ADMIN_EMAIL)' : '', !privateKey ? 'IMAGEKIT_PRIVATE_KEY' : ''].filter(Boolean).join(', ')}. Add the missing variable to your local .env file and restart netlify dev.` }), {
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
    if (!decoded.email || decoded.email.toLowerCase() !== adminEmail) {
      return new Response(JSON.stringify({ error: 'Only the configured store administrator can upload product photos.' }), {
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
