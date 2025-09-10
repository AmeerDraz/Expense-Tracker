import React from "react";
import { formatCurrency, getDisplayAmount } from "../utils/currencyUtils";

const CurrencyDisplay = ({
    transaction,
    displayCurrency = "USD", // Always display in USD as base currency
    showOriginal = true, // Show original amount by default
    className = "",
    compact = false, // For compact display in cards
    sign = "", // Optional sign to display inline with amount
}) => {
    // Always display in USD (base currency)
    const displayInfo = getDisplayAmount(transaction, "USD");

    if (compact) {
        return (
            <div className={`${className}`}>
                <div className="flex flex-col h-full justify-center">
                    <span className="font-semibold text-sm truncate">
                        {sign}
                        {formatCurrency(displayInfo.amount, "USD")}
                    </span>
                    {displayInfo.isConverted && (
                        <div className="text-xs text-gray-500 truncate">
                            <span className="font-semibold text-gray-400">
                                <span className="text-[10px] text-gray-500 mr-1">
                                    conv.
                                </span>
                                {formatCurrency(
                                    transaction.originalAmount,
                                    transaction.originalCurrency
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <div className="flex flex-col">
                <span className="font-semibold text-base">
                    {sign}
                    {formatCurrency(displayInfo.amount, "USD")}
                </span>
                {displayInfo.isConverted && (
                    <div className="flex flex-col mt-1">
                        <div className="text-xs text-blue-600 font-medium">
                            Converted from
                        </div>
                        {showOriginal && (
                            <div className="text-xs text-gray-600 mt-0.5 bg-gray-50 px-2 py-1 rounded">
                                <span className="font-semibold text-gray-800">
                                    Original:{" "}
                                    <span className="text-[10px] text-gray-500 mr-1">
                                        conv.
                                    </span>
                                    {formatCurrency(
                                        transaction.originalAmount,
                                        transaction.originalCurrency
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyDisplay;
