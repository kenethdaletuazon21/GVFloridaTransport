const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register new user (passenger)
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
    body('phone').optional().isMobilePhone(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password, first_name, last_name, phone } = req.body;

        const existing = await db('users').where({ email }).first();
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        const password_hash = await bcrypt.hash(password, 12);
        const [user] = await db('users').insert({
            email, password_hash, first_name, last_name, phone
        }).returning(['id', 'email', 'first_name', 'last_name']);

        const token = jwt.sign(
            { id: user.id, email: user.email, type: 'user', role: 'passenger' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({ user, token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        const user = await db('users').where({ email, is_active: true }).first();

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        await db('users').where({ id: user.id }).update({ last_login: new Date() });

        const token = jwt.sign(
            { id: user.id, email: user.email, type: 'user', role: 'passenger' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, wallet_balance: user.wallet_balance, loyalty_points: user.loyalty_points },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Employee/Staff login
router.post('/staff/login', [
    body('employee_id').notEmpty(),
    body('password').notEmpty(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { employee_id, password } = req.body;
        const employee = await db('employees').where({ employee_id, is_active: true }).first();

        if (!employee || !(await bcrypt.compare(password, employee.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: employee.id, employee_id: employee.employee_id, type: 'employee', role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            employee: { id: employee.id, employee_id: employee.employee_id, first_name: employee.first_name, last_name: employee.last_name, role: employee.role },
            token
        });
    } catch (err) {
        console.error('Staff login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Delete account
router.delete('/account', authenticate, async (req, res) => {
    try {
        await db('users').where({ id: req.user.id }).update({
            is_active: false,
            deleted_at: new Date(),
            email: db.raw("'deleted_' || id || '@deleted.com'"),
            phone: null,
            first_name: 'Deleted',
            last_name: 'User',
            wallet_balance: 0,
        });
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Account deletion error:', err);
        res.status(500).json({ error: 'Account deletion failed' });
    }
});

module.exports = router;
