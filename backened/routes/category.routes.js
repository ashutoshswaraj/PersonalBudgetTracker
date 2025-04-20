const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Category = require('../models/Category');

// Validation middleware
const validateCategory = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type').isIn(['income', 'expense']).withMessage('Invalid category type'),
    body('budgetLimit').optional().isFloat({ min: 0 }).withMessage('Budget limit must be a positive number'),
    body('color').optional().isHexColor().withMessage('Invalid color format'),
    body('icon').optional().isString().withMessage('Icon must be a string'),
];

// Get all categories
router.get('/', auth, async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user._id });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new category
router.post('/', [auth, validateCategory], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const category = new Category({
            ...req.body,
            userId: req.user._id
        });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a category
router.put('/:id', [auth, validateCategory], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a category
router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 