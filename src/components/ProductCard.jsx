import React from 'react';
import { Heart, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { money } from '../data/catalog.js';

export default function ProductCard({ product, categoryName, onOpen, onAdd, isWished, onWish, isCompared, onCompare }) {
  const badge = product.autoBadge !== undefined ? product.autoBadge : (product.promotionLabel || product.tag || '');
  return <article className="product-card">
    <div className={`product-art ${product.tone || 'blush'}`}>
      {badge && <span className={`product-tag ${product.promotionId ? 'product-tag-sale' : ''}`}>{badge}</span>}
      <button className={`wish-btn ${isWished(product.id) ? 'wished' : ''}`} aria-label={isWished(product.id) ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => onWish(product.id)}><Heart size={17} fill={isWished(product.id) ? 'currentColor' : 'none'} /></button>
      <button className="product-art-button" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; const fallback = e.currentTarget.parentElement.querySelector('.product-fallback'); if (fallback) fallback.style.display = 'grid'; }} /> : null}
        <span className="product-fallback" style={{ display: product.image ? 'none' : 'grid' }}>{product.emoji || '🎁'}</span>
        <span className="art-caption">GODFIRSTGIFTSHOPWORLDWIDE</span>
        <span className="quick-view">Quick view <ArrowUpRight size={14}/></span>
      </button>
    </div>
    <div className="product-info">
      <p className="eyebrow">{categoryName(product.category)}</p>
      <button className="product-name product-name-button" onClick={() => onOpen(product)}>{product.name}</button>
      <div className="price-row"><strong>{money(product.price)}</strong>{product.oldPrice > product.price && <del>{money(product.oldPrice)}</del>}</div>
      <div className="product-card-actions"><button className="add-btn" onClick={() => onAdd(product)} disabled={Number(product.stock) <= 0}><ShoppingBag size={15}/>{Number(product.stock) <= 0 ? 'Out of stock' : 'Add to bag'}</button></div>
    </div>
  </article>;
}
