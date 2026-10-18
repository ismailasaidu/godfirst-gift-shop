import React, { useEffect, useState } from 'react';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShieldCheck, CreditCard, LockKeyhole, ExternalLink, X } from 'lucide-react';
import { money } from '../data/catalog.js';

const PAYSTACK_KEY = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '').trim();
const COUNTRIES = ['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czechia','Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kosovo','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'];
const COUNTRY_DIAL_CODES = {
  'Afghanistan':'+93','Albania':'+355','Algeria':'+213','Angola':'+244','Argentina':'+54','Australia':'+61','Austria':'+43','Bahrain':'+973','Bangladesh':'+880','Belgium':'+32','Benin':'+229','Botswana':'+267','Brazil':'+55','Cameroon':'+237','Canada':'+1','China':'+86','Ivory Coast':'+225','Egypt':'+20','Ethiopia':'+251','France':'+33','Gambia':'+220','Germany':'+49','Ghana':'+233','India':'+91','Indonesia':'+62','Ireland':'+353','Israel':'+972','Italy':'+39','Japan':'+81','Kenya':'+254','Liberia':'+231','Malaysia':'+60','Mexico':'+52','Morocco':'+212','Mozambique':'+258','Namibia':'+264','Nepal':'+977','Netherlands':'+31','New Zealand':'+64','Niger':'+227','Nigeria':'+234','Norway':'+47','Pakistan':'+92','Philippines':'+63','Poland':'+48','Portugal':'+351','Qatar':'+974','Rwanda':'+250','Saudi Arabia':'+966','Senegal':'+221','Sierra Leone':'+232','Singapore':'+65','South Africa':'+27','South Korea':'+82','Spain':'+34','Sri Lanka':'+94','Sudan':'+249','Sweden':'+46','Switzerland':'+41','Tanzania':'+255','Thailand':'+66','Togo':'+228','Turkey':'+90','Uganda':'+256','Ukraine':'+380','United Arab Emirates':'+971','United Kingdom':'+44','United States':'+1','Zambia':'+260','Zimbabwe':'+263'
};
Object.assign(COUNTRY_DIAL_CODES, {
  'Denmark':'+45','Finland':'+358','Greece':'+30','Iran':'+98','Kuwait':'+965','Oman':'+968','Vatican City':'+39','Vietnam':'+84','Andorra':'+376','Antigua and Barbuda':'+1 268','Armenia':'+374','Azerbaijan':'+994','Bahamas':'+1 242','Barbados':'+1 246','Belarus':'+375','Belize':'+501','Bhutan':'+975','Bolivia':'+591','Bosnia and Herzegovina':'+387','Brunei':'+673','Bulgaria':'+359','Burkina Faso':'+226','Burundi':'+257','Cambodia':'+855','Cape Verde':'+238','Central African Republic':'+236','Chad':'+235','Chile':'+56','Colombia':'+57','Comoros':'+269','Costa Rica':'+506','Croatia':'+385','Cuba':'+53','Cyprus':'+357','Czechia':'+420','Congo':'+242','Democratic Republic of the Congo':'+243','Djibouti':'+253','Dominica':'+1 767','Dominican Republic':'+1 809','Ecuador':'+593','El Salvador':'+503','Equatorial Guinea':'+240','Eritrea':'+291','Estonia':'+372','Eswatini':'+268','Fiji':'+679','Gabon':'+241','Georgia':'+995','Grenada':'+1 473','Guatemala':'+502','Guinea':'+224','Guinea-Bissau':'+245','Guyana':'+592','Haiti':'+509','Honduras':'+504','Hungary':'+36','Iceland':'+354','Iraq':'+964','Jamaica':'+1 876','Jordan':'+962','Kazakhstan':'+7','Kiribati':'+686','Kosovo':'+383','Kyrgyzstan':'+996','Laos':'+856','Latvia':'+371','Lebanon':'+961','Lesotho':'+266','Libya':'+218','Liechtenstein':'+423','Lithuania':'+370','Luxembourg':'+352','Madagascar':'+261','Malawi':'+265','Maldives':'+960','Mali':'+223','Malta':'+356','Marshall Islands':'+692','Mauritania':'+222','Mauritius':'+230','Micronesia':'+691','Moldova':'+373','Monaco':'+377','Mongolia':'+976','Montenegro':'+382','Myanmar':'+95','Nauru':'+674','Nicaragua':'+505','North Korea':'+850','North Macedonia':'+389','Palau':'+680','Palestine':'+970','Panama':'+507','Papua New Guinea':'+675','Paraguay':'+595','Peru':'+51','Romania':'+40','Russia':'+7','Saint Kitts and Nevis':'+1 869','Saint Lucia':'+1 758','Saint Vincent and the Grenadines':'+1 784','Samoa':'+685','San Marino':'+378','Sao Tome and Principe':'+239','Serbia':'+381','Seychelles':'+248','Slovakia':'+421','Slovenia':'+386','Solomon Islands':'+677','Somalia':'+252','South Sudan':'+211','Suriname':'+597','Syria':'+963','Taiwan':'+886','Tajikistan':'+992','Timor-Leste':'+670','Tonga':'+676','Trinidad and Tobago':'+1 868','Tunisia':'+216','Turkmenistan':'+993','Tuvalu':'+688','Ukraine':'+380','Uruguay':'+598','Uzbekistan':'+998','Vanuatu':'+678','Venezuela':'+58','Yemen':'+967'
});
const dialCodeFor = country => COUNTRY_DIAL_CODES[country] || '';

const COUNTRY_FLAGS = {
  'Afghanistan': '🇦🇫',
  'Albania': '🇦🇱',
  'Algeria': '🇩🇿',
  'Andorra': '🇦🇩',
  'Angola': '🇦🇴',
  'Antigua and Barbuda': '🇦🇬',
  'Argentina': '🇦🇷',
  'Armenia': '🇦🇲',
  'Australia': '🇦🇺',
  'Austria': '🇦🇹',
  'Azerbaijan': '🇦🇿',
  'Bahamas': '🇧🇸',
  'Bahrain': '🇧🇭',
  'Bangladesh': '🇧🇩',
  'Barbados': '🇧🇧',
  'Belarus': '🇧🇾',
  'Belgium': '🇧🇪',
  'Belize': '🇧🇿',
  'Benin': '🇧🇯',
  'Bhutan': '🇧🇹',
  'Bolivia': '🇧🇴',
  'Bosnia and Herzegovina': '🇧🇦',
  'Botswana': '🇧🇼',
  'Brazil': '🇧🇷',
  'Brunei': '🇧🇳',
  'Bulgaria': '🇧🇬',
  'Burkina Faso': '🇧🇫',
  'Burundi': '🇧🇮',
  'Cambodia': '🇰🇭',
  'Cameroon': '🇨🇲',
  'Canada': '🇨🇦',
  'Cape Verde': '🇨🇻',
  'Central African Republic': '🇨🇫',
  'Chad': '🇹🇩',
  'Chile': '🇨🇱',
  'China': '🇨🇳',
  'Colombia': '🇨🇴',
  'Comoros': '🇰🇲',
  'Congo': '🇨🇬',
  'Costa Rica': '🇨🇷',
  'Croatia': '🇭🇷',
  'Cuba': '🇨🇺',
  'Cyprus': '🇨🇾',
  'Czechia': '🇨🇿',
  'Democratic Republic of the Congo': '🇨🇩',
  'Denmark': '🇩🇰',
  'Djibouti': '🇩🇯',
  'Dominica': '🇩🇲',
  'Dominican Republic': '🇩🇴',
  'Ecuador': '🇪🇨',
  'Egypt': '🇪🇬',
  'El Salvador': '🇸🇻',
  'Equatorial Guinea': '🇬🇶',
  'Eritrea': '🇪🇷',
  'Estonia': '🇪🇪',
  'Eswatini': '🇸🇿',
  'Ethiopia': '🇪🇹',
  'Fiji': '🇫🇯',
  'Finland': '🇫🇮',
  'France': '🇫🇷',
  'Gabon': '🇬🇦',
  'Gambia': '🇬🇲',
  'Georgia': '🇬🇪',
  'Germany': '🇩🇪',
  'Ghana': '🇬🇭',
  'Greece': '🇬🇷',
  'Grenada': '🇬🇩',
  'Guatemala': '🇬🇹',
  'Guinea': '🇬🇳',
  'Guinea-Bissau': '🇬🇼',
  'Guyana': '🇬🇾',
  'Haiti': '🇭🇹',
  'Honduras': '🇭🇳',
  'Hungary': '🇭🇺',
  'Iceland': '🇮🇸',
  'India': '🇮🇳',
  'Indonesia': '🇮🇩',
  'Iran': '🇮🇷',
  'Iraq': '🇮🇶',
  'Ireland': '🇮🇪',
  'Israel': '🇮🇱',
  'Italy': '🇮🇹',
  'Ivory Coast': '🇨🇮',
  'Jamaica': '🇯🇲',
  'Japan': '🇯🇵',
  'Jordan': '🇯🇴',
  'Kazakhstan': '🇰🇿',
  'Kenya': '🇰🇪',
  'Kiribati': '🇰🇮',
  'Kosovo': '🇽🇰',
  'Kuwait': '🇰🇼',
  'Kyrgyzstan': '🇰🇬',
  'Laos': '🇱🇦',
  'Latvia': '🇱🇻',
  'Lebanon': '🇱🇧',
  'Lesotho': '🇱🇸',
  'Liberia': '🇱🇷',
  'Libya': '🇱🇾',
  'Liechtenstein': '🇱🇮',
  'Lithuania': '🇱🇹',
  'Luxembourg': '🇱🇺',
  'Madagascar': '🇲🇬',
  'Malawi': '🇲🇼',
  'Malaysia': '🇲🇾',
  'Maldives': '🇲🇻',
  'Mali': '🇲🇱',
  'Malta': '🇲🇹',
  'Marshall Islands': '🇲🇭',
  'Mauritania': '🇲🇷',
  'Mauritius': '🇲🇺',
  'Mexico': '🇲🇽',
  'Micronesia': '🇫🇲',
  'Moldova': '🇲🇩',
  'Monaco': '🇲🇨',
  'Mongolia': '🇲🇳',
  'Montenegro': '🇲🇪',
  'Morocco': '🇲🇦',
  'Mozambique': '🇲🇿',
  'Myanmar': '🇲🇲',
  'Namibia': '🇳🇦',
  'Nauru': '🇳🇷',
  'Nepal': '🇳🇵',
  'Netherlands': '🇳🇱',
  'New Zealand': '🇳🇿',
  'Nicaragua': '🇳🇮',
  'Niger': '🇳🇪',
  'Nigeria': '🇳🇬',
  'North Korea': '🇰🇵',
  'North Macedonia': '🇲🇰',
  'Norway': '🇳🇴',
  'Oman': '🇴🇲',
  'Pakistan': '🇵🇰',
  'Palau': '🇵🇼',
  'Palestine': '🇵🇸',
  'Panama': '🇵🇦',
  'Papua New Guinea': '🇵🇬',
  'Paraguay': '🇵🇾',
  'Peru': '🇵🇪',
  'Philippines': '🇵🇭',
  'Poland': '🇵🇱',
  'Portugal': '🇵🇹',
  'Qatar': '🇶🇦',
  'Romania': '🇷🇴',
  'Russia': '🇷🇺',
  'Rwanda': '🇷🇼',
  'Saint Kitts and Nevis': '🇰🇳',
  'Saint Lucia': '🇱🇨',
  'Saint Vincent and the Grenadines': '🇻🇨',
  'Samoa': '🇼🇸',
  'San Marino': '🇸🇲',
  'Sao Tome and Principe': '🇸🇹',
  'Saudi Arabia': '🇸🇦',
  'Senegal': '🇸🇳',
  'Serbia': '🇷🇸',
  'Seychelles': '🇸🇨',
  'Sierra Leone': '🇸🇱',
  'Singapore': '🇸🇬',
  'Slovakia': '🇸🇰',
  'Slovenia': '🇸🇮',
  'Solomon Islands': '🇸🇧',
  'Somalia': '🇸🇴',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'South Sudan': '🇸🇸',
  'Spain': '🇪🇸',
  'Sri Lanka': '🇱🇰',
  'Sudan': '🇸🇩',
  'Suriname': '🇸🇷',
  'Sweden': '🇸🇪',
  'Switzerland': '🇨🇭',
  'Syria': '🇸🇾',
  'Taiwan': '🇹🇼',
  'Tajikistan': '🇹🇯',
  'Tanzania': '🇹🇿',
  'Thailand': '🇹🇭',
  'Timor-Leste': '🇹🇱',
  'Togo': '🇹🇬',
  'Tonga': '🇹🇴',
  'Trinidad and Tobago': '🇹🇹',
  'Tunisia': '🇹🇳',
  'Turkey': '🇹🇷',
  'Turkmenistan': '🇹🇲',
  'Tuvalu': '🇹🇻',
  'Uganda': '🇺🇬',
  'Ukraine': '🇺🇦',
  'United Arab Emirates': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  'Uruguay': '🇺🇾',
  'Uzbekistan': '🇺🇿',
  'Vanuatu': '🇻🇺',
  'Vatican City': '🇻🇦',
  'Venezuela': '🇻🇪',
  'Vietnam': '🇻🇳',
  'Yemen': '🇾🇪',
  'Zambia': '🇿🇲',
  'Zimbabwe': '🇿🇼'
};
const flagForCountry = country => COUNTRY_FLAGS[country] || '🌐';
const POSTAL_PATTERNS = {
  Nigeria: /^\d{6}$/, 'United States': /^\d{5}(?:-\d{4})?$/, Canada: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'United Kingdom': /^(?:GIR 0AA|[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})$/i,
  Australia: /^\d{4}$/, India: /^\d{6}$/, Ghana: /^[A-Za-z0-9 -]{4,10}$/, 'South Africa': /^\d{4}$/, Kenya: /^\d{5}$/, 'New Zealand': /^\d{4}$/, Germany: /^\d{5}$/, France: /^\d{5}$/, Italy: /^\d{5}$/, Spain: /^\d{5}$/, Japan: /^\d{3}-?\d{4}$/, China: /^\d{6}$/, 'United Arab Emirates': /^[A-Za-z0-9 -]{3,10}$/
};
const postalCodeIsValid = (country, value) => {
  const postal = String(value || '').trim();
  // Postal codes are optional because many delivery arrangements can be confirmed by city and street address.
  if (!postal) return true;
  if (postal.length < 4 || postal.length > 10 || !/^[A-Za-z0-9][A-Za-z0-9 -]*$/.test(postal)) return false;
  return POSTAL_PATTERNS[country] ? POSTAL_PATTERNS[country].test(postal) : true;
};

const onlyDigits = value => String(value || '').replace(/\D/g, '');
const phoneForCountry = (phone, oldCountry, newCountry) => {
  const oldCode = dialCodeFor(oldCountry);
  const newCode = dialCodeFor(newCountry);
  const raw = String(phone || '').trim();
  if (!newCode) return raw;
  if (!raw) return `${newCode} `;
  if (oldCode && raw.startsWith(oldCode)) return `${newCode} ${raw.slice(oldCode.length).trim()}`;
  if (raw.startsWith('+')) return raw;
  return `${newCode} ${raw.replace(/^0+/, '')}`;
};

function loadPaystack() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve(window.PaystackPop);
    const existing = document.querySelector('script[data-paystack-inline]');
    if (existing) { existing.addEventListener('load', () => resolve(window.PaystackPop), { once: true }); existing.addEventListener('error', reject, { once: true }); return; }
    const script = document.createElement('script'); script.src = 'https://js.paystack.co/v2/inline.js'; script.async = true; script.dataset.paystackInline = 'true';
    script.onload = () => window.PaystackPop ? resolve(window.PaystackPop) : reject(new Error('The payment window could not be loaded.'));
    script.onerror = () => reject(new Error('Could not load the payment provider. Check your internet connection and try again.'));
    document.body.appendChild(script);
  });
}

export function CartDrawer({ cart, onClose, qty, go, total, openProduct }) {
 return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">YOUR LITTLE COLLECTION</p><h2>Your bag <span>({cart.reduce((n,x)=>n+x.qty,0)})</span></h2></div><button className="drawer-close-btn" onClick={onClose} aria-label="Close shopping bag"><X size={22}/></button></div>{cart.length? <><div className="cart-items">{cart.map(item=><div className="cart-item" key={item.id}><button className="drawer-product-image" onClick={()=>openProduct?.(item)} aria-label={`View ${item.name}`}><img src={item.image} alt={item.name}/></button><div className="cart-item-copy"><button className="drawer-product-title" onClick={()=>openProduct?.(item)}>{item.name}</button><strong>{money(item.price)}</strong><div className="quantity-control"><button onClick={()=>qty(item.id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.qty}</span><button onClick={()=>qty(item.id,1)} aria-label="Increase quantity"><Plus size={13}/></button><button onClick={()=>qty(item.id,-item.qty)} aria-label="Remove item"><Trash2 size={13}/></button></div></div></div>)}</div><div className="drawer-total"><span>Subtotal</span><strong>{money(total)}</strong></div><button className="btn btn-primary drawer-checkout" onClick={()=>go('checkout')}>Continue to checkout <ArrowRight size={15}/></button><button className="cart-continue" onClick={()=>go('cart')}>View full bag</button></>:<div className="empty-state"><ShoppingBag size={30}/><h3>Your bag is empty</h3><p>Find a thoughtful gift for someone special.</p><button className="btn btn-primary" onClick={()=>go('shop')}>Explore gifts</button></div>}</aside></div>;
}

export default function CheckoutPage({ cart, total, deliveryFee=0, grandTotal=total, deliveryMethod='normal', checkout, setCheckout, onSubmit, onPaymentSuccess, go }) {
 const [step,setStep] = useState('details'); const [busy,setBusy] = useState(false); const [paymentError,setPaymentError] = useState('');
 useEffect(()=>{setStep('details');setPaymentError('')},[cart.length]);
 const startPayment = async () => {
   setPaymentError('');
   if (!PAYSTACK_KEY || !PAYSTACK_KEY.startsWith('pk_')) { setPaymentError('Online payment is currently unavailable. Please contact us for help completing your order. No payment has been taken.'); return; }
   if (!checkout.email.trim()) { setStep('details'); setPaymentError('Please enter your email address before payment.'); return; }
   const amountInMinorUnits = Math.round(Number(grandTotal) * 100);
   const orderDate = new Date().toISOString();
   if (!Number.isSafeInteger(amountInMinorUnits) || amountInMinorUnits < 1) { setPaymentError('The checkout total is invalid. Please review your basket before paying.'); return; }
   setBusy(true);
   try {
     const PaystackPop = await loadPaystack();
     const popup = new PaystackPop();
     const paymentReference = `GFG-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
     const orderPayload = { id: paymentReference, date: orderDate, customer: checkout, items: cart, subtotal: Number(total), deliveryMethod, deliveryFee: Number(deliveryFee), total: Number(grandTotal) };
     popup.newTransaction({ key: PAYSTACK_KEY, email: checkout.email.trim(), amount: amountInMinorUnits, currency: 'NGN', reference: paymentReference, metadata: { custom_fields: [{display_name:'Customer name',variable_name:'customer_name',value:checkout.name},{display_name:'Phone',variable_name:'phone',value:checkout.phone},{display_name:'Delivery method',variable_name:'delivery_method',value:deliveryMethod},{display_name:'Delivery fee',variable_name:'delivery_fee',value:String(deliveryFee)},{display_name:'Delivery country',variable_name:'delivery_country',value:checkout.country},{display_name:'Delivery address',variable_name:'delivery_address',value:[checkout.address,checkout.addressLine2,checkout.city,checkout.state,checkout.postalCode,checkout.country].filter(Boolean).join(', ')}] }, onSuccess: async response => { const reference = String(response?.reference || '').trim(); if (!reference) { setBusy(false); setPaymentError('Paystack did not return a payment reference. If you were charged, contact the store before trying again.'); return; } try { const verifyResponse = await fetch('/.netlify/functions/verify-paystack', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reference, expectedAmount: amountInMinorUnits, expectedCurrency: 'NGN', order: { ...orderPayload, id: reference } }) }); const verification = await verifyResponse.json().catch(() => ({})); if (!verifyResponse.ok || verification.verified !== true) { const mismatchDetails = verification.code === 'PAYSTACK_TRANSACTION_MISMATCH' ? ` Expected order amount: ${verification.expectedAmountMinor ?? 'unknown'} kobo; Paystack requested amount: ${verification.requestedAmountMinor ?? 'not supplied'} kobo; customer charge: ${verification.reportedAmountMinor ?? 'unknown'} kobo; currency: ${verification.reportedCurrency || 'unknown'}.` : ''; setPaymentError(`${verification.message || 'We could not confirm this payment yet.'}${mismatchDetails} Reference: ${reference}`); setBusy(false); return; } setBusy(false); await onPaymentSuccess?.({ reference: verification.reference, channel: verification.channel || 'Paystack', verificationStatus: 'verified', verifiedAmount: verification.amount, chargedAmount: verification.chargedAmount ?? verification.amount, currency: verification.currency, paidAt: verification.paidAt, orderId: verification.orderId || reference, orderSaved: verification.orderSaved === true, orderSaveMessage: verification.orderSaveMessage || '', emailNotifications: verification.emailNotifications || null }); } catch (verifyError) { setPaymentError(`Your payment may have gone through, but we could not verify it right now. Do not pay again until you contact the store. Reference: ${reference}`); setBusy(false); } }, onCancel: () => setBusy(false), onError: error => { setPaymentError(error?.message || 'Paystack could not start the payment. Please try again.'); setBusy(false); } });
   } catch (err) { setPaymentError(err.message || 'Unable to open the payment window. Please try again.'); setBusy(false); }
 };
 return <main className="container page-main checkout-page"><div className="page-title"><p className="eyebrow">ALMOST THERE</p><h1>{step==='details'?'Delivery details.':'Secure payment.'}</h1><p>{step==='details'?'Tell us where to deliver your thoughtful gifts.':'Review your order and continue to Paystack to make payment.'}</p></div>
 {!cart.length?<div className="empty-state"><ShoppingBag size={30}/><h3>Your bag is empty</h3><button className="btn btn-primary" onClick={()=>go('shop')}>Browse gifts</button></div>:<>
  <div className="cart-progress checkout-progress"><span className="is-done">✓ <b>Your bag</b></span><i/><span className={step==='details'?'is-current':'is-done'}>{step==='payment'?'✓':'2'} <b>Delivery</b></span><i/><span className={step==='payment'?'is-current':''}>3 <b>Payment</b></span></div>
  <div className="checkout-layout"><section className="checkout-form-panel">
   {step==='details'?<form className="checkout-form" onSubmit={e=>{e.preventDefault();setPaymentError('');const email=checkout.email.trim();const phone=String(checkout.phone||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setPaymentError('Enter a valid email address for your order record and payment receipt.');return;}const phoneDigits=onlyDigits(phone);if(phoneDigits.length<7||phoneDigits.length>15){setPaymentError('Enter a phone number with 7–15 digits so the shop can contact you about delivery.');return;}const selectedCode=dialCodeFor(checkout.country).replace(/\s/g,'');const codeDigits=selectedCode.replace(/\D/g,'');const localDigits=selectedCode&&phoneDigits.startsWith(codeDigits)?phoneDigits.slice(codeDigits.length):phoneDigits.replace(/^0+/, '');const normalizedPhone=phone.trim().startsWith('+')?`+${phoneDigits}`:(selectedCode?`${selectedCode}${localDigits}`:`+${phoneDigits}`);setCheckout(old=>({...old,phone:normalizedPhone}));setStep('payment');window.scrollTo({top:0,behavior:'smooth'});}}><h2>Delivery details</h2><p className="checkout-step-note">Fields marked required help us coordinate your delivery.</p>{paymentError&&<p className="payment-error" role="alert">{paymentError}</p>}<div className="form-grid"><label>Country / territory<select autoComplete="country-name" value={checkout.country} onChange={e=>setCheckout({...checkout,country:e.target.value,phone:phoneForCountry(checkout.phone,checkout.country,e.target.value)})} required><option value="">Choose your country</option>{COUNTRIES.map(country=><option key={country} value={country}>{flagForCountry(country)} {country}</option>)}</select>{checkout.country&&dialCodeFor(checkout.country)&&<small className="field-help">Phone country code: {flagForCountry(checkout.country)} {dialCodeFor(checkout.country)}</small>}</label>{[['name','Full name','text'],['email','Email address','email'],['phone','Phone number','tel'],['address','Street address / house number','text'],['addressLine2','Apartment, suite, unit (optional)','text'],['city','City / town','text'],['state','State / province / region','text'],['postalCode','Postal / ZIP code','text']].map(([key,label,type])=><label key={key} className={['address','addressLine2'].includes(key)?'full-field':''}>{label}{key==='phone'?<><span className="phone-country-hint">{flagForCountry(checkout.country)} {checkout.country||'Choose country'} {dialCodeFor(checkout.country)||''}</span><input type="tel" autoComplete="tel" value={checkout.phone||''} placeholder={checkout.country&&dialCodeFor(checkout.country)?`${dialCodeFor(checkout.country)} 801 234 5678`:'Choose your country first'} onChange={e=>{let value=e.target.value.replace(/[^+0-9 ()-]/g,'');const code=dialCodeFor(checkout.country);if(code&&value.startsWith(code)){const local=value.slice(code.length).trim().replace(/^0+/, '');value=local?`${code} ${local}`:`${code} `;}else if(code&&value&&!value.startsWith('+')){value=`${code} ${value.replace(/^0+/, '')}`;}setCheckout({...checkout,phone:value});}} inputMode="tel" required maxLength={22}/></>:<input type={type} autoComplete={{name:'name',email:'email',address:'address-line1',addressLine2:'address-line2',city:'address-level2',state:'address-level1',postalCode:'postal-code'}[key]} value={checkout[key]||''} onChange={e=>setCheckout({...checkout,[key]:e.target.value})} inputMode={key==='postalCode'?'text':undefined} autoCapitalize={key==='email'?'none':undefined} spellCheck={key==='email'?false:undefined} required={!['addressLine2','postalCode'].includes(key)} maxLength={key==='postalCode'?12:undefined} aria-describedby={key==='postalCode'?'postal-help':undefined}/>}{key==='postalCode'&&<small id="postal-help" className="field-help">Postal / ZIP code is optional if you do not have one. Enter it when available to help with delivery.</small>}</label>)}<label className="full-field">Delivery notes<textarea value={checkout.note} onChange={e=>setCheckout({...checkout,note:e.target.value})} rows="3" placeholder="Optional message or delivery instructions"/></label><fieldset className="delivery-method-field full-field"><legend>Choose delivery speed</legend><label className={`delivery-method-option ${deliveryMethod==='normal'?'selected':''}`}><input type="radio" name="deliveryMethod" value="normal" checked={deliveryMethod==='normal'} onChange={()=>setCheckout({...checkout,deliveryMethod:'normal'})}/><span><strong>Normal delivery</strong><small>{[...new Set(cart.map(item=>item.normalDeliveryDuration||'3–7 business days'))].join(' · ')}</small></span><b>{money(cart.reduce((sum,item)=>sum+Math.max(0,Number(item.normalDeliveryFee||0))*Number(item.qty||1),0))}</b></label><label className={`delivery-method-option ${deliveryMethod==='express'?'selected':''}`}><input type="radio" name="deliveryMethod" value="express" checked={deliveryMethod==='express'} onChange={()=>setCheckout({...checkout,deliveryMethod:'express'})}/><span><strong>Express delivery</strong><small>{[...new Set(cart.map(item=>item.expressDeliveryDuration||'1–2 business days'))].join(' · ')}</small></span><b>{money(cart.reduce((sum,item)=>sum+Math.max(0,Number(item.expressDeliveryFee||0))*Number(item.qty||1),0))}</b></label></fieldset></div><button className="btn btn-primary checkout-primary" type="submit">Continue to payment <ArrowRight size={16}/></button><button type="button" className="cart-continue" onClick={()=>go('cart')}><ArrowLeft size={14}/> Return to bag</button></form>:<div className="checkout-form payment-panel"><div className="payment-heading-icon"><CreditCard size={25}/></div><h2>Pay securely online</h2><p>You'll be redirected to Paystack's secure checkout to complete your payment in naira.</p><div className="payment-method-card"><div className="payment-method-icon"><LockKeyhole size={20}/></div><div><strong>Paystack</strong><span>Cards and other payment methods supported by Paystack</span></div><span className="payment-selected">Selected</span></div><div className="payment-total-row"><span>Amount to pay</span><strong>{money(grandTotal)}</strong></div>{paymentError&&<p className="payment-error" role="alert">{paymentError}</p>}<button className="btn btn-primary checkout-primary" type="button" onClick={startPayment} disabled={busy}>{busy?'Opening secure payment…':<>Pay {money(grandTotal)} <LockKeyhole size={15}/></>}</button><button className="cart-continue" type="button" onClick={()=>{setStep('details');setPaymentError('');}}><ArrowLeft size={14}/> Edit delivery details</button><p className="payment-security-note"><ShieldCheck size={16}/> Your card details are entered on Paystack, not stored by this website.</p></div>}
  </section><aside className="order-summary checkout-summary"><h2>Your order</h2><div className="checkout-summary-items">{cart.map(item=><div className="checkout-summary-item" key={item.id}><button className="checkout-product-image" onClick={()=>go('cart')} aria-label={`Return to bag to view ${item.name}`}><img src={item.image} alt={item.name}/><span>{item.qty}</span></button><div><strong>{item.name}</strong><small>Qty {item.qty}</small></div><b>{money(item.price*item.qty)}</b></div>)}</div><div className="summary-line"><span>Subtotal</span><strong>{money(total)}</strong></div><div className="summary-line"><span>{deliveryMethod==='express'?'Express delivery':'Normal delivery'}</span><strong>{money(deliveryFee)}</strong></div><div className="summary-total"><span>Total due</span><strong>{money(grandTotal)}</strong></div><p>Delivery fees and estimated durations are the product settings selected by the store. Confirm availability and any destination-specific charges before fulfilment.</p><div className="checkout-safe-note"><ShieldCheck size={16}/><span>Secure payment powered by Paystack</span></div></aside></div>
 </>}
 </main>;
}
