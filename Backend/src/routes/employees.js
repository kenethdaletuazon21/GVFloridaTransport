const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all employees
router.get('/', authenticate, authorize('admin', 'manager', 'hr'), async (req, res) => {
    try {
        const { role, is_active } = req.query;
        let query = db('employees').select('id', 'employee_id', 'email', 'phone', 'first_name', 'last_name', 'role', 'license_number', 'license_expiry', 'base_salary', 'salary_type', 'is_active', 'created_at');
        if (role) query = query.where({ role });
        if (is_active !== undefined) query = query.where({ is_active: is_active === 'true' });
        const employees = await query.orderBy('last_name');
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Get employee by ID
router.get('/:id', authenticate, authorize('admin', 'manager', 'hr'), async (req, res) => {
    try {
        const employee = await db('employees').where({ id: req.params.id }).first();
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        const { password_hash, ...safeEmployee } = employee;
        res.json(safeEmployee);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// Create employee
router.post('/', authenticate, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { password, ...data } = req.body;
        const password_hash = await bcrypt.hash(password || 'GVFlorida2026!', 12);
        const [employee] = await db('employees').insert({ ...data, password_hash }).returning('*');
        const { password_hash: _, ...safeEmployee } = employee;
        res.status(201).json(safeEmployee);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create employee' });
    }
});

// Update employee
router.put('/:id', authenticate, authorize('admin', 'hr'), async (req, res) => {
    try {
        const { password, ...data } = req.body;
        if (password) data.password_hash = await bcrypt.hash(password, 12);
        const [employee] = await db('employees').where({ id: req.params.id })
            .update({ ...data, updated_at: new Date() }).returning('*');
        const { password_hash, ...safeEmployee } = employee;
        res.json(safeEmployee);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Attendance / shift logs for employee
router.get('/:id/shifts', authenticate, authorize('admin', 'manager', 'hr'), async (req, res) => {
    try {
        const shifts = await db('shift_logs')
            .where({ employee_id: req.params.id })
            .orderBy('clock_in', 'desc').limit(50);
        res.json(shifts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch shifts' });
    }
});

module.exports = router;
