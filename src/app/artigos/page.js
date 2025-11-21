"use client";

import { useEffect, useState } from "react";
import ArticleList from "../../components/ArticleList";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Articles() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

  return (
    <main className="min-h-screen bg-white bg-[url('/grid.png')] bg-repeat">
      <div className="pt-24 pb-16 bg-linear-to-b from-white/80 to-blue-50/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
              Todos os Artigos
            </h1>
            <p className="text-lg text-slate-600">
              Explore todos os artigos do Código de Defesa do Consumidor
            </p>
          </div>

          <section aria-live="polite" className="max-w-5xl mx-auto">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-6">
                <ArticleList
                  loading={loading}
                  displayQuery=""
                  results={items}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
