const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Process payment
router.post('/', authenticate, async (req, res) => {
    try {
        const { booking_id, amount, payment_method, payment_type } = req.body;
        const transaction_id = 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const receipt_number = 'RCT-' + Date.now().toString(36).toUpperCase();

        const [payment] = await db('payments').insert({
            transaction_id, user_id: req.user.type === 'user' ? req.user.id : null,
            booking_id, amount, payment_method,
            payment_type: payment_type || 'ticket_purchase',
            processed_by: req.user.type === 'employee' ? req.user.id : null,
            receipt_number, status: 'completed'
        }).returning('*');

        // If booking payment, update booking status
        if (booking_id) {
            await db('bookings').where({ id: booking_id }).update({ status: 'confirmed' });
        }

        res.status(201).json(payment);
    } catch (err) {
        console.error('Payment error:', err);
        res.status(500).json({ error: 'Payment processing failed' });
    }
});

// Get payment history
router.get('/history', authenticate, async (req, res) => {
    try {
        const payments = await db('payments')
            .where(function () {
                if (req.user.type === 'user') this.where('user_id', req.user.id);
                else this.where('processed_by', req.user.id);
            })
            .orderBy('created_at', 'desc')
            .limit(50);
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payment history' });
    }
});

// Get receipt
router.get('/:id/receipt', authenticate, async (req, res) => {
    try {
        const payment = await db('payments')
            .leftJoin('bookings', 'payments.booking_id', 'bookings.id')
            .leftJoin('trips', 'bookings.trip_id', 'trips.id')
            .leftJoin('routes', 'trips.route_id', 'routes.id')
            .where('payments.id', req.params.id)
            .select('payments.*', 'bookings.seat_number', 'bookings.passenger_name',
                'routes.origin_name', 'routes.destination_name', 'trips.scheduled_departure')
            .first();
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        res.json({
            receipt_number: payment.receipt_number,
            transaction_id: payment.transaction_id,
            date: payment.created_at,
            amount: payment.amount,
            payment_method: payment.payment_method,
            passenger: payment.passenger_name,
            origin: payment.origin_name,
            destination: payment.destination_name,
            seat: payment.seat_number,
            departure: payment.scheduled_departure,
            company: 'GV Florida Transport, Inc.',
            address: '832 AH Lacson Ave. Cor. Earnshaw St. Sampaloc, Manila'
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate receipt' });
    }
});

module.exports = router;
