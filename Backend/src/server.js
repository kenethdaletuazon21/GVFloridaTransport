require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const routeRoutes = require('./routes/routes');
const fleetRoutes = require('./routes/fleet');
const tripRoutes = require('./routes/trips');
const paymentRoutes = require('./routes/payments');
const walletRoutes = require('./routes/wallet');
const employeeRoutes = require('./routes/employees');
const payrollRoutes = require('./routes/payroll');
const reportRoutes = require('./routes/reports');
const kioskRoutes = require('./routes/kiosk');
const trackingRoutes = require('./routes/tracking');
const notificationRoutes = require('./routes/notifications');

const app = express();
const server = http.createServer(app);

// Socket.IO for real-time tracking
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/kiosk', kioskRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'GV Florida Backend', timestamp: new Date().toISOString() });
});

// Socket.IO - Real-time GPS tracking
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Staff sends GPS location updates
    socket.on('location:update', (data) => {
        const { tripId, busId, latitude, longitude, speed, heading } = data;
        // Broadcast to passengers tracking this trip
        io.to(`trip:${tripId}`).emit('bus:location', {
            tripId, busId, latitude, longitude, speed, heading,
            timestamp: new Date().toISOString()
        });
    });

    // Passenger subscribes to trip tracking
    socket.on('trip:subscribe', (tripId) => {
        socket.join(`trip:${tripId}`);
    });

    socket.on('trip:unsubscribe', (tripId) => {
        socket.leave(`trip:${tripId}`);
    });

    // Emergency/SOS alerts
    socket.on('sos:alert', (data) => {
        io.to('admin').emit('sos:received', data);
    });

    // Admin room
    socket.on('admin:join', () => {
        socket.join('admin');
    });

    // On-board announcements
    socket.on('announcement:send', (data) => {
        io.to(`trip:${data.tripId}`).emit('announcement:received', data);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`GV Florida Backend running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io };
