"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactFormat = void 0;
const winston_1 = require("winston");
const SENSITIVE_KEYS = [
    'authorization',
    'cookie',
    'set-cookie',
    'password',
    'otp',
    'token',
    'accesstoken',
    'refreshtoken',
    'secret',
    'apikey',
    'cardnumber',
    'cvv',
];
const redactValue = '[REDACTED]';
function redactObject(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;
    if (Array.isArray(obj)) {
        return obj.map(redactObject);
    }
    const redacted = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
            redacted[key] = redactValue;
        }
        else if (typeof value === 'object') {
            redacted[key] = redactObject(value);
        }
        else {
            redacted[key] = value;
        }
    }
    return redacted;
}
exports.redactFormat = (0, winston_1.format)((info) => {
    // Redact the message if it's an object (though usually info.message is string)
    // Redact meta objects attached to info
    const redactedInfo = redactObject(info);
    // Ensure level and message are preserved properly if they were mutated poorly
    if (info.level)
        redactedInfo.level = info.level;
    if (info.message)
        redactedInfo.message = info.message;
    return redactedInfo;
});
