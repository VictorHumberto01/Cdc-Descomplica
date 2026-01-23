const stopWords = new Set([
  'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'e', 'ou',
  'para', 'por', 'com', 'que', 'se', 'ao', 'aos', 'à', 'às',
  'pelo', 'pela', 'pelos', 'pelas', 'seu', 'sua', 'seus', 'suas',
  'meu', 'minha', 'meus', 'minhas', 'este', 'esta', 'estes', 'estas',
  'esse', 'essa', 'esses', 'essas', 'como', 'foi', 'ser', 'são'
]);

const synonyms = {
  'devolucao': ['reembolso', 'restituicao', 'devolver', 'devolvido'],
  'reembolso': ['devolucao', 'restituicao', 'devolver'],
  'garantia': ['garantido', 'cobertura', 'assegurado'],
  'defeito': ['vicio', 'problema', 'falha', 'defeituoso', 'quebrado', 'estragado'],
  'vicio': ['defeito', 'problema', 'falha'],
  'troca': ['substituicao', 'trocar', 'substituir'],
  'prazo': ['tempo', 'dias', 'periodo', 'validade'],
  'arrependimento': ['desistencia', 'cancelar', 'cancelamento', 'desistir'],
  'produto': ['mercadoria', 'item', 'bem', 'compra'],
  'servico': ['atendimento', 'prestacao'],
  'consumidor': ['cliente', 'comprador'],
  'fornecedor': ['vendedor', 'loja', 'empresa', 'comerciante'],
  'reclamacao': ['queixa', 'reclamar', 'denunciar'],
  'publicidade': ['propaganda', 'anuncio', 'marketing'],
  'contrato': ['acordo', 'termo'],
  'indenizacao': ['ressarcimento', 'compensacao', 'reparacao'],
  'abusivo': ['abusiva', 'ilegal', 'injusto'],
  'direito': ['direitos', 'lei', 'legal']
};

export const normalize = (str) => {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const stem = (word) => {
  if (word.length < 4) return word;
  
  const suffixes = [
    'mente', 'acao', 'acoes', 'oes', 'ado', 'ados', 'ido', 'idos',
    'ando', 'endo', 'indo', 'ar', 'er', 'ir', 'ou', 'ava', 'ia',
    'aram', 'eram', 'iram', 'am', 'em', 'iam', 'oria', 'ante',
    'ente', 'ista', 'oso', 'osa', 'ivo', 'iva', 'vel', 'dor'
  ];
  
  for (const suffix of suffixes) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      return word.slice(0, -suffix.length);
    }
  }
  return word;
};

export const expandQuery = (word) => {
  const normalized = normalize(word);
  const stemmed = stem(normalized);
  const terms = new Set([normalized, stemmed]);
  
  if (synonyms[normalized]) {
    synonyms[normalized].forEach(syn => terms.add(syn));
  }
  
  if (synonyms[stemmed]) {
    synonyms[stemmed].forEach(syn => terms.add(syn));
  }
  
  for (const [key, list] of Object.entries(synonyms)) {
    const listSet = new Set(list);
    
    if (listSet.has(normalized) || listSet.has(stemmed)) {
      terms.add(key);
      list.forEach(syn => terms.add(syn));
    }
  }
  
  return Array.from(terms);
};

export const safeSearch = (items, query) => {
  const q = normalize(query);
  if (!q || q.length < 2) return { summaries: [], regularResults: [] };

  const rawTokens = q.split(/\s+/).filter((t) => t.length > 0);
  const tokens = rawTokens.filter(t => !stopWords.has(t) && t.length > 1);
  
  const finalTokens = tokens.length > 0 ? tokens : rawTokens.filter(t => t.length > 1);
  
  const expandedTokens = finalTokens.flatMap(t => expandQuery(t));

  const scoredItems = items
    .filter((item) => item)
    .map((item) => {
      let score = 0;

      const title = normalize(item.titulo);
      const text = normalize(item.texto);
      const tags = (item.tags || []).map((t) => normalize(t));
      const paragraphs = (item.paragrafos || []).map((p) => {
        const pText = normalize(p.texto);
        const incisos = (p.incisos || []).map((i) => normalize(i));
        return { text: pText, incisos };
      });
      const itemIncisos = (item.incisos || []).map((i) => normalize(i));

      if (title.includes(q)) score += 150;
      if (text.includes(q)) score += 75;

      expandedTokens.forEach((token) => {
        const wordBoundary = new RegExp(`\\b${token}\\b`);
        if (wordBoundary.test(title)) score += 40;
        else if (title.includes(token)) score += 25;
        
        if (wordBoundary.test(text)) score += 20;
        else if (text.includes(token)) score += 12;
        
        if (tags.some((t) => t.includes(token) || token.includes(t))) score += 30;

        paragraphs.forEach((p) => {
          if (p.text.includes(token)) score += 8;
          p.incisos.forEach((inc) => {
            if (inc.includes(token)) score += 5;
          });
        });

        itemIncisos.forEach((inc) => {
          if (inc.includes(token)) score += 5;
        });
      });

      finalTokens.forEach((token) => {
        if (title.includes(token)) score += 15;
        if (tags.some((t) => t === token)) score += 20;
      });

      return { ...item, score };
    });

  const filtered = scoredItems
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.priority || 0) - (a.priority || 0);
    });

  const summaries = filtered
    .filter((it) => it.priority >= 4)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const regularResults = filtered.filter(
    (it) => !it.priority || it.priority < 4,
  );

  return { summaries, regularResults };
};
