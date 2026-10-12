import React from 'react';
import { CheckCircle2, X, Info, AlertTriangle } from 'lucide-react';
export default function Toast({ toast, dismiss }) { if (!toast) return null; const Icon = toast.type === 'error' ? AlertTriangle : toast.type === 'info' ? Info : CheckCircle2; return <div className={`toast toast-${toast.type}`} role="status" aria-live="polite"><Icon size={18}/><span>{toast.message}</span><button className="toast-close" aria-label="Dismiss notification" onClick={dismiss}><X size={14}/></button></div>; }
