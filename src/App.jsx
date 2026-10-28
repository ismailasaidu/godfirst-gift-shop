import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification, reload } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, serverTimestamp, where } from 'firebase/firestore';
import './styles.css';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, SUBCATEGORIES, money, slug, readStore } from './data/catalog.js';
import { auth, db, firebaseConfigured } from './lib/firebase.js';
import { loadSharedStore, syncCollectionChanges, importLocalStore, saveCustomerOrder } from './lib/storeRepository.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import ProductCard from './components/ProductCard.jsx';
import HomePage from './pages/HomePage.jsx';
import ShopPage from './pages/ShopPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import { WishlistPage } from './pages/SavedPages.jsx';
import GiftFinderPage from './pages/GiftFinderPage.jsx';
import CustomGiftPage from './pages/CustomGiftPage.jsx';
import CheckoutPage, { CartDrawer } from './pages/CheckoutPage.jsx';
import CartPage from './pages/CartPage.jsx';
import TrackingPage from './pages/TrackingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminPage from './pages/admin/AdminPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import DeliveryPage from './pages/DeliveryPage.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import { PrivacyPage, TermsPage } from './pages/LegalPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Use one known-authorized continuation domain in production. This avoids Firebase
// rejecting verification/reset emails when the storefront is opened via www or a preview URL.
const getAuthContinueUrl = (path) => {
 const host = window.location.hostname;
 const isLocal = host === 'localhost' || host === '127.0.0.1';
 const base = isLocal ? window.location.origin : 'https://godfirstgiftshopworldwide.com';
 return new URL(path, base).toString();
};
import { LoaderCircle, Gift } from 'lucide-react';
import AuthActionPage from './pages/AuthActionPage.jsx';
import GiftAssistant from './components/GiftAssistant.jsx';

const ROUTES = { home:'/', admin:'/admin', shop:'/shop', services:'/services', customGift:'/custom-gifts', giftFinder:'/gift-finder', wishlist:'/wishlist', cart:'/cart', checkout:'/checkout', tracking:'/track-order', about:'/about', faq:'/faq', contact:'/contact', account:'/account', delivery:'/delivery-information', confirmation:'/order-confirmation', privacy:'/privacy-policy', terms:'/terms' };
const routeFromPath = path => { const clean = path.replace(/\/$/,'') || '/'; if (clean.startsWith('/product/')) return clean.split('/')[2] ? 'product' : 'notFound'; return Object.keys(ROUTES).find(key => ROUTES[key] === clean) || 'notFound'; };
const read = (key, fallback) => readStore(key, fallback);
export default function App() {
 const [categories,setCategories]=useState(()=>{const saved=read('gfg_categories',null);if(Array.isArray(saved))return saved.map(item=>({...item,subcategories:Array.isArray(item.subcategories)?item.subcategories:(SUBCATEGORIES[item.id]||[])}));return DEFAULT_CATEGORIES.map(item=>({...item,subcategories:SUBCATEGORIES[item.id]||item.subcategories||[]}));});
 const [products,setProducts]=useState(()=>{const saved=read('gfg_products',null);return Array.isArray(saved)?saved:DEFAULT_PRODUCTS;});
 const [orders,setOrders]=useState(()=>read('gfg_orders',[]));
 const [homeContent,setHomeContent]=useState(()=>read('gfg_home_content',{headline:'Send a little love their way.',subheadline:'Thoughtful gifts for the people who matter, delivered across borders with care. Find something lovely for every person and every occasion.',announcement:'MAKE DISTANCE FEEL SMALLER'}));
 const [recentOrder,setRecentOrder]=useState(()=>read('gfg_recent_order',null));
 const [cart,setCart]=useState(()=>read('gfg_cart',[]));
 const [wishlist,setWishlist]=useState(()=>read('gfg_guest_wishlist',read('gfg_wishlist',[])));
 const [wishlistOwnerUid,setWishlistOwnerUid]=useState(null);
 const [page,setPage]=useState(()=>routeFromPath(window.location.pathname));
 const [pendingReturnTo,setPendingReturnTo]=useState(()=>{try{return sessionStorage.getItem('gfg_auth_return_to')||'';}catch{return '';}});
 const [siteLoading,setSiteLoading]=useState(true);
 const [authReady,setAuthReady]=useState(false);
 const [isAdmin,setIsAdmin]=useState(false);
 const [roleLoading,setRoleLoading]=useState(false);
 const [adminRoleError,setAdminRoleError]=useState('');
 const [selectedProduct,setSelectedProduct]=useState(null);
 const [category,setCategory]=useState('all'); const [subcategory,setSubcategory]=useState('all'); const [query,setQuery]=useState(''); const [sort,setSort]=useState('featured');
 const [mobileNav,setMobileNav]=useState(false); const [cartOpen,setCartOpen]=useState(false); const [adminOpen,setAdminOpen]=useState(false);
 const [toast,setToast]=useState(null);
 const notify=useCallback((message,type='success')=>setToast({message,type}),[]); const [user,setUser]=useState(null); const [emailVerified,setEmailVerified]=useState(false); const [verificationBusy,setVerificationBusy]=useState(false); const [verificationNotice,setVerificationNotice]=useState('');
 const [authOpen,setAuthOpen]=useState(false); const [authMode,setAuthMode]=useState('login'); const [authIntent,setAuthIntent]=useState('customer');
 const [authForm,setAuthForm]=useState({email:'',password:'',confirmPassword:''}); const [authError,setAuthError]=useState(''); const [authSuccess,setAuthSuccess]=useState(''); const [authBusy,setAuthBusy]=useState(false);
 const [checkout,setCheckout]=useState({name:'',email:'',phone:'',address:'',addressLine2:'',city:'',state:'',postalCode:'',country:'',note:'',deliveryMethod:'normal'});
 const [trackRef,setTrackRef]=useState(''); const [trackingResult,setTrackingResult]=useState(null);
 const refreshAdminRole=useCallback(async currentUser=>{
  setRoleLoading(true);
  setAdminRoleError('');
  try {
   if(!currentUser){setIsAdmin(false);return false;}
   if(!db){setIsAdmin(false);setAdminRoleError('Firebase is not configured, so administrator access cannot be checked. Check .env.local and restart Netlify.');return false;}
   const normalizedEmail=String(currentUser.email||'').trim().toLowerCase();
   const snap=await getDoc(doc(db,'admins',currentUser.uid));
   const role=snap.exists()?snap.data():null;
   const roleEmail=String(role?.email||'').trim().toLowerCase();
   let allowed=Boolean(role?.active===true && (!roleEmail || roleEmail===normalizedEmail));
   // Recovery path for admin records created with an email-based document ID instead of the UID.
   // Access is still granted only when an active admin record explicitly matches this signed-in email.
   if(!allowed && normalizedEmail){
    try {
     const matches=await getDocs(query(collection(db,'admins'),where('email','==',normalizedEmail)));
     allowed=matches.docs.some(item=>{const data=item.data();return data?.active===true && String(data?.email||'').trim().toLowerCase()===normalizedEmail;});
    } catch(queryError) {
     console.warn('Email-based admin lookup was unavailable; UID-based check was used:',queryError);
    }
   }
   setIsAdmin(allowed);
   if(!allowed){
    if(!snap.exists()) setAdminRoleError('No admins document was found for this account UID. In Firestore, create admins/' + currentUser.uid + ' with active set to the Boolean true and email set to ' + normalizedEmail + '.');
    else if(role?.active!==true) setAdminRoleError('Your admins document exists, but its active field must be the Boolean true (not the text "true").');
    else if(roleEmail && roleEmail!==normalizedEmail) setAdminRoleError('The email in your admins document does not match the signed-in email. Check spelling and spaces.');
    else setAdminRoleError('Firebase did not confirm administrator access. Check Firestore permissions and the admins document.');
   }
   return allowed;
  } catch(error) {
   console.error('Admin role check failed:',error);
   setIsAdmin(false);
   setAdminRoleError(error?.code==='permission-denied'?'Firebase rules denied the admin-role check. Allow the signed-in user to read their own admins/{uid} role document.':(error?.message||'Could not check administrator access.'));
   return false;
  } finally { setRoleLoading(false); }
 },[]);
 useEffect(()=>{ if(!auth){setAuthReady(true);return;} return onAuthStateChanged(auth,async currentUser=>{setUser(currentUser);setEmailVerified(Boolean(currentUser?.emailVerified));await refreshAdminRole(currentUser);setAuthReady(true);}); },[refreshAdminRole]);
 useEffect(()=>{if(!auth)return;const refreshCurrentUser=async()=>{const current=auth.currentUser;if(!current)return;try{await reload(current);setUser(auth.currentUser);setEmailVerified(Boolean(auth.currentUser?.emailVerified));await refreshAdminRole(auth.currentUser);}catch(error){console.warn('Could not refresh authentication state:',error);}};const onFocus=()=>{if(document.visibilityState==='visible')refreshCurrentUser();};window.addEventListener('focus',onFocus);document.addEventListener('visibilitychange',onFocus);return()=>{window.removeEventListener('focus',onFocus);document.removeEventListener('visibilitychange',onFocus);};},[refreshAdminRole]);
 useEffect(()=>{ if(!firebaseConfigured||!db||!authReady)return; let cancelled=false; (async()=>{try{const shared=await loadSharedStore({includeHidden:isAdmin,ownerUid:user?.uid});if(cancelled)return;if(shared.categories?.length)setCategories(shared.categories);if(shared.products?.length)setProducts(shared.products);if(shared.orders?.length)setOrders(shared.orders);if(db){const settingsSnap=await getDoc(doc(db,'storeSettings','main'));if(!cancelled&&settingsSnap.exists()&&settingsSnap.data().homeContent)setHomeContent(settingsSnap.data().homeContent);}}catch(error){console.warn('Shared store data is not available yet; keeping local catalogue:',error);}})();return()=>{cancelled=true;}; },[authReady,isAdmin,user?.uid]);
 useEffect(()=>{if(!firebaseConfigured||!db||!authReady)return;let live=true;const unsubscribers=[];const applySnapshot=(kind,snapshot)=>{if(!live)return;const items=snapshot.docs.map(item=>({id:item.id,...item.data()}));if(kind==='categories'){if(items.length)setCategories(items);}else if(items.length)setProducts(items);};try{unsubscribers.push(onSnapshot(collection(db,'categories'),snapshot=>applySnapshot('categories',snapshot),error=>console.warn('Shared categories live sync unavailable:',error.message)));const productSource=isAdmin?collection(db,'products'):query(collection(db,'products'),where('published','==',true));unsubscribers.push(onSnapshot(productSource,snapshot=>applySnapshot('products',snapshot),error=>console.warn('Shared products live sync unavailable:',error.message)));}catch(error){console.warn('Could not start shared catalogue live sync:',error.message);}return()=>{live=false;unsubscribers.forEach(unsubscribe=>unsubscribe());};},[authReady,isAdmin]);
 useEffect(()=>{if(!firebaseConfigured||!db||!authReady||!isAdmin)return;let firstSnapshot=true;const unsubscribe=onSnapshot(collection(db,'orders'),snapshot=>{const next=snapshot.docs.map(item=>({id:item.id,...item.data()}));setOrders(current=>{const byId=new Map(current.map(order=>[String(order.id),order]));for(const order of next)byId.set(String(order.id),{...(byId.get(String(order.id))||{}),...order});return [...byId.values()].sort((a,b)=>(new Date(b.date||b.createdAt||0).getTime()||0)-(new Date(a.date||a.createdAt||0).getTime()||0));});if(firstSnapshot){firstSnapshot=false;return;}for(const change of snapshot.docChanges()){if(change.type!=='added')continue;const order={id:change.doc.id,...change.doc.data()};const title=`New order ${order.id}`;const body=`${order.customer?.name||'Customer'} · ${money(Number(order.total||0))}`;if(localStorage.getItem('gfg_browser_order_notifications')!=='false'){notify(`${title} — ${body}`,'info');if('Notification'in window&&Notification.permission==='granted'){try{new Notification(title,{body,tag:order.id});}catch{}}}}},error=>console.warn('Live admin order notifications unavailable:',error.message));return()=>unsubscribe();},[authReady,isAdmin,notify]);
 useEffect(()=>{ const id=window.setTimeout(()=>setSiteLoading(false),650); return ()=>window.clearTimeout(id); },[]);
 useEffect(()=>{ document.documentElement.scrollTop=0; document.body.scrollTop=0; },[]);
 useEffect(()=>{
  const pageSeo={
   home:{title:'Online Gift Shop Nigeria & Worldwide | God First Gift Shop',description:'Shop birthday gifts, flowers, cakes, hampers and personalised gifts online in Nigeria and selected destinations worldwide at God First Gift Shop.'},
   shop:{title:'Shop Gifts Online | Birthday Gifts, Flowers & Hampers',description:'Browse gifts online from God First Gift Shop Worldwide: birthday gifts, flowers, cakes, hampers, personalised gifts and thoughtful surprises for special occasions.'},
   services:{title:'Gift Delivery & Gifting Services | God First Gift Shop',description:'Explore gift delivery assistance and gifting services from God First Gift Shop Worldwide. Contact us to confirm availability, destination and delivery details.'},
   about:{title:'About God First Gift Shop Worldwide',description:'Meet God First Gift Shop Worldwide and discover our approach to thoughtful gifting, celebrations and helping people feel remembered.'},
   contact:{title:'Contact God First Gift Shop | Gift & Order Support',description:'Contact God First Gift Shop Worldwide for gift recommendations, order enquiries, delivery questions and customer support.'},
   faq:{title:'Gift Shop FAQs | Orders, Payments & Delivery',description:'Find answers about shopping, payments, order confirmations, delivery and tracking at God First Gift Shop Worldwide.'},
   delivery:{title:'Gift Delivery Information | God First Gift Shop Worldwide',description:'Review delivery information and contact God First Gift Shop Worldwide to confirm delivery options, timing and charges for your destination.'},
   privacy:{title:'Privacy Policy | God First Gift Shop Worldwide',description:'Read how God First Gift Shop Worldwide handles information when you browse, create an account or place an order.'},
   terms:{title:'Terms & Conditions | God First Gift Shop Worldwide',description:'Read the terms and conditions for using God First Gift Shop Worldwide and placing orders.'},
   giftFinder:{title:'Find the Perfect Gift | God First Gift Finder',description:'Find gift ideas by recipient, occasion and budget with the God First Gift Finder.'}
  };
  const pathProductId=decodeURIComponent(window.location.pathname.split('/')[2]||'');
  const seoProduct=page==='product'?(selectedProduct||products.find(p=>String(p.id)===pathProductId)):null;
  const meta=seoProduct?{title:`${seoProduct.name} | Buy Online | God First Gift Shop`,description:String(seoProduct.description||`Shop ${seoProduct.name} online at God First Gift Shop Worldwide.`).replace(/\s+/g,' ').slice(0,155)}:(pageSeo[page]||{title:'God First Gift Shop Worldwide | Thoughtful Gifts',description:'Shop birthday gifts, flowers, cakes, hampers and personalised gifts at God First Gift Shop Worldwide.'});
  const origin='https://godfirstgiftshopworldwide.com';
  const canonicalUrl=`${origin}${seoProduct?`/product/${encodeURIComponent(seoProduct.id)}`:(ROUTES[page]||'/')}`;
  const setMeta=(selector,attribute,value,create)=>{let element=document.querySelector(selector);if(!element){element=document.createElement(create||'meta');if(create==='link')element.rel='canonical';else if(selector.includes('property='))element.setAttribute('property',selector.match(/property="([^"]+)/)?.[1]||'');else if(selector.includes('name='))element.name=selector.match(/name="([^"]+)/)?.[1]||'';document.head.appendChild(element);}element.setAttribute(attribute,value);};
  document.title=meta.title;
  setMeta('meta[name="description"]','content',meta.description);
  setMeta('link[rel="canonical"]','href',canonicalUrl,'link');
  setMeta('meta[property="og:title"]','content',meta.title);
  setMeta('meta[property="og:description"]','content',meta.description);
  setMeta('meta[property="og:url"]','content',canonicalUrl);
  setMeta('meta[property="og:type"]','content',seoProduct?'product':'website');
  setMeta('meta[property="og:image"]','content',seoProduct?.image||`${origin}/images/hero-cake.jpeg`);
  setMeta('meta[name="twitter:card"]','content','summary_large_image');
  setMeta('meta[name="twitter:title"]','content',meta.title);
  setMeta('meta[name="twitter:description"]','content',meta.description);
  const robotsMeta=document.querySelector('meta[name="robots"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{name:'robots'}));
  robotsMeta.content=['admin','account','cart','checkout','tracking','wishlist','confirmation'].includes(page)||page==='notFound'?'noindex,nofollow':'index,follow,max-image-preview:large';
  const schema=seoProduct?{
   '@context':'https://schema.org','@type':'Product','name':seoProduct.name,'description':String(seoProduct.description||'').slice(0,1000),'image':seoProduct.image?[seoProduct.image]:undefined,'sku':String(seoProduct.id),'brand':{'@type':'Brand','name':'God First Gift Shop Worldwide'},
   'offers':{'@type':'Offer','url':canonicalUrl,'priceCurrency':'NGN','price':Number(seoProduct.price||0).toFixed(2),'availability':Number(seoProduct.stock)>0?'https://schema.org/InStock':'https://schema.org/OutOfStock','itemCondition':'https://schema.org/NewCondition'}
  }:{'@context':'https://schema.org','@type':'OnlineStore','@id':`${origin}/#store`,'name':'God First Gift Shop Worldwide','url':origin,'description':'Online gift shop for birthday gifts, flowers, cakes, hampers and personalised gifts.','image':`${origin}/images/hero-cake.jpeg`,'email':'support@godfirstgiftshopworldwide.com','currenciesAccepted':'NGN','areaServed':'Worldwide','sameAs':[]};
  let jsonLd=document.querySelector('script[data-gfg-seo-schema]');if(!jsonLd){jsonLd=document.createElement('script');jsonLd.type='application/ld+json';jsonLd.dataset.gfgSeoSchema='true';document.head.appendChild(jsonLd);}jsonLd.textContent=JSON.stringify(schema);
 },[page,selectedProduct,products]);
 useEffect(()=>{ const frame=window.requestAnimationFrame(()=>{document.documentElement.scrollTop=0;document.body.scrollTop=0; const active=document.activeElement; if(active && active!==document.body && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) active.blur();}); return ()=>window.cancelAnimationFrame(frame); },[page]);
 useEffect(()=>{localStorage.setItem('gfg_categories',JSON.stringify(categories));},[categories]);
 useEffect(()=>{localStorage.setItem('gfg_products',JSON.stringify(products));},[products]);
 useEffect(()=>{localStorage.setItem('gfg_cart',JSON.stringify(cart));},[cart]);
 // Guest wishlists remain local. Signed-in wishlists are loaded from and synced to the customer's Firestore profile.
 useEffect(()=>{if(!authReady)return;if(!user?.uid){try{if(wishlistOwnerUid){localStorage.removeItem('gfg_wishlist');setWishlist(read('gfg_guest_wishlist',[]));setWishlistOwnerUid(null);}else{localStorage.setItem('gfg_guest_wishlist',JSON.stringify(wishlist));localStorage.removeItem('gfg_wishlist');}}catch{}return;}if(wishlistOwnerUid!==user.uid)return;try{localStorage.setItem('gfg_wishlist',JSON.stringify(wishlist));}catch{}},[wishlist,authReady,user?.uid,wishlistOwnerUid]);
 useEffect(()=>{let cancelled=false;if(!authReady)return;const uid=user?.uid;if(!uid){setWishlistOwnerUid(null);setWishlist(read('gfg_guest_wishlist',[]));return;}if(!db){notify('Wishlist account sync is unavailable because Firebase is not configured.','error');return;}setWishlistOwnerUid(null);(async()=>{try{const profileRef=doc(db,'users',uid);const snap=await getDoc(profileRef);const cloudIds=Array.isArray(snap.data()?.wishlist)?snap.data().wishlist:[];const guestIds=read('gfg_guest_wishlist',read('gfg_wishlist',[]));const merged=[...new Set([...cloudIds,...guestIds].map(String))];await setDoc(profileRef,{uid,email:user.email||'',displayName:user.displayName||'',role:'customer',wishlist:merged,updatedAt:serverTimestamp(),...(snap.exists()?{}:{createdAt:serverTimestamp()})},{merge:true});if(cancelled)return;setWishlist(merged);setWishlistOwnerUid(uid);try{localStorage.removeItem('gfg_guest_wishlist');localStorage.setItem('gfg_wishlist',JSON.stringify(merged));}catch{}}catch(error){console.error('Could not load or merge account wishlist:',error);if(!cancelled)notify('Could not sync your wishlist to your account. Please check your connection and try again.','error');}})();return()=>{cancelled=true;};},[authReady,user?.uid,notify]);
 useEffect(()=>{if(!authReady||!user?.uid||wishlistOwnerUid!==user.uid||!db)return;const timeout=window.setTimeout(()=>{setDoc(doc(db,'users',user.uid),{uid:user.uid,email:user.email||'',displayName:user.displayName||'',role:'customer',wishlist:[...new Set(wishlist.map(String))],updatedAt:serverTimestamp()},{merge:true}).catch(error=>{console.error('Wishlist cloud sync failed:',error);notify('Wishlist changed on this device, but cloud sync failed. Please try again.','error');});},250);return()=>window.clearTimeout(timeout);},[wishlist,authReady,user?.uid,user?.email,user?.displayName,wishlistOwnerUid,notify]);
 useEffect(()=>{localStorage.setItem('gfg_orders',JSON.stringify(orders));},[orders]);
 useEffect(()=>{localStorage.setItem('gfg_home_content',JSON.stringify(homeContent));},[homeContent]);
 useEffect(()=>{if(recentOrder)localStorage.setItem('gfg_recent_order',JSON.stringify(recentOrder));},[recentOrder]);
 useEffect(()=>{if(!toast)return;const id=window.setTimeout(()=>setToast(null),3500);return()=>window.clearTimeout(id);},[toast]);
 useEffect(()=>{const params=new URLSearchParams(window.location.search);if(params.get('verification')==='complete'){if(auth?.currentUser){reload(auth.currentUser).then(()=>{setUser(auth.currentUser);setEmailVerified(Boolean(auth.currentUser?.emailVerified));}).catch(()=>{});}setVerificationNotice('Thanks for verifying your email. Your account status has been refreshed.');notify('Returned from email verification. Your account status has been refreshed.','success');params.delete('verification');const next=`${window.location.pathname}${params.toString()?`?${params.toString()}`:''}${window.location.hash}`;window.history.replaceState(window.history.state,'',next);}} ,[notify]);
 const go=useCallback(next=>{const path=next==='product'&&selectedProduct?`/product/${encodeURIComponent(selectedProduct.id)}`:(ROUTES[next]||'/');if(window.location.pathname!==path)window.history.pushState({page:next},'',path);setPage(next);setMobileNav(false);setCartOpen(false);setAdminOpen(false);document.documentElement.scrollTop=0;document.body.scrollTop=0;},[selectedProduct]);
 useEffect(()=>{if(page!=='checkout'||!authReady||user)return;try{sessionStorage.setItem('gfg_auth_return_to','/checkout');}catch{}setPendingReturnTo('/checkout');if(!authOpen)openAuth('customer');},[page,authReady,user,authOpen]);
 useEffect(()=>{const sync=()=>{const path=window.location.pathname;const next=routeFromPath(path);setPage(next);if(next==='product'){const id=decodeURIComponent(path.split('/')[2]||'');setSelectedProduct(products.find(p=>p.id===id)||null);}else setSelectedProduct(null);setCartOpen(false);setAdminOpen(false);document.documentElement.scrollTop=0;document.body.scrollTop=0;};window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync);},[products]);
 const updateProducts=useCallback(updater=>{const next=typeof updater==='function'?updater(products):updater;const previous=products;setProducts(next);setCart(old=>old.filter(item=>next.some(p=>p.id===item.id)).map(item=>({...item,...next.find(p=>p.id===item.id)})));setWishlist(old=>old.filter(id=>next.some(p=>p.id===id)));if(isAdmin&&db)syncCollectionChanges('products',previous,next).catch(error=>notify(`Product saved locally but cloud sync failed: ${error.message}`,'error'));},[products,isAdmin,notify]);
 const updateCategories=useCallback(updater=>{const next=typeof updater==='function'?updater(categories):updater;const previous=categories;setCategories(next);if(isAdmin&&db)syncCollectionChanges('categories',previous,next).catch(error=>notify(`Category saved locally but cloud sync failed: ${error.message}`,'error'));},[categories,isAdmin,notify]);
 const updateOrders=useCallback(updater=>{const next=typeof updater==='function'?updater(orders):updater;const previous=orders;setOrders(next);if(isAdmin&&db)syncCollectionChanges('orders',previous,next).catch(error=>notify(`Order changes saved locally but cloud sync failed: ${error.message}`,'error'));},[orders,isAdmin,notify]);
 const categoryName=id=>categories.find(c=>c.id===id)?.name||'Gift collection';
 const cartCount=cart.reduce((n,item)=>n+item.qty,0); const total=cart.reduce((n,item)=>n+item.price*item.qty,0); const deliveryMethod=checkout.deliveryMethod==='express'?'express':'normal'; const deliveryFee=cart.reduce((sum,item)=>sum+Math.max(0,Number(item[deliveryMethod==='express'?'expressDeliveryFee':'normalDeliveryFee']||0))*Number(item.qty||1),0); const grandTotal=total+deliveryFee;
 const displayProducts=useMemo(()=>{const sold=new Map();for(const order of orders){const status=String(order?.payment?.verificationStatus||'').toLowerCase();if(order?.status==='Cancelled'||!['manually_confirmed','verified','success','successful'].includes(status))continue;for(const item of order.items||[]){const id=String(item.id||item.productId||'');const qty=Number(item.qty??item.quantity??1);if(id&&Number.isFinite(qty)&&qty>0)sold.set(id,(sold.get(id)||0)+qty);}}return products.map(p=>{const stock=Number(p.stock||0);const created=p.createdAt?.toDate?p.createdAt.toDate():new Date(p.createdAt||0);const isNew=Number.isFinite(created.getTime())&&created.getTime()>0&&(Date.now()-created.getTime())<14*86400000;const isBest=(sold.get(String(p.id))||0)>=3;const autoBadge=p.promotionLabel||(stock>0&&stock<=5?'LOW STOCK':isNew?'NEW ARRIVAL':isBest?'BESTSELLER':'');return {...p,autoBadge,soldCount:sold.get(String(p.id))||0};});},[products,orders]);
 const filtered=useMemo(()=>{const term=query.trim().toLocaleLowerCase();let list=displayProducts.filter(p=>{const cat=categories.find(c=>c.id===p.category);const sub=(cat?.subcategories||SUBCATEGORIES[p.category]||[]).find(item=>item.id===p.subcategory);const searchable=[p.name,p.description,p.tag,p.category,cat?.name,sub?.name,sub?.description,p.subcategory].filter(Boolean).join(' ').toLocaleLowerCase();return p.published!==false&&(category==='all'||p.category===category)&&(subcategory==='all'||p.subcategory===subcategory)&&(!term||searchable.includes(term));});if(sort==='price-low')list=[...list].sort((a,b)=>a.price-b.price);if(sort==='price-high')list=[...list].sort((a,b)=>b.price-a.price);if(sort==='name')list=[...list].sort((a,b)=>a.name.localeCompare(b.name));return list;},[displayProducts,categories,category,subcategory,query,sort]);
 const openProduct=p=>{setSelectedProduct(p);setPage('product');const path=`/product/${encodeURIComponent(p.id)}`;if(window.location.pathname!==path)window.history.pushState({page:'product',id:p.id},'',path);document.documentElement.scrollTop=0;document.body.scrollTop=0;};
 const addCart=p=>{if((p.hasSizes||p.sizes?.length>0)&&!p.selectedSize){openProduct(p);notify('Choose an available size before adding this item to your bag','info');return;}if(Number(p.stock)<=0){notify('This gift is currently out of stock','error');return;}const existing=cart.find(x=>x.id===p.id&&(x.selectedSize||'')===(p.selectedSize||''));if(existing&&existing.qty>=Number(p.stock)){notify('You have reached the available stock for this gift','warning');return;}setCart(old=>{const found=old.find(x=>x.id===p.id&&(x.selectedSize||'')===(p.selectedSize||''));return found?old.map(x=>x.id===p.id&&(x.selectedSize||'')===(p.selectedSize||'')?{...x,qty:Math.min(Number(p.stock),x.qty+1)}:x):[...old,{...p,cartLineId:`${p.id}::${p.selectedSize||'default'}`,qty:1}]});notify('Added to your bag');};
 const qty=(id,change)=>setCart(old=>old.map(item=>{if((item.cartLineId||item.id)!==id)return item;const next=item.qty+change;if(next>Number(item.stock)){notify('That is all the stock currently available','warning');return item;}return {...item,qty:next};}).filter(item=>item.qty>0));
 const toggleWishlist=id=>{setWishlist(old=>{const exists=old.includes(id);notify(exists?'Removed from your wishlist':'Saved to your wishlist','success');return exists?old.filter(x=>x!==id):[...old,id];});};
 const productCardProps={onOpen:openProduct,onAdd:addCart,isWished:id=>wishlist.includes(id),onWish:toggleWishlist};
 const openAuth=intent=>{setAuthIntent(intent);setAuthMode('login');setAuthError('');setAuthSuccess('');setAuthOpen(true);};
 const submitAuth=async e=>{
  e.preventDefault();setAuthError('');setAuthSuccess('');
  if(!firebaseConfigured||!auth){setAuthError('Account services are temporarily unavailable. Please try again later.');return;}
  if(authMode==='signup'&&authForm.password!==authForm.confirmPassword){setAuthError('Your passwords do not match.');return;}
  setAuthBusy(true);
  try{
   if(authMode==='reset'){
    await sendPasswordResetEmail(auth,authForm.email.trim(),{url:getAuthContinueUrl('/account?passwordReset=complete')});
    setAuthSuccess('If an account exists for this address, a password reset email has been sent. Check your inbox and spam folder.');
    setAuthMode('login');setAuthForm(old=>({...old,password:'',confirmPassword:''}));return;
   }
   if(authMode==='signup'){
    const credential=await createUserWithEmailAndPassword(auth,authForm.email.trim(),authForm.password);
    const createdUser=credential.user;
    try{
     await sendEmailVerification(createdUser,{url:getAuthContinueUrl('/account?verification=complete')});
    }catch(sendError){
     console.error('Firebase verification email send failed:',sendError);
     await signOut(auth).catch(()=>{});setUser(null);setEmailVerified(false);setIsAdmin(false);
     const sendMessages={
      'auth/too-many-requests':'Firebase temporarily limited verification emails. Wait a few minutes, then try signing in to request another email.',
      'auth/operation-not-allowed':'Email/password authentication or verification email sending is not enabled correctly in Firebase Authentication.',
      'auth/unauthorized-continue-uri':'Firebase rejected the verification continuation URL. This build uses https://godfirstgiftshopworldwide.com for production links. In Firebase Console → Authentication → Settings → Authorized domains, confirm godfirstgiftshopworldwide.com is listed exactly (without a backslash), then retry.',
      'auth/network-request-failed':'A network problem stopped the verification email from being sent. Check your connection and try again.'
     };
     setAuthError(`Your account was created, but Firebase could not send the verification email. ${sendMessages[sendError?.code]||`Please try signing in again to request a new verification email. (${sendError?.code||'email-send-error'})`}`);
     setAuthMode('login');setAuthForm({email:authForm.email.trim(),password:'',confirmPassword:''});return;
    }
    if(db){try{await setDoc(doc(db,'users',createdUser.uid),{uid:createdUser.uid,email:createdUser.email||authForm.email.trim(),displayName:createdUser.displayName||'',role:'customer',createdAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});}catch(profileError){console.warn('Customer profile could not be saved yet:',profileError);}}
    await signOut(auth);setUser(null);setEmailVerified(false);setIsAdmin(false);
    setAuthSuccess(`Your account has been created. We sent a verification link to ${createdUser.email||authForm.email.trim()}. Open that email and verify your address before signing in. Check Spam/Junk if it doesn't arrive.`);
    setAuthMode('signup');setAuthForm({email:'',password:'',confirmPassword:''});return;
   }
   const credential=await signInWithEmailAndPassword(auth,authForm.email.trim(),authForm.password);
   const current=credential.user;
   if(!current.emailVerified){
    let sent=false;
    try{await sendEmailVerification(current,{url:getAuthContinueUrl('/account?verification=complete')});sent=true;}catch(sendError){console.error('Could not resend verification email during sign-in:',sendError);}
    await signOut(auth).catch(()=>{});setUser(null);setEmailVerified(false);setIsAdmin(false);
    setAuthError(sent?'Your email address is not verified yet, so you are not signed in. We sent you a fresh verification link. Check your inbox and Spam/Junk folder.':'Your email address is not verified yet, so you are not signed in. We could not send another verification email. Wait a few minutes and try again, and check Spam/Junk.');
    return;
   }
   setUser(current);setEmailVerified(true);
   const allowed=await refreshAdminRole(current);
   if(authIntent==='admin'&&!allowed){setAuthError('This account is not authorised to manage the store.');await signOut(auth);setUser(null);setIsAdmin(false);return;}
   setAuthOpen(false);
   if(allowed&&authIntent==='admin'){setAdminOpen(true);notify('Signed in successfully');}
   else notify('You are now signed in','success');
   const savedDestination=(()=>{try{return sessionStorage.getItem('gfg_auth_return_to')||pendingReturnTo;}catch{return pendingReturnTo;}})();
   if(savedDestination==='/checkout'){try{sessionStorage.removeItem('gfg_auth_return_to');}catch{}setPendingReturnTo('');go('checkout');}
   setAuthForm({email:'',password:'',confirmPassword:''});
  }catch(err){
   const messages={
    'auth/api-key-not-valid':'Firebase rejected the web API key. Check the Firebase web app settings configured in Netlify.',
    'auth/invalid-api-key':'Firebase rejected the web API key. Check the Firebase web app configuration.',
    'auth/invalid-credential':'Email or password is incorrect.',
    'auth/wrong-password':'Email or password is incorrect.',
    'auth/user-not-found':'No account was found for that email. Create an account first.',
    'auth/email-already-in-use':'An account already exists with this email. Sign in instead.',
    'auth/invalid-email':'Enter a valid email address.',
    'auth/weak-password':'Choose a stronger password (at least 6 characters).',
    'auth/too-many-requests':'Too many attempts. Wait a little and try again.',
    'auth/network-request-failed':'Network error. Check your internet connection and try again.'
   };
   setAuthError(messages[err.code]||err.message||'We could not complete that request. Please try again.');
  }finally{setAuthBusy(false);}
 };
 const openAdmin=()=>{if(user&&isAdmin){setAdminOpen(true);go('admin');return;}openAuth('admin');};
 const signOutCurrentUser=async()=>{if(auth)await signOut(auth);setUser(null);setEmailVerified(false);setIsAdmin(false);setAdminOpen(false);notify('You have signed out');};
 const resendVerification=async()=>{if(!auth?.currentUser){setVerificationNotice('Please sign in again to resend the verification email.');return;}setVerificationBusy(true);setVerificationNotice('');try{await sendEmailVerification(auth.currentUser,{url:getAuthContinueUrl('/account?verification=complete')});setVerificationNotice(`A new verification link was sent to ${auth.currentUser.email}.`);notify('Verification email sent','success');}catch(error){const message=error.code==='auth/too-many-requests'?'Too many requests. Please wait before trying again.':error.message||'Could not send verification email.';setVerificationNotice(message);notify(message,'error');}finally{setVerificationBusy(false);}};
 const completePayment=async({reference,channel='Paystack',verificationStatus='pending_server_verification',verifiedAmount,chargedAmount,currency,paidAt,orderId,orderSaved,orderSaveMessage,emailNotifications}={})=>{
  if(!cart.length){notify('Your bag is empty','warning');return;}
  const unavailable=cart.find(item=>{const current=products.find(p=>p.id===item.id);return !current||Number(current.stock)<Number(item.qty)||Number(current.stock)<=0;});
  if(unavailable){notify(`${unavailable.name} no longer has enough stock. Please update your bag.`,'error');go('cart');return;}
  const verified=verificationStatus==='verified';
  const order={id:String(orderId||reference||`GFG-${Date.now().toString().slice(-6)}`),date:new Date().toISOString(),customer:checkout,items:cart,subtotal:total,deliveryMethod,deliveryFee,total:grandTotal,payment:{provider:channel,reference:reference||'',verificationStatus,...(verified?{verifiedAmount,chargedAmount,currency,paidAt}: {})},status:verified?'Paid — awaiting fulfilment':'Payment confirmation pending',...(user?.uid?{ownerUid:user.uid}:{})};
  let finalWarning='';
  if(user?.uid&&db&&!orderSaved){try{await saveCustomerOrder(order,user.uid);}catch(error){finalWarning=`Order could not sync to your account yet: ${error.message||'Firebase save failed.'}`;}}
  setOrders(old=>[order,...old.filter(existing=>String(existing.id)!==String(order.id))]);
  if(verified&&!orderSaved){finalWarning=[finalWarning,orderSaveMessage||'Payment was verified, but the order has not synced to the shared admin database. Check server Firebase credentials before fulfilment.'].filter(Boolean).join(' ');}
  // Transactional email notifications are disabled; they do not block checkout.
  setCart([]);setCheckout({name:'',email:'',phone:'',address:'',addressLine2:'',city:'',state:'',postalCode:'',country:'',note:'',deliveryMethod:'normal'});setTrackRef(order.id);setTrackingResult(order);setRecentOrder(order);
  if(finalWarning)notify(`${verified?'Payment verified.':'Order recorded.'} ${finalWarning} Reference: ${String(reference||'')}`,'warning');
  else notify(verified?'Payment verified and order received.':'Payment reference received. Confirmation is pending verification.',verified?'success':'info');
  go('confirmation');
 };
 const trackOrder=e=>{e.preventDefault();const result=orders.find(o=>o.id.toLowerCase()===trackRef.trim().toLowerCase());setTrackingResult(result||null);if(!result)notify('We could not find that order reference','error');};
 const openCategory=id=>{setCategory(id);setSubcategory('all');setQuery('');go('shop');};
 const wishedProducts=products.filter(p=>wishlist.includes(p.id));
 const renderAdminWorkspace=()=> <AdminPage products={products} categories={categories} orders={orders} setProducts={updateProducts} setCategories={updateCategories} setOrders={updateOrders} notify={notify} onClose={()=>{setAdminOpen(false);if(page==='admin')go('home');}} categoryName={categoryName} homeContent={homeContent} setHomeContent={setHomeContent} onImportLocalStore={async()=>{try{await importLocalStore({products,categories,orders});notify('Catalogue and categories copied to the shared database');}catch(error){notify(error.message||'Could not publish catalogue to Firestore','error');}}}/>;
 if(page==='admin'&&isAdmin) return <div className="admin-route-shell">{renderAdminWorkspace()}</div>;
 const actionMode = new URLSearchParams(window.location.search).get('mode');
 if(['verifyEmail','verificationResult','resetPassword','recoverEmail','verifyAndChangeEmail','action'].includes(actionMode) || window.location.pathname.replace(/\/$/,'')==='/auth/action') return <AuthActionPage/>;
 return <div className="app-shell"><Header page={page} go={go} categories={categories} onOpenCategory={(id,sub='all')=>{setCategory(id);setSubcategory(sub);setQuery('');go('shop');}} cartCount={cartCount} wishlistCount={wishlist.length} query={query} setQuery={setQuery} openCart={()=>setCartOpen(true)} openAuth={openAuth} openAdmin={openAdmin} onSignOut={signOutCurrentUser} isAdmin={isAdmin} mobileNav={mobileNav} setMobileNav={setMobileNav} user={user}/>
 <main key={page + (page==='product' ? (selectedProduct?.id||'') : '')} className="page-transition">
 {page==='admin'&&(!authReady||roleLoading)&&<section className="auth-route-message"><LoaderCircle className="admin-upload-spin" size={24}/><h1>Checking administrator access</h1><p>Please wait while we verify your account.</p></section>}{page==='admin'&&authReady&&!roleLoading&&!isAdmin&&<section className="auth-route-message"><h1>Administrator access required</h1><p>Sign in with an authorised store administrator account to open this page.</p><button className="btn btn-primary" onClick={()=>openAuth('admin')}>Administrator sign in</button><button className="btn btn-secondary" onClick={()=>go('home')}>Back to store</button></section>}
 {page==='home'&&<HomePage categories={categories} products={displayProducts} categoryName={categoryName} go={go} openCategory={openCategory} productCardProps={productCardProps} homeContent={homeContent}/>}
 {page==='shop'&&<ShopPage products={filtered} categories={categories} category={category} setCategory={id=>{setCategory(id);setSubcategory('all');}} subcategory={subcategory} setSubcategory={setSubcategory} query={query} setQuery={setQuery} sort={sort} setSort={setSort} categoryName={categoryName} productCardProps={productCardProps}/>}
 {page==='product'&&(selectedProduct||displayProducts.find(p=>p.id===decodeURIComponent(window.location.pathname.split('/')[2]||'')))&&<ProductPage product={selectedProduct||displayProducts.find(p=>p.id===decodeURIComponent(window.location.pathname.split('/')[2]||''))} categoryName={categoryName} go={go} onAdd={addCart} isWished={(selectedProduct||displayProducts.find(p=>p.id===decodeURIComponent(window.location.pathname.split('/')[2]||''))) ? wishlist.includes((selectedProduct||displayProducts.find(p=>p.id===decodeURIComponent(window.location.pathname.split('/')[2]||''))).id) : false} onWish={toggleWishlist}/>}
 {page==='giftFinder'&&<GiftFinderPage products={products} categories={categories} go={go} openProduct={openProduct}/>}
 {page==='customGift'&&<CustomGiftPage go={go}/>}
 {page==='services'&&<ServicesPage/>}
 {page==='about'&&<AboutPage go={go}/> }
 {page==='faq'&&<FAQPage go={go}/> }
 {page==='contact'&&<ContactPage notify={notify}/> }
 {page==='account'&&<AccountPage user={user} orders={orders} go={go} openAuth={openAuth} onSignOut={signOutCurrentUser} emailVerified={emailVerified} onResendVerification={resendVerification} verificationBusy={verificationBusy} verificationNotice={verificationNotice} isAdmin={isAdmin} roleLoading={roleLoading} adminRoleError={adminRoleError} onRefreshAdminRole={() => refreshAdminRole(auth?.currentUser || user)}/>}
 {page==='delivery'&&<DeliveryPage go={go}/>}
 {page==='confirmation'&&<OrderConfirmationPage order={recentOrder} go={go} notify={notify}/>}
 {page==='privacy'&&<PrivacyPage/>}
 {page==='terms'&&<TermsPage/>}
 {page==='wishlist'&&<WishlistPage products={displayProducts.filter(p=>wishlist.includes(p.id))} categoryName={categoryName} productCardProps={productCardProps} go={go}/>}
 {page==='cart'&&<CartPage cart={cart} total={total} qty={qty} go={go} openProduct={openProduct}/>}
 {page==='checkout'&&(user?<CheckoutPage cart={cart} total={total} deliveryFee={deliveryFee} grandTotal={grandTotal} deliveryMethod={deliveryMethod} checkout={checkout} setCheckout={setCheckout} onPaymentSuccess={completePayment} go={go}/>:<section className="auth-route-message"><h1>Sign in to continue</h1><p>Please sign in or create an account to complete your checkout. We'll bring you back here afterwards.</p><button className="btn btn-primary" onClick={()=>openAuth('customer')}>Sign in or create account</button><button className="btn btn-secondary" onClick={()=>go('cart')}>Return to bag</button></section>)}
 {page==='tracking'&&<TrackingPage trackRef={trackRef} setTrackRef={setTrackRef} onTrack={trackOrder} trackingResult={trackingResult}/>}
 {((page==='notFound')||(page==='product'&&!(selectedProduct||displayProducts.find(p=>p.id===decodeURIComponent(window.location.pathname.split('/')[2]||'')))))&&<NotFoundPage go={go}/>}
 </main>
 <Footer go={go}/>
 {cartOpen&&<CartDrawer cart={cart} onClose={()=>setCartOpen(false)} qty={qty} go={go} total={total} openProduct={openProduct}/>}
 {adminOpen&&page!=='admin'&&isAdmin&&renderAdminWorkspace()}
 {authOpen&&<LoginPage onClose={()=>setAuthOpen(false)} onClearSuccess={()=>setAuthSuccess('')} success={authSuccess} mode={authMode} setMode={setAuthMode} intent={authIntent} form={authForm} setForm={setAuthForm} error={authError} busy={authBusy} onSubmit={submitAuth}/>}
 <GiftAssistant products={displayProducts} categories={categories} onOpenProduct={openProduct}/>
 <Toast toast={toast} dismiss={()=>setToast(null)}/>{siteLoading&&<div className="site-loader" role="status" aria-live="polite"><span className="loader-brand"><span className="brand-mark"><Gift size={25}/></span><b>GOD FIRST <i>Gift Shop Worldwide</i></b></span><LoaderCircle className="loader-spinner" size={27}/><span className="loader-caption">Preparing something thoughtful…</span></div>}</div>;
}
