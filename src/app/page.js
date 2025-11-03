"use client";

import { useEffect, useMemo, useState } from "react";

/**
 *
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
 *
 * Comportamento da interface:
 * - Quando não há consulta (ou a consulta é muito curta), mostramos "Destaques" — artigos
 *   selecionados para consulta rápida.
 * - Ao buscar, exibimos o número de resultados e destacamos visualmente as ocorrências
 *   encontradas no texto para facilitar a leitura.
 * - Você pode limpar a pesquisa rapidamente ou abrir um artigo para ver mais detalhes.
 *
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

  function highlight(text = "", q = "") {
    if (!q) return text;
    const parts = [];
    const lower = text.toLowerCase();
    const search = q.toLowerCase();
    let i = 0;
    let idx = lower.indexOf(search, i);
    while (idx !== -1) {
      if (idx > i) parts.push(text.slice(i, idx));
      parts.push(
        <mark
          key={idx}
          className="rounded bg-amber-100 px-0.5 py-0.5 font-semibold text-amber-800"
        >
          {text.slice(idx, idx + search.length)}
        </mark>,
      );
      i = idx + search.length;
      idx = lower.indexOf(search, i);
    }
    if (i < text.length) parts.push(text.slice(i));
    return parts;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <main className="mx-auto max-w-xl px-4 pb-16 pt-12">
        <header className="mb-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/80 ring-1 ring-slate-200 flex items-center justify-center shadow-sm">
              <svg
                className="h-6 w-6 text-amber-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">CDC Descomplica</h1>
              <p className="text-xs text-slate-500">
                Busque artigos do Código de Defesa do Consumidor
              </p>
            </div>
          </div>
        </header>

        <section aria-labelledby="search-heading" className="mb-6">
          <label id="search-heading" className="sr-only">
            Buscar artigos
          </label>
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg
                  className="h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                  />
                </svg>
              </span>

              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Procure por 'vício', 'publicidade', 'Art. 6º'..."
                className="w-full rounded-xl border border-slate-200 bg-white px-12 py-3 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                aria-label="Pesquisar artigos do Código de Defesa do Consumidor"
              />

              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                  }}
                  aria-label="Limpar pesquisa"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 hover:bg-slate-200"
                >
                  <svg
                    className="h-4 w-4 text-slate-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.28 5.22a.75.75 0 011.06 0L10 7.88l2.66-2.66a.75.75 0 111.06 1.06L11.06 8.94l2.66 2.66a.75.75 0 11-1.06 1.06L10 9.997l-2.66 2.66a.75.75 0 01-1.06-1.06l2.66-2.66L6.28 6.28a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Dicas: use palavras-chave (mín. 2 caracteres). Deixe vazio para
              ver os destaques.
            </p>
          </div>
        </section>

        <section aria-live="polite">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow">
                <svg
                  className="h-4 w-4 animate-spin text-amber-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Carregando artigos...
              </div>
            </div>
          ) : displayQuery && displayQuery.length >= 2 ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium">
                  Resultados para:{" "}
                  <span className="font-semibold">"{displayQuery}"</span>
                </h2>
                <span className="text-xs text-slate-500">
                  {results.length}{" "}
                  {results.length === 1 ? "resultado" : "resultados"}
                </span>
              </div>

              {results.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-sm text-slate-600 shadow-sm">
                  Nenhum artigo encontrado. Tente outra palavra-chave.
                </div>
              ) : (
                <ul className="space-y-3">
                  {results.map((it, idx) => {
                    const id = `${it.titulo}-${idx}`;
                    const isOpen = expandedId === id;
                    return (
                      <li
                        key={id}
                        className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-2">
                              <h3 className="truncate text-sm font-semibold">
                                {highlight(it.titulo, displayQuery)}
                              </h3>
                              {Array.isArray(it.tags) && it.tags.length > 0 && (
                                <span className="ml-2 inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                  {it.tags[0]}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              {highlight(it.texto, displayQuery)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => setExpandedId(isOpen ? null : id)}
                              className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                              aria-expanded={isOpen}
                              aria-controls={`article-${id}`}
                            >
                              {isOpen ? "Fechar" : "Abrir"}
                            </button>
                          </div>
                        </div>

                        {isOpen && (
                          <div
                            id={`article-${id}`}
                            className="mt-4 border-t pt-3 text-sm text-slate-700"
                          >
                            <div className="space-y-3">
                              <p>{it.texto}</p>
                              {Array.isArray(it.paragrafos) &&
                                it.paragrafos.length > 0 && (
                                  <div className="space-y-2">
                                    {it.paragrafos.map((p, pi) => (
                                      <div key={pi}>
                                        <p className="font-medium">{p.texto}</p>
                                        {Array.isArray(p.incisos) &&
                                          p.incisos.length > 0 && (
                                            <ol className="mt-1 ml-4 list-decimal space-y-1 text-sm text-slate-600">
                                              {p.incisos.map((inc, ii) => (
                                                <li key={ii}>{inc}</li>
                                              ))}
                                            </ol>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            // Destaques
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold">Destaques</h2>
                <p className="text-xs text-slate-500">Assuntos mais comuns</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {destaques.map((it, idx) => {
                  const id = `${it.titulo}-d-${idx}`;
                  return (
                    <article
                      key={id}
                      className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold">{it.titulo}</h3>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-3">
                            {it.texto}
                          </p>
                        </div>
                        <div className="ml-2 shrink-0">
                          <svg
                            className="h-6 w-6 text-amber-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 7.05 5.636 5.636m12.728 0-1.414 1.414M7.05 16.95l-1.414 1.414"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {Array.isArray(it.tags) &&
                            it.tags.slice(0, 2).map((t, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                              >
                                {t}
                              </span>
                            ))}
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setQuery(it.titulo);
                              setExpandedId(`${it.titulo}-0`);
                            }}
                            className="rounded-md bg-amber-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-700"
                          >
                            Ver artigo
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
