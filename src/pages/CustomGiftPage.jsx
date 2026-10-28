import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, MessageCircle, Sparkles, Shirt, Coffee, Heart, Gift, CheckCircle2, ChevronLeft, ChevronRight, Palette, PackageCheck } from 'lucide-react';

const WHATSAPP = 'https://wa.me/233277031930?text='; // Keep the shop's configured WhatsApp contact.
const message = "Hello God First Gift Shop, I'd like to customize a gift for someone I love. I have a unique idea and would like to discuss the options, design, price and delivery. Please help me bring it to life.";
const ideas = [
  { title: 'Custom T-shirts & hoodies', tag: 'Wear your message', description: 'Names, photos, inside jokes, matching couple shirts or a message made just for them.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85', examples: ['Couple / family shirts', 'Birthday and celebration tees', 'Photo or text prints'] },
  { title: 'Personalised mugs & tumblers', tag: 'A little love every day', description: 'A favourite photo, name, date, short note or design they will smile at with every sip.', image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1000&q=85', examples: ['Name and photo mugs', 'Matching mug sets', 'Office and appreciation gifts'] },
  { title: 'Memory & photo gifts', tag: 'Keep the moment close', description: 'Turn your favourite memories into thoughtful keepsakes, framed photos and photo-led gifts.', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85', examples: ['Photo frames and collages', 'Memory boxes', 'Anniversary keepsakes'] },
  { title: 'Gift boxes made for them', tag: 'Their favourite things', description: 'A themed box with a mix of treats, self-care items, accessories, handwritten notes and surprises.', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=85', examples: ['Birthday and proposal boxes', 'Self-care hampers', 'Long-distance love boxes'] },
  { title: 'Accessories & everyday items', tag: 'Small things, big meaning', description: 'Explore personalised tote bags, keyrings, notebooks, phone cases and other useful keepsakes.', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85', examples: ['Tote bags and notebooks', 'Keyrings and phone cases', 'Team and business gifts'] },
  { title: 'Custom photo cushions', tag: 'A hug they can keep', description: 'A favourite photo, special date or meaningful message on a soft cushion for their room or living space.', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=85', examples: ['Couple and family photos', 'Names and special dates', 'Home and dorm-room gifts'] },
  { title: 'Personalised bottles & flasks', tag: 'Made for their everyday', description: 'Useful drinkware with names, short messages or designs for work, school, fitness and travel.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85', examples: ['Name-printed bottles', 'Matching couple flasks', 'Team and appreciation gifts'] },
  { title: 'Custom notebooks & journals', tag: 'Their thoughts, their style', description: 'A thoughtful journal or notebook with a name, quote, initials or a design chosen for the recipient.', image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1000&q=85', examples: ['Name and initial covers', 'Encouraging messages', 'Graduation and work gifts'] },
  { title: 'Personalised caps & tote bags', tag: 'Carry it their way', description: 'Everyday accessories that can carry a name, phrase, team identity or a simple custom design.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85', examples: ['Custom tote designs', 'Matching group accessories', 'Business and event merchandise'] },
  { title: 'Proposal & celebration keepsakes', tag: 'A moment to remember', description: 'Small details for proposals, anniversaries, birthdays, graduations and other milestones.', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85', examples: ['Proposal boxes', 'Anniversary keepsakes', 'Graduation surprises'] },
];

export default function CustomGiftPage({ go }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scroll = (direction) => {
    const node = track.current;
    if (!node) return;
    const card = node.querySelector('.custom-gift-slide');
    const distance = card ? card.getBoundingClientRect().width + 18 : node.clientWidth * .8;
    const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth);
    const nextLeft = node.scrollLeft + direction * distance;
    if (direction > 0 && node.scrollLeft >= maxScroll - 8) node.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction < 0 && node.scrollLeft <= 8) node.scrollTo({ left: maxScroll, behavior: 'smooth' });
    else node.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const updateActive = () => {
      const cards = [...node.querySelectorAll('.custom-gift-slide')];
      if (!cards.length) return;
      const center = node.scrollLeft + node.clientWidth * 0.35;
      let nearest = 0; let distance = Infinity;
      cards.forEach((card, index) => { const d = Math.abs(card.offsetLeft - center); if (d < distance) { distance = d; nearest = index; } });
      setActive(nearest);
    };
    node.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => node.removeEventListener('scroll', updateActive);
  }, []);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const node = track.current;
      if (!node) return;
      const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth);
      if (node.scrollLeft >= maxScroll - 12) node.scrollTo({ left: 0, behavior: 'smooth' });
      else { const card = node.querySelector('.custom-gift-slide'); node.scrollBy({ left: (card?.getBoundingClientRect().width || node.clientWidth * .8) + 18, behavior: 'smooth' }); }
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);
  const whatsapp = `${WHATSAPP}${encodeURIComponent(message)}`;
  return <main className="custom-gifts-page">
    <section className="custom-gifts-hero">
      <div className="custom-gifts-hero-image" aria-hidden="true"><img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1800&q=90" alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/hero-flowers.jpeg"; }} /></div>
      <div className="custom-gifts-hero-shade" />
      <div className="container custom-gifts-hero-content">
        <p className="eyebrow"><Sparkles size={14}/> MADE PERSONAL, JUST FOR THEM</p>
        <h1>Have an idea? <em>Let’s make it a gift.</em></h1>
        <p>Not seeing exactly what you imagined? Tell us what you have in mind. From custom T-shirts and photo mugs to keepsake boxes and one-of-a-kind surprises, we’ll help you explore the possibilities.</p>
        <div className="custom-gifts-hero-actions"><a className="btn btn-primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Discuss your idea on WhatsApp</a><button className="btn btn-secondary" onClick={() => document.getElementById('custom-gift-ideas')?.scrollIntoView({behavior:'smooth'})}>Explore gift ideas <ArrowRight size={16}/></button></div>
        <div className="custom-gifts-hero-notes"><span><Heart size={15}/> Made meaningful</span><span><Palette size={15}/> Your idea, your style</span><span><PackageCheck size={15}/> Details confirmed first</span></div>
      </div>
      <div className="custom-gifts-hero-stamp"><Gift size={18}/><span>Thoughtful gifts<br/><b>with a personal touch</b></span></div>
    </section>

    <section className="container custom-gifts-intro section">
      <div><p className="eyebrow">YOUR IDEA IS THE STARTING POINT</p><h2>Something they won’t find just anywhere.</h2></div>
      <p>Maybe it’s a shirt with a private joke, a mug with a favourite picture, a keepsake for an anniversary, or a gift box built around everything they love. Share the idea with us and we’ll discuss what can be made, the available options, pricing and timing before you decide.</p>
    </section>

    <section id="custom-gift-ideas" className="section custom-gift-ideas-section" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
      <div className="container">
        <div className="section-heading custom-gift-heading"><div><p className="eyebrow">A LITTLE INSPIRATION</p><h2>What could we make for them?</h2><p>Swipe through ideas to spark your imagination. These are examples to discuss with us, not a fixed catalogue.</p></div><div className="custom-gift-carousel-controls"><button type="button" aria-label="Previous gift ideas" onClick={() => scroll(-1)}><ChevronLeft size={19}/></button><button type="button" aria-label="Next gift ideas" onClick={() => scroll(1)}><ChevronRight size={19}/></button></div></div>
        <div className="custom-gift-carousel" ref={track} aria-label="Custom gift inspiration carousel">{ideas.map((idea, index) => <article className="custom-gift-slide" key={idea.title}>
          <div className="custom-gift-slide-image"><img src={idea.image} alt={idea.title} loading={index < 4 ? "eager" : "lazy"} decoding="async" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = "/images/hero-flowers.jpeg"; }}/><span className="custom-gift-slide-number">0{index+1}</span><span className="custom-gift-slide-tag">{idea.tag}</span></div>
          <div className="custom-gift-slide-body"><h3>{idea.title}</h3><p>{idea.description}</p><ul>{idea.examples.map(example => <li key={example}><CheckCircle2 size={14}/>{example}</li>)}</ul><a href={`${WHATSAPP}${encodeURIComponent(`${message}\n\nI'm interested in: ${idea.title}.`)}`} target="_blank" rel="noreferrer" className="custom-gift-card-link">Ask about this idea <ArrowRight size={15}/></a></div>
        </article>)}</div>
        <div className="custom-gift-carousel-footer"><span>Idea {String(active+1).padStart(2,'0')} of {String(ideas.length).padStart(2,'0')}</span><div className="custom-gift-dots">{ideas.map((idea,index)=><button type="button" key={idea.title} aria-label={`Show idea ${index+1}`} className={active===index?'is-active':''} onClick={()=>{setActive(index);const node=track.current;const card=node?.querySelectorAll('.custom-gift-slide')[index];card?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});}} />)}</div><span>Swipe to explore <ArrowRight size={13}/></span></div>
      </div>
    </section>

    <section className="container custom-gifts-how section"><div className="custom-gifts-how-copy"><p className="eyebrow">SIMPLE, PERSONAL, NO PRESSURE</p><h2>From “what if?” to a gift they’ll remember.</h2><p>We’ll talk through the idea together before you commit. Availability, customisation methods, production time and delivery can vary depending on the item and destination, so we’ll confirm the details with you first.</p><a className="btn btn-primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Start a WhatsApp conversation</a></div><div className="custom-gifts-steps"><div><span>01</span><div><b>Tell us your idea</b><p>Describe the gift, occasion, recipient and any reference photos you have.</p></div></div><div><span>02</span><div><b>Discuss the details</b><p>We’ll talk about design, personalisation, availability, budget and timing.</p></div></div><div><span>03</span><div><b>Confirm before proceeding</b><p>Review the agreed details and price with our team before placing your request.</p></div></div></div></section>

    <section className="custom-gifts-cta"><div className="container custom-gifts-cta-inner"><div><p className="eyebrow">LET’S CREATE SOMETHING THOUGHTFUL</p><h2>The best gifts feel like they were made for one person.</h2><p>Tell us who it’s for and what you’re imagining. We’ll take it from there, one detail at a time.</p></div><a className="btn btn-primary" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Hello, I’d like to customise a gift <ArrowRight size={16}/></a></div></section>
  </main>;
}
