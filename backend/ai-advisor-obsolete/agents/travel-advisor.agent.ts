import { Agent } from '@mastra/core/agent';
import { searchTripsTool } from '../tools/search-trips.tool';
import { getUserBookingsTool } from '../tools/get-user-bookings.tool';
import { getPoliciesTool } from '../tools/get-policies.tool';
import { getSystemPrompt } from '../prompts/travel-advisor.prompt';

const provider = process.env.AI_PROVIDER || (process.env.GOOGLE_GENERATIVE_AI_API_KEY ? 'gemini' : 'ollama');
const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

let agentModel: any;

if (provider === 'ollama') {
  agentModel = {
    // OpenAI-compatible endpoint mapping for local Ollama
    url: `${ollamaUrl}/v1`,
    id: `ollama/${ollamaModel}`,
  };
} else if (provider === 'gemini') {
  agentModel = {
    id: process.env.GEMINI_MODEL || 'google/gemini-3.5-flash-lite',
  };
} else if (provider === 'openai') {
  agentModel = {
    provider: 'OPEN_AI',
    name: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  };
} else {
  agentModel = {
    url: 'http://127.0.0.1:11434/v1',
    id: 'ollama/qwen2.5:7b',
  };
}

export const travelAdvisorAgent = new Agent({
  id: 'busz-travel-advisor',
  name: 'An Chuyến Travel Advisor',
  instructions: getSystemPrompt(''),
  model: agentModel,
  tools: {
    searchTrips: searchTripsTool,
    getUserBookings: getUserBookingsTool,
    getPolicies: getPoliciesTool,
  },
});
