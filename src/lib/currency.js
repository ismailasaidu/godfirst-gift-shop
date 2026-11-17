const PREF_KEY = 'gfg_regional_preferences';
const RATE_KEY = 'gfg_exchange_rates_ngn';
export const DEFAULT_REGIONAL_PREFERENCES = { country: 'Nigeria', currency: 'NGN' };
export const readRegionalPreferences = () => {
  try { return { ...DEFAULT_REGIONAL_PREFERENCES, ...(JSON.parse(localStorage.getItem(PREF_KEY) || '{}')) }; }
  catch { return DEFAULT_REGIONAL_PREFERENCES; }
};
export const saveRegionalPreferences = (preferences) => {
  const next = { ...DEFAULT_REGIONAL_PREFERENCES, ...preferences };
  localStorage.setItem(PREF_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('gfg-regional-preferences-changed', { detail: next }));
  return next;
};
export const readExchangeRates = () => {
  try { return JSON.parse(localStorage.getItem(RATE_KEY) || 'null'); } catch { return null; }
};
export const saveExchangeRates = (data) => {
  localStorage.setItem(RATE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('gfg-exchange-rates-changed'));
};
export const currencyCodes = () => {
  try { return ['NGN', ...Intl.supportedValuesOf('currency').filter(code => code !== 'NGN')].sort(); }
  catch { return ['NGN','USD','GBP','EUR','CAD','AUD','GHS','ZAR','KES','XOF','XAF','AED','INR','JPY','CNY','CHF','NZD','SGD']; }
};
export const formatCurrency = (amount, currency) => {
  try { return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: ['NGN','JPY','KRW','XAF','XOF'].includes(currency) ? 0 : 2 }).format(Number(amount) || 0); }
  catch { return `${currency} ${(Number(amount)||0).toLocaleString()}`; }
};
export const displayPrice = (amount) => {
  const value = Number(amount) || 0;
  const prefs = readRegionalPreferences();
  if (!prefs.currency || prefs.currency === 'NGN') return formatCurrency(value, 'NGN');
  const rates = readExchangeRates();
  const rate = Number(rates?.rates?.[prefs.currency]);
  if (!Number.isFinite(rate) || rate <= 0) return `${prefs.currency} conversion unavailable`;
  const converted = value * rate;
  return formatCurrency(converted, prefs.currency);
};
export const currencyName = code => { try { return new Intl.DisplayNames(undefined, { type: 'currency' }).of(code) || code; } catch { return code; } };
