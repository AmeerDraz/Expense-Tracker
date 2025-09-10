import React from "react";

const CurrencySelector = ({
    value,
    onChange,
    label = "Currency",
    className = "",
}) => {
    const currencies = [
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
    ];

    return (
        <div className={`${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
                {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CurrencySelector;
