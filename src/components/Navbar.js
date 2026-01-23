"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar({ onOpenTutorial }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border/60 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-slate-900 hover:text-rose-600 transition-colors"
            >
              <span className="font-bold text-xl tracking-tight">
                CDC <span className="text-rose-600">Descomplica</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
              <Link
                href="/"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${pathname === "/"
                  ? "bg-white text-rose-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/artigos"
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${pathname === "/artigos"
                  ? "bg-white text-rose-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
              >
                Todos os Artigos
              </Link>
            </div>
          </div>

          {/* Right Section - Partners & Github */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={onOpenTutorial}
              className="text-sm font-medium text-slate-600 hover:text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
              Ajuda
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Procon Placeholder Logo */}
                <div className="flex items-center gap-3 group cursor-default" title="Procon Sete Lagoas">
                  <div className="flex flex-col leading-none justify-center">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-rose-700 transition-colors">PROCON</span>
                    <span className="text-xs text-slate-500">Lorem Ipsum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={onOpenTutorial}
              className="text-slate-600 hover:text-rose-600 transition-colors p-2"
              aria-label="Ajuda"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-rose-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === "/"
                ? "bg-rose-50 text-rose-600"
                : "text-slate-700 hover:text-rose-600 hover:bg-slate-50"
                }`}
            >
              Home
            </Link>
            <Link
              href="/artigos"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === "/artigos"
                ? "bg-rose-50 text-rose-600"
                : "text-slate-700 hover:text-rose-600 hover:bg-slate-50"
                }`}
            >
              Todos os Artigos
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenTutorial) onOpenTutorial();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-rose-600 hover:bg-slate-50"
            >
              Ajuda
            </button>
          </div>
          <div className="pt-4 pb-4 border-t border-slate-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3 group cursor-default" title="Lorem Ipsum">
                  <div className="flex flex-col leading-none justify-center">
                    <span className="text-sm font-bold text-slate-700 group-hover:text-rose-700 transition-colors">PROCON</span>
                    <span className="text-xs text-slate-500">Lorem Ipsum</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
