import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, Wand2, Layout, Type, AlignLeft } from 'lucide-react';
import { generateOptimizedMetadata } from '../services/geminiService';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export default function VideoOptimizer() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const analysis = await generateOptimizedMetadata(title, description, tags.split(','));
      if (analysis) {
        setResults(JSON.parse(analysis));
      } else {
        setResults({ error: "No optimization received." });
      }
    } catch (error) {
      console.error(error);
      setResults({ error: "Failed to optimize metadata." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Wand2 className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold">Video Details</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <Type className="w-4 h-4" /> Current Title
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My first vlog in Paris" 
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" /> Description (Optional)
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Briefly describe your video..." 
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <Layout className="w-4 h-4" /> Tags (Comma separated)
                </label>
                <input 
                  type="text" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="vlog, paris, travel..." 
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleOptimize}
              disabled={loading || !title}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-red-600/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Optimizing with AI...' : 'Generate Optimized SEO'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!results && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
              <Sparkles className="w-12 h-12 text-gray-700 mb-4" />
              <h4 className="text-lg font-bold text-gray-500">AI Results will appear here</h4>
              <p className="text-sm text-gray-600 mt-2">Enter your video details and click optimize to see AI-powered suggestions.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 animate-pulse">Gemini is analyzing your content...</p>
            </div>
          )}

          {results && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Suggested Titles */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-red-500 flex items-center gap-2">
                  <Type className="w-4 h-4" /> Suggested Titles
                </h4>
                <div className="space-y-2">
                  {results.Titles?.map((t: string, i: number) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/30 transition-all">
                      <span className="text-sm font-medium">{t}</span>
                      <button 
                        onClick={() => copyToClipboard(t, `title-${i}`)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {copied === `title-${i}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimized Description */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-red-500 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" /> Optimized Description
                  </h4>
                  <button 
                    onClick={() => copyToClipboard(results.Description, 'desc')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === 'desc' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <div className="p-4 bg-[#0f0f0f] rounded-xl border border-white/5 text-sm text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {results.Description}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-red-500 flex items-center gap-2">
                  <Layout className="w-4 h-4" /> High-Ranking Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.Tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
