"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const autocannon_1 = __importDefault(require("autocannon"));
const BASE_URL = "http://localhost:3000";
const TIERS = [
    { connections: 100, duration: 15, label: "Tier 1 — 100 users" },
    { connections: 500, duration: 15, label: "Tier 2 — 500 users" },
    { connections: 1000, duration: 15, label: "Tier 3 — 1000 users" },
];
const ENDPOINTS = ["/api/promotions", "/api/trips"];
async function runTier(tier, endpoint) {
    return new Promise((resolve, reject) => {
        const instance = (0, autocannon_1.default)({
            url: `${BASE_URL}${endpoint}`,
            connections: tier.connections,
            duration: tier.duration,
            headers: { "accept-encoding": "gzip" },
        }, (err, result) => {
            if (err)
                return reject(err);
            resolve({
                tier: tier.label,
                endpoint,
                requests: {
                    total: result.requests.total,
                    average: Math.round(result.requests.average),
                },
                latency: {
                    average: Math.round(result.latency.average),
                    p50: Math.round(result.latency.p50),
                    p99: Math.round(result.latency.p99),
                    max: Math.round(result.latency.max),
                },
                throughput: {
                    average: Math.round(result.throughput.average / 1024),
                },
                errors: result.errors,
                timeouts: result.timeouts,
                non2xx: result.non2xx,
            });
        });
        autocannon_1.default.track(instance, { renderLatencyTable: false, renderProgressBar: true });
    });
}
function printResult(r) {
    const healthy = r.errors === 0 && r.timeouts === 0 && r.latency.p99 < 1000;
    console.log(`\n[${"=".repeat(58)}]`);
    console.log(`  ${r.tier} | ${r.endpoint}`);
    console.log(`[${"=".repeat(58)}]`);
    console.log(`  Requests/s (avg) : ${r.requests.average}`);
    console.log(`  Total Requests   : ${r.requests.total}`);
    console.log(`  Throughput (avg) : ${r.throughput.average} KB/s`);
    console.log(`  Latency avg      : ${r.latency.average} ms`);
    console.log(`  Latency p50      : ${r.latency.p50} ms`);
    console.log(`  Latency p99      : ${r.latency.p99} ms`);
    console.log(`  Latency max      : ${r.latency.max} ms`);
    console.log(`  Errors           : ${r.errors}`);
    console.log(`  Timeouts         : ${r.timeouts}`);
    console.log(`  Non-2xx          : ${r.non2xx}`);
    console.log(`  Status           : ${healthy ? "PASS" : "DEGRADED"}`);
}
async function main() {
    console.log("\n  An Chuyến Backend — Load Test Suite (Sprint 3.4)");
    console.log(`  Target  : ${BASE_URL}`);
    console.log("  Tool    : autocannon\n");
    const allResults = [];
    for (const tier of TIERS) {
        for (const endpoint of ENDPOINTS) {
            console.log(`\n  >> ${tier.label} on ${endpoint} (${tier.duration}s)...`);
            const result = await runTier(tier, endpoint);
            allResults.push(result);
            printResult(result);
            await new Promise((r) => setTimeout(r, 2000));
        }
    }
    console.log("\n\n  ====== FINAL SUMMARY ======");
    console.log("  Tier                    | Endpoint          | Req/s  | p99 ms | Errors");
    console.log("  ------------------------|-------------------|--------|--------|-------");
    for (const r of allResults) {
        const tier = r.tier.padEnd(23);
        const endpoint = r.endpoint.padEnd(17);
        const reqs = String(r.requests.average).padEnd(6);
        const p99 = String(r.latency.p99).padEnd(6);
        const errs = r.errors + r.timeouts;
        console.log(`  ${tier} | ${endpoint} | ${reqs} | ${p99} | ${errs}`);
    }
}
main().catch(console.error);
