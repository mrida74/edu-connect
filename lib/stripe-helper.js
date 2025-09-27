// Helper functions for Stripe payment processing
export const formatAmountForStripe = (amount, currency = "BDT") => {
  // Handle edge cases
  if (!amount || amount < 0) return 0;
  
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(amount);
  
  // Check if currency uses decimal places
  const hasDecimals = parts.some(part => part.type === "decimal");
  
  // Zero-decimal currencies (like JPY, KRW) don't need *100 conversion
  // Decimal currencies (like USD, EUR, BDT) need *100 for cents
  return hasDecimals ? Math.round(amount * 100) : Math.round(amount);
};

// Format amount back from Stripe (cents to dollars)
export const formatAmountFromStripe = (amount, currency = "BDT") => {
  if (!amount) return 0;
  
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });

  const parts = numberFormat.formatToParts(1);
  const hasDecimals = parts.some(part => part.type === "decimal");
  
  return hasDecimals ? amount / 100 : amount;
};

// Get currency symbol
export const getCurrencySymbol = (currency = "BDT") => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(0).replace(/\d/g, "").trim();
};

// Validate currency support
export const isSupportedCurrency = (currency) => {
  const supportedCurrencies = [
    "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD",
    "MXN", "SGD", "HKD", "NOK", "KRW", "TRY", "RUB", "INR", "BRL", "ZAR",
    "BDT", "PKR", "LKR", "NPR", "BTN", "MVR", "AFN"
  ];
  
  return supportedCurrencies.includes(currency.toUpperCase());
};
