import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

class CurrencyService {
    // Get supported currencies
    async getSupportedCurrencies() {
        try {
            const response = await axiosInstance.get(
                API_PATHS.CURRENCY.GET_CURRENCIES
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching currencies:", error);
            // Return fallback currencies
            return [
                { code: "USD", name: "US Dollar", symbol: "$" },
                { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
            ];
        }
    }

    // Get current exchange rates
    async getExchangeRates(from = "USD", to = "ILS") {
        try {
            const response = await axiosInstance.get(
                `${API_PATHS.CURRENCY.GET_EXCHANGE_RATES}?from=${from}&to=${to}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
            // Return fallback rate
            return {
                from,
                to,
                rate: from === "USD" && to === "ILS" ? 3.7 : 0.27,
                timestamp: new Date().toISOString(),
            };
        }
    }

    // Convert currency amount
    async convertCurrency(amount, from, to) {
        try {
            const response = await axiosInstance.post(
                API_PATHS.CURRENCY.CONVERT_CURRENCY,
                {
                    amount,
                    from,
                    to,
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error converting currency:", error);
            // Return fallback conversion
            const fallbackRate = from === "USD" && to === "ILS" ? 3.7 : 0.27;
            return {
                originalAmount: parseFloat(amount),
                convertedAmount: parseFloat(amount) * fallbackRate,
                from,
                to,
                exchangeRate: fallbackRate,
                timestamp: new Date().toISOString(),
            };
        }
    }
}

export default new CurrencyService();
