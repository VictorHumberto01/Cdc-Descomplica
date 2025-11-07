"use client";

import HighlightedText from "./HighlightedText";

export default function ArticleCard({
  article,
  displayQuery,
  expandedId,
  setExpandedId,
  index,
}) {
  const id = `${article.titulo}-${index}`;
  const isOpen = expandedId === id;

  return (
    <li className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 transition-all duration-300 hover:shadow-xl hover:ring-blue-200 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                <HighlightedText
                  text={article.titulo}
                  searchQuery={displayQuery}
                />
              </h3>
              {Array.isArray(article.tags) && article.tags.length > 0 && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 ring-1 ring-inset ring-blue-200">
                  {article.tags[0]}
                </span>
              )}
            </div>
            <p className="text-base text-slate-600 leading-relaxed">
              <HighlightedText
                text={article.texto}
                searchQuery={displayQuery}
              />
            </p>
          </div>

          <div className="flex shrink-0 items-start">
            <button
              onClick={() => setExpandedId(isOpen ? null : id)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-200 shadow-sm ring-1 ring-blue-200 hover:bg-blue-50 hover:ring-blue-300 active:bg-blue-100"
              aria-expanded={isOpen}
              aria-controls={`article-${id}`}
            >
              {isOpen ? (
                <>
                  Fechar
                  <svg
                    className="h-4 w-4 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </>
              ) : (
                <>
                  Expandir
                  <svg
                    className="h-4 w-4 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            id={`article-${id}`}
            className="mt-6 border-t border-blue-100 pt-6 animate-fadeIn"
          >
            {Array.isArray(article.paragrafos) &&
              article.paragrafos.length > 0 && (
                <div className="space-y-4">
                  {article.paragrafos.map((paragrafo, pIdx) => (
                    <div key={pIdx} className="rounded-lg bg-slate-50 p-4">
                      <p className="text-base text-slate-700 leading-relaxed">
                        <HighlightedText
                          text={paragrafo.texto}
                          searchQuery={displayQuery}
                        />
                      </p>
                      {Array.isArray(paragrafo.incisos) &&
                        paragrafo.incisos.length > 0 && (
                          <ul className="mt-3 space-y-2 pl-6">
                            {paragrafo.incisos.map((inciso, iIdx) => (
                              <li
                                key={iIdx}
                                className="text-base text-slate-600 list-disc"
                              >
                                <HighlightedText
                                  text={inciso}
                                  searchQuery={displayQuery}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              )}

            {Array.isArray(article.incisos) && article.incisos.length > 0 && (
              <ul className="mt-3 space-y-2 pl-6">
                {article.incisos.map((inciso, idx) => (
                  <li key={idx} className="text-base text-slate-600 list-disc">
                    <HighlightedText text={inciso} searchQuery={displayQuery} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
