"use client";

import { useEffect, useState } from "react";
import ArticleList from "../../components/ArticleList";
import LoadingSpinner from "../../components/LoadingSpinner";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden bg-white border-b border-slate-200">


        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Todos os Artigos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore os artigos do Código de Defesa do Consumidor catalogados no site.
          </p>
        </div>
      </div>

      <main className="flex-grow relative z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
          <section aria-live="polite">
            {loading ? (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid gap-6">
                <ArticleList
                  loading={loading}
                  displayQuery=""
                  results={items}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  allowEmptyQuery={true}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
