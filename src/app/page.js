"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ArticleList from "../components/ArticleList";
import ArticleCard from "../components/ArticleCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDisplayQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
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

  const results = useMemo(() => {
    const q = displayQuery.toLowerCase();
    if (!q || q.length < 2) return [];
    return items.filter((it) => {
      if (!it) return false;
      const matchIn = (str) => (str || "").toLowerCase().includes(q);
      if (matchIn(it.titulo)) return true;
      if (matchIn(it.texto)) return true;
      if (Array.isArray(it.tags) && it.tags.some((t) => matchIn(t)))
        return true;
      if (Array.isArray(it.paragrafos)) {
        for (const p of it.paragrafos) {
          if (matchIn(p.texto)) return true;
          if (Array.isArray(p.incisos) && p.incisos.some((inc) => matchIn(inc)))
            return true;
        }
      }
      if (Array.isArray(it.incisos) && it.incisos.some((inc) => matchIn(inc)))
        return true;
      return false;
    });
  }, [items, displayQuery]);

  const destaques = useMemo(() => {
    const picks = items.filter((it) => it.destaque).slice(0, 6);
    if (picks.length) return picks;
    return items.slice(0, 6);
  }, [items]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-white">
          <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

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
              <ArticleList
                loading={loading}
                displayQuery={displayQuery}
                results={results}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
              />
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
