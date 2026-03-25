import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export default function ThumbnailPreview({ user }: { user: any }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        setHasApiKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
    // Auto-detect language
    const browserLang = navigator.language.split('-')[0];
    if (['fr', 'en', 'es'].includes(browserLang)) {
      setLanguage(browserLang);
    }
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(await window.aistudio.hasSelectedApiKey());
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      // 1. Check usage limit
      const response = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt }),
      });
      
      if (response.status === 429) {
        alert("Limite atteinte ! Vous avez utilisé vos 3 analyses gratuites du jour.");
        return;
      }
      
      if (!response.ok) throw new Error('Failed to check usage limit');
      
      const data = await response.json();
      setRemaining(data.remaining);

      // 2. Generate strategy using Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const fullPrompt = `Tu es l'intelligence artificielle de "Vidan AI", une plateforme experte en stratégie de croissance et optimisation de chaînes YouTube. Ton unique mission est d'aider les créateurs à exploser leur taux de clic (CTR) et leur audience.

Analyse la niche suivante : ${prompt}
Réponds impérativement en langue : ${language === 'fr' ? 'Français' : language === 'en' ? 'Anglais' : 'Espagnol'}

Génère une réponse au format JSON suivant :
{
  "niche_strategy": "Ton analyse stratégique SEO ici, incluant les mots-clés principaux, l'intention de recherche et les opportunités de croissance",
  "suggestions": [
    {
      "type": "Nom du concept",
      "visual": "Description précise de ce qu'on doit voir sur l'image",
      "text_overlay": "Le texte à écrire sur la miniature (3 mots max)",
      "title_tag": "Le titre optimisé pour le SEO (mots-clés, curiosité)"
    }
  ],
  "design_tips": {
    "colors": ["Couleur 1", "Couleur 2"],
    "font_style": "Style de police conseillé"
  }
}
`;
      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      console.log(aiResponse.text);
      alert("Analyse SEO Vidan AI générée ! Consultez la console pour voir le résultat.");
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la génération.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-white/5 rounded-3xl border border-white/10">
        <h3 className="text-xl font-bold mb-4">Connectez votre chaîne YouTube</h3>
        <p className="mb-6 text-gray-400">Pour débloquer vos 3 analyses quotidiennes gratuites.</p>
        <a href="/api/auth/url" className="bg-red-600 px-6 py-3 rounded-xl font-bold">
          Se connecter avec Google
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold">AI Thumbnail Generator</h3>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0f0f0f] border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none"
            >
              <option value="fr">FR</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <div className="text-sm text-gray-400">
              Essais restants : {remaining !== null ? remaining : '...'} / 3
            </div>
          </div>
        </div>

        {!hasApiKey ? (
          <button 
            onClick={handleSelectKey}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
          >
            <Key className="w-5 h-5" />
            Select API Key to Generate
          </button>
        ) : (
          <>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your thumbnail (e.g. A happy person holding a camera)" 
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500"
            />

            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate Thumbnail'}
            </button>
          </>
        )}
      </div>

      {imageUrl && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 p-4 rounded-3xl"
        >
          <img src={imageUrl} alt="Generated Thumbnail" className="w-full rounded-2xl" referrerPolicy="no-referrer" />
        </motion.div>
      )}
    </div>
  );
}
