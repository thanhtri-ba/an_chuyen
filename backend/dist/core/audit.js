"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLog = auditLog;
const logger_1 = require("./logger");
function auditLog(entry) {
    logger_1.logger.info(entry.event, {
        category: 'audit',
        ...entry,
    });
}
