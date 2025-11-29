function cosine(a, b) {
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

module.exports = { cosine };
