const OpenAI = require('openai');

function createMockOpenAI() {
  return {
    chat: {
      completions: {
        create: async ({ messages }) => {
          const userMsg = Array.isArray(messages)
            ? messages.find((m) => m.role === 'user')?.content || ''
            : '';
          return {
            choices: [
              {
                message: {
                  content: `[MOCK RESPONSE] ${userMsg.substring(0, 120)}`,
                },
                finish_reason: 'stop',
              },
            ],
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          };
        },
      },
    },
  };
}

let openai;
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (err) {
  // Fallback to mock client for local development without API key
  console.warn('OPENAI_API_KEY not set, using mock OpenAI client for simulations.');
  openai = createMockOpenAI();
}

module.exports = { openai };


