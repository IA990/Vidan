import React from 'react';
import { Tab } from '../App';

interface FooterProps {
  onShowLegal: () => void;
  onShowPrivacy: () => void;
  onNavigate: (tab: Tab) => void;
}

export default function Footer({ onShowLegal, onShowPrivacy, onNavigate }: FooterProps) {
  return (
    <footer className="bg-black py-16 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Vidan AI</h3>
          <p className="text-gray-400 text-sm">
            L'outil ultime pour booster votre croissance YouTube grâce à l'IA. Optimisation SEO, miniatures et stratégies de contenu.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Produit</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><button onClick={() => onNavigate('features')} className="hover:text-red-500">Fonctionnalités</button></li>
            <li><button onClick={() => onNavigate('dashboard')} className="hover:text-red-500">Dashboard</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Ressources</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><button onClick={() => onNavigate('seo-guide')} className="hover:text-red-500">Guide SEO</button></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4">Légal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><button onClick={onShowLegal} className="hover:text-red-500">Mentions Légales</button></li>
            <li><button onClick={onShowPrivacy} className="hover:text-red-500">Politique de Confidentialité</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 Vidan AI. Tous droits réservés. Optimisez votre chaîne YouTube avec notre IA.
      </div>
    </footer>
  );
}
