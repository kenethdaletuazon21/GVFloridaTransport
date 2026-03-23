const express = require('express');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

// Get payroll records
router.get('/', authenticate, authorize('admin', 'hr', 'finance'), async (req, res) => {
    try {
        const { period_start, period_end, status } = req.query;
        let query = db('payroll')
            .join('employees', 'payroll.employee_id', 'employees.id')
            .select('payroll.*', 'employees.first_name', 'employees.last_name', 'employees.employee_id as emp_id', 'employees.role');
        if (period_start) query = query.where('payroll.period_start', '>=', period_start);
        if (period_end) query = query.where('payroll.period_end', '<=', period_end);
        if (status) query = query.where('payroll.status', status);
        const records = await query.orderBy('payroll.period_end', 'desc');
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch payroll' });
    }
});

// Generate payroll for a period
router.post('/generate', authenticate, authorize('admin', 'hr', 'finance'), async (req, res) => {
    try {
        const { period_start, period_end } = req.body;
        const employees = await db('employees').where({ is_active: true });
        const results = [];

        for (const emp of employees) {
            const shifts = await db('shift_logs')
                .where({ employee_id: emp.id })
                .whereBetween('clock_in', [period_start, period_end]);

            const trip_count = shifts.length;
            const base_pay = parseFloat(emp.base_salary) || 0;
            const trip_pay = emp.salary_type === 'per_trip' ? trip_count * (parseFloat(emp.base_salary) || 500) : 0;
            const net_pay = base_pay + trip_pay;

            const [payroll] = await db('payroll').insert({
                employee_id: emp.id, period_start, period_end,
                base_pay, trip_pay, net_pay, status: 'draft'
            }).returning('*');
            results.push(payroll);
        }

        res.status(201).json({ message: `Generated payroll for ${results.length} employees`, records: results });
    } catch (err) {
        res.status(500).json({ error: 'Payroll generation failed' });
    }
});

// Approve payroll
router.put('/:id/approve', authenticate, authorize('admin', 'finance'), async (req, res) => {
    try {
        const [payroll] = await db('payroll').where({ id: req.params.id })
            .update({ status: 'approved', updated_at: new Date() }).returning('*');
        res.json(payroll);
    } catch (err) {
        res.status(500).json({ error: 'Failed to approve payroll' });
    }
});

// Mark as paid
router.put('/:id/pay', authenticate, authorize('admin', 'finance'), async (req, res) => {
    try {
        const [payroll] = await db('payroll').where({ id: req.params.id })
            .update({ status: 'paid', paid_date: new Date(), updated_at: new Date() }).returning('*');
        res.json(payroll);
    } catch (err) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

module.exports = router;
