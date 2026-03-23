const express = require('express');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get trips (with filters)
router.get('/', async (req, res) => {
    try {
        const { date, route_id, status, driver_id } = req.query;
        let query = db('trips')
            .join('routes', 'trips.route_id', 'routes.id')
            .join('buses', 'trips.bus_id', 'buses.id')
            .leftJoin('employees as driver', 'trips.driver_id', 'driver.id')
            .leftJoin('employees as conductor', 'trips.conductor_id', 'conductor.id')
            .select(
                'trips.*',
                'routes.name as route_name', 'routes.origin_name', 'routes.destination_name',
                'buses.bus_number', 'buses.plate_number', 'buses.bus_type',
                db.raw("CONCAT(driver.first_name, ' ', driver.last_name) as driver_name"),
                db.raw("CONCAT(conductor.first_name, ' ', conductor.last_name) as conductor_name")
            );

        if (date) query = query.whereRaw('DATE(trips.scheduled_departure) = ?', [date]);
        if (route_id) query = query.where('trips.route_id', route_id);
        if (status) query = query.where('trips.status', status);
        if (driver_id) query = query.where('trips.driver_id', driver_id);

        const trips = await query.orderBy('trips.scheduled_departure', 'asc');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Get assigned trip for staff
router.get('/my-trips', authenticate, async (req, res) => {
    try {
        const trips = await db('trips')
            .join('routes', 'trips.route_id', 'routes.id')
            .join('buses', 'trips.bus_id', 'buses.id')
            .where(function () {
                this.where('trips.driver_id', req.user.id)
                    .orWhere('trips.conductor_id', req.user.id);
            })
            .where('trips.scheduled_departure', '>=', new Date(Date.now() - 24 * 60 * 60 * 1000))
            .select('trips.*', 'routes.name as route_name', 'routes.origin_name', 'routes.destination_name',
                'buses.bus_number', 'buses.plate_number', 'buses.bus_type')
            .orderBy('trips.scheduled_departure', 'asc');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch trips' });
    }
});

// Get passenger manifest for a trip
router.get('/:id/manifest', authenticate, async (req, res) => {
    try {
        const bookings = await db('bookings')
            .where({ trip_id: req.params.id })
            .whereIn('status', ['confirmed', 'boarded'])
            .orderBy('seat_number');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch manifest' });
    }
});

// Start trip (staff)
router.put('/:id/start', authenticate, authorize('driver', 'conductor'), async (req, res) => {
    try {
        const [trip] = await db('trips').where({ id: req.params.id })
            .update({ status: 'departed', actual_departure: new Date(), updated_at: new Date() })
            .returning('*');
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to start trip' });
    }
});

// End trip (staff)
router.put('/:id/end', authenticate, authorize('driver', 'conductor'), async (req, res) => {
    try {
        const [trip] = await db('trips').where({ id: req.params.id })
            .update({ status: 'arrived', actual_arrival: new Date(), updated_at: new Date() })
            .returning('*');
        // Mark all boarded bookings as completed
        await db('bookings').where({ trip_id: req.params.id, status: 'boarded' })
            .update({ status: 'completed' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to end trip' });
    }
});

// Validate ticket (staff - scan QR)
router.post('/:id/validate', authenticate, authorize('conductor', 'inspector'), async (req, res) => {
    try {
        const { booking_reference, seat_number } = req.body;
        const booking = await db('bookings')
            .where({ trip_id: req.params.id, booking_reference, status: 'confirmed' })
            .first();
        if (!booking) return res.status(404).json({ error: 'Invalid ticket' });

        const [updated] = await db('bookings').where({ id: booking.id })
            .update({ status: 'boarded', boarded_at: new Date() }).returning('*');
        res.json({ message: 'Ticket validated', booking: updated });
    } catch (err) {
        res.status(500).json({ error: 'Validation failed' });
    }
});

// Create trip (admin)
router.post('/', authenticate, authorize('admin', 'manager'), async (req, res) => {
    try {
        const trip_number = 'TRP-' + Date.now().toString(36).toUpperCase();
        const bus = await db('buses').where({ id: req.body.bus_id }).first();
        const [trip] = await db('trips').insert({
            ...req.body, trip_number, available_seats: bus.total_seats
        }).returning('*');
        res.status(201).json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create trip' });
    }
});

module.exports = router;
