const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Update bus location (from staff app)
router.post('/update', authenticate, async (req, res) => {
    try {
        const { trip_id, latitude, longitude, speed, heading } = req.body;
        await db('trips').where({ id: trip_id }).update({
            current_latitude: latitude, current_longitude: longitude,
            current_speed: speed, updated_at: new Date()
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update location' });
    }
});

// Get bus location for a trip (passenger tracking)
router.get('/trip/:tripId', async (req, res) => {
    try {
        const trip = await db('trips')
            .join('buses', 'trips.bus_id', 'buses.id')
            .where('trips.id', req.params.tripId)
            .select('trips.current_latitude', 'trips.current_longitude', 'trips.current_speed',
                'trips.status', 'buses.plate_number', 'buses.bus_number')
            .first();
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch location' });
    }
});

// Get all active bus locations (admin dashboard)
router.get('/active', authenticate, async (req, res) => {
    try {
        const buses = await db('trips')
            .join('buses', 'trips.bus_id', 'buses.id')
            .join('routes', 'trips.route_id', 'routes.id')
            .whereIn('trips.status', ['departed', 'in_transit'])
            .whereNotNull('trips.current_latitude')
            .select('trips.id as trip_id', 'trips.current_latitude', 'trips.current_longitude',
                'trips.current_speed', 'trips.status',
                'buses.bus_number', 'buses.plate_number', 'buses.bus_type',
                'routes.origin_name', 'routes.destination_name');
        res.json(buses);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch active buses' });
    }
});

// Geo-tag a passenger
router.post('/geo-tag', authenticate, async (req, res) => {
    try {
        const { trip_id, passenger_id, latitude, longitude, notes, reason } = req.body;
        const [geoTag] = await db('geo_tags').insert({
            trip_id, tagged_by: req.user.id, passenger_id,
            latitude, longitude, notes, reason
        }).returning('*');
        res.status(201).json(geoTag);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create geo-tag' });
    }
});

module.exports = router;
