"use client";

import { useEffect } from "react";

const EXAMPLE_KEYWORDS = [
  "devolução",
  "garantia",
  "produto defeituoso",
  "prazo",
  "cancelamento",
  "propaganda enganosa",
];

export default function SearchBar({ query, setQuery, displayQuery }) {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <svg
            className="h-6 w-6 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque artigos no CDC..."
          className="block w-full rounded-2xl border-0 bg-white py-6 pl-14 pr-12 text-lg text-slate-900 shadow-lg ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-shadow duration-200 ease-in-out hover:shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <span className="sr-only">Limpar busca</span>
            <svg
              className="h-5 w-5"
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

      {/* Example Keywords */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500 font-medium">
          Exemplos de busca:
        </span>
        {EXAMPLE_KEYWORDS.map((keyword, index) => (
          <button
            key={index}
            onClick={() => setQuery(keyword)}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200/20 hover:bg-blue-100 transition-colors duration-200"
          >
            {keyword}
          </button>
        ))}
      </div>

      {/* Search Status */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <p className="text-blue-600 font-medium">
          Digite pelo menos 2 caracteres para buscar
        </p>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              query.length >= 2 ? "bg-blue-500" : "bg-slate-300"
            }`}
          />
          <p className="text-slate-400">
            {query.length} / 2 caracteres mínimos
          </p>
        </div>
      </div>
    </div>
  );
}
