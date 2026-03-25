import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Image as ImageIcon, Key } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export default function ThumbnailPreview() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        setHasApiKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkKey();
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
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: { parts: [{ text: `YouTube thumbnail for: ${prompt}` }] },
        config: {
          imageConfig: { aspectRatio: "16:9", imageSize: "1K" }
        },
      });
      
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
        setHasApiKey(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold">AI Thumbnail Generator</h3>
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
