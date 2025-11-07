"use client";

import ArticleCard from "./ArticleCard";

export default function ArticleList({
  loading,
  displayQuery,
  results,
  expandedId,
  setExpandedId,
}) {
  if (!displayQuery || displayQuery.length < 2) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm text-slate-600 font-medium">
          Resultados para:{" "}
          <span className="font-semibold">"{displayQuery}"</span>
        </h2>
        <span className="text-xs text-slate-500">
          {results.length} {results.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-6 text-center text-sm text-slate-600 shadow-sm">
          Nenhum artigo encontrado. Tente outra palavra-chave.
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((article, idx) => (
            <ArticleCard
              key={`${article.titulo}-${idx}`}
              article={article}
              displayQuery={displayQuery}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              index={idx}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
