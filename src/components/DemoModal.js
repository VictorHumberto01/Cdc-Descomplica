"use client";

import { useEffect, useState } from "react";

export default function DemoModal() {
  const [isOpen, setIsOpen] = useState(false);

  // ATENCAO GEREI ESSE MODAL COM IA DEVE ESTAR LIXOSO
  useEffect(() => {
    // Show modal after a very short delay to ensure smooth transition
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          {/* Warning Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </div>

          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-xl font-semibold leading-6 text-gray-900">
              🚧 Versão de Demonstração
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Bem-vindo ao <strong>CDC Descomplica!</strong> Esta é uma versão
                de testes ainda em desenvolvimento.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Antes de continuar, saiba que:
              </p>
              <ul className="mt-2 list-disc text-left text-sm text-gray-500 pl-4 space-y-1">
                <li>
                  Alguns recursos podem estar temporariamente indisponíveis
                </li>
                <li>Podem ocorrer erros ou comportamentos inesperados</li>
                <li>Os dados exibidos podem conter inconsistências</li>
                <li>
                  A interface e funcionalidades podem mudar a qualquer momento
                </li>
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Entendi e desejo continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
