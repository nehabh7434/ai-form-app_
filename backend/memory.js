const Form = require("./models/Form.js");
const { cosine } = require("./utils");
const { embedText } = require("./ai");

// simple cosine for arrays
function cosineArray(a, b) {
  if (!a || !b) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * (b[i] || 0);
    na += a[i] * a[i];
    nb += (b[i] || 0) * (b[i] || 0);
  }
  na = Math.sqrt(na); 
  nb = Math.sqrt(nb);
  if (na === 0 || nb === 0) return 0;
  return dot / (na * nb);
}

async function retrieveRelevantForms(userId, prompt, topK = 5) {
  // embed the query text
  const queryEmbedding = await embedText(prompt);

  // get all user's forms
  const forms = await Form.find({ userId })
    .select("schema summary embedding prompt createdAt")
    .lean();

  const scored = forms.map(f => ({
    form: f,
    score: cosineArray(queryEmbedding, f.embedding || [])
  }));

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, topK).map(s => ({
    purpose: s.form.summary || (s.form.prompt || "").slice(0, 80),
    fields: (s.form.schema && s.form.schema.fields)
      ? s.form.schema.fields.map(fd => fd.name || fd.label)
      : [],
    score: s.score,
    id: s.form._id
  }));

  return { topK: top, queryEmbedding };
}

module.exports = { retrieveRelevantForms };
