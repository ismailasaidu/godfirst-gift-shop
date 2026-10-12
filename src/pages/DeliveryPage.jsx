import React from 'react';
import { PackageCheck, Globe2, Clock3, MessageCircle, MapPin, ClipboardCheck, ArrowRight } from 'lucide-react';
const EMAIL = 'godfirstgiftshopworldwide@gmail.com';
const WHATSAPP = 'https://wa.me/233277031930?text=';
export default function DeliveryPage({ go }) {
  return <main className="container info-page delivery-page">
    <header className="info-page-heading delivery-hero"><span className="page-feature-icon"><PackageCheck size={26}/></span><p className="eyebrow">DELIVERY INFORMATION</p><h1>Every gift deserves <em>a thoughtful arrival.</em></h1><p>Delivery depends on the gift, destination, availability, and local arrangements. Here's how to make the process smoother.</p><a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noreferrer">Confirm delivery options <ArrowRight size={16}/></a></header>
    <section className="delivery-steps" aria-label="How delivery works">
      <article><span className="delivery-step-number">01</span><div className="delivery-step-icon"><Globe2/></div><h2>Share the destination</h2><p>Tell us the country, city or area where the gift should be delivered. Not every product or service is available in every location.</p></article>
      <article><span className="delivery-step-number">02</span><div className="delivery-step-icon"><ClipboardCheck/></div><h2>Confirm the details</h2><p>Check the gift, recipient's full name, delivery address, phone number, and any message or special instructions before payment.</p></article>
      <article><span className="delivery-step-number">03</span><div className="delivery-step-icon"><Clock3/></div><h2>Agree on timing and cost</h2><p>Ask us to confirm the estimated delivery window, any delivery charge, and the total payable amount before placing an urgent order.</p></article>
      <article><span className="delivery-step-number">04</span><div className="delivery-step-icon"><PackageCheck/></div><h2>Keep your reference</h2><p>Keep your order reference and payment receipt. Contact us if you need an update or if the recipient cannot be reached.</p></article>
    </section>
    <section className="delivery-note"><MapPin size={22}/><div><h2>Delivery timing can vary</h2><p>We don't promise a universal delivery time or flat delivery fee. Timing and charges should be confirmed for your specific order and destination before payment.</p></div></section>
    <section className="delivery-help"><div><p className="eyebrow">NEED A DELIVERY UPDATE?</p><h2>Let's confirm the right details.</h2><p>Have your destination and order reference ready if you have already ordered.</p></div><div className="delivery-help-actions"><a className="btn btn-primary" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp us</a><a className="btn btn-secondary" href={`mailto:${EMAIL}`}>Email support</a><button className="text-link" onClick={() => go('faq')}>Read FAQs <ArrowRight size={15}/></button></div></section>
  </main>;
}
