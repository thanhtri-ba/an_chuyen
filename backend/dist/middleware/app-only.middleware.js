"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictToApp = restrictToApp;
/**
 * Middleware to restrict access to only mobile application clients.
 * Expects a custom header 'x-client-platform' with the value 'mobile'.
 */
function restrictToApp(req, res, next) {
    const clientPlatform = req.headers['x-client-platform'];
    if (clientPlatform === 'mobile') {
        next();
    }
    else {
        res.status(403).json({
            message: 'Access forbidden. This resource is only accessible from the mobile app.',
        });
    }
}
