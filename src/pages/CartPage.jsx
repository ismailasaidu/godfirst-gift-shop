import React from 'react';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft, Globe2 } from 'lucide-react';
import { money } from '../data/catalog.js';
import { displayPrice } from '../lib/currency.js';

export default function CartPage({ cart, total, qty, go, openProduct, user }) {
  const count = cart.reduce((n, p) => n + p.qty, 0);
  return <main className="container page-main cart-page">
    <div className="page-title"><p className="eyebrow">YOUR LITTLE COLLECTION</p><h1>Your shopping bag.</h1><p>Take one last look at your gifts before checkout.</p></div>
    {cart.length ? <>
      <section className="regional-currency-prompt cart-currency-prompt" aria-label="Set your shopping currency">
        <div className="regional-currency-prompt-icon"><Globe2 size={19}/></div>
        <div className="regional-currency-prompt-copy">
          <strong>Prefer to shop in your home currency?</strong>
          <span>{user ? 'Choose your home country in your account. We will automatically match its currency.' : 'Sign in and choose your home country in your account. We will automatically match its currency.'}</span>
        </div>
        <button type="button" className="regional-currency-prompt-link" onClick={() => go('account')}>
          {user ? 'Set country' : 'Sign in'} <ArrowRight size={15}/>
        </button>
      </section>
      <div className="cart-progress" aria-label="Checkout progress"><span className="is-current">1 <b>Your bag</b></span><i/><span>2 <b>Delivery</b></span><i/><span>3 <b>Payment</b></span></div>
      <div className="cart-page-layout"><div className="cart-page-items">{cart.map(item => <article className="cart-page-item" key={item.cartLineId||item.id}>
        <button className="cart-product-image" onClick={() => openProduct(item)} aria-label={`View ${item.name}`}><img src={item.image} alt={item.name}/><span>View gift</span></button>
        <div className="cart-page-item-copy"><button className="cart-product-title" onClick={() => openProduct(item)}>{item.name}</button><p>{item.description}</p>{item.selectedSize&&<small className="cart-selected-size">Size: <strong>{item.selectedSize}</strong></small>}<strong className="cart-item-price">{displayPrice(item.price)}</strong>
          <div className="cart-item-actions"><div className="quantity-control"><button onClick={() => qty(item.cartLineId||item.id,-1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{item.qty}</span><button onClick={() => qty(item.cartLineId||item.id,1)} aria-label="Increase quantity"><Plus size={14}/></button></div><button className="cart-remove" onClick={() => qty(item.cartLineId||item.id,-item.qty)}><Trash2 size={14}/> Remove</button><strong className="cart-line-total">{displayPrice(item.price * item.qty)}</strong></div>
        </div></article>)}</div>
        <aside className="order-summary cart-summary"><h2>Order summary</h2><div className="summary-line"><span>Items ({count})</span><strong>{displayPrice(total)}</strong></div><div className="summary-line"><span>Delivery</span><span>Confirmed after order</span></div><div className="summary-total"><span>Subtotal</span><strong>{displayPrice(total)}</strong></div><p>Delivery options and any applicable charges will be confirmed before your order is fulfilled.</p><button className="btn btn-primary" onClick={() => go('checkout')}>Continue to checkout <ArrowRight size={16}/></button><button className="cart-continue" onClick={() => go('shop')}><ArrowLeft size={14}/> Continue shopping</button><div className="cart-trust-note"><ShoppingBag size={16}/><span>Your bag stays saved while you browse.</span></div></aside>
      </div>
    </> : <div className="empty-state"><ShoppingBag size={32}/><h3>Your bag is empty</h3><p>Find a thoughtful gift for someone special.</p><button className="btn btn-primary" onClick={() => go('shop')}>Explore gifts</button></div>}
  </main>;
}
