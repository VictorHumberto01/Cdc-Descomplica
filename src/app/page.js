"use client";

import { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import ArticleList from "../components/ArticleList";
import ArticleCard from "../components/ArticleCard";

/**
 * Objetivo:
 * - Ajudar você a encontrar, de forma rápida e intuitiva, artigos e trechos relevantes do CDC.
 * - Pensado para ser prático: digite palavras-chave e veja resultados ou explore os destaques
 *   quando não houver uma busca ativa.
 *
 * Como a busca funciona:
 * - A busca é feita no próprio navegador sobre os dados carregados (arquivo de referência).
 * - É uma correspondência por substring, sem diferenciar maiúsculas de minúsculas:
 *   o sistema procura o termo em título, texto principal, parágrafos, incisos e tags.
 * - Para evitar resultados irrelevantes, a pesquisa só ativa a partir de 2 caracteres.
 * - A interface aplica um pequeno debounce (retardo) para atualizar o que é exibido enquanto
 *   você digita, deixando a experiência mais fluida.
 */

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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-amber-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                CDC Descomplica
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Navegue pelo Código de Defesa do Consumidor de forma simples
              </p>
            </div>
          </div>

          <SearchBar
            query={query}
            setQuery={setQuery}
            displayQuery={displayQuery}
          />
        </section>

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
              <h2 className="mb-3 text-sm font-medium text-gray-600">
                Destaques
              </h2>
              <ul className="grid grid-cols-1 text-gray-600 gap-4 sm:grid-cols-2">
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
              </ul>
            </div>
          )}
        </section>
      </div>
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <p className="text-center text-sm text-slate-500">
            CDC Descomplica - Ferramenta de busca para o Código de Defesa do
            Consumidor
          </p>
        </div>
      </footer>
    </main>
  );
}
