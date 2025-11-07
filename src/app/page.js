"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ArticleList from "../components/ArticleList";
import ArticleCard from "../components/ArticleCard";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen flex flex-col bg-white bg-[url('/grid.png')] bg-repeat">
      <Navbar />

      {/* Hero Section with Search */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-white/80 to-blue-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
              CDC Descomplica
            </h1>
            <p className="text-lg text-slate-600">
              Navegue pelo Código de Defesa do Consumidor de forma simples e
              intuitiva
            </p>
          </div>

          <SearchBar
            query={query}
            setQuery={setQuery}
            displayQuery={displayQuery}
          />
        </div>
      </section>

      {/* Main Content Section */}
      <div className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <section aria-live="polite">
            {loading ? (
              <LoadingSpinner />
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
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Principais Artigos
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-gradient-to-b from-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-center text-sm text-slate-500">
            CDC Descomplica - Ferramenta de busca para o Código de Defesa do
            Consumidor
          </p>
        </div>
      </footer>
    </div>
  );
}
