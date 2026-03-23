const express = require('express');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Dashboard summary
router.get('/dashboard', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [revenueToday] = await db('payments').where('status', 'completed')
            .whereRaw('DATE(created_at) = ?', [today]).sum('amount as total');
        const [revenueMonth] = await db('payments').where('status', 'completed')
            .whereRaw("DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)").sum('amount as total');

        const [activeTrips] = await db('trips').whereIn('status', ['departed', 'in_transit']).count('* as count');
        const [totalBookings] = await db('bookings').whereRaw('DATE(created_at) = ?', [today]).count('* as count');
        const [avgRating] = await db('ratings').avg('overall_rating as average');
        const [pendingAlerts] = await db('incidents').where('status', 'open').count('* as count');

        res.json({
            revenue: { today: revenueToday.total || 0, month: revenueMonth.total || 0 },
            active_trips: parseInt(activeTrips.count),
            bookings_today: parseInt(totalBookings.count),
            avg_satisfaction: parseFloat(avgRating.average || 0).toFixed(1),
            pending_alerts: parseInt(pendingAlerts.count)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Revenue report
router.get('/revenue', authenticate, authorize('admin', 'manager', 'finance'), async (req, res) => {
    try {
        const { from, to, group_by } = req.query;
        let query = db('payments').where('status', 'completed');
        if (from) query = query.where('created_at', '>=', from);
        if (to) query = query.where('created_at', '<=', to);

        if (group_by === 'payment_method') {
            const data = await query.groupBy('payment_method')
                .select('payment_method', db.raw('SUM(amount) as total'), db.raw('COUNT(*) as count'));
            return res.json(data);
        }

        const data = await query.select(
            db.raw("DATE(created_at) as date"),
            db.raw('SUM(amount) as total'),
            db.raw('COUNT(*) as transactions')
        ).groupByRaw('DATE(created_at)').orderBy('date');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate revenue report' });
    }
});

// Trip performance report
router.get('/trips', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const trips = await db('trips')
            .join('routes', 'trips.route_id', 'routes.id')
            .select(
                'routes.name as route',
                db.raw('COUNT(*) as total_trips'),
                db.raw('AVG(booked_seats) as avg_passengers'),
                db.raw("SUM(CASE WHEN trips.status = 'arrived' THEN 1 ELSE 0 END) as completed"),
                db.raw("SUM(CASE WHEN trips.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled")
            )
            .groupBy('routes.name')
            .orderBy('total_trips', 'desc');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate trip report' });
    }
});

// Employee productivity report
router.get('/employees', authenticate, authorize('admin', 'manager', 'hr'), async (req, res) => {
    try {
        const data = await db('shift_logs')
            .join('employees', 'shift_logs.employee_id', 'employees.id')
            .select(
                'employees.employee_id', 'employees.first_name', 'employees.last_name', 'employees.role',
                db.raw('COUNT(*) as total_shifts'),
                db.raw('SUM(passenger_count) as total_passengers'),
                db.raw('SUM(total_collections) as total_collections')
            )
            .groupBy('employees.id', 'employees.employee_id', 'employees.first_name', 'employees.last_name', 'employees.role')
            .orderBy('total_shifts', 'desc');
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate employee report' });
    }
});

module.exports = router;
