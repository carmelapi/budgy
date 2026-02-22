/**
 * Currency Utilities
 *
 * Handles EUR to SEK conversion using live exchange rates
 * API: https://api.frankfurter.app (free, no auth required)
 */

// Cache exchange rate for 1 hour to avoid excessive API calls
let cachedRate: number | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch current EUR→SEK exchange rate
 *
 * Returns cached rate if less than 1 hour old.
 * Falls back to 11.5 if API fails (approximate average rate).
 *
 * Why cache? API rate limits + exchange rates don't change every second
 */
export async function fetchExchangeRate(): Promise<number> {
  const now = Date.now();

  // Return cached rate if still valid (less than 1 hour old)
  if (cachedRate !== null && cacheTimestamp !== null) {
    if (now - cacheTimestamp < CACHE_DURATION) {
      console.log('Using cached exchange rate:', cachedRate);
      return cachedRate;
    }
  }

  try {
    console.log('Fetching fresh EUR→SEK exchange rate...');

    // Call Frankfurter API for EUR→SEK rate
    const response = await fetch('https://api.frankfurter.app/latest?from=EUR&to=SEK');

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const rate = data.rates.SEK;

    if (!rate || isNaN(rate)) {
      throw new Error('Invalid rate in response');
    }

    // Cache the rate
    cachedRate = rate;
    cacheTimestamp = now;

    console.log('Fresh exchange rate:', rate);
    return rate;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    console.warn('Using fallback rate: 11.5');

    // Fallback: approximate average EUR→SEK rate
    // Better to show approximate than crash the app
    return 11.5;
  }
}

/**
 * Convert EUR to SEK
 *
 * @param amountEur - Amount in EUR (e.g., 20)
 * @param rate - Exchange rate (e.g., 11.5)
 * @returns Amount in SEK (e.g., 230.00)
 */
export function convertEurToSek(amountEur: number, rate: number): number {
  return parseFloat((amountEur * rate).toFixed(2));
}

/**
 * Format currency for display
 *
 * @param amount - Numeric amount
 * @param currency - 'SEK' or 'EUR'
 * @returns Formatted string (e.g., "1,234.56 kr" or "20.00 EUR")
 */
export function formatCurrency(amount: number, currency: 'SEK' | 'EUR'): string {
  const formatted = amount.toLocaleString('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency === 'SEK' ? `${formatted} kr` : `${formatted} EUR`;
}

/**
 * Format currency with EUR→SEK conversion display
 *
 * For EUR amounts, shows both: "230.00 kr (20.00 EUR)"
 * For SEK amounts, shows just: "1,234.56 kr"
 *
 * @param amount - Numeric amount in original currency
 * @param currency - 'SEK' or 'EUR'
 * @param exchangeRate - Current EUR→SEK rate (only needed if currency is EUR)
 */
export function formatCurrencyWithConversion(
  amount: number,
  currency: 'SEK' | 'EUR',
  exchangeRate?: number
): string {
  if (currency === 'SEK') {
    return formatCurrency(amount, 'SEK');
  }

  // EUR: show converted amount + original
  if (!exchangeRate) {
    return formatCurrency(amount, 'EUR'); // Fallback if no rate
  }

  const convertedAmount = convertEurToSek(amount, exchangeRate);
  return `${formatCurrency(convertedAmount, 'SEK')} (${formatCurrency(amount, 'EUR')})`;
}
