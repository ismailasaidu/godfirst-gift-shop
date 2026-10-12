import React, { useEffect, useRef, useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Gift, UserRound, LayoutDashboard, ChevronDown, ArrowRight, LogOut } from 'lucide-react';

export default function Header({ page, go, cartCount, wishlistCount, query, setQuery, categories = [], onOpenCategory, openCart, openAuth, openAdmin, onSignOut, mobileNav, setMobileNav, user, isAdmin = false }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!mobileNav) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMobileNav(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', closeOnEscape); };
  }, [mobileNav, setMobileNav]);

  const submitSearch = (event) => {
    event?.preventDefault?.();
    go('shop');
    setMobileSearchOpen(false);
    setMobileNav(false);
  };
  const openCollection = (id, sub = 'all') => {
    setShopOpen(false);
    setExpandedCollection('');
    setMobileNav(false);
    setMobileSearchOpen(false);
    if (onOpenCategory) onOpenCategory(id, sub);
    else go('shop');
  };
  const links = [['home', 'Home'], ['services', 'Services'], ['giftFinder', 'Gift Finder'], ['tracking', 'Track order']];
  const extraLinks = [['about', 'About us'], ['faq', 'FAQs'], ['contact', 'Contact us'], ['delivery', 'Delivery information'], ['account', 'My account'], ['privacy', 'Privacy policy'], ['terms', 'Terms & conditions']];

  return <>
    {mobileNav && <button type="button" className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={() => setMobileNav(false)} />}
    <div className="announcement" aria-label="Thoughtful gifts, delivered with care. Fast, reliable, professional.">
      <div className="announcement-track" aria-hidden="true">{[0, 1, 2, 3].map(n => <span className="announcement-group" key={n}><span>Thoughtful gifts, delivered with care.</span><b>✦</b><span>FAST · RELIABLE · PROFESSIONAL</span><b>✦</b></span>)}</div>
    </div>
    <header className={`site-header ${mobileNav ? 'nav-drawer-open' : ''}`}>
      <button className="mobile-menu-btn icon-btn" aria-expanded={mobileNav} onClick={() => { setMobileNav(!mobileNav); setMoreOpen(false); setShopOpen(false); setMobileSearchOpen(false); }} aria-label="Toggle navigation">{mobileNav ? <X /> : <Menu />}</button>
      <button className="brand" onClick={() => go('home')} aria-label="Godfirstgiftshopworldwide home"><span className="brand-mark"><Gift size={24} /></span><span><b>GOD FIRST</b><i>Gift Shop Worldwide</i></span></button>

      <nav className={`main-nav ${mobileNav ? 'mobile-open' : ''}`} aria-label="Main navigation">
        <div className="mobile-nav-head"><span><b>GOD FIRST</b><small>Gift Shop Worldwide</small></span><button type="button" className="mobile-nav-close" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={21}/></button></div>
        <button className={page === 'home' ? 'nav-active' : ''} onClick={() => { setMoreOpen(false); setShopOpen(false); go('home'); }}>Home</button>
        <button className={`desktop-shop-link ${page === 'shop' ? 'nav-active' : ''}`} onClick={() => { setMoreOpen(false); go('shop'); }}>Shop</button>
        <div className={`nav-dropdown mobile-shop-dropdown ${shopOpen ? 'dropdown-open' : ''}`}>
          <button type="button" className={`nav-dropdown-trigger ${page === 'shop' ? 'nav-active' : ''}`} aria-expanded={shopOpen} onClick={() => { setShopOpen(v => !v); setMoreOpen(false); }}>
            Shop <ChevronDown size={13} />
          </button>
          {shopOpen && <div className="nav-dropdown-menu shop-dropdown-menu">
            <button type="button" className="all-gifts-menu-link" onClick={() => openCollection('all')}>All gifts <ArrowRight size={13} /></button>
            {categories.map(c => <div className={`collection-menu-item ${expandedCollection === c.id ? 'collection-expanded' : ''}`} key={c.id}>
              <div className="collection-menu-row">
                <button type="button" onClick={() => openCollection(c.id)}>{c.emoji ? <span className="collection-emoji">{c.emoji}</span> : null}<span>{c.name}</span></button>
                {(c.subcategories || []).length > 0 && <button type="button" className="collection-expand-btn" aria-label={`Show ${c.name} subcollections`} aria-expanded={expandedCollection === c.id} onClick={() => setExpandedCollection(v => v === c.id ? '' : c.id)}><ChevronDown size={13} /></button>}
              </div>
              {expandedCollection === c.id && (c.subcategories || []).length > 0 && <div className="nested-collection-menu">{c.subcategories.map(sub => <button type="button" key={sub.id} onClick={() => openCollection(c.id, sub.id)}>{sub.name}</button>)}</div>}
            </div>)}
          </div>}
        </div>
        {links.slice(1).map(([key, label]) => <button key={key} className={page === key ? 'nav-active' : ''} onClick={() => { setMoreOpen(false); setShopOpen(false); go(key); }}>{label}</button>)}
        {isAdmin && <button className={page === 'admin' ? 'nav-active admin-nav-link' : 'admin-nav-link'} onClick={() => { setMoreOpen(false); setShopOpen(false); openAdmin(); }}>Admin</button>}
        <div className={`nav-dropdown ${moreOpen ? 'dropdown-open' : ''}`}>
          <button type="button" className={`nav-dropdown-trigger ${extraLinks.some(([key]) => key === page) ? 'nav-active' : ''}`} aria-expanded={moreOpen} onClick={() => { setMoreOpen(v => !v); setShopOpen(false); }}>More <ChevronDown size={13} /></button>
          {moreOpen && <div className="nav-dropdown-menu">{extraLinks.map(([key, label]) => <button type="button" key={key} className={page === key ? 'nav-active' : ''} onClick={() => { setMoreOpen(false); setMobileNav(false); go(key); }}>{label}</button>)}</div>}
        </div>
        <div className="mobile-auth-panel">
          {user ? <>
            <div className="mobile-auth-status"><span className="mobile-auth-dot"/><span><strong>Signed in</strong><small>{user.email || 'Your account'}</small></span></div>
            <button type="button" className="mobile-auth-action" onClick={() => { setMobileNav(false); go('account'); }}><UserRound size={16}/> My account</button>
            <button type="button" className="mobile-auth-action mobile-signout-action" onClick={async () => { setMobileNav(false); await onSignOut?.(); }}><LogOut size={16}/> Sign out</button>
          </> : <>
            <div className="mobile-auth-status"><span className="mobile-auth-dot mobile-auth-dot-off"/><span><strong>Not signed in</strong><small>Sign in to view your account and orders.</small></span></div>
            <button type="button" className="mobile-auth-action mobile-signin-action" onClick={() => { setMobileNav(false); openAuth('customer'); }}><UserRound size={16}/> Sign in / Create account</button>
          </>}
        </div>
      </nav>

      <div className="header-actions">
        <form className={`header-search ${mobileSearchOpen ? 'mobile-search-open' : ''}`} onSubmit={submitSearch} role="search">
          <Search size={16} />
          <input ref={searchInputRef} aria-label="Search gifts" placeholder="Search gifts and collections..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setMobileSearchOpen(false); }} />
          <button type="submit" className="search-submit" aria-label="Show search results">Search</button>
          {mobileSearchOpen && query && <button type="button" className="search-clear" aria-label="Clear search" onClick={() => { setQuery(''); searchInputRef.current?.focus(); }}><X size={15} /></button>}
        </form>
        <button className={`icon-btn mobile-search-toggle ${mobileSearchOpen ? 'search-toggle-active' : ''}`} aria-label={mobileSearchOpen ? 'Close gift search' : 'Open gift search'} aria-expanded={mobileSearchOpen} onClick={() => { setMobileSearchOpen(v => !v); setMobileNav(false); setMoreOpen(false); setShopOpen(false); }}><Search size={19} /></button>
        <button className="icon-btn" aria-label="Wishlist" onClick={() => go('wishlist')}><Heart size={19} />{wishlistCount > 0 && <span className="tiny-count">{wishlistCount}</span>}</button>
        <button className="icon-btn account-header-action" aria-label={user ? 'My account, signed in' : 'Sign in or create account'} onClick={() => user ? go('account') : openAuth('customer')} title={user ? `Signed in as ${user.email || 'customer'}` : 'Sign in / create account'}><UserRound size={19}/><span className="account-action-label">{user ? 'Account' : 'Sign in'}</span>{user && <span className="account-initial">{(user.displayName || user.email || 'U').trim().charAt(0).toUpperCase()}</span>}</button>
        <button className="bag-btn" onClick={openCart}><ShoppingBag size={17} /><span>Bag</span><b>{cartCount}</b></button>
        {isAdmin && <button className="icon-btn admin-shortcut" aria-label="Store administration" onClick={openAdmin}><LayoutDashboard size={17} /></button>}
      </div>
    </header>
  </>;
}
