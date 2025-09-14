import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import CurrencySelector from "../Inputs/CurrencySelector";
import Loader from "../Loader";

const AddExpenseForm = ({ onAddExpense }) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
        originalCurrency: "USD",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (key, value) =>
        setExpense({ ...expense, [key]: value });

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Icon Selection */}
            <div>
                <EmojiPickerPopup
                    icon={expense.icon}
                    onSelect={(selectedIcon) =>
                        handleChange("icon", selectedIcon)
                    }
                />
            </div>

            {/* Category Field */}
            <div>
                <Input
                    value={expense.category}
                    onChange={({ target }) =>
                        handleChange("category", target.value)
                    }
                    label="Category"
                    placeholder="Rent, Groceries, etc"
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
                            value={expense.amount}
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
                            value={expense.originalCurrency}
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
                    value={expense.date}
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
                    className="add-btn add-btn-fill px-6 py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader className="h-4 w-4" />
                            Adding...
                        </div>
                    ) : (
                        "Add Expense"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;
