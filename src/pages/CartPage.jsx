import React from 'react';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { money } from '../data/catalog.js';

export default function CartPage({ cart, total, qty, go, openProduct }) {
  const count = cart.reduce((n, p) => n + p.qty, 0);
  return <main className="container page-main cart-page">
    <div className="page-title"><p className="eyebrow">YOUR LITTLE COLLECTION</p><h1>Your shopping bag.</h1><p>Take one last look at your gifts before checkout.</p></div>
    {cart.length ? <>
      <div className="cart-progress" aria-label="Checkout progress"><span className="is-current">1 <b>Your bag</b></span><i/><span>2 <b>Delivery</b></span><i/><span>3 <b>Payment</b></span></div>
      <div className="cart-page-layout"><div className="cart-page-items">{cart.map(item => <article className="cart-page-item" key={item.id}>
        <button className="cart-product-image" onClick={() => openProduct(item)} aria-label={`View ${item.name}`}><img src={item.image} alt={item.name}/><span>View gift</span></button>
        <div className="cart-page-item-copy"><button className="cart-product-title" onClick={() => openProduct(item)}>{item.name}</button><p>{item.description}</p><strong className="cart-item-price">{money(item.price)}</strong>
          <div className="cart-item-actions"><div className="quantity-control"><button onClick={() => qty(item.id,-1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{item.qty}</span><button onClick={() => qty(item.id,1)} aria-label="Increase quantity"><Plus size={14}/></button></div><button className="cart-remove" onClick={() => qty(item.id,-item.qty)}><Trash2 size={14}/> Remove</button><strong className="cart-line-total">{money(item.price * item.qty)}</strong></div>
        </div></article>)}</div>
        <aside className="order-summary cart-summary"><h2>Order summary</h2><div className="summary-line"><span>Items ({count})</span><strong>{money(total)}</strong></div><div className="summary-line"><span>Delivery</span><span>Confirmed after order</span></div><div className="summary-total"><span>Subtotal</span><strong>{money(total)}</strong></div><p>Delivery options and any applicable charges will be confirmed before your order is fulfilled.</p><button className="btn btn-primary" onClick={() => go('checkout')}>Continue to checkout <ArrowRight size={16}/></button><button className="cart-continue" onClick={() => go('shop')}><ArrowLeft size={14}/> Continue shopping</button><div className="cart-trust-note"><ShoppingBag size={16}/><span>Your bag stays saved while you browse.</span></div></aside>
      </div>
    </> : <div className="empty-state"><ShoppingBag size={32}/><h3>Your bag is empty</h3><p>Find a thoughtful gift for someone special.</p><button className="btn btn-primary" onClick={() => go('shop')}>Explore gifts</button></div>}
  </main>;
}
