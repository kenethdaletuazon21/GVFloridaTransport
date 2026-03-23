const express = require('express');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Search available trips
router.get('/search', async (req, res) => {
    try {
        const { origin, destination, date, bus_type } = req.query;
        let query = db('trips')
            .join('routes', 'trips.route_id', 'routes.id')
            .join('buses', 'trips.bus_id', 'buses.id')
            .where('trips.status', 'scheduled')
            .where('trips.scheduled_departure', '>=', new Date())
            .select(
                'trips.*',
                'routes.name as route_name', 'routes.origin_name', 'routes.destination_name',
                'routes.base_fare', 'routes.fare_matrix',
                'buses.bus_type', 'buses.bus_number', 'buses.total_seats', 'buses.amenities as bus_amenities'
            );

        if (origin) query = query.whereILike('routes.origin_name', `%${origin}%`);
        if (destination) query = query.whereILike('routes.destination_name', `%${destination}%`);
        if (date) query = query.whereRaw('DATE(trips.scheduled_departure) = ?', [date]);
        if (bus_type) query = query.where('buses.bus_type', bus_type);

        const trips = await query.orderBy('trips.scheduled_departure', 'asc');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Get seat map for a trip
router.get('/:tripId/seats', async (req, res) => {
    try {
        const trip = await db('trips')
            .join('buses', 'trips.bus_id', 'buses.id')
            .where('trips.id', req.params.tripId)
            .select('buses.seat_layout', 'buses.total_seats')
            .first();

        const bookedSeats = await db('bookings')
            .where({ trip_id: req.params.tripId })
            .whereIn('status', ['reserved', 'confirmed', 'boarded'])
            .select('seat_number');

        res.json({
            seat_layout: trip.seat_layout,
            total_seats: trip.total_seats,
            booked_seats: bookedSeats.map(b => b.seat_number)
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
});

// Create booking
router.post('/', authenticate, async (req, res) => {
    try {
        const { trip_id, seat_number, passenger_name, passenger_phone, baggage, payment_method } = req.body;

        // Check seat availability
        const existing = await db('bookings')
            .where({ trip_id, seat_number })
            .whereIn('status', ['reserved', 'confirmed', 'boarded'])
            .first();
        if (existing) return res.status(409).json({ error: 'Seat already taken' });

        // Get fare
        const trip = await db('trips').join('routes', 'trips.route_id', 'routes.id')
            .where('trips.id', trip_id).select('routes.base_fare').first();

        const fare_amount = parseFloat(trip.base_fare);
        const baggage_fee = baggage?.declared_value ? Math.max(0, (baggage.declared_value - 500) * 0.01) : 0;
        const total_amount = fare_amount + baggage_fee;

        const booking_reference = 'GVF-' + Date.now().toString(36).toUpperCase();
        const qr_data = JSON.stringify({ ref: booking_reference, trip: trip_id, seat: seat_number });
        const qr_code = await QRCode.toDataURL(qr_data);

        const [booking] = await db('bookings').insert({
            booking_reference,
            user_id: req.user.id,
            trip_id,
            seat_number,
            fare_amount,
            baggage_fee,
            total_amount,
            passenger_name: passenger_name || `${req.user.first_name} ${req.user.last_name}`,
            passenger_phone,
            qr_code,
            baggage: JSON.stringify(baggage || {}),
            status: payment_method ? 'confirmed' : 'reserved',
            reserved_until: new Date(Date.now() + 15 * 60 * 1000),
        }).returning('*');

        // Update trip booked seats
        await db('trips').where({ id: trip_id }).increment('booked_seats', 1);

        res.status(201).json(booking);
    } catch (err) {
        console.error('Booking error:', err);
        res.status(500).json({ error: 'Booking failed' });
    }
});

// Get booking details
router.get('/:id', authenticate, async (req, res) => {
    try {
        const booking = await db('bookings')
            .join('trips', 'bookings.trip_id', 'trips.id')
            .join('routes', 'trips.route_id', 'routes.id')
            .join('buses', 'trips.bus_id', 'buses.id')
            .where('bookings.id', req.params.id)
            .select(
                'bookings.*',
                'trips.scheduled_departure', 'trips.trip_number', 'trips.status as trip_status',
                'routes.name as route_name', 'routes.origin_name', 'routes.destination_name',
                'buses.bus_number', 'buses.plate_number', 'buses.bus_type'
            )
            .first();
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// Cancel booking
router.put('/:id/cancel', authenticate, async (req, res) => {
    try {
        const [booking] = await db('bookings')
            .where({ id: req.params.id, user_id: req.user.id })
            .whereIn('status', ['reserved', 'confirmed'])
            .update({ status: 'cancelled', updated_at: new Date() })
            .returning('*');
        if (!booking) return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });

        await db('trips').where({ id: booking.trip_id }).decrement('booked_seats', 1);
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Cancellation failed' });
    }
});

module.exports = router;
