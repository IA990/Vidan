import React from 'react';
import { X } from 'lucide-react';

export default function MentionsLegales({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 p-8 rounded-3xl w-full max-w-2xl relative shadow-2xl max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-white">Mentions Légales</h2>
        <div className="text-gray-400 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Éditeur du site</h3>
            <p>Vidan AI est une plateforme éditée par Vidan AI SAS, au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 123 456 789.</p>
            <p>Siège social : 123 Avenue des Créateurs, 75001 Paris, France.</p>
            <p>Contact : contact@vidan-ai.com</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Hébergement</h3>
            <p>Le site est hébergé par Google Cloud Platform (GCP), via les services Google Cloud Run.</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. Propriété intellectuelle</h3>
            <p>Tous les contenus présents sur le site (textes, images, logos, outils IA) sont la propriété exclusive de Vidan AI SAS ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
