interface ExchangeRates {
  [key: string]: number;
}

let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000;

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now();

  if (cachedRates !== null && cacheTimestamp !== null) {
    if (now - cacheTimestamp < CACHE_DURATION) {
      return cachedRates;
    }
  }

  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=EUR",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const rates: ExchangeRates = { ...data.rates, EUR: 1 };

    cachedRates = rates;
    cacheTimestamp = now;
    return rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return { EUR: 1, SEK: 11.5 };
  }
}

export async function fetchExchangeRate(): Promise<number> {
  const rates = await fetchExchangeRates();
  return rates.SEK || 11.5;
}

export function convertEurToSek(amountEur: number, rate: number): number {
  return parseFloat((amountEur * rate).toFixed(2));
}

export function formatCurrency(
  amount: number,
  currency: "SEK" | "EUR",
): string {
  const formatted = amount.toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency === "SEK" ? `${formatted} kr` : `${formatted} EUR`;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInEUR = fromCurrency === 'EUR' ? amount : amount / rates[fromCurrency];
  const convertedAmount = toCurrency === 'EUR' ? amountInEUR : amountInEUR * rates[toCurrency];

  return parseFloat(convertedAmount.toFixed(2));
}

export function formatCurrencyWithConversion(
  amount: number,
  currency: "SEK" | "EUR",
  userBaseCurrency: string,
  rates: ExchangeRates
): string {
  if (currency === userBaseCurrency) {
    const symbol = userBaseCurrency === 'SEK' ? 'kr' : 'EUR';
    const formatted = amount.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${symbol}`;
  }

  const convertedAmount = convertCurrency(amount, currency, userBaseCurrency, rates);
  const baseSymbol = userBaseCurrency === 'SEK' ? 'kr' : 'EUR';
  const originalSymbol = currency === 'SEK' ? 'kr' : 'EUR';

  const formattedConverted = convertedAmount.toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedOriginal = amount.toLocaleString("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formattedConverted} ${baseSymbol} (${formattedOriginal} ${originalSymbol})`;
}
