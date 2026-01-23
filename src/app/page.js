"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ArticleList from "../components/ArticleList";
import ArticleCard from "../components/ArticleCard";
import SummaryCard from "../components/SummaryCard";
import TutorialModal from "../components/TutorialModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VLibras from "@djpfs/react-vlibras";

import ColorBends from "../components/ColorBends";

export default function Home() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const resultsRef = useRef(null);

  const handleSearch = () => {
    if (resultsRef.current) {
      const yOffset = -120; 
      const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const [showSummaries, setShowSummaries] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDisplayQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setShowSummaries(true);
  }, [displayQuery]);


  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/cdc.json");
        if (!res.ok) throw new Error("Failed to load data");
        const data = await res.json();
        if (mounted) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to load cdc.json", err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCloseTutorial = (dontShowAgain = false) => {
    setShowTutorial(false);
    if (dontShowAgain) {
      localStorage.setItem("hasSeenTutorial", "true");
    }
  };

  const handleOpenTutorial = () => {
    setShowTutorial(true);
  };

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

  const stem = (word) => {
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

  const normalize = (str) => {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const expandQuery = (word) => {
    const normalized = normalize(word);
    const stemmed = stem(normalized);
    const terms = new Set([normalized, stemmed]);
    
    if (synonyms[normalized]) {
      synonyms[normalized].forEach(syn => terms.add(syn));
    }
    if (synonyms[stemmed]) {
      synonyms[stemmed].forEach(syn => terms.add(syn));
    }
    
    return Array.from(terms);
  };

  const { summaries, regularResults } = useMemo(() => {
    const q = normalize(displayQuery);
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
  }, [items, displayQuery]);

  useEffect(() => {
    if (summaries.length > 1) {
      const hasSeenScrollHint = localStorage.getItem("hasSeenScrollHint");
      if (!hasSeenScrollHint) {
        setShowScrollHint(true);
      }
    }
  }, [summaries.length]);

  const nextSummary = () => {
    setDirection(1);
    setCurrentSummaryIndex((prev) => (prev + 1) % summaries.length);
  };

  const prevSummary = () => {
    setDirection(-1);
    setCurrentSummaryIndex(
      (prev) => (prev - 1 + summaries.length) % summaries.length,
    );
  };

  useEffect(() => {
    setCurrentSummaryIndex(0);
  }, [summaries.length]);

  const destaques = useMemo(() => {
    const validItems = items.filter((it) => it);
    const picks = validItems.filter((it) => it.destaque).slice(0, 6);
    if (picks.length) return picks;
    return validItems.slice(0, 6);
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <VLibras forceOnload={true} />
      <Navbar onOpenTutorial={handleOpenTutorial} />
      <TutorialModal isOpen={showTutorial} onClose={handleCloseTutorial} />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-background overflow-hidden">
          <ColorBends
            colors={["#ff002f78"]}
            rotation={0}
            speed={0.1}
            scale={1.7}
            frequency={1.2}
            warpStrength={1}
            mouseInfluence={0}
            parallax={0}
            noise={0}
          />
          <div className="absolute inset-0 opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12 animate-slideUp">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              CDC Descomplica
            </h1>
            <p className="text-lg sm:text-xl text-stone-700 leading-relaxed">
              Navegue pelo Código de Defesa do Consumidor com facilidade e
              rapidez.
            </p>
          </div>

          <div className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <SearchBar
              query={query}
              setQuery={setQuery}
              displayQuery={displayQuery}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      <main className="flex-grow relative z-10" ref={resultsRef}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <section aria-live="polite" className="min-h-[400px]">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {summaries.length > 0 && showSummaries && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 relative overflow-hidden"
                    >
                        {summaries.length > 1 && (
                          <div className="flex flex-col items-center gap-3 mb-6 animate-fadeIn">
                            <AnimatePresence>
                              {showScrollHint && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="bg-rose-600 text-white text-sm px-4 py-2 rounded-xl shadow-lg flex items-center gap-3 mb-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                  <span>Use as setas ou arraste para ver mais resumos!</span>
                                  <button
                                    onClick={() => {
                                      setShowScrollHint(false);
                                      localStorage.setItem("hasSeenScrollHint", "true");
                                    }}
                                    className="ml-1 p-1 hover:bg-white/20 rounded-full transition-colors"
                                    aria-label="Fechar dica"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            <div className="flex items-center justify-center gap-4">
                              <button 
                                onClick={prevSummary}
                                className="p-2 rounded-full text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                                aria-label="Anterior"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                              </button>
                              
                              <div className="flex items-center gap-2">
                                {summaries.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setDirection(idx > currentSummaryIndex ? 1 : -1);
                                      setCurrentSummaryIndex(idx);
                                    }}
                                    className={`transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-200 ${
                                      idx === currentSummaryIndex 
                                        ? "w-6 h-2 bg-rose-600" 
                                        : "w-2 h-2 bg-rose-200 hover:bg-rose-300"
                                    }`}
                                    aria-label={`Ir para resumo ${idx + 1}`}
                                  />
                                ))}
                              </div>
                              
                              <button 
                                onClick={nextSummary}
                                className="p-2 rounded-full text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                                aria-label="Próximo"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="overflow-hidden rounded-2xl relative min-h-[300px]">
                        <AnimatePresence
                          initial={false}
                          custom={direction}
                          mode="popLayout"
                        >
                          <motion.div
                            key={currentSummaryIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                              x: {
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              },
                              opacity: { duration: 0.2 },
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                              const swipe = swipePower(offset.x, velocity.x);

                              if (swipe < -swipeConfidenceThreshold) {
                                nextSummary();
                              } else if (swipe > swipeConfidenceThreshold) {
                                prevSummary();
                              }
                            }}
                            className="w-full"
                          >
                            <SummaryCard
                              article={
                                summaries[currentSummaryIndex] || summaries[0]
                              }
                              onDismiss={() => setShowSummaries(false)}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <ArticleList
                  loading={loading}
                  displayQuery={displayQuery}
                  results={regularResults}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
              </>
            )}

            {!loading && (!displayQuery || displayQuery.length < 2) && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-foreground">
                    Artigos em Destaque
                  </h2>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {destaques.map((article, idx) => (
                    <ArticleCard
                      key={`${article.titulo}-${idx}`}
                      article={article}
                      displayQuery=""
                      expandedId={expandedId}
                      setExpandedId={setExpandedId}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
