const express = require('express');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all buses
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, bus_type, terminal_id } = req.query;
        let query = db('buses').leftJoin('terminals', 'buses.home_terminal_id', 'terminals.id')
            .select('buses.*', 'terminals.name as terminal_name');
        if (status) query = query.where('buses.status', status);
        if (bus_type) query = query.where('buses.bus_type', bus_type);
        if (terminal_id) query = query.where('buses.home_terminal_id', terminal_id);
        const buses = await query.orderBy('buses.bus_number');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch fleet' });
    }
});

// Get bus by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const bus = await db('buses').where({ id: req.params.id }).first();
        if (!bus) return res.status(404).json({ error: 'Bus not found' });
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bus' });
    }
});

// Add bus (admin)
router.post('/', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const [bus] = await db('buses').insert(req.body).returning('*');
        res.status(201).json(bus);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add bus' });
    }
});

// Update bus
router.put('/:id', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const [bus] = await db('buses').where({ id: req.params.id })
            .update({ ...req.body, updated_at: new Date() }).returning('*');
        res.json(bus);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update bus' });
    }
});

// Get maintenance records for a bus
router.get('/:id/maintenance', authenticate, async (req, res) => {
    try {
        const records = await db('maintenance_records')
            .where({ bus_id: req.params.id })
            .orderBy('created_at', 'desc');
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch maintenance records' });
    }
});

// Add maintenance record
router.post('/:id/maintenance', authenticate, authorize('admin', 'manager', 'driver'), async (req, res) => {
    try {
        const [record] = await db('maintenance_records')
            .insert({ ...req.body, bus_id: req.params.id, reported_by: req.user.id })
            .returning('*');
        res.status(201).json(record);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add maintenance record' });
    }
});

module.exports = router;
