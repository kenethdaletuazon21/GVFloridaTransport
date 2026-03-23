const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await db('users')
            .where({ id: req.user.id, is_active: true })
            .select('id', 'email', 'phone', 'first_name', 'last_name', 'date_of_birth', 'profile_image', 'wallet_balance', 'loyalty_points', 'preferences', 'created_at')
            .first();
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
    try {
        const { first_name, last_name, phone, date_of_birth, preferences } = req.body;
        const [updated] = await db('users')
            .where({ id: req.user.id })
            .update({ first_name, last_name, phone, date_of_birth, preferences, updated_at: new Date() })
            .returning(['id', 'email', 'first_name', 'last_name', 'phone']);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get user's trip history
router.get('/trips', authenticate, async (req, res) => {
    try {
        const bookings = await db('bookings')
            .join('trips', 'bookings.trip_id', 'trips.id')
            .join('routes', 'trips.route_id', 'routes.id')
            .where({ 'bookings.user_id': req.user.id })
            .select(
                'bookings.*',
                'trips.scheduled_departure', 'trips.trip_number',
                'routes.name as route_name', 'routes.origin_name', 'routes.destination_name'
            )
            .orderBy('trips.scheduled_departure', 'desc');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Get wallet transactions
router.get('/wallet/transactions', authenticate, async (req, res) => {
    try {
        const transactions = await db('wallet_transactions')
            .where({ user_id: req.user.id })
            .orderBy('created_at', 'desc')
            .limit(50);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get loyalty points
router.get('/loyalty', authenticate, async (req, res) => {
    try {
        const user = await db('users').where({ id: req.user.id }).select('loyalty_points').first();
        res.json({ points: user.loyalty_points });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch loyalty points' });
    }
});

module.exports = router;
