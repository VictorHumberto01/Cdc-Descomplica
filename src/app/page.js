"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ArticleList from "../components/ArticleList";
import ArticleCard from "../components/ArticleCard";
import SummaryCard from "../components/SummaryCard";
import DailyTipCard from "../components/DailyTipCard";
import TutorialModal from "../components/TutorialModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VLibras from "@djpfs/react-vlibras";

import ColorBends from "../components/ColorBends";
import { safeSearch } from "../utils/searchUtils";

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
  const [dailyTip, setDailyTip] = useState(null);
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
        const [cdcRes, dicasRes] = await Promise.all([
          fetch("/cdc.json"),
          fetch("/dicas.json")
        ]);

        if (!cdcRes.ok) throw new Error("Failed to load CDC data");
        const cdcData = await cdcRes.json();
        
        if (mounted) {
          setItems(Array.isArray(cdcData) ? cdcData : []);
        }

        if (dicasRes.ok) {
          const dicasData = await dicasRes.json();
          if (mounted && Array.isArray(dicasData) && dicasData.length > 0) {
            const randomIndex = Math.floor(Math.random() * dicasData.length);
            setDailyTip(dicasData[randomIndex]);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
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



  const { summaries, regularResults } = useMemo(() => {
    return safeSearch(items, displayQuery);
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
                                  className="bg-rose-600 text-white text-base px-6 py-3 rounded-2xl shadow-lg flex items-center gap-4 mb-2"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                  <span className="font-medium">Use as setas ou arraste para ver mais resumos!</span>
                                  <button
                                    onClick={() => {
                                      setShowScrollHint(false);
                                      localStorage.setItem("hasSeenScrollHint", "true");
                                    }}
                                    className="ml-2 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                                    aria-label="Fechar dica"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
              <div className="animate-fadeIn space-y-16">
                {/* Daily Tip Section */}
                {dailyTip && (
                  <div>
                    <DailyTipCard tip={dailyTip} />
                  </div>
                )}

                {/* Artigos em Destaque Section */}
                <div>
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
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
