const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// Get all transactions
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .populate('category')
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create transaction
router.post('/', [
    auth,
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category').isMongoId().withMessage('Invalid category ID'),
    body('description').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, amount, category, description } = req.body;

        // Check if category exists and belongs to user
        const categoryExists = await Category.findOne({
            _id: category,
            userId: req.user._id
        });

        if (!categoryExists) {
            return res.status(400).json({ message: 'Category not found' });
        }

        const transaction = new Transaction({
            userId: req.user._id,
            type,
            amount,
            category,
            description
        });

        await transaction.save();
        await transaction.populate('category');
        
        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update transaction
router.put('/:id', [
    auth,
    body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    body('category').optional().isMongoId().withMessage('Invalid category ID'),
    body('description').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { type, amount, category, description } = req.body;

        // Check if transaction exists and belongs to user
        let transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // If category is being updated, verify it exists and belongs to user
        if (category) {
            const categoryExists = await Category.findOne({
                _id: category,
                userId: req.user._id
            });

            if (!categoryExists) {
                return res.status(400).json({ message: 'Category not found' });
            }
        }

        // Update transaction
        transaction.type = type || transaction.type;
        transaction.amount = amount || transaction.amount;
        transaction.category = category || transaction.category;
        transaction.description = description || transaction.description;

        await transaction.save();
        await transaction.populate('category');
        
        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 