"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelAdvisorAgent = void 0;
const agent_1 = require("@mastra/core/agent");
const search_trips_tool_1 = require("../tools/search-trips.tool");
const get_user_bookings_tool_1 = require("../tools/get-user-bookings.tool");
const get_policies_tool_1 = require("../tools/get-policies.tool");
const travel_advisor_prompt_1 = require("../prompts/travel-advisor.prompt");
const provider = process.env.AI_PROVIDER || (process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'gemini' : 'ollama');
const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
let agentModel;
if (provider === 'ollama') {
    agentModel = {
        // OpenAI-compatible endpoint mapping for local Ollama
        url: `${ollamaUrl}/v1`,
        id: `ollama/${ollamaModel}`,
    };
}
else if (provider === 'gemini') {
    agentModel = {
        id: process.env.GEMINI_MODEL || 'google/gemini-3.5-flash-lite',
    };
}
else if (provider === 'openai') {
    agentModel = {
        provider: 'OPEN_AI',
        name: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
}
else {
    agentModel = {
        url: 'http://127.0.0.1:11434/v1',
        id: 'ollama/qwen2.5:7b',
    };
}
exports.travelAdvisorAgent = new agent_1.Agent({
    id: 'busz-travel-advisor',
    name: 'An Chuyến Travel Advisor',
    instructions: (0, travel_advisor_prompt_1.getSystemPrompt)(''),
    model: agentModel,
    tools: {
        searchTrips: search_trips_tool_1.searchTripsTool,
        getUserBookings: get_user_bookings_tool_1.getUserBookingsTool,
        getPolicies: get_policies_tool_1.getPoliciesTool,
    },
});
