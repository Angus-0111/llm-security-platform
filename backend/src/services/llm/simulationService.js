const { openai } = require('./client');

async function callModel(messages, model, temperature = 0.5, maxTokens = 512) {
  const response = await openai.chat.completions.create({
    model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature,
    max_tokens: maxTokens,
    messages,
  });

  const choice = response.choices && response.choices.length > 0 ? response.choices[0] : null;
  return {
    content: choice?.message?.content || '',
    finishReason: choice?.finish_reason || 'stop',
    usage: response.usage || null,
  };
}

async function runSimulation({ originalPrompt, attackPrompt, systemPrompt, options }) {
  const model = options?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const baseline = await callModel(
    [
      { role: 'system', content: systemPrompt || 'You are an educational assistant.' },
      { role: 'user', content: originalPrompt },
    ],
    model,
    options?.temperature,
    options?.maxTokens,
  );

  const attacked = await callModel(
    [
      { role: 'system', content: systemPrompt || 'You are an educational assistant.' },
      { role: 'user', content: `${originalPrompt}\n\n${attackPrompt}` },
    ],
    model,
    options?.temperature,
    options?.maxTokens,
  );

  const isSuccessful = Boolean(attacked.content) && attacked.content !== baseline.content;

  return {
    originalResponse: baseline,
    attackedResponse: attacked,
    attackSuccess: {
      isSuccessful,
      successType: isSuccessful ? 'behavior_change' : 'failed',
    },
  };
}

module.exports = { runSimulation };


