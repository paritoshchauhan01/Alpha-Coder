"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.errorHandler = errorHandler;
const utils_1 = require("./utils");
function requireAuth(req, res, next) {
    try {
        const token = (0, utils_1.extractToken)(req.headers.authorization);
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = (0, utils_1.verifyJWT)(token);
        req.user = { userId: decoded.userId, email: decoded.email };
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
    }
    if (err.code === 11000) {
        return res.status(409).json({ error: 'Resource already exists', details: 'A user with this email already exists' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}
