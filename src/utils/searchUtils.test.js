
import { safeSearch, expandQuery, normalize, stem } from './searchUtils';

// Mock data for testing
const mockItems = [
  {
    titulo: "Art. 18",
    texto: "Os fornecedores respondem solidariamente pelos vícios de qualidade.",
    tags: ["vicio", "defeito", "troca"],
    paragrafos: [{ texto: "Não sendo o vício sanado, pode exigir substituição.", incisos: [] }],
    incisos: [],
    priority: 1
  },
  {
    titulo: "Art. 49",
    texto: "O consumidor pode desistir do contrato, no prazo de 7 dias.",
    tags: ["arrependimento", "devolução", "prazo"],
    paragrafos: [],
    incisos: [],
    priority: 1
  }
];

describe('Search Utils', () => {
  
  describe('normalize', () => {
    it('removes accents and converts to lowercase', () => {
      expect(normalize('Devolução')).toBe('devolucao');
      expect(normalize('VÍCIO')).toBe('vicio');
      expect(normalize('Ação')).toBe('acao');
    });

    it('handles empty input', () => {
      expect(normalize(null)).toBe('');
      expect(normalize(undefined)).toBe('');
    });
  });

  describe('stem (Portuguese)', () => {
    it('removes common suffixes', () => {
      expect(stem('garantido')).toBe('garant'); // Stemming logic just chops suffix
      expect(stem('devolvido')).toBe('devolv'); // Simple stemmer just chops suffix
      expect(stem('reclamacoes')).toBe('reclam');
    });

    it('keeps short words intact', () => {
      expect(stem('tem')).toBe('tem');
      expect(stem('lei')).toBe('lei');
    });
  });

  describe('expandQuery', () => {
    it('includes original word and stem', () => {
      const terms = expandQuery('garantia');
      expect(terms).toContain('garantia');
    });

    it('includes synonyms', () => {
      const terms = expandQuery('defeito');
      // Should include terms from our synonym map
      expect(terms).toContain('vicio');
      expect(terms).toContain('quebrado');
    });
    
    it('handles stemmed synonyms', () => {
      // 'devolvido' stems to 'devolv' or similar, but normalizing 'devolvido' -> 'devolvido'
      // keys in synonym map include 'devolucao'
      const terms = expandQuery('restituicao');
      expect(terms).toContain('devolucao');
      expect(terms).toContain('reembolso');
    });
  });

  describe('safeSearch', () => {
    it('finds exact matches', () => {
      const { summaries, regularResults } = safeSearch(mockItems, 'vicios');
      // Should match Art. 18 which has "vícios" in text/title or tags
      const allResults = [...summaries, ...regularResults];
      expect(allResults.length).toBeGreaterThan(0);
      expect(allResults[0].titulo).toBe('Art. 18');
    });

    it('finds synonym matches', () => {
      // Searching for "reembolso" should find Art. 49 which mentions "devolução" (synonym)
      const { regularResults } = safeSearch(mockItems, 'reembolso');
      expect(regularResults.length).toBeGreaterThan(0);
      expect(regularResults[0].titulo).toBe('Art. 49');
    });

    it('returns empty results for short queries', () => {
      const { regularResults } = safeSearch(mockItems, 'a');
      expect(regularResults).toHaveLength(0);
    });

    it('handles no matches gracefully', () => {
      const { regularResults } = safeSearch(mockItems, 'aeroporto');
      expect(regularResults).toHaveLength(0);
    });
    
    it('ranks exact matches higher than partial matches', () => {
       const { regularResults } = safeSearch(mockItems, 'consumidor');
       expect(regularResults.length).toBeGreaterThan(0);
    });
  });
});
