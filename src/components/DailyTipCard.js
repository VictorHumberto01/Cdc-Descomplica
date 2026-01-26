"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export default function DailyTipCard({ tip }) {
  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-rose-900/5 overflow-hidden border border-rose-100 ring-1 ring-white/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50 to-orange-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-50 to-pink-50 rounded-full blur-3xl -ml-12 -mb-12 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-rose-100/80 text-rose-600 rounded-xl shadow-sm ring-1 ring-rose-200/50">
               <Lightbulb size={20} strokeWidth={2.5} />
             </div>
             <h2 className="text-sm font-bold text-rose-600 tracking-wider uppercase">Dica do Dia</h2>
          </div>
          
          <div className="space-y-6">
             <h3 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
               {tip.titulo}
             </h3>
             <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
               {tip.texto}
             </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-2 sm:items-center text-slate-500">
             <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">Base Legal</span>
             <span className="hidden sm:block text-slate-300">•</span>
             <span className="text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1 rounded-full w-fit">
                {tip.base_legal}
             </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
