import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Verifies a Paystack transaction on the server before the storefront records
 * the checkout as paid. Configure PAYSTACK_SECRET_KEY in Netlify environment
 * variables; never place the secret key in VITE_* variables or frontend code.
 */
export default async (request) => {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  };
  const json = (statusCode, body) => new Response(JSON.stringify(body), { status: statusCode, headers });

  if (request.method !== 'POST') {
    return json(405, { verified: false, message: 'Method not allowed.' });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error('PAYSTACK_SECRET_KEY is not configured in Netlify.');
    return json(503, { verified: false, message: 'Payment verification is not configured yet. Please contact the store with your payment reference.' });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { verified: false, message: 'Invalid verification request.' });
  }

  const reference = String(payload?.reference || '').trim();
  const expectedAmount = Number(payload?.expectedAmount);
  const expectedCurrency = String(payload?.expectedCurrency || 'NGN').toUpperCase();
  if (!reference || !/^[a-zA-Z0-9.=_-]{1,100}$/.test(reference) || !Number.isSafeInteger(expectedAmount) || expectedAmount < 1 || expectedCurrency !== 'NGN') {
    return json(400, { verified: false, message: 'The payment details could not be validated.' });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: { authorization: `Bearer ${secretKey}`, accept: 'application/json' },
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.status || !result?.data) {
      return json(502, { verified: false, message: 'Paystack could not confirm this payment yet. Keep your reference and try again shortly.' });
    }

    const transaction = result.data;
    if (transaction.status !== 'success') {
      return json(402, { verified: false, paymentStatus: transaction.status || 'unknown', message: 'Paystack has not marked this transaction as successful.' });
    }
    const reportedAmount = Number(transaction.amount);
    // Paystack may return `amount` as the amount charged to the customer and
    // `requested_amount` as the original amount requested by the merchant.
    // Compare the order total to requested_amount when Paystack supplies it,
    // while retaining the actual charged amount for the order audit trail.
    const requestedAmount = Number(transaction.requested_amount);
    const hasRequestedAmount = Number.isSafeInteger(requestedAmount) && requestedAmount > 0;
    const amountToMatch = hasRequestedAmount ? requestedAmount : reportedAmount;
    const reportedCurrency = String(transaction.currency || '').trim().toUpperCase();
    const reportedReference = String(transaction.reference || '').trim();
    const referenceMatches = reportedReference === reference;
    const amountMatches = Number.isSafeInteger(amountToMatch) && amountToMatch === expectedAmount;
    const currencyMatches = reportedCurrency === expectedCurrency;
    if (!referenceMatches || !amountMatches || !currencyMatches) {
      // Keep verification strict. Log only transaction comparison metadata; never log keys or customer/card data.
      const mismatch = {
        referenceMatches,
        amountMatches,
        currencyMatches,
        expectedAmountMinor: expectedAmount,
        reportedAmountMinor: Number.isFinite(reportedAmount) ? reportedAmount : null,
        requestedAmountMinor: hasRequestedAmount ? requestedAmount : null,
        amountComparedMinor: Number.isFinite(amountToMatch) ? amountToMatch : null,
        expectedCurrency,
        reportedCurrency,
        referenceSuffix: reference.slice(-6),
      };
      console.warn('Paystack verification mismatch:', JSON.stringify(mismatch));
      const reasons = [];
      if (!referenceMatches) reasons.push('reference');
      if (!amountMatches) reasons.push('amount');
      if (!currencyMatches) reasons.push('currency');
      return json(400, {
        verified: false,
        code: 'PAYSTACK_TRANSACTION_MISMATCH',
        mismatch: { reference: !referenceMatches, amount: !amountMatches, currency: !currencyMatches },
        expectedAmountMinor: expectedAmount,
        reportedAmountMinor: Number.isFinite(reportedAmount) ? reportedAmount : null,
        requestedAmountMinor: hasRequestedAmount ? requestedAmount : null,
        amountComparedMinor: Number.isFinite(amountToMatch) ? amountToMatch : null,
        expectedCurrency,
        reportedCurrency,
        message: `Paystack verification found a ${reasons.join(' and ')} mismatch. Do not pay again. Contact the store with your reference.`,
      });
    }

    const orderInput = payload?.order && typeof payload.order === 'object' ? payload.order : null;
    let orderSaved = false;
    let orderId = reference;
    let orderSaveMessage = '';
    if (orderInput) {
      const orderTotalMinor = Math.round(Number(orderInput.total) * 100);
      const orderItems = Array.isArray(orderInput.items) ? orderInput.items : [];
      const customer = orderInput.customer && typeof orderInput.customer === 'object' ? orderInput.customer : {};
      if (!Number.isSafeInteger(orderTotalMinor) || orderTotalMinor !== expectedAmount || !orderItems.length || !String(customer.email || '').trim()) {
        orderSaveMessage = 'Paystack verified the payment, but the submitted order details did not pass validation. Do not pay again; reconcile this reference before fulfilment.';
      }
      if (!orderSaveMessage) try {
        const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        if (!rawServiceAccount) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON is not configured.');
        const serviceAccount = JSON.parse(rawServiceAccount);
        if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        const app = getApps().length ? getApps()[0] : initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID });
        const db = getFirestore(app);
        orderId = String(orderInput.id || reference).replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100) || reference;
        const savedOrder = {
          id: orderId,
          date: String(orderInput.date || new Date().toISOString()),
          customer: {
            name: String(customer.name || '').slice(0, 160),
            email: String(customer.email || '').trim().slice(0, 254),
            phone: String(customer.phone || '').slice(0, 32),
            address: String(customer.address || '').slice(0, 300),
            addressLine2: String(customer.addressLine2 || '').slice(0, 300),
            city: String(customer.city || '').slice(0, 120),
            state: String(customer.state || '').slice(0, 120),
            postalCode: String(customer.postalCode || '').slice(0, 40),
            country: String(customer.country || '').slice(0, 100),
            note: String(customer.note || '').slice(0, 1000),
          },
          items: orderItems.slice(0, 100).map(item => ({
            id: String(item.id || item.productId || '').slice(0, 120),
            productId: String(item.productId || item.id || '').slice(0, 120),
            name: String(item.name || 'Gift').slice(0, 200),
            image: String(item.image || '').slice(0, 1500),
            price: Number(item.price || item.unitPrice || 0),
            qty: Math.max(1, Math.min(100, Math.floor(Number(item.qty ?? item.quantity ?? 1)))),
          })),
          subtotal: Number(orderInput.subtotal || 0),
          deliveryMethod: String(orderInput.deliveryMethod || 'normal').slice(0, 40),
          deliveryFee: Number(orderInput.deliveryFee || 0),
          total: Number(orderInput.total),
          payment: { provider: 'Paystack', reference: transaction.reference, verificationStatus: 'verified', verifiedAmount: hasRequestedAmount ? requestedAmount : reportedAmount, chargedAmount: reportedAmount, currency: reportedCurrency, paidAt: transaction.paid_at || null, channel: transaction.channel || 'Paystack' },
          status: 'Paid — awaiting fulfilment',
          orderSource: 'paystack-verified-checkout',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        await db.collection('orders').doc(orderId).set(savedOrder, { merge: true });
        orderSaved = true;
      } catch (saveError) {
        console.error('Verified payment order save failed:', saveError?.message || saveError);
        orderSaveMessage = 'Payment verified, but the order could not sync to the shared admin database. Configure FIREBASE_SERVICE_ACCOUNT_JSON and reconcile this reference before fulfilment.';
      }
    }
    return json(200, {
      verified: true,
      orderSaved,
      orderId,
      orderSaveMessage,
      reference: transaction.reference,
      amount: hasRequestedAmount ? requestedAmount : Number(transaction.amount),
      chargedAmount: Number(transaction.amount),
      currency: transaction.currency,
      paidAt: transaction.paid_at || null,
      channel: transaction.channel || 'Paystack',
      message: 'Payment verified successfully.',
    });
  } catch (error) {
    console.error('Paystack verification request failed:', error?.message || error);
    return json(502, { verified: false, message: 'We could not verify the payment because of a connection issue. Keep your reference and contact the store if you were charged.' });
  }
};
