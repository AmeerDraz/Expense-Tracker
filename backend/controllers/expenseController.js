const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense 
exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing filds
        if (!category || !amount || !date) {
            return res
                .status(400)
                .json({ message: "Please fill all the fields" });
        }

        const newExpence = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpence.save();
        res.status(200).json(newExpence);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// get All Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// delete Income Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// dowmload Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // prepare data for excel
        const data = expense.map((expense) => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "Expense_details.xlsx");
        res.download("Expense_details.xlsx");
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
