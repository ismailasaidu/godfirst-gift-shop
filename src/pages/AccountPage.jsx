import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { UserRound, Package, Heart, LogIn, LogOut, ArrowRight, MailCheck, ShieldCheck, RefreshCw, Globe2, Save, Info } from 'lucide-react';
import { COUNTRIES } from './CheckoutPage.jsx';
import { readRegionalPreferences, readExchangeRates, saveRegionalPreferences, displayPrice } from '../lib/currency.js';

const COUNTRY_CURRENCY = {
  Afghanistan: 'AFN',
  Albania: 'ALL',
  Algeria: 'DZD',
  Andorra: 'EUR',
  Angola: 'AOA',
  'Antigua and Barbuda': 'XCD',
  Argentina: 'ARS',
  Armenia: 'AMD',
  Australia: 'AUD',
  Austria: 'EUR',
  Azerbaijan: 'AZN',
  Bahamas: 'BSD',
  Bahrain: 'BHD',
  Bangladesh: 'BDT',
  Barbados: 'BBD',
  Belarus: 'BYN',
  Belgium: 'EUR',
  Belize: 'BZD',
  Benin: 'XOF',
  Bhutan: 'BTN',
  Bolivia: 'BOB',
  'Bosnia and Herzegovina': 'BAM',
  Botswana: 'BWP',
  Brazil: 'BRL',
  Brunei: 'BND',
  Bulgaria: 'BGN',
  'Burkina Faso': 'XOF',
  Burundi: 'BIF',
  Cambodia: 'KHR',
  Cameroon: 'XAF',
  Canada: 'CAD',
  'Cape Verde': 'CVE',
  'Central African Republic': 'XAF',
  Chad: 'XAF',
  Chile: 'CLP',
  China: 'CNY',
  Colombia: 'COP',
  Comoros: 'KMF',
  Congo: 'XAF',
  'Costa Rica': 'CRC',
  Croatia: 'EUR',
  Cuba: 'CUP',
  Cyprus: 'EUR',
  Czechia: 'CZK',
  'Democratic Republic of the Congo': 'CDF',
  Denmark: 'DKK',
  Djibouti: 'DJF',
  Dominica: 'XCD',
  'Dominican Republic': 'DOP',
  Ecuador: 'USD',
  Egypt: 'EGP',
  'El Salvador': 'USD',
  'Equatorial Guinea': 'XAF',
  Eritrea: 'ERN',
  Estonia: 'EUR',
  Eswatini: 'SZL',
  Ethiopia: 'ETB',
  Fiji: 'FJD',
  Finland: 'EUR',
  France: 'EUR',
  Gabon: 'XAF',
  Gambia: 'GMD',
  Georgia: 'GEL',
  Germany: 'EUR',
  Ghana: 'GHS',
  Greece: 'EUR',
  Grenada: 'XCD',
  Guatemala: 'GTQ',
  Guinea: 'GNF',
  'Guinea-Bissau': 'XOF',
  Guyana: 'GYD',
  Haiti: 'HTG',
  Honduras: 'HNL',
  Hungary: 'HUF',
  Iceland: 'ISK',
  India: 'INR',
  Indonesia: 'IDR',
  Iran: 'IRR',
  Iraq: 'IQD',
  Ireland: 'EUR',
  Israel: 'ILS',
  Italy: 'EUR',
  'Ivory Coast': 'XOF',
  Jamaica: 'JMD',
  Japan: 'JPY',
  Jordan: 'JOD',
  Kazakhstan: 'KZT',
  Kenya: 'KES',
  Kiribati: 'AUD',
  Kosovo: 'EUR',
  Kuwait: 'KWD',
  Kyrgyzstan: 'KGS',
  Laos: 'LAK',
  Latvia: 'EUR',
  Lebanon: 'LBP',
  Lesotho: 'LSL',
  Liberia: 'LRD',
  Libya: 'LYD',
  Liechtenstein: 'CHF',
  Lithuania: 'EUR',
  Luxembourg: 'EUR',
  Madagascar: 'MGA',
  Malawi: 'MWK',
  Malaysia: 'MYR',
  Maldives: 'MVR',
  Mali: 'XOF',
  Malta: 'EUR',
  'Marshall Islands': 'USD',
  Mauritania: 'MRU',
  Mauritius: 'MUR',
  Mexico: 'MXN',
  Micronesia: 'USD',
  Moldova: 'MDL',
  Monaco: 'EUR',
  Mongolia: 'MNT',
  Montenegro: 'EUR',
  Morocco: 'MAD',
  Mozambique: 'MZN',
  Myanmar: 'MMK',
  Namibia: 'NAD',
  Nauru: 'AUD',
  Nepal: 'NPR',
  Netherlands: 'EUR',
  'New Zealand': 'NZD',
  Nicaragua: 'NIO',
  Niger: 'XOF',
  Nigeria: 'NGN',
  'North Korea': 'KPW',
  'North Macedonia': 'MKD',
  Norway: 'NOK',
  Oman: 'OMR',
  Pakistan: 'PKR',
  Palau: 'USD',
  Palestine: 'ILS',
  Panama: 'USD',
  'Papua New Guinea': 'PGK',
  Paraguay: 'PYG',
  Peru: 'PEN',
  Philippines: 'PHP',
  Poland: 'PLN',
  Portugal: 'EUR',
  Qatar: 'QAR',
  Romania: 'RON',
  Russia: 'RUB',
  Rwanda: 'RWF',
  'Saint Kitts and Nevis': 'XCD',
  'Saint Lucia': 'XCD',
  'Saint Vincent and the Grenadines': 'XCD',
  Samoa: 'WST',
  'San Marino': 'EUR',
  'Sao Tome and Principe': 'STN',
  'Saudi Arabia': 'SAR',
  Senegal: 'XOF',
  Serbia: 'RSD',
  Seychelles: 'SCR',
  'Sierra Leone': 'SLE',
  Singapore: 'SGD',
  Slovakia: 'EUR',
  Slovenia: 'EUR',
  'Solomon Islands': 'SBD',
  Somalia: 'SOS',
  'South Africa': 'ZAR',
  'South Korea': 'KRW',
  'South Sudan': 'SSP',
  Spain: 'EUR',
  'Sri Lanka': 'LKR',
  Sudan: 'SDG',
  Suriname: 'SRD',
  Sweden: 'SEK',
  Switzerland: 'CHF',
  Syria: 'SYP',
  Taiwan: 'TWD',
  Tajikistan: 'TJS',
  Tanzania: 'TZS',
  Thailand: 'THB',
  'Timor-Leste': 'USD',
  Togo: 'XOF',
  Tonga: 'TOP',
  'Trinidad and Tobago': 'TTD',
  Tunisia: 'TND',
  Turkey: 'TRY',
  Turkmenistan: 'TMT',
  Tuvalu: 'AUD',
  Uganda: 'UGX',
  Ukraine: 'UAH',
  'United Arab Emirates': 'AED',
  'United Kingdom': 'GBP',
  'United States': 'USD',
  Uruguay: 'UYU',
  Uzbekistan: 'UZS',
  Vanuatu: 'VUV',
  'Vatican City': 'EUR',
  Venezuela: 'VES',
  Vietnam: 'VND',
  Yemen: 'YER',
  Zambia: 'ZMW',
  Zimbabwe: 'ZWL',
};

export default function AccountPage({ user, orders = [], go, openAuth, onSignOut, emailVerified = false, onResendVerification, verificationBusy = false, verificationNotice = '', isAdmin = false, roleLoading = false, adminRoleError = '', onRefreshAdminRole }) {
  const [preferences, setPreferences] = useState(readRegionalPreferences);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferenceError, setPreferenceError] = useState('');
  const [rateInfo, setRateInfo] = useState(readExchangeRates);
  const selectedCurrency = COUNTRY_CURRENCY[preferences.country] || 'NGN';
  const mine = user ? orders.filter(o => (o.ownerUid && o.ownerUid === user.uid) || (o.customer?.email || '').toLowerCase() === (user.email || '').toLowerCase()).sort((a,b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime()) : [];
  useEffect(() => {
    let active = true;
    const loadAccountPreferences = async () => {
      if (!user?.uid || !db) return;
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        const profile = snapshot.exists() ? snapshot.data() : {};
        const cloudPrefs = profile.regionalPreferences || (profile.country ? { country: profile.country } : null);
        if (active && cloudPrefs?.country) {
          const country = COUNTRY_CURRENCY[cloudPrefs.country] ? cloudPrefs.country : 'Nigeria';
          const next = { country, currency: COUNTRY_CURRENCY[country] };
          saveRegionalPreferences(next);
          setPreferences(next);
        }
      } catch (error) {
        console.warn('Could not load account regional preferences:', error);
        if (active) setPreferenceError('We could not retrieve your saved country. Please check your connection and try again.');
      }
    };
    loadAccountPreferences();
    return () => { active = false; };
  }, [user?.uid]);

  useEffect(() => {
    const update = () => { setPreferences(readRegionalPreferences()); setRateInfo(readExchangeRates()); };
    window.addEventListener('gfg-regional-preferences-changed', update);
    window.addEventListener('gfg-exchange-rates-changed', update);
    return () => {
      window.removeEventListener('gfg-regional-preferences-changed', update);
      window.removeEventListener('gfg-exchange-rates-changed', update);
    };
  }, []);

  const savePreferences = async () => {
    if (!user?.uid || !db) {
      setPreferenceError('Please sign in to save your country and display currency.');
      return;
    }
    const next = { country: preferences.country, currency: selectedCurrency };
    setSaving(true); setSaved(false); setPreferenceError('');
    try {
      const profileRef = doc(db, 'users', user.uid);
      const profileSnapshot = await getDoc(profileRef);
      const profile = profileSnapshot.exists() ? profileSnapshot.data() : {};
      const profileUpdate = {
        uid: user.uid,
        email: user.email || profile.email || '',
        displayName: user.displayName || profile.displayName || '',
        regionalPreferences: next,
        country: next.country,
        displayCurrency: next.currency,
        updatedAt: serverTimestamp()
      };
      if (!profileSnapshot.exists()) profileUpdate.role = 'customer';
      await setDoc(profileRef, profileUpdate, { merge: true });
      saveRegionalPreferences(next);
      setPreferences(next);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2600);
    } catch (error) {
      console.error('Could not save account regional preferences:', error);
      setPreferenceError('We could not sync your country to your account. Please try again.');
    } finally { setSaving(false); }
  };

  const changeCountry = country => {
    setPreferences({ country, currency: COUNTRY_CURRENCY[country] || 'NGN' });
    setSaved(false);
    setPreferenceError('');
  };
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const renderOrderCard = (order, label = 'ORDER DETAILS') => (
    <article className="account-order-featured account-order-expanded">
      <div className="account-order-featured-top">
        <span className="account-order-recent-label"><Package size={14}/> {label}</span>
        <span className="account-order-status">{order.status || 'Order received'}</span>
      </div>
      <div className="account-order-featured-main">
        <div>
          <small>Order reference</small>
          <b>{order.id}</b>
          <small>{new Date(order.date || order.createdAt || Date.now()).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</small>
        </div>
        <strong>{displayPrice(order.total)}</strong>
      </div>
    </article>
  );
  return <main className="container info-page account-page">
    <header className="info-page-heading"><p className="eyebrow">YOUR GOD FIRST ACCOUNT</p><h1>A little place for <em>your orders.</em></h1><p>Keep track of your gift plans and find your saved favourites.</p></header>
    <section className="account-panel"><div className="account-avatar"><UserRound size={28}/></div><div className="account-intro"><h2>{user ? `Welcome back${user.displayName ? ' ' + user.displayName : ''}` : 'Sign in to your account'}</h2><p>{user ? user.email : 'Sign in to access your account details and order history.'}</p>{user && <span className={`account-state ${emailVerified ? 'account-state-verified' : 'account-state-pending'}`}>{emailVerified ? <ShieldCheck size={14}/> : <MailCheck size={14}/>} {emailVerified ? 'Email verified' : 'Email verification pending'}</span>}</div>{user ? <button className="btn btn-secondary" onClick={onSignOut}><LogOut size={15}/> Sign out</button> : <button className="btn btn-primary" onClick={() => openAuth('customer')}><LogIn size={15}/> Sign in / Create account</button>}</section>
    <section className="account-panel regional-preferences-panel"><div className="account-avatar"><Globe2 size={26}/></div><div className="account-intro"><h2>Shopping country</h2><p>Choose your country. We'll automatically set the matching display currency.</p></div><div className="regional-preferences-fields">
      {!user ? <div className="regional-preferences-auth-required"><p>Sign in to choose and save your shopping country. Your currency preference will follow your account on other devices.</p><button type="button" className="btn btn-primary" onClick={() => openAuth('customer')}><LogIn size={15}/> Sign in to continue</button></div> : <>
        <label>Country / region<select value={preferences.country} onChange={e => changeCountry(e.target.value)}>{COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}</select></label>
        <div className="regional-currency-preview"><span>Automatically selected currency</span><strong>{selectedCurrency}</strong></div>
        <button type="button" className="btn btn-primary" onClick={savePreferences} disabled={saving}><Save size={15}/>{saving ? 'Saving…' : saved ? 'Country saved' : 'Save country'}</button>
        <p className="regional-preferences-note"><Info size={14}/> Prices throughout the shop and your bag will use the currency assigned to your selected country.</p>
        {preferenceError && <p className="regional-preferences-error" role="alert">{preferenceError}</p>}
        {rateInfo?.providerUpdatedAt && <small className="field-help">Exchange-rate provider update: {rateInfo.providerUpdatedAt}</small>}
      </>}
    </div></section>
    {user && !emailVerified && <section className="verification-panel"><MailCheck size={21}/><div><h3>Verify your email address</h3><p>We sent a verification link to <strong>{user.email}</strong>. Open it, follow the instructions, then return here. This page will refresh your verification status.</p>{verificationNotice && <p className="verification-notice" role="status">{verificationNotice}</p>}<button className="btn btn-primary" disabled={verificationBusy} onClick={onResendVerification}><RefreshCw size={15}/>{verificationBusy ? 'Sending…' : 'Resend verification email'}</button></div></section>}
    <div className="account-shortcuts"><button onClick={() => go('tracking')}><Package/><span><b>Track an order</b><small>Check the latest status using your reference.</small></span><ArrowRight/></button><button onClick={() => go('wishlist')}><Heart/><span><b>Saved gifts</b><small>Return to the gifts you have saved.</small></span><ArrowRight/></button></div>
    {user && <section className="account-orders"><div className="account-orders-heading"><div><p className="eyebrow">ORDER HISTORY</p><h2>My orders</h2></div>{mine.length > 0 && <span className="account-order-count">{mine.length} {mine.length === 1 ? 'order' : 'orders'}</span>}</div>{mine.length ? <>
      {renderOrderCard(mine[0], 'MOST RECENT ORDER')}
      {mine.length > 1 && <div className="account-order-list"><h3>All other orders</h3><p className="account-order-list-hint">Select an order to expand its details.</p>{mine.slice(1).map(order => <div className="account-order-list-item" key={order.id}>
        <button type="button" className={`account-order-row ${expandedOrderId === order.id ? 'is-expanded' : ''}`} onClick={() => setExpandedOrderId(current => current === order.id ? null : order.id)} aria-expanded={expandedOrderId === order.id}>
          <span className="account-order-row-info"><b>{order.id}</b><small>{new Date(order.date || order.createdAt || Date.now()).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</small></span>
          <span className="account-order-status">{order.status || 'Order received'}</span>
          <strong>{displayPrice(order.total)}</strong>
          <span className="account-order-row-toggle">{expandedOrderId === order.id ? 'Hide details' : 'View details'} <ArrowRight size={14}/></span>
        </button>
        {expandedOrderId === order.id && renderOrderCard(order, 'ORDER DETAILS')}
      </div>)}</div>}
    </> : <p>No orders are linked to this account yet. Orders placed while signed in will appear here when linked to your account.</p>}</section>}
  </main>;
}
