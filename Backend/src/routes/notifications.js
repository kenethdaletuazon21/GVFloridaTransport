const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get notifications
router.get('/', authenticate, async (req, res) => {
    try {
        const field = req.user.type === 'user' ? 'user_id' : 'employee_id';
        const notifications = await db('notifications')
            .where({ [field]: req.user.id })
            .orderBy('created_at', 'desc')
            .limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Mark as read
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        await db('notifications').where({ id: req.params.id }).update({ is_read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Mark all as read
router.put('/read-all', authenticate, async (req, res) => {
    try {
        const field = req.user.type === 'user' ? 'user_id' : 'employee_id';
        await db('notifications').where({ [field]: req.user.id, is_read: false })
            .update({ is_read: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notifications' });
    }
});

// Send notification (admin)
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, message, type, user_id, employee_id, data } = req.body;
        const [notification] = await db('notifications').insert({
            title, message, type, user_id, employee_id, data: JSON.stringify(data || {})
        }).returning('*');
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

module.exports = router;
