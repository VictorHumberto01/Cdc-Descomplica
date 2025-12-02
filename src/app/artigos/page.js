"use client";

import { useEffect, useState } from "react";
import ArticleList from "../../components/ArticleList";
import LoadingSpinner from "../../components/LoadingSpinner";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Articles() {
  const [items, setItems] = useState({ articles: [], summaries: [] });
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
          if (Array.isArray(data)) {
            const articles = data.filter(item => item.titulo.startsWith("Art."));
            const summaries = data.filter(item => !item.titulo.startsWith("Art."));


            articles.sort((a, b) => {
              const parseArticle = (str) => {
                const match = str.match(/Art\.\s*(\d+)(?:-([A-Za-z0-9]+))?/);
                if (!match) return { num: 0, suffix: "" };
                return {
                  num: parseInt(match[1], 10),
                  suffix: match[2] || ""
                };
              };

              const artA = parseArticle(a.titulo);
              const artB = parseArticle(b.titulo);

              if (artA.num !== artB.num) {
                return artA.num - artB.num;
              }


              if (!artA.suffix && artB.suffix) return -1;
              if (artA.suffix && !artB.suffix) return 1;


              if (artA.suffix < artB.suffix) return -1;
              if (artA.suffix > artB.suffix) return 1;

              return 0;
            });


            setItems({ articles, summaries });
          } else {
            setItems({ articles: [], summaries: [] });
          }
        }
      } catch (err) {
        console.error("Failed to load cdc.json", err);
        if (mounted) setItems({ articles: [], summaries: [] });
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
              <div className="space-y-16">
                {items.articles && items.articles.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Artigos do Código
                      </h2>
                    </div>
                    <ArticleList
                      loading={loading}
                      displayQuery=""
                      results={items.articles}
                      expandedId={expandedId}
                      setExpandedId={setExpandedId}
                      allowEmptyQuery={true}
                    />
                  </section>
                )}

                {items.summaries && items.summaries.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Resumos e Dúvidas Frequentes
                      </h2>
                    </div>
                    <ArticleList
                      loading={loading}
                      displayQuery=""
                      results={items.summaries}
                      expandedId={expandedId}
                      setExpandedId={setExpandedId}
                      allowEmptyQuery={true}
                    />
                  </section>
                )}

                {(!items.articles?.length && !items.summaries?.length) && (
                  <div className="text-center py-12">
                    <p className="text-slate-500">Nenhum artigo encontrado.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
