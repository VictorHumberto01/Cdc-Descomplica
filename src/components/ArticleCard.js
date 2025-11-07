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
    <li className="group overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-amber-200">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-sm font-medium text-slate-900 sm:text-base">
              <HighlightedText
                text={article.titulo}
                searchQuery={displayQuery}
              />
            </h3>
            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                {article.tags[0]}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">
            <HighlightedText text={article.texto} searchQuery={displayQuery} />
          </p>
        </div>

        <div className="flex shrink-0 items-start">
          <button
            onClick={() => setExpandedId(isOpen ? null : id)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-amber-100 hover:text-amber-700"
            aria-expanded={isOpen}
            aria-controls={`article-${id}`}
          >
            {isOpen ? (
              <>
                Fechar
                <svg
                  className="h-4 w-4"
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
                Abrir
                <svg
                  className="h-4 w-4"
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
          className="mt-4 border-t border-slate-100 pt-4"
        >
          {Array.isArray(article.paragrafos) &&
            article.paragrafos.length > 0 && (
              <div className="space-y-3">
                {article.paragrafos.map((paragrafo, pIdx) => (
                  <div key={pIdx}>
                    <p className="text-sm text-slate-600">
                      <HighlightedText
                        text={paragrafo.texto}
                        searchQuery={displayQuery}
                      />
                    </p>
                    {Array.isArray(paragrafo.incisos) &&
                      paragrafo.incisos.length > 0 && (
                        <ul className="mt-2 space-y-1 pl-6">
                          {paragrafo.incisos.map((inciso, iIdx) => (
                            <li key={iIdx} className="text-sm text-slate-600">
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
            <ul className="mt-2 space-y-1 pl-6">
              {article.incisos.map((inciso, idx) => (
                <li key={idx} className="text-sm text-slate-600">
                  <HighlightedText text={inciso} searchQuery={displayQuery} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
