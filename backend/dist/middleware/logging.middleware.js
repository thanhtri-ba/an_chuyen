"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = loggingMiddleware;
const logger_1 = require("../core/logger");
function loggingMiddleware(req, res, next) {
    const startTime = Date.now();
    let logged = false;
    const logRequest = () => {
        if (logged)
            return;
        logged = true;
        const durationMs = Date.now() - startTime;
        const isHealthCheck = req.path === '/health';
        const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
        const logData = {
            event: 'http_request_completed',
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs,
        };
        if (isHealthCheck) {
            if (isSuccess) {
                // Suppress successful health check from info logs
                logger_1.logger.debug('health_check', logData);
            }
            else {
                logger_1.logger.warn('health_check_failed', logData);
            }
        }
        else {
            logger_1.logger.info('http_request_completed', logData);
        }
    };
    res.on('finish', logRequest);
    res.on('close', logRequest);
    next();
}
