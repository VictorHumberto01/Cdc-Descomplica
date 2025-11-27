"use client";

const EXAMPLE_KEYWORDS = [
  "devolução",
  "garantia",
  "vício oculto",
  "prazo",
  "arrependimento",
  "oferta",
];

export default function SearchBar({ query, setQuery, displayQuery }) {
  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-0">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-blue-900/5 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
            <svg
              className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300"
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
            placeholder="O que você procura no CDC?"
            className="block w-full border-0 bg-transparent py-5 pl-14 pr-12 text-lg text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-xl sm:leading-6"
            aria-label="Buscar no Código de Defesa do Consumidor"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Limpar busca"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Example Keywords */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 font-medium mb-3 px-1">
          Sugestões de busca:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_KEYWORDS.map((keyword, index) => (
            <button
              key={index}
              onClick={() => setQuery(keyword)}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-200 transition-all duration-200 active:scale-95"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
