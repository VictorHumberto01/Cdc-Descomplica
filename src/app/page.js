"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ArticleList from "../components/ArticleList";
import ArticleCard from "../components/ArticleCard";
import SummaryCard from "../components/SummaryCard";
import TutorialModal from "../components/TutorialModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
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

  const normalize = (str) => {
    return (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const { summaries, regularResults } = useMemo(() => {
    const q = normalize(displayQuery);
    if (!q || q.length < 2) return { summaries: [], regularResults: [] };

    const tokens = q.split(/\s+/).filter(t => t.length > 0);

    const scoredItems = items
      .filter(item => item)
      .map((item) => {
        let score = 0;

        const title = normalize(item.titulo);
        const text = normalize(item.texto);
        const tags = (item.tags || []).map(t => normalize(t));
        const paragraphs = (item.paragrafos || []).map(p => {
          const pText = normalize(p.texto);
          const incisos = (p.incisos || []).map(i => normalize(i));
          return { text: pText, incisos };
        });
        const itemIncisos = (item.incisos || []).map(i => normalize(i));


        if (title.includes(q)) score += 100;
        if (text.includes(q)) score += 50;


        tokens.forEach(token => {
          if (title.includes(token)) score += 20;
          if (text.includes(token)) score += 10;
          if (tags.some(t => t.includes(token))) score += 15;


          paragraphs.forEach(p => {
            if (p.text.includes(token)) score += 5;
            p.incisos.forEach(inc => {
              if (inc.includes(token)) score += 3;
            });
          });


          itemIncisos.forEach(inc => {
            if (inc.includes(token)) score += 3;
          });
        });

        return { ...item, score };
      });

    const filtered = scoredItems
      .filter(item => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.priority || 0) - (a.priority || 0);
      });

    const summaries = filtered
      .filter(it => it.priority >= 4)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const regularResults = filtered.filter(it => !it.priority || it.priority < 4);

    return { summaries, regularResults };
  }, [items, displayQuery]);

  const nextSummary = () => {
    setDirection(1);
    setCurrentSummaryIndex((prev) => (prev + 1) % summaries.length);
  };

  const prevSummary = () => {
    setDirection(-1);
    setCurrentSummaryIndex((prev) => (prev - 1 + summaries.length) % summaries.length);
  };


  useEffect(() => {
    setCurrentSummaryIndex(0);
  }, [summaries.length]);

  const destaques = useMemo(() => {
    const validItems = items.filter(it => it);
    const picks = validItems.filter((it) => it.destaque).slice(0, 6);
    if (picks.length) return picks;
    return validItems.slice(0, 6);
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenTutorial={handleOpenTutorial} />
      <TutorialModal isOpen={showTutorial} onClose={handleCloseTutorial} />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12 animate-slideUp">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl mb-6">
              CDC <span className="text-blue-600">Descomplica</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Navegue pelo Código de Defesa do Consumidor com facilidade e rapidez.
            </p>
          </div>

          <div className="animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <SearchBar
              query={query}
              setQuery={setQuery}
              displayQuery={displayQuery}
            />
          </div>
        </div>
      </section>

      <main className="flex-grow relative z-10">
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
                      <div className="overflow-hidden rounded-2xl relative min-h-[300px]">
                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                          <motion.div
                            key={currentSummaryIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                              x: { type: "spring", stiffness: 300, damping: 30 },
                              opacity: { duration: 0.2 }
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
                              article={summaries[currentSummaryIndex] || summaries[0]}
                              onDismiss={() => setShowSummaries(false)}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {summaries.length > 1 && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 hidden md:flex justify-between px-2 pointer-events-none z-10">
                          <button
                            onClick={prevSummary}
                            className="pointer-events-auto p-2 rounded-full bg-white/80 shadow-md hover:bg-white text-indigo-600 transition-colors backdrop-blur-sm"
                            aria-label="Previous summary"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                          </button>
                          <button
                            onClick={nextSummary}
                            className="pointer-events-auto p-2 rounded-full bg-white/80 shadow-md hover:bg-white text-indigo-600 transition-colors backdrop-blur-sm"
                            aria-label="Next summary"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                          </button>
                        </div>
                      )}

                      {summaries.length > 1 && (
                        <div className="flex justify-center gap-2 mt-2">
                          {summaries.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setDirection(idx > currentSummaryIndex ? 1 : -1);
                                setCurrentSummaryIndex(idx);
                              }}
                              className={`w-2 h-2 rounded-full transition-colors ${idx === currentSummaryIndex ? 'bg-indigo-600' : 'bg-indigo-200'}`}
                              aria-label={`Go to summary ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
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
                  <h2 className="text-2xl font-bold text-slate-900">
                    Artigos em Destaque
                  </h2>
                  <div className="h-px flex-1 bg-slate-200"></div>
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
