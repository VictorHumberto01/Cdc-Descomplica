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
    <div className="group relative bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:shadow-md hover:ring-blue-200/50">
      <button
        onClick={() => setExpandedId(isOpen ? null : id)}
        className="w-full text-left p-6 sm:p-8 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-2xl"
        aria-expanded={isOpen}
        aria-controls={`article-${id}`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                <HighlightedText
                  text={article.titulo}
                  searchQuery={displayQuery}
                />
              </h3>
              {Array.isArray(article.tags) && article.tags.length > 0 && (
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {article.tags[0]}
                </span>
              )}
            </div>
            <p className={`text-lg text-slate-600 leading-relaxed group-hover:text-slate-900 transition-colors ${!isOpen ? "line-clamp-3" : ""}`}>
              <HighlightedText
                text={article.texto}
                searchQuery={displayQuery}
              />
            </p>
          </div>

          <div className="flex-shrink-0 pt-1">
            <div
              className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "bg-blue-100 text-blue-600 rotate-180" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div
          id={`article-${id}`}
          className="px-6 pb-6 sm:px-8 sm:pb-8 animate-fadeIn"
        >
          <div className="border-t border-slate-100 pt-6 space-y-6">
            {Array.isArray(article.paragrafos) &&
              article.paragrafos.length > 0 && (
                <div className="space-y-4">
                  {article.paragrafos.map((paragrafo, pIdx) => (
                    <div key={pIdx} className="bg-slate-50/50 rounded-xl p-5 border border-slate-100">
                      <p className="text-base text-slate-700 leading-relaxed">
                        <HighlightedText
                          text={paragrafo.texto}
                          searchQuery={displayQuery}
                        />
                      </p>
                      {Array.isArray(paragrafo.incisos) &&
                        paragrafo.incisos.length > 0 && (
                          <ul className="mt-4 space-y-3 pl-4 border-l-2 border-blue-100">
                            {paragrafo.incisos.map((inciso, iIdx) => (
                              <li
                                key={iIdx}
                                className="text-sm text-slate-600 leading-relaxed pl-2"
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
              <ul className="space-y-3 pl-4 border-l-2 border-blue-100">
                {article.incisos.map((inciso, idx) => (
                  <li key={idx} className="text-base text-slate-600 leading-relaxed pl-2">
                    <HighlightedText text={inciso} searchQuery={displayQuery} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
