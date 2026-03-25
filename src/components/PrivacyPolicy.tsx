import React from 'react';
import { X } from 'lucide-react';

export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 p-8 rounded-3xl w-full max-w-2xl relative shadow-2xl max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white">Politique de Confidentialité</h2>
        <div className="text-gray-400 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Collecte des données</h3>
            <p>Nous collectons uniquement les données nécessaires à la fourniture de nos services (nom, email, données YouTube liées à votre compte).</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Utilisation des données</h3>
            <p>Vos données sont utilisées pour optimiser votre expérience sur Vidan AI et améliorer nos outils IA. Elles ne sont jamais vendues à des tiers.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. Vos droits</h3>
            <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits en nous contactant à contact@vidan-ai.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
