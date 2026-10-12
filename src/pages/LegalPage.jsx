import React from 'react';
import { ShieldCheck, FileText, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

const STORE = 'Godfirstgiftshopworldwide';
const EMAIL = 'godfirstgiftshopworldwide@gmail.com';
const WHATSAPP = 'https://wa.me/233277031930?text=';

function LegalShell({ eyebrow, title, intro, children, icon: Icon }) {
  return <main className="container legal-page info-page">
    <header className="legal-hero">
      <span className="legal-hero-icon"><Icon size={24}/></span>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="legal-intro">{intro}</p>
      <span className="legal-updated">Last updated: October 10, 2026</span>
    </header>
    <article className="legal-content">{children}</article>
    <aside className="legal-contact"><div><h2>Questions about this page?</h2><p>Contact {STORE} and include enough detail for us to help.</p></div><a className="btn btn-primary" href={`mailto:${EMAIL}`}>Email us <ArrowUpRight size={15}/></a><a className="btn btn-secondary" href={WHATSAPP} target="_blank" rel="noreferrer"><MessageCircle size={15}/> WhatsApp</a></aside>
  </main>;
}

export function PrivacyPage() {
  return <LegalShell icon={ShieldCheck} eyebrow="YOUR PRIVACY MATTERS" title="Privacy policy" intro={`This policy explains how ${STORE} handles information you provide when you browse our store, contact us, or place an order.`}>
    <section><h2>1. Information you provide</h2><p>Depending on your interaction with us, information may include your name, email address, phone number, delivery address, recipient details, order contents, order reference, and messages sent to customer support. Please provide only information needed to make an enquiry or fulfil an order.</p></section>
    <section><h2>2. How information is used</h2><ul><li>To respond to product and service enquiries.</li><li>To review order requests, confirm availability, and coordinate delivery.</li><li>To provide order updates and customer support.</li><li>To maintain appropriate business records, address disputes, and help prevent misuse.</li></ul></section>
    <section><h2>3. Payments</h2><p>Do not send card PINs, passwords, one-time passcodes, or other authentication secrets through contact forms or messaging. Payment information should be entered only through an official payment channel where one is provided. If a transfer is requested, confirm the account details and amount with the store through a trusted contact channel before paying.</p></section>
    <section><h2>4. Sharing with service providers</h2><p>We may share the minimum relevant information with delivery partners or service providers when necessary to handle an order, respond to you, or operate the website. Information may also be disclosed where required by applicable law. We do not claim that information is never shared.</p></section>
    <section><h2>5. Storage and security</h2><p>We aim to use reasonable safeguards for customer information. No website, device, messaging service, or electronic storage system can be guaranteed completely secure. Access to order information should be limited to people who need it to provide the service.</p></section>
    <section><h2>6. Retention and your choices</h2><p>We keep information for as long as needed to handle your enquiry or order, maintain business records, resolve disputes, and meet legal obligations. You may contact us to ask about, correct, or request deletion of personal information, subject to any applicable record-keeping requirements.</p></section>
    <section><h2>7. Cookies and website preferences</h2><p>Your browser may store information needed for basic shopping features, such as remembering items in your bag or your shopping preferences. If you follow a link to a third-party service, that service handles information under its own privacy policy.</p></section>
    <section><h2>8. Contact</h2><p>For privacy questions, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or message us on WhatsApp using the contact link on this page.</p></section>
  </LegalShell>;
}

export function TermsPage() {
  return <LegalShell icon={FileText} eyebrow="SHOP WITH CONFIDENCE" title="Terms & conditions" intro={`These terms apply when you browse, enquire about, or place an order with ${STORE}. Please read them before submitting an order.`}>
    <section><h2>1. Products and availability</h2><p>We aim to describe products and services as clearly as possible. Product photos are for illustration and small differences in colour, packaging, presentation, or availability may occur. An item is not guaranteed until availability has been confirmed by the store.</p></section>
    <section><h2>2. Prices and order confirmation</h2><p>Review the product, quantity, delivery destination, and total before paying. We confirm availability, delivery charges, customisation, and the final order details with you before fulfilment. Keep your order reference for updates and support.</p></section>
    <section><h2>3. Payment safety</h2><p>Use payment details provided through the store's official contact channels. Never share your banking password, card PIN, or one-time passcode. Keep your payment receipt and order reference. We confirm payment before preparing or dispatching an order.</p></section>
    <section><h2>4. Delivery details and timing</h2><p>You are responsible for providing accurate recipient information, a complete address, and a reachable contact number. Delivery timing and charges depend on destination, stock, preparation, and delivery arrangements. Confirm timing before ordering if a gift is needed for a specific date. See our Delivery Information page for the process.</p></section>
    <section><h2>5. Changes, cancellations, and problems</h2><p>If you need to change or cancel an order, contact us promptly and include your order reference. Whether a change or cancellation can be accommodated depends on the order's preparation and dispatch status. Report damaged, missing, or incorrect items as soon as possible and provide the order reference and relevant details so the team can review the issue.</p></section>
    <section><h2>6. Customer responsibilities</h2><p>Please use the store lawfully, provide truthful order information, and do not misuse the website or attempt to interfere with its operation. You should ensure you have permission to share a recipient's contact and delivery details with us.</p></section>
    <section><h2>7. Third-party services and links</h2><p>The store may link to or rely on third-party messaging, social media, payment, or delivery services. Those services operate under their own terms and privacy policies. We cannot guarantee the availability or performance of services outside our control.</p></section>
    <section><h2>8. Updates and contact</h2><p>We update these terms when our services or policies change. The latest version and its update date appear on this page. For questions, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p></section>
  </LegalShell>;
}
