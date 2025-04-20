const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Get dashboard data
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Get transactions for the current month
        const transactions = await Transaction.find({
            userId: userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        }).populate('category');

        // Calculate total income and expenses
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        // Calculate category-wise spending
        const categorySpending = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const categoryName = t.category ? t.category.name : 'Uncategorized';
                categorySpending[categoryName] = (categorySpending[categoryName] || 0) + t.amount;
            });

        // Get recent transactions
        const recentTransactions = await Transaction.find({ userId: userId })
            .sort({ date: -1 })
            .limit(5)
            .populate('category');

        res.json({
            summary: {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses
            },
            categorySpending: Object.entries(categorySpending).map(([name, amount]) => ({
                name,
                amount
            })),
            recentTransactions
        });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

module.exports = router; 