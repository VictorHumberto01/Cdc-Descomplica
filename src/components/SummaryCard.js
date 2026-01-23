import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SummaryCard({ article, onDismiss }) {
    const [showHighlight, setShowHighlight] = useState(true);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHighlight(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleFeedback = () => {
        setIsSubmittingFeedback(true);
        setTimeout(() => {
            onDismiss();
        }, 1500);
    };

    return (
        <div className="mb-8 rounded-2xl p-[3px] shadow-lg relative overflow-hidden group bg-gradient-to-br from-rose-100 via-orange-100 to-red-100">

            <AnimatePresence>
                {showHighlight && (
                    <motion.div
                        className="absolute inset-[-350%] bg-[conic-gradient(from_90deg,#fb7185,#f43f5e,#e11d48,#fb7185)]"
                        animate={{ rotate: 360 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 0.5 }
                        }}
                    ></motion.div>
                )}
            </AnimatePresence>


            <div className="relative h-full w-full bg-slate-50 rounded-[14px] p-6 md:px-16 overflow-hidden">

                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-rose-200 rounded-full opacity-20 blur-xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-rose-600"
                            >
                                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-rose-900 uppercase tracking-wide">
                            Seu direito resumido
                        </h3>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                        {article.titulo}
                    </h2>

                    <div className="prose prose-rose max-w-none">
                        <p className="text-slate-700 text-lg leading-relaxed">
                            {article.texto}
                        </p>

                        {article.paragrafos && article.paragrafos.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {article.paragrafos.map((p, idx) => (
                                    <div key={idx} className="bg-white/60 rounded-lg p-3 text-slate-700">
                                        {p.texto}
                                        {p.incisos && p.incisos.length > 0 && (
                                            <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                                                {p.incisos.map((inc, i) => (
                                                    <li key={i} className="text-slate-600">{inc}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {article.incisos && article.incisos.length > 0 && (
                            <ul className="list-disc list-inside mt-4 space-y-2 text-slate-700">
                                {article.incisos.map((inc, i) => (
                                    <li key={i}>{inc}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {article.tags && article.tags.map((tag, idx) => (
                            <span key={`${tag}-${idx}`} className="px-3 py-1 bg-white text-rose-600 text-xs font-medium rounded-full border border-rose-100">
                                #{tag}
                            </span>
                        ))}
                    </div>


                    <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-col items-center gap-2">
                        <span className="text-sm text-slate-500">Não encontrou o que procura?</span>
                        <a
                            href="tel:151"
                            className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-rose-50 md:pointer-events-none md:cursor-default"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span className="md:hidden">Ligar para o Procon</span>
                            <span className="hidden md:inline">Procon: 151</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
