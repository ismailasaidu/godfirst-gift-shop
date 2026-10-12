import { collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { requireFirebase } from './firebase';

const COLLECTIONS = { products: 'products', categories: 'categories', orders: 'orders' };
const clean = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export async function loadSharedStore({ includeHidden = false, ownerUid = null } = {}) {
  const { db } = requireFirebase();
  const [categorySnap, productSnap, orderSnap] = await Promise.all([
    getDocs(query(collection(db, COLLECTIONS.categories), orderBy('name'))).catch(() => getDocs(collection(db, COLLECTIONS.categories))),
    getDocs(includeHidden ? collection(db, COLLECTIONS.products) : query(collection(db, COLLECTIONS.products), where('published', '==', true))).catch(async error => { if (includeHidden) throw error; return getDocs(query(collection(db, COLLECTIONS.products), where('published', '!=', false))); }),
    includeHidden ? getDocs(collection(db, COLLECTIONS.orders)) : ownerUid ? getDocs(query(collection(db, COLLECTIONS.orders), where('ownerUid', '==', ownerUid))).catch(() => ({ docs: [] })) : Promise.resolve({ docs: [] }),
  ]);
  return { categories: categorySnap.docs.map(clean), products: productSnap.docs.map(clean), orders: orderSnap.docs.map(clean) };
}

export async function syncCollectionChanges(collectionName, previous = [], next = []) {
  const { db } = requireFirebase();
  const name = COLLECTIONS[collectionName];
  if (!name) throw new Error('Unsupported store collection.');
  const oldMap = new Map(previous.map(item => [String(item.id), item]));
  const nextMap = new Map(next.map(item => [String(item.id), item]));
  for (const [id, item] of nextMap) {
    if (!id || id === 'undefined') continue;
    const payload = { ...item, id, updatedAt: serverTimestamp() };
    if (collectionName === 'products') payload.published = item.published !== false;
    delete payload._localOnly;
    if (!oldMap.has(id) || JSON.stringify(oldMap.get(id)) !== JSON.stringify(item)) {
      if (!oldMap.has(id)) payload.createdAt = serverTimestamp();
      await setDoc(doc(db, name, id), payload, { merge: true });
    }
  }
  for (const id of oldMap.keys()) if (!nextMap.has(id)) await deleteDoc(doc(db, name, id));
}

export async function importLocalStore({ products, categories, orders }) {
  const { db } = requireFirebase();
  if (!Array.isArray(products) || !Array.isArray(categories)) throw new Error('Local catalogue data is unavailable.');
  const write = async (name, items) => {
    for (const item of items) {
      if (!item?.id) continue;
      await setDoc(doc(db, name, String(item.id)), { ...item, id: String(item.id), updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true });
    }
  };
  await write(COLLECTIONS.categories, categories);
  await write(COLLECTIONS.products, products.map(product => ({ ...product, published: product.published !== false })));
  // Orders are imported only by an authenticated admin and are preserved by ID.
  await write(COLLECTIONS.orders, Array.isArray(orders) ? orders : []);
}

export async function saveCustomerOrder(order, ownerUid) {
  const { db } = requireFirebase();
  if (!ownerUid) return false;
  const id = String(order.id);
  await setDoc(doc(db, COLLECTIONS.orders, id), { ...order, id, ownerUid, status: 'Payment confirmation pending', updatedAt: serverTimestamp(), createdAt: serverTimestamp() });
  return true;
}
