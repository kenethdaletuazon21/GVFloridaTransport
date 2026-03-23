const jwt = require('jsonwebtoken');
const db = require('../database/connection');

// Verify JWT token
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Role-based access control
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}

// Audit logging middleware
async function auditLog(req, res, next) {
    const originalSend = res.json.bind(res);
    res.json = function (body) {
        if (req.method !== 'GET' && res.statusCode < 400) {
            db('audit_logs').insert({
                user_id: req.user?.type === 'user' ? req.user.id : null,
                employee_id: req.user?.type === 'employee' ? req.user.id : null,
                action: `${req.method} ${req.originalUrl}`,
                resource_type: req.originalUrl.split('/')[2],
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
            }).catch(console.error);
        }
        return originalSend(body);
    };
    next();
}

module.exports = { authenticate, authorize, auditLog };
