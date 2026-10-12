import React, { useMemo, useState } from 'react';
import { ArrowRight, Gift, Heart, Sparkles } from 'lucide-react';
import { money } from '../data/catalog.js';

const occasions = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂', words: ['birthday', 'cake', 'celebration'] },
  { id: 'love', label: 'Love & anniversary', emoji: '❤️', words: ['love', 'anniversary', 'romance', 'couple', 'heart', 'flower'] },
  { id: 'thank-you', label: 'Thank you', emoji: '💐', words: ['thank', 'appreciation', 'flower', 'hamper'] },
  { id: 'graduation', label: 'Graduation', emoji: '🎓', words: ['graduation', 'graduate', 'achievement', 'milestone'] },
  { id: 'just-because', label: 'Just because', emoji: '🎁', words: ['personalised', 'bear', 'thoughtful', 'gift', 'surprise'] },
  { id: 'new-baby', label: 'New baby', emoji: '🧸', words: ['baby', 'kids', 'teddy', 'bear'] },
];
const recipients = [
  { id: 'partner', label: 'Partner', emoji: '🥰', words: ['love', 'romance', 'anniversary', 'flower', 'bouquet'] },
  { id: 'friend', label: 'Friend', emoji: '😊', words: ['birthday', 'personalised', 'flower', 'hamper', 'treat'] },
  { id: 'parent', label: 'Parent', emoji: '💝', words: ['hamper', 'home', 'wellness', 'flower', 'personalised'] },
  { id: 'child', label: 'Child', emoji: '🧸', words: ['baby', 'kids', 'bear', 'toy', 'cake'] },
  { id: 'colleague', label: 'Colleague', emoji: '💼', words: ['corporate', 'graduation', 'personalised', 'tech'] },
  { id: 'anyone', label: 'Anyone', emoji: '🎁', words: [] },
];
const budgets = [
  { id: 'any', label: 'Any budget', max: Infinity },
  { id: 'under-20000', label: 'Under ₦20,000', max: 20000 },
  { id: 'under-35000', label: 'Under ₦35,000', max: 35000 },
  { id: 'under-50000', label: 'Under ₦50,000', max: 50000 },
];
const wordsFor = p => `${p.name || ''} ${p.description || ''} ${p.tag || ''} ${p.category || ''} ${p.subcategory || ''}`.toLowerCase();

export default function GiftFinderPage({ products = [], categories = [], go, openProduct }) {
  const [occasion, setOccasion] = useState('');
  const [recipient, setRecipient] = useState('');
  const [budget, setBudget] = useState('any');
  const [showResults, setShowResults] = useState(false);
  const selectedOccasion = occasions.find(x => x.id === occasion);
  const selectedRecipient = recipients.find(x => x.id === recipient);
  const maxBudget = budgets.find(x => x.id === budget)?.max ?? Infinity;
  const results = useMemo(() => {
    const available = products.filter(p => Number(p.stock) > 0 && Number(p.price) <= maxBudget);
    const score = p => {
      const text = wordsFor(p);
      let points = 0;
      if (selectedOccasion?.words.some(word => text.includes(word))) points += 3;
      if (selectedRecipient?.words.some(word => text.includes(word))) points += 2;
      if (selectedRecipient?.id === 'anyone') points += 1;
      return points;
    };
    return [...available].sort((a, b) => score(b) - score(a)).slice(0, 6);
  }, [products, maxBudget, selectedOccasion, selectedRecipient]);
  const reset = () => { setOccasion(''); setRecipient(''); setBudget('any'); setShowResults(false); };
  return <main className="container page-main gift-finder-page">
    <section className="gift-finder-hero"><span className="gift-finder-icon"><Gift size={25}/></span><p className="eyebrow">A LITTLE HELP FINDING THE RIGHT GIFT</p><h1>Let’s find something <em>lovely.</em></h1><p>Tell us a little about the person and the occasion. We’ll suggest gifts from our current collection.</p></section>
    <section className="gift-finder-panel" aria-label="Gift finder preferences">
      <div className="finder-step"><span>01</span><div><h2>What’s the occasion?</h2><p>Choose the reason for the gift.</p></div></div>
      <div className="finder-options">{occasions.map(item => <button key={item.id} type="button" className={`finder-option ${occasion === item.id ? 'active' : ''}`} aria-pressed={occasion === item.id} onClick={() => {setOccasion(item.id);setShowResults(false);}}><span>{item.emoji}</span>{item.label}</button>)}</div>
      <div className="finder-step"><span>02</span><div><h2>Who are you shopping for?</h2><p>We’ll use this to guide the suggestions.</p></div></div>
      <div className="finder-options finder-recipient-options">{recipients.map(item => <button key={item.id} type="button" className={`finder-option ${recipient === item.id ? 'active' : ''}`} aria-pressed={recipient === item.id} onClick={() => {setRecipient(item.id);setShowResults(false);}}><span>{item.emoji}</span>{item.label}</button>)}</div>
      <div className="finder-step"><span>03</span><div><h2>What’s your budget?</h2><p>Choose a price range that feels right.</p></div></div>
      <div className="finder-budget-options">{budgets.map(item => <button key={item.id} type="button" className={`finder-budget ${budget === item.id ? 'active' : ''}`} aria-pressed={budget === item.id} onClick={() => {setBudget(item.id);setShowResults(false);}}>{item.label}</button>)}</div>
      <button type="button" className="btn btn-primary finder-submit" onClick={() => setShowResults(true)}><Sparkles size={16}/> Find my gifts <ArrowRight size={16}/></button>
    </section>
    {showResults && <section className="gift-finder-results" aria-live="polite"><div className="section-heading"><div><p className="eyebrow">YOUR GIFT IDEAS</p><h2>Thoughtful picks for you.</h2><p>Suggestions are based on your choices and the products currently available.</p></div><button type="button" className="text-link" onClick={reset}>Start again</button></div>
      {results.length ? <div className="product-grid">{results.map(p => {const cat = categories.find(c => c.id === p.category);return <article className="product-card finder-product-card" key={p.id}><button type="button" className="finder-product-art" onClick={() => openProduct(p)} aria-label={`View ${p.name}`}>{p.image ? <img src={p.image} alt={p.name} loading="lazy"/> : <span>{p.emoji || '🎁'}</span>}</button><div className="product-info"><p className="eyebrow">{cat?.name || 'Gift idea'}</p><button type="button" className="product-name product-name-button" onClick={() => openProduct(p)}>{p.name}</button><div className="price-row"><strong>{money(p.price)}</strong></div><button type="button" className="btn btn-secondary finder-view-btn" onClick={() => openProduct(p)}>View gift <ArrowRight size={14}/></button></div></article>;})}</div> : <div className="empty-state"><Heart size={30}/><h3>No exact matches just yet</h3><p>Try a higher budget or another combination to see more available gifts.</p><button type="button" className="btn btn-primary" onClick={() => {setBudget('any');setShowResults(true);}}>Show more gifts</button></div>}
    </section>}
    <div className="finder-help"><span>Still deciding?</span><p>Browse all gifts or contact us for help choosing something special.</p><div><button type="button" className="btn btn-secondary" onClick={() => go('shop')}>Browse all gifts</button><button type="button" className="text-link" onClick={() => go('contact')}>Contact us <ArrowRight size={14}/></button></div></div>
  </main>;
}
