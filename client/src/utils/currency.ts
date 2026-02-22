let cachedRate: number | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60 * 60 * 1000;

export async function fetchExchangeRate(): Promise<number> {
  const now = Date.now();

  if (cachedRate !== null && cacheTimestamp !== null) {
    if (now - cacheTimestamp < CACHE_DURATION) {
      return cachedRate;
    }
  }

  try {
    console.log("Fetching fresh EUR→SEK exchange rate...");

    const response = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=SEK",
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const rate = data.rates.SEK;

    if (!rate || isNaN(rate)) {
      throw new Error("Invalid rate in response");
    }

    cachedRate = rate;
    cacheTimestamp = now;

    console.log("Fresh exchange rate:", rate);
    return rate;
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error);
    console.warn("Using fallback rate: 11.5");
    return 11.5;
  }
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

export function formatCurrencyWithConversion(
  amount: number,
  currency: "SEK" | "EUR",
  exchangeRate?: number,
): string {
  if (currency === "SEK") {
    return formatCurrency(amount, "SEK");
  }

  if (!exchangeRate) {
    return formatCurrency(amount, "EUR");
  }

  const convertedAmount = convertEurToSek(amount, exchangeRate);
  return `${formatCurrency(convertedAmount, "SEK")} (${formatCurrency(amount, "EUR")})`;
}
