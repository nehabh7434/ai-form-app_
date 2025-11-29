// AI client wrapper using node-fetch
const fetch = require('node-fetch');
require('dotenv').config();

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const EMBED_MODEL = process.env.EMBED_MODEL || 'text-embedding-3-small';
const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

// ============ EMBEDDINGS ============ //
async function embedText(text) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text
    })
  });

  const j = await res.json();
  if (!j.data || !j.data[0]) throw new Error('Embedding failed: ' + JSON.stringify(j));
  return j.data[0].embedding;
}

// ============ FORM SCHEMA GENERATION ============ //
async function generateFormSchema(prompt, retrievedContext = []) {
  const systemPrompt = `
You are an intelligent form schema generator.

Here is relevant user form history for reference:
${JSON.stringify(retrievedContext, null, 2)}

Now generate a NEW form schema for this request:
"${prompt}"

Rules:
- Output ONLY valid JSON (no comments, no markdown).
- Must include:
    * "summary" (short description)
    * "version": number
    * "fields": array of objects:
        { name, label, type, required, validations? }
- Support file/image fields using type="file" or "image".
- Keep output functional, minimal, and clean.
`;

  const payload = {
    model: LLM_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate JSON only for: ${prompt}` }
    ],
    max_tokens: 1200,
    temperature: 0.1
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const j = await res.json();
  if (!j.choices || !j.choices[0]) throw new Error('LLM failed: ' + JSON.stringify(j));

  const content = j.choices[0].message.content.trim();

  // Try normal JSON parse
  try {
    return JSON.parse(content);
  } catch (err) {
    // Fallback: extract only JSON part
    const start = content.indexOf('{');
    const end = content.lastIndexOf('}');
    return JSON.parse(content.slice(start, end + 1));
  }
}

module.exports = { embedText, generateFormSchema };

