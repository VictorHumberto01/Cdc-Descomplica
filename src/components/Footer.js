export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <span className="text-xl font-bold text-slate-900">CDC <span className="text-blue-600">Descomplica</span></span>
                        <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                            Uma ferramenta intuitiva para democratizar o acesso ao Código de Defesa do Consumidor.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Parceria & Desenvolvimento</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                            Desenvolvido pelos alunos do curso de Ciência da Computação do <span className="font-medium text-slate-700">IFMG - Ibirité</span> em parceria com o <span className="font-medium text-slate-700">Procon Sete Lagoas</span>.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-slate-700">Instituto Federal de Minas Gerais - Campus Ibirité</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-slate-700">Procon Sete Lagoas</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <a
                        href="https://github.com/VictorHumberto01/Cdc-Descomplica"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                        Ver código fonte
                    </a>
                </div>
            </div>
        </footer>
    );
}
