import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TutorialModal({ isOpen, onClose }) {
    const [step, setStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) setStep(0);
    }, [isOpen]);

    const steps = [
        {
            title: "Bem-vindo ao CDC Descomplica!",
            content: (
                <div className="space-y-6">
                    <div className="flex justify-center py-6">
                        <div className="bg-rose-50 p-6 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed text-center">
                        Sua ferramenta definitiva para entender seus direitos como consumidor de forma simples e rápida.
                    </p>
                    <p className="text-slate-500 text-base text-center">
                        Navegue por artigos, tire dúvidas e conheça a lei que protege você.
                    </p>
                </div>
            )
        },
        {
            title: "Como Pesquisar",
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600 text-lg">
                        Para obter os melhores resultados, use <strong>palavras-chave</strong> em vez de frases longas.
                    </p>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-base">
                            <span className="text-red-500 font-bold text-xl">✕</span>
                            <span className="text-slate-500 line-through">"meu produto veio com defeito o que eu faço"</span>
                        </div>
                        <div className="flex items-center gap-3 text-base">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-slate-800 font-medium">"defeito produto"</span>
                        </div>
                        <div className="flex items-center gap-3 text-base">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-slate-800 font-medium">"garantia prazo"</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Resumos e Artigos",
            content: (
                <div className="space-y-6">
                    <p className="text-slate-600 text-lg">
                        O site oferece dois tipos de conteúdo:
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                            <h4 className="font-bold text-rose-800 mb-2 text-lg">Resumos</h4>
                            <p className="text-base text-rose-700">Explicações simples e diretas para dúvidas comuns do dia a dia.</p>
                            <br />
                            <p className="text-sm text-center text-rose-400">Alguns tópicos possuem mais de um resumo. Para isso, passe para o lado e veja os outros resumos.</p>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                            <h4 className="font-bold text-orange-800 mb-2 text-lg">Artigos</h4>
                            <p className="text-base text-orange-700">O texto original da lei para consulta detalhada e jurídica.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "Aviso Importante",
            content: (
                <div className="space-y-6">
                    <div className="flex justify-center py-4">
                        <div className="bg-amber-50 p-4 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        </div>
                    </div>
                    <p className="text-slate-600 text-lg text-center">
                        Este site é uma ferramenta <strong>educativa</strong> para facilitar a leitura do Código de Defesa do Consumidor.
                    </p>
                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                        <p className="text-amber-800 font-medium text-center mb-2">
                            Não substituímos o PROCON
                        </p>
                        <p className="text-amber-700 text-sm text-center">
                            Caso tenha problemas com algum estabelecimento, recomendamos cautela e que procure o PROCON ou aconselhamento jurídico profissional para orientação.
                        </p>
                    </div>
                </div>
            )
        }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onClose(dontShowAgain);
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden border border-slate-100"
                    >
                        <div className="p-8">
                            {/* Progress Bar */}
                            <div className="flex gap-2 mb-8">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${idx <= step ? 'bg-rose-600' : 'bg-slate-100'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="mb-8 min-h-[320px] flex flex-col justify-center">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h2 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">
                                        {steps[step].title}
                                    </h2>
                                    {steps[step].content}
                                </motion.div>
                            </div>

                            {/* Checkbox for Don't Show Again (Only on last step) */}
                            {step === steps.length - 1 && (
                                <div className="mb-6 flex items-center justify-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="dontShowAgain"
                                        checked={dontShowAgain}
                                        onChange={(e) => setDontShowAgain(e.target.checked)}
                                        className="w-5 h-5 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                                    />
                                    <label htmlFor="dontShowAgain" className="text-slate-600 text-base cursor-pointer select-none">
                                        Não mostrar este tutorial novamente
                                    </label>
                                </div>
                            )}

                            {/* Footer Buttons */}
                            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                <button
                                    onClick={handlePrev}
                                    className={`text-slate-500 hover:text-slate-800 text-base font-medium px-4 py-2 rounded-lg transition-colors ${step === 0 ? 'invisible' : ''
                                        }`}
                                >
                                    Voltar
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    {step === steps.length - 1 ? 'Começar' : 'Próximo'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
