import React from 'react';
import { Gift, ArrowUpRight, HeartHandshake, PackageCheck, ShieldCheck, Mail, MessageCircle, Music2, Send } from 'lucide-react';

export default function Footer({ go }) {
  const link = (key, label) => <button key={key} type="button" onClick={() => go(key)}>{label}<ArrowUpRight size={13} aria-hidden="true" /></button>;
  return <footer className="site-footer">
    <div className="footer-main container">
      <section className="footer-brand" aria-label="About Godfirstgiftshopworldwide">
        <button className="brand footer-logo" type="button" onClick={() => go('home')} aria-label="Godfirstgiftshopworldwide home">
          <span className="brand-mark"><Gift size={23}/></span><span><b>GOD FIRST</b><i>Gift Shop Worldwide</i></span>
        </button>
        <p>Godfirstgiftshopworldwide helps you celebrate, comfort and surprise the people who matter, wherever they are.</p>
        <div className="footer-promise"><HeartHandshake size={17}/><span>Made for thoughtful giving</span></div><div className="footer-socials" aria-label="Social and contact links"><a href="mailto:godfirstgiftshopworldwide@gmail.com" aria-label="Email"><Mail size={16}/></a><a href="https://wa.me/233277031930?text=" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={16}/></a><a href="https://www.tiktok.com/@godfirstomobn5" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={16}/></a><a href="https://t.me/godfirst5451" target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={16}/></a></div>
      </section>
      <nav className="footer-column" aria-label="Explore the store">
        <h4>Explore</h4>
        {link('shop','Shop all gifts')}{link('services','Our services')}{link('about','Our story')}{link('tracking','Track an order')}
      </nav>
      <nav className="footer-column" aria-label="Customer support">
        <h4>Help & support</h4>
        {link('faq','Frequently asked questions')}{link('contact','Contact us')}{link('delivery','Delivery information')}{link('account','My account')}
      </nav>
      <section className="footer-help">
        <span className="footer-help-icon"><PackageCheck size={20}/></span>
        <h4>Need a hand?</h4>
        <p>Email us at godfirstgiftshopworldwide@gmail.com or message us on WhatsApp for help with gifts, orders, and delivery.</p>
        <button className="footer-contact-cta" type="button" onClick={() => go('contact')}>Get in touch <ArrowUpRight size={15}/></button>
      </section>
    </div>
    <div className="footer-legal container">
      <span>© {new Date().getFullYear()} Godfirstgiftshopworldwide</span>
      <nav aria-label="Legal information">{link('privacy','Privacy policy')}{link('terms','Terms & conditions')}</nav>
      <span className="footer-secure"><ShieldCheck size={14}/> Thoughtful gifts, delivered with care</span>
    </div>
  </footer>;
}
