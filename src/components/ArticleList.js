"use client";

import ArticleCard from "./ArticleCard";

export default function ArticleList({
  loading,
  displayQuery,
  results,
  expandedId,
  setExpandedId,
  allowEmptyQuery = false,
}) {
  if (!allowEmptyQuery && (!displayQuery || displayQuery.length < 2)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {displayQuery && displayQuery.length >= 2 && (
        <div className="flex items-center justify-between px-2">
          <h2 className="text-base text-slate-500 font-medium">
            Resultados para <span className="text-slate-900 font-bold">"{displayQuery}"</span>
          </h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {results.length} {results.length === 1 ? "encontrado" : "encontrados"}
          </span>
        </div>
      )}

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum artigo encontrado</h3>
          <p className="text-slate-500 max-w-sm">
            Não encontramos nada com esse termo. Tente usar palavras-chave mais gerais ou sinônimos.
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {results.map((article, idx) => (
            <li key={`${article.titulo}-${idx}`}>
              <ArticleCard
                article={article}
                displayQuery={displayQuery}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                index={idx}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
