const jwt = require('jsonwebtoken');
const { Admin } = require('../models/admin.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ status: 'error', message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.query().findById(decoded.id);

        if (!admin || admin.status !== 'active') {
            return res.status(401).json({ status: 'error', message: 'Authentication failed' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
};

const isSuperAdmin = async (req, res, next) => {
    if (req.admin.role !== 'super_admin') {
        return res.status(403).json({ status: 'error', message: 'Super admin access required' });
    }
    next();
};

module.exports = { auth, isSuperAdmin };
