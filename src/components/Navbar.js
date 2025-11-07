"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-600 font-semibold text-lg"
            >
              {" "}
              <span>CDC Descomplica</span>
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === "/"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/artigos"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                pathname === "/articles"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-300"
              }`}
            >
              Todos os Artigos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
