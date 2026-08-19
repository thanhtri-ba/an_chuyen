"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncContext = void 0;
exports.getRequestContext = getRequestContext;
const node_async_hooks_1 = require("node:async_hooks");
exports.asyncContext = new node_async_hooks_1.AsyncLocalStorage();
function getRequestContext() {
    return exports.asyncContext.getStore();
}
