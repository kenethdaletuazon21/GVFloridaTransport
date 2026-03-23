const express = require('express');
const db = require('../database/connection');
const router = express.Router();

// Kiosk - Search trips (no auth required)
router.get('/trips', async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        let query = db('trips')
            .join('routes', 'trips.route_id', 'routes.id')
            .join('buses', 'trips.bus_id', 'buses.id')
            .where('trips.status', 'scheduled')
            .where('trips.scheduled_departure', '>=', new Date())
            .select('trips.id', 'trips.trip_number', 'trips.scheduled_departure', 'trips.available_seats', 'trips.booked_seats',
                'routes.name as route_name', 'routes.origin_name', 'routes.destination_name', 'routes.base_fare',
                'buses.bus_type', 'buses.bus_number');
        if (origin) query = query.whereILike('routes.origin_name', `%${origin}%`);
        if (destination) query = query.whereILike('routes.destination_name', `%${destination}%`);
        if (date) query = query.whereRaw('DATE(trips.scheduled_departure) = ?', [date]);
        const trips = await query.orderBy('trips.scheduled_departure');
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: 'Failed to search trips' });
    }
});

// Kiosk - Quick booking (minimal auth)
router.post('/book', async (req, res) => {
    try {
        const { trip_id, seat_number, passenger_name, passenger_phone, payment_method } = req.body;
        const trip = await db('trips').join('routes', 'trips.route_id', 'routes.id')
            .where('trips.id', trip_id).select('routes.base_fare').first();
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        const booking_reference = 'KSK-' + Date.now().toString(36).toUpperCase();
        const [booking] = await db('bookings').insert({
            booking_reference, trip_id, seat_number,
            passenger_name, passenger_phone,
            fare_amount: trip.base_fare, total_amount: trip.base_fare,
            status: 'confirmed', booking_source: 'kiosk'
        }).returning('*');

        await db('trips').where({ id: trip_id }).increment('booked_seats', 1);
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Booking failed' });
    }
});

// Kiosk - Group booking
router.post('/group-book', async (req, res) => {
    try {
        const { trip_id, passengers, payment_method } = req.body; // passengers: [{ name, phone, seat }]
        const trip = await db('trips').join('routes', 'trips.route_id', 'routes.id')
            .where('trips.id', trip_id).select('routes.base_fare').first();

        const bookings = [];
        for (const p of passengers) {
            const booking_reference = 'KSK-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase();
            const [booking] = await db('bookings').insert({
                booking_reference, trip_id, seat_number: p.seat,
                passenger_name: p.name, passenger_phone: p.phone,
                fare_amount: trip.base_fare, total_amount: trip.base_fare,
                status: 'confirmed', booking_source: 'kiosk'
            }).returning('*');
            bookings.push(booking);
        }

        await db('trips').where({ id: trip_id }).increment('booked_seats', passengers.length);
        res.status(201).json({ bookings, total: parseFloat(trip.base_fare) * passengers.length });
    } catch (err) {
        res.status(500).json({ error: 'Group booking failed' });
    }
});

// Station info
router.get('/station-info', async (req, res) => {
    try {
        const terminals = await db('terminals').where({ is_active: true });
        res.json(terminals);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch station info' });
    }
});

// Active promotions
router.get('/promotions', async (req, res) => {
    try {
        const promos = await db('promotions')
            .where({ is_active: true })
            .where('valid_until', '>=', new Date())
            .orderBy('valid_until');
        res.json(promos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch promotions' });
    }
});

module.exports = router;
