import React from 'react';
import { ArrowLeft, ArrowRight, Compass, Gift, Home, Search } from 'lucide-react';

export default function NotFoundPage({ go }) {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-art" aria-hidden="true">
        <span className="not-found-orbit not-found-orbit-one" />
        <span className="not-found-orbit not-found-orbit-two" />
        <span className="not-found-gift"><Gift size={58} strokeWidth={1.25} /></span>
        <span className="not-found-spark not-found-spark-one">✦</span>
        <span className="not-found-spark not-found-spark-two">✧</span>
      </div>
      <p className="eyebrow"><Compass size={13} /> A LITTLE DETOUR</p>
      <h1 id="not-found-title">Oh dear, this page has <em>gone missing.</em></h1>
      <p className="not-found-copy">The link may be old, or the page may have moved. Let's help you find something thoughtful instead.</p>
      <div className="not-found-actions">
        <button className="btn btn-primary" onClick={() => go('home')}><Home size={16} /> Back to home</button>
        <button className="btn btn-secondary" onClick={() => go('shop')}>Explore the shop <ArrowRight size={16} /></button>
      </div>
      <button className="not-found-back" onClick={() => window.history.length > 1 ? window.history.back() : go('home')}><ArrowLeft size={14} /> Or return to the previous page</button>
      <div className="not-found-help"><Search size={16} /><span>Looking for a particular gift? Use the search in the header to find it.</span></div>
    </section>
  );
}
