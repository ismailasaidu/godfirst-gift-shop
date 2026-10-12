import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { SERVICES, SERVICE_IMAGES } from '../data/catalog.js';

// Existing store WhatsApp contact used elsewhere on the website.
const OWNER_WHATSAPP = '233277031930';
const serviceMessage = (name) => `Hello God First Gift Shop Worldwide, I would like to enquire about your ${name} service. Please share the pricing, requirements, and next steps. Thank you.`;

export default function ServicesPage() {
  return <main className="container page-main">
    <section className="services-hero"><p className="eyebrow">FAST · RELIABLE · PROFESSIONAL</p><h1>More than gifts.<br/><em>Here to help.</em></h1><p>Explore our additional services and speak with us about what you need.</p></section>
    <div className="services-grid">{SERVICES.map(([name,description,Icon],i)=>{
      const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(serviceMessage(name))}`;
      return <article className="service-card" key={name}>
        <div className="service-image"><img src={SERVICE_IMAGES[i]} alt={name} loading="lazy"/></div>
        <div className="service-icon"><Icon size={22}/></div><h3>{name}</h3><p>{description}</p>
        <a className="text-link service-whatsapp-link" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={15}/> Enquire on WhatsApp <ArrowRight size={14}/></a>
      </article>;
    })}</div>
  </main>;
}
