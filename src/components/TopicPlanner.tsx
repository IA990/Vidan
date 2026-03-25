import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export default function TopicPlanner() {
  const [niche, setNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!niche) return;
    setLoading(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please ensure GEMINI_API_KEY is set in your environment.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Generate 5 trending video topic ideas for the niche: ${niche}. Return as a JSON array of strings.`,
        config: { responseMimeType: "application/json" },
      });
      
      if (response.text) {
        setTopics(JSON.parse(response.text));
      } else {
        throw new Error("Failed to generate topics.");
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to generate topics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold">Video Topic Planner</h3>
        </div>

        <input 
          type="text" 
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g. Tech reviews, Cooking, Gaming" 
          className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500"
        />

        <button 
          onClick={handleGenerate}
          disabled={loading || !niche}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Generating...' : 'Generate Topics'}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {topics.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6"
        >
          <h4 className="font-bold text-red-500">Suggested Topics</h4>
          <ul className="space-y-4">
            {topics.map((topic, i) => (
              <li key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                {topic}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}
