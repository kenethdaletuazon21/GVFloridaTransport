const express = require('express');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await db('routes').where({ is_active: true })
            .orderBy('name');
        res.json(routes);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch routes' });
    }
});

// Get route by ID
router.get('/:id', async (req, res) => {
    try {
        const route = await db('routes').where({ id: req.params.id }).first();
        if (!route) return res.status(404).json({ error: 'Route not found' });
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch route' });
    }
});

// Create route (admin only)
router.post('/', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const [route] = await db('routes').insert(req.body).returning('*');
        res.status(201).json(route);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create route' });
    }
});

// Update route (admin only)
router.put('/:id', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const [route] = await db('routes').where({ id: req.params.id })
            .update({ ...req.body, updated_at: new Date() }).returning('*');
        res.json(route);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update route' });
    }
});

module.exports = router;
