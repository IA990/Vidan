import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Hero({ onShowAuth }: { onShowAuth: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 pt-20">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
        <Sparkles className="w-4 h-4" />
        <span>Propulsé par l'IA pour les créateurs</span>
      </div>
      
      <h1 className="text-7xl font-bold mb-8 tracking-tight max-w-4xl">
        Explosez votre audience <span className="text-red-500">YouTube</span> avec Vidan AI
      </h1>
      
      <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
        Analysez vos performances, optimisez vos miniatures et titres, et découvrez les stratégies de croissance qui fonctionnent réellement.
      </p>
      
      <button 
        onClick={onShowAuth} 
        className="group bg-red-600 hover:bg-red-700 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
      >
        Commencer gratuitement
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
