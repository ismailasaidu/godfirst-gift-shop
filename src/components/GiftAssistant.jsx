import React, { useMemo, useState } from 'react';
import { Bot, Gift, MessageCircle, Send, ShoppingBag, Sparkles, X } from 'lucide-react';

const clean = value => String(value || '').toLowerCase();
function localReply(message, products, categories) {
  const q = clean(message);
  const budgetMatch = q.match(/(?:under|below|less than|budget(?: of)?|₦|n)(\s*[\d,]+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/[₦n,\s]/gi, '')) : null;
  const terms = q.split(/[^a-z0-9]+/).filter(word => word.length > 2 && !['the','for','and','with','under','below','gift','gifts','want','need','please','someone','something','looking','find','show','recommend'].includes(word));
  let ranked = (products || []).filter(p => p.published !== false && Number(p.stock) > 0).map(p => {
    const haystack = clean([p.name,p.description,p.tag,p.category,categories?.find(c=>c.id===p.category)?.name,p.subcategory].join(' '));
    let score = terms.reduce((n,t)=>n+(haystack.includes(t)?2:0),0);
    if (budget && Number(p.price) <= budget) score += 2;
    if (/birthday|celebrat/.test(q) && /birthday|cake|balloon|celebrat/.test(haystack)) score += 2;
    if (/romantic|love|anniversary|valentine/.test(q) && /love|rose|romantic|anniversary|heart|couple/.test(haystack)) score += 2;
    if (/baby|newborn|child|kid/.test(q) && /baby|newborn|child|kid|toy|teddy/.test(haystack)) score += 2;
    if (/mum|mother|mom/.test(q) && /mum|mother|mom|flower|care|spa/.test(haystack)) score += 2;
    if (/dad|father/.test(q) && /dad|father|men|man/.test(haystack)) score += 2;
    return { ...p, _score: score };
  }).filter(p => (!budget || Number(p.price) <= budget) && (terms.length === 0 || p._score > 0)).sort((a,b)=>b._score-a._score).slice(0,3);
  if (!ranked.length && budget) ranked = (products||[]).filter(p=>p.published!==false&&Number(p.stock)>0&&Number(p.price)<=budget).sort((a,b)=>a.price-b.price).slice(0,3);
  if (ranked.length) return { text: `Here are ${ranked.length} gift${ranked.length===1?'':'s'} that may suit what you described. Tap a product to see its details. ${budget ? `I kept these within ₦${budget.toLocaleString('en-NG')}.` : ''}`, products: ranked };
  return { text: 'I can help you find something thoughtful. Tell me who the gift is for, the occasion, and your budget (for example: “a birthday gift for my mum under ₦20,000”). I can only recommend items currently listed and in stock in this shop.', products: [] };
}

function offlineReply(message, products, categories) {
  const text = String(message || '').trim();
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const greeting = /^(hi|hello|hey|hey man|hey there|yo|good morning|good afternoon|good evening|how are you|what s up|whats up)(\s|$)/i.test(normalized);
  const affirmation = /^(alright|all right|okay|ok|yeah|yes|sure|lets do that|let s do that|ait|aiit|sounds good|go ahead|let us do that)(\s|$)/i.test(normalized);
  const thanks = /^(thanks|thank you|thank you so much|cheers|nice one)(\s|$)/i.test(normalized);
  const capabilities = /^(help|what can you do|how can you help|what do you do)(\s|\?)*$/i.test(normalized);
  const giftIntent = /\b(gift|present|birthday|anniversary|flowers|flower|cake|hamper|budget|shop|product|buy|price|stock|recommend|occasion|recipient|mum|mom|dad|wife|husband|friend|delivery|gift ideas)\b/i.test(text);
  if (greeting) return { text: 'Hey! 👋 Good to see you. I’m here to help. We can look for gifts in the shop catalogue, or you can ask me a question. What would you like to do?', products: [] };
  if (affirmation) return { text: 'Great, let’s do that! 😊 Tell me what you have in mind. If we’re choosing a gift, share who it’s for, the occasion, and your budget, and I’ll look through the available products.', products: [] };
  if (thanks) return { text: 'You’re welcome! 😊 Want help finding a gift or checking what’s available in the shop?', products: [] };
  if (capabilities) return { text: 'I can help you browse available gifts, compare products and prices, and narrow down options by recipient, occasion, and budget. My live AI service is temporarily unavailable, so I may not be able to answer broader questions until it comes back. What would you like help with?', products: [] };
  if (giftIntent) { const result = localReply(text, products, categories); return { text: result.text, products: result.products }; }
  return { text: 'I’m having trouble connecting to my full AI service right now, but you haven’t done anything wrong. I can still help you browse available gifts and compare their prices. If you wanted to ask a general question, please try again a little later.', products: [] };
}

export default function GiftAssistant({ products = [], categories = [], onOpenProduct }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiAvailable, setAiAvailable] = useState(null);
  const [messages, setMessages] = useState([{ role:'assistant', text:'Hello! I’m your God First AI assistant and gift expert. Who are you shopping for, what’s the occasion, and what budget do you have in mind?' }]);
  const available = useMemo(() => (products||[]).filter(p=>p.published!==false&&Number(p.stock)>0),[products]);
  const send = async e => {
    e?.preventDefault(); const text = input.trim(); if (!text || busy) return;
    setMessages(old=>[...old,{role:'user',text}]); setInput(''); setBusy(true);
    try {
      const response = await fetch('/.netlify/functions/gift-assistant',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:text,history:messages.filter(m=>m.role==='user'||m.role==='assistant').slice(-10).map(m=>({role:m.role,content:m.text})),products:available.slice(0,150).map(p=>({id:p.id,name:p.name,description:p.description||'',category:categories.find(c=>c.id===p.category)?.name||p.category,price:Number(p.price),stock:Number(p.stock),image:p.image||''}))})});
      const data = await response.json().catch(()=>({}));
      if (response.ok && data.reply) { setAiAvailable(true); setMessages(old=>[...old,{role:'assistant',text:data.reply,products:(data.productIds||[]).map(id=>available.find(p=>String(p.id)===String(id))).filter(Boolean)}]); }
      else {
        // Never expose provider billing, quota, model, or raw API errors to shoppers.
        if(response.status!==404) console.warn('Gift assistant API unavailable; using friendly fallback.');
        setAiAvailable(false);
        const fallback = offlineReply(text, available, categories);
        setMessages(old=>[...old,{role:'assistant',text:fallback.text,products:fallback.products}]);
      }
    } catch { setAiAvailable(false); const fallback=offlineReply(text,available,categories);setMessages(old=>[...old,{role:'assistant',text:fallback.text,products:fallback.products}]); }
    finally { setBusy(false); }
  };
  return <><button type="button" className="gift-assistant-launcher" onClick={()=>setOpen(v=>!v)} aria-label={open?'Close gift assistant':'Open AI gift assistant'}>{open?<X size={21}/>:<><MessageCircle size={20}/><span>Gift help</span><Sparkles size={15}/></>}</button>
    {open&&<section className="gift-assistant-panel" aria-label="God First AI gift assistant"><header><span className="gift-assistant-avatar"><Bot size={20}/></span><div><b>God First Gift Assistant</b><small>{aiAvailable===false?'Smart catalogue suggestions':aiAvailable===true?'AI-powered shopping help':'Personal gift recommendations'}</small></div><button type="button" onClick={()=>setOpen(false)} aria-label="Close chat"><X size={18}/></button></header>
      <div className="gift-assistant-messages" aria-live="polite">{messages.map((m,i)=><div className={`gift-assistant-message ${m.role}`} key={i}><p>{m.text}</p>{m.products?.length>0&&<div className="gift-assistant-products">{m.products.map(p=><button type="button" className="gift-assistant-product" key={p.id} onClick={()=>{onOpenProduct?.(p);setOpen(false)}}>{p.image?<img src={p.image} alt=""/>:<span className="gift-assistant-product-placeholder"><Gift size={20}/></span>}<span><b>{p.name}</b><small>₦{Number(p.price).toLocaleString('en-NG')}</small></span><ShoppingBag size={15}/></button>)}</div>}</div>)}{busy&&<div className="gift-assistant-message assistant"><p>Finding thoughtful options…</p></div>}</div>
      <form className="gift-assistant-input" onSubmit={send}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask me anything—or find the right gift…" aria-label="Message gift assistant" maxLength={2000}/><button type="submit" disabled={busy||!input.trim()} aria-label="Send message"><Send size={17}/></button></form>
      <p className="gift-assistant-disclaimer">Recommendations use available store products. Check each product page for full details.</p>
    </section>}</>;
}
