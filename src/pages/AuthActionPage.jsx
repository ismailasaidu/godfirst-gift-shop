import React, { useEffect, useState } from 'react';
import { applyActionCode, checkActionCode, confirmPasswordReset } from 'firebase/auth';
import { ArrowRight, CheckCircle2, Gift, LoaderCircle, LockKeyhole, MailCheck, ShieldAlert } from 'lucide-react';
import { auth } from '../lib/firebase.js';

export default function AuthActionPage() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode') || '';
  const code = params.get('oobCode') || '';
  const [status, setStatus] = useState('working');
  const [message, setMessage] = useState('We are securely checking your link.');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [resolvedMode, setResolvedMode] = useState(mode);

  useEffect(() => {
    let active = true;
    const cleanSensitiveQuery = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('oobCode'); url.searchParams.delete('apiKey'); url.searchParams.delete('continueUrl'); url.searchParams.delete('lang');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    };
    (async () => {
      if (!auth || !code) { if (active) { setStatus('error'); setMessage('This link is incomplete or expired. Request a fresh link from the store.'); } return; }
      try {
        const info = await checkActionCode(auth, code);
        if (!active) return;
        setEmail(info?.data?.email || '');
        const inferredMode = ['action', 'verificationResult', ''].includes(mode) ? ({ PASSWORD_RESET: 'resetPassword', VERIFY_EMAIL: 'verifyEmail', EMAIL_VERIFICATION: 'verifyEmail', RECOVER_EMAIL: 'recoverEmail', VERIFY_AND_CHANGE_EMAIL: 'verifyAndChangeEmail' }[String(info?.operation || '').toUpperCase()] || '') : mode;
        setResolvedMode(inferredMode);
        if (inferredMode === 'resetPassword') {
          setReady(true); setStatus('ready'); setMessage('Choose a new password for your God First Gift Shop account.');
          return;
        }
        if (inferredMode === 'verifyEmail' || inferredMode === 'verifyAndChangeEmail') {
          await applyActionCode(auth, code);
          if (!active) return;
          cleanSensitiveQuery(); setStatus('success'); setMessage(inferredMode === 'verifyAndChangeEmail' ? 'Your updated email address has been verified.' : 'Your email address is verified. You can now sign in to your account.'); return;
        }
        if (inferredMode === 'recoverEmail') {
          await applyActionCode(auth, code);
          if (!active) return;
          cleanSensitiveQuery(); setStatus('success'); setMessage('Your email change has been reversed. Please sign in and review your account security.'); return;
        }
        setStatus('error'); setMessage('This type of account link could not be identified. In Firebase Authentication, configure the custom action URL to https://godfirstgiftshopworldwide.com/auth/action, then request a fresh link.');
      } catch (error) {
        if (!active) return;
        cleanSensitiveQuery(); setStatus('error');
        setMessage(error?.code === 'auth/expired-action-code' ? 'This link has expired. Return to the store and request a new one.' : error?.code === 'auth/invalid-action-code' ? 'This link has already been used or is no longer valid. Request a fresh link if needed.' : 'We could not validate this link. Check that you opened the complete link from your email, then try again.');
      }
    })();
    return () => { active = false; };
  }, [mode, code]);

  const savePassword = async e => {
    e.preventDefault();
    if (password.length < 6) { setMessage('Use at least 6 characters for your password.'); return; }
    if (password !== confirm) { setMessage('The passwords do not match.'); return; }
    setBusy(true);
    try {
      await confirmPasswordReset(auth, code, password);
      const url = new URL(window.location.href); url.searchParams.delete('oobCode'); url.searchParams.delete('apiKey'); url.searchParams.delete('continueUrl');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      setStatus('success'); setMessage('Your password has been updated. You can now sign in securely.'); setPassword(''); setConfirm('');
    } catch (error) {
      setStatus('error'); setMessage(error?.code === 'auth/weak-password' ? 'Choose a stronger password with at least 6 characters.' : 'We could not reset your password. This link may have expired; request a new password reset email.');
    } finally { setBusy(false); }
  };
  const resetMode = resolvedMode === 'resetPassword' && ready && status === 'ready';
  const Icon = status === 'working' ? LoaderCircle : status === 'error' ? ShieldAlert : status === 'success' ? CheckCircle2 : resetMode ? LockKeyhole : MailCheck;
  return <div className="app-shell auth-action-shell"><main className="auth-action-page"><section className="auth-action-card">
    <div className="auth-action-brand"><span className="brand-mark"><Gift size={23}/></span><div><b>GOD FIRST</b><i>Gift Shop Worldwide</i></div></div>
    <div className={`auth-action-icon ${status === 'success' ? 'is-success' : status === 'error' ? 'is-error' : ''}`}><Icon size={30} className={status === 'working' ? 'admin-upload-spin' : ''}/></div>
    <p className="eyebrow">YOUR ACCOUNT, MADE PERSONAL</p>
    <h1>{status === 'working' ? 'Checking your secure link' : status === 'success' ? 'You’re all set.' : status === 'error' ? 'Let’s get you back on track.' : 'Create a new password'}</h1>
    <p className="auth-action-message">{message}</p>
    {resetMode && <form className="auth-reset-form" onSubmit={savePassword}><label>New password<input type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters"/></label><label>Confirm new password<input type="password" autoComplete="new-password" minLength={6} required value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Enter it again"/></label><button className="btn btn-primary" disabled={busy}>{busy ? 'Updating password…' : 'Update password'} <ArrowRight size={16}/></button></form>}
    {status === 'success' && <a className="btn btn-primary" href="/account">Continue to your account <ArrowRight size={16}/></a>}
    {status === 'error' && <a className="btn btn-primary" href="/account">Return to God First <ArrowRight size={16}/></a>}
    {email && <p className="auth-action-footnote">Account email: {email}</p>}
    {status === 'working' && <p className="auth-action-footnote">Please keep this page open for a moment.</p>}
  </section></main></div>;
}
