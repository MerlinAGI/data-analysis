import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export const anthropic_call = async (prompt: string, output_prefix = '') => {
  const completion = await anthropic.completions.create({
    model: 'claude-2',
    max_tokens_to_sample: 4000,
    temperature: 0.0,
    prompt: `${Anthropic.HUMAN_PROMPT} ${prompt}${Anthropic.AI_PROMPT}${output_prefix}`
  });
  console.log(completion.completion);
  return completion.completion;
};

export const anthropic_json = async (prompt: string, isArray = true) => {
  const prefix = isArray ? '[' : '{';
  const text = await anthropic_call(prompt, ' ' + prefix);
  const json = JSON.parse(prefix + text);
  return json;
};
