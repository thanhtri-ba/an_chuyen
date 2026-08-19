"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = requireAdmin;
function requireAdmin(req, res, next) {
    if (!req.user) {
        res.status(401).json({
            error: 'Authentication required',
        });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({
            error: 'Admin permission required',
        });
        return;
    }
    next();
}
