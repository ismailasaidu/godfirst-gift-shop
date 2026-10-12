import React from 'react';
import { ArrowRight, Truck, ShieldCheck, MessageCircle, Gift, HeartHandshake, Sparkles, Globe2 } from 'lucide-react';
import { CATEGORY_IMAGES, SUBCATEGORIES } from '../data/catalog.js';
import ProductCard from '../components/ProductCard.jsx';

const GIFT_TYPES = [
  { id: 'flowers', title: 'Flowers', text: 'A little colour goes a long way', image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=800&q=85' },
  { id: 'birthday', title: 'Birthday gifts', text: 'Make their day feel bigger', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1?auto=format&fit=crop&w=800&q=85' },
  { id: 'personalised', title: 'Personalised', text: 'Made to feel like theirs', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=800&q=85' },
  { id: 'romance', title: 'Love & anniversaries', text: 'For the moments you share', image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=85' },
];

export default function HomePage({ categories, products, categoryName, go, openCategory, productCardProps, homeContent }) {
  const featured = products.filter(p => p.featured).slice(0, 4);
  return <main className="home-page">
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={13} /> {homeContent?.announcement || 'MAKE DISTANCE FEEL SMALLER'}</p>
        <h1>{(homeContent?.headline || 'Send a little love their way.').split(/\s+/).slice(0,3).join(' ')}<br/><em>{(homeContent?.headline || 'Send a little love their way.').split(/\s+/).slice(3).join(' ')}</em></h1>
        <p className="hero-lede">{homeContent?.subheadline || 'Thoughtful gifts for the people who matter, delivered across borders with care. Find something lovely for every person and every occasion.'}</p>
        <div className="hero-actions"><button className="btn btn-primary" onClick={() => go('shop')}>Explore the collection <ArrowRight size={16}/></button><button className="btn btn-secondary" onClick={() => go('services')}>How we can help</button></div>
        <div className="hero-assurances"><span><HeartHandshake size={16}/> Picked with care</span><span><Globe2 size={16}/> Gifts across borders</span></div>
      </div>
      <div className="hero-visual" aria-label="Gift inspiration">
        <div className="hero-image-backdrop" />
        <div className="hero-main-photo"><img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1100&q=90" alt="Beautifully wrapped gift box" /></div>
        <div className="hero-photo-card hero-photo-card-top"><img src="https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=600&q=85" alt="Bouquet of flowers" /><span>For their special day</span></div>
        <div className="hero-photo-card hero-photo-card-bottom"><img src="/images/hero-cake.jpeg" alt="White celebration cake with colourful sprinkles" /><span>Little things, big meaning</span></div>
        <div className="hero-floating-card"><Gift size={19}/><span><b>Make them feel remembered</b><small>Whatever the distance</small></span></div>
      </div>
      <div className="hero-index"><span>01</span><i/><span>THOUGHTFUL GIFTING, MADE EASIER</span></div>
    </section>

    <section className="trust-strip"><div><Truck/><span><b>Delivery assistance</b><small>For selected destinations</small></span></div><div><ShieldCheck/><span><b>Carefully selected gifts</b><small>Quality and presentation matter</small></span></div><div><MessageCircle/><span><b>Real personal support</b><small>Help when you need it</small></span></div></section>

    <section className="section container destination-section"><div className="section-heading"><div><p className="eyebrow">WHERE ARE WE SENDING LOVE?</p><h2>Shop by destination</h2><p>Choose where your gift is going, then explore the kinds of gifts available there.</p></div><button className="text-link" onClick={() => go('shop')}>View all collections <ArrowRight size={15}/></button></div><div className="category-grid destination-grid">{categories.slice(0,6).map((c,i)=><button className="category-tile" key={c.id} onClick={() => openCategory(c.id)}><span className="category-photo" style={{backgroundImage:`url(${CATEGORY_IMAGES[c.id] || products.find(p=>p.category===c.id)?.image || CATEGORY_IMAGES.birthday})`}}/><span className="category-shade"/><span className="category-content"><small className="category-kicker">{String(i+1).padStart(2,'0')} / COLLECTION</small><b>{c.name.replace(' Gift Items','')}</b><small className="category-description">{c.description}</small><span className="category-arrow"><ArrowRight size={16}/></span></span></button>)}</div></section>

    <section className="section gift-type-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">A GIFT FOR EVERY KIND OF MOMENT</p><h2>What would make them smile?</h2><p>Start with something they love. We will help with the rest.</p></div></div><div className="gift-type-grid">{GIFT_TYPES.map((item,i)=><button className="gift-type-card" key={item.id} onClick={() => openCategory(item.id)}><span className="gift-type-image"><img src={item.image} alt={item.title} loading="lazy"/><span className="gift-type-number">0{i+1}</span></span><span className="gift-type-copy"><b>{item.title}</b><small>{item.text}</small><ArrowRight size={17}/></span></button>)}</div></div></section>

    <section className="section featured-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">A FEW CUSTOMER FAVOURITES</p><h2>Gifts worth remembering</h2><p>Beautiful little surprises, ready to make someone's day.</p></div><button className="text-link" onClick={() => go('shop')}>Shop all gifts <ArrowRight size={15}/></button></div><div className="product-grid">{featured.map(p=><ProductCard key={p.id} product={p} categoryName={categoryName} {...productCardProps}/>)}</div></div></section>

    <section className="home-service-band container"><div className="service-band-image"><img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1000&q=85" alt="Thoughtfully prepared gifts" loading="lazy"/></div><div className="service-band-copy"><p className="eyebrow">MORE THAN A GIFT SHOP</p><h2>Need a little help<br/>getting it there?</h2><p>From gift delivery enquiries to parcel tracking support, our team can help you work out the next step.</p><button className="btn btn-primary" onClick={() => go('services')}>Explore our services <ArrowRight size={15}/></button><div className="service-band-note"><span>01</span><span>Thoughtful service, one step at a time</span></div></div></section>

    <section className="closing-quote container"><span>“</span><p>It's the thought that brings us closer.</p><small>GODFIRSTGIFTSHOPWORLDWIDE</small></section>
  </main>;
}
