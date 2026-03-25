import React from 'react';
import { BookOpen, Search, Zap, Image as ImageIcon } from 'lucide-react';

const seoArticles = [
  {
    title: "Comment optimiser vos titres YouTube pour le CTR",
    description: "Découvrez les techniques psychologiques pour rédiger des titres qui incitent au clic sans tomber dans le clickbait.",
    icon: Zap,
    readTime: "5 min"
  },
  {
    title: "L'importance des mots-clés dans la description",
    description: "Apprenez à structurer vos descriptions pour aider l'algorithme YouTube à mieux comprendre et référencer votre contenu.",
    icon: Search,
    readTime: "4 min"
  },
  {
    title: "Comment créer des miniatures qui convertissent",
    description: "Les règles d'or du design pour des miniatures percutantes qui stoppent le scroll des spectateurs.",
    icon: ImageIcon,
    readTime: "6 min"
  }
];

export default function SeoGuide() {
  return (
    <main className="space-y-12">
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Guide SEO YouTube</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Maîtrisez les fondamentaux du référencement pour propulser vos vidéos en haut des résultats de recherche.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {seoArticles.map((article, index) => (
          <article key={index} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:border-red-500/30 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <article.icon className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold">{article.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{article.description}</p>
            <footer className="flex items-center justify-between pt-4">
              <span className="text-xs text-gray-500">{article.readTime} de lecture</span>
              <button className="text-red-500 font-medium text-sm hover:text-red-400">
                Lire l'article →
              </button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
