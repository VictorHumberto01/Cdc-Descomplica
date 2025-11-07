"use client";

import { useEffect } from "react";

export default function SearchBar({ query, setQuery, displayQuery }) {
  return (
    <div className="relative">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          <svg
            className="h-5 w-5 text-slate-400"
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
          placeholder="Busque por palavra-chave..."
          className="block w-full rounded-lg border-0 bg-white py-3 pl-11 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 sm:text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <span className="sr-only">Limpar busca</span>
            <svg
              className="h-4 w-4"
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

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <p>Use palavras-chave (mín. 2 caracteres)</p>
        <p className="text-slate-400">{query.length} / 2 caracteres mínimos</p>
      </div>
    </div>
  );
}
