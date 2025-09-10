// Currency utility functions

export const formatCurrency = (amount, currency = "USD", showSymbol = true) => {
    const currencySymbols = {
        USD: "$",
        ILS: "₪",
    };

    const symbol = currencySymbols[currency] || currency;
    const numAmount = parseFloat(amount);

    // Format with commas for thousands separator
    const formattedAmount = numAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (showSymbol) {
        return `${symbol}${formattedAmount}`;
    }
    return formattedAmount;
};

export const getCurrencySymbol = (currency) => {
    const currencySymbols = {
        USD: "$",
        ILS: "₪",
    };
    return currencySymbols[currency] || currency;
};

export const convertAmount = (
    amount,
    fromCurrency,
    toCurrency,
    exchangeRate
) => {
    if (fromCurrency === toCurrency) {
        return parseFloat(amount);
    }

    // If converting to base currency (USD), multiply by exchange rate
    if (toCurrency === "USD") {
        return parseFloat(amount) * exchangeRate;
    }

    // If converting from base currency, divide by exchange rate
    if (fromCurrency === "USD") {
        return parseFloat(amount) / exchangeRate;
    }

    // For other conversions, use the exchange rate directly
    return parseFloat(amount) * exchangeRate;
};

export const getDisplayAmount = (transaction, displayCurrency = "USD") => {
    // If transaction doesn't have currency info (old data), return original amount
    if (!transaction.originalCurrency) {
        return {
            amount: transaction.amount,
            currency: displayCurrency,
            isConverted: false,
        };
    }

    // If displaying in original currency, return original amount
    if (displayCurrency === transaction.originalCurrency) {
        return {
            amount: transaction.originalAmount || transaction.amount,
            currency: transaction.originalCurrency,
            isConverted: false,
        };
    }

    // If displaying in base currency, return converted amount
    if (displayCurrency === "USD") {
        return {
            amount: transaction.amount,
            currency: "USD",
            isConverted: transaction.originalCurrency !== "USD",
        };
    }

    // For other currencies, we would need to convert from base currency
    // This would require additional API calls or cached rates
    return {
        amount: transaction.amount,
        currency: displayCurrency,
        isConverted: true,
    };
};
