const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get wallet balance
router.get('/balance', authenticate, async (req, res) => {
    try {
        const user = await db('users').where({ id: req.user.id }).select('wallet_balance').first();
        res.json({ balance: user.wallet_balance });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
});

// Top up wallet
router.post('/topup', authenticate, async (req, res) => {
    try {
        const { amount, payment_method } = req.body;
        if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

        const user = await db('users').where({ id: req.user.id }).first();
        const newBalance = parseFloat(user.wallet_balance) + parseFloat(amount);

        await db('users').where({ id: req.user.id }).update({ wallet_balance: newBalance });

        const [transaction] = await db('wallet_transactions').insert({
            user_id: req.user.id, type: 'credit', amount, balance_after: newBalance,
            description: `Wallet top-up via ${payment_method}`
        }).returning('*');

        // Create payment record
        const transaction_id = 'TXN-' + Date.now().toString(36).toUpperCase();
        await db('payments').insert({
            transaction_id, user_id: req.user.id, amount, payment_method,
            payment_type: 'wallet_topup', status: 'completed',
            receipt_number: 'RCT-' + Date.now().toString(36).toUpperCase()
        });

        res.json({ balance: newBalance, transaction });
    } catch (err) {
        res.status(500).json({ error: 'Top-up failed' });
    }
});

// Pay with wallet
router.post('/pay', authenticate, async (req, res) => {
    try {
        const { amount, booking_id, description } = req.body;
        const user = await db('users').where({ id: req.user.id }).first();

        if (parseFloat(user.wallet_balance) < parseFloat(amount)) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }

        const newBalance = parseFloat(user.wallet_balance) - parseFloat(amount);
        await db('users').where({ id: req.user.id }).update({ wallet_balance: newBalance });

        const [transaction] = await db('wallet_transactions').insert({
            user_id: req.user.id, type: 'debit', amount, balance_after: newBalance,
            description: description || 'Ticket purchase', booking_id
        }).returning('*');

        res.json({ balance: newBalance, transaction });
    } catch (err) {
        res.status(500).json({ error: 'Payment failed' });
    }
});

// Transaction history
router.get('/transactions', authenticate, async (req, res) => {
    try {
        const transactions = await db('wallet_transactions')
            .where({ user_id: req.user.id })
            .orderBy('created_at', 'desc').limit(100);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;
