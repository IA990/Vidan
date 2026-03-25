import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Alex, Créateur Tech",
    quote: "Grâce à Vidan AI, mon taux de clic a augmenté de 40% en un mois. C'est indispensable.",
    role: "100k+ Abonnés"
  },
  {
    name: "Sarah, Vlogueuse Lifestyle",
    quote: "La planification de contenu est devenue un jeu d'enfant. Je gagne 5h par semaine.",
    role: "50k+ Abonnés"
  },
  {
    name: "Thomas, Gaming",
    quote: "Les outils d'optimisation de miniatures sont juste incroyables. Mes vidéos sont enfin vues.",
    role: "200k+ Abonnés"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">Ils font confiance à Vidan AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#121212] border border-white/10 p-8 rounded-3xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />)}
              </div>
              <p className="text-lg text-gray-300 mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-bold text-white">{t.name}</p>
                <p className="text-sm text-red-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
