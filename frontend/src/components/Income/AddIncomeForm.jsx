import React, { useState } from "react";
import Input from "./../Inputs/Input";
import EmojiPickerPopup from "./../EmojiPickerPopup";
import CurrencySelector from "../Inputs/CurrencySelector";

const AddIncomeForm = ({ onAddIncome }) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
        originalCurrency: "USD",
    });

    const handleChange = (key, value) => setIncome({ ...income, [key]: value });

    return (
        <div className="space-y-6">
            {/* Icon Selection */}
            <div>
                <EmojiPickerPopup
                    icon={income.icon}
                    onSelect={(selectedIcon) =>
                        handleChange("icon", selectedIcon)
                    }
                />
            </div>

            {/* Income Source Field */}
            <div>
                <Input
                    value={income.source}
                    onChange={({ target }) =>
                        handleChange("source", target.value)
                    }
                    label="Income Source"
                    placeholder="Freelancer, Salary, etc"
                    type="text"
                />
            </div>

            {/* Amount and Currency Section */}
            <div className="p-4 rounded-lg">
                <div className="flex gap-4">
                    {/* Amount Field */}
                    <div className="flex-1">
                        <label className="text-[13px] text-slate-800 dark:text-white">
                            Amount
                        </label>
                        <input
                            value={income.amount}
                            onChange={({ target }) =>
                                handleChange("amount", target.value)
                            }
                            placeholder="0.00"
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                        />
                    </div>

                    {/* Currency Field */}
                    <div className="w-48">
                        <label className="text-[13px] text-slate-800 dark:text-white">
                            Select Currency
                        </label>
                        <CurrencySelector
                            value={income.originalCurrency}
                            onChange={({ target }) =>
                                handleChange("originalCurrency", target.value)
                            }
                            label=""
                        />
                    </div>
                </div>
            </div>

            {/* Date Field */}
            <div>
                <Input
                    value={income.date}
                    onChange={({ target }) =>
                        handleChange("date", target.value)
                    }
                    label="Date"
                    placeholder=""
                    type="date"
                />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    className="add-btn add-btn-fill px-6 py-2.5 text-sm font-medium"
                    onClick={() => onAddIncome(income)}
                >
                    Add Income
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;
