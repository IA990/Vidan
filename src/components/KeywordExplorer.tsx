import React, { useState } from 'react';
import { Search, TrendingUp, AlertCircle, CheckCircle2, Info, Sparkles, Loader2 } from 'lucide-react';
import { analyzeKeywords } from '../services/geminiService';
import { motion } from 'motion/react';

export default function KeywordExplorer() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);
    try {
      const analysis = await analyzeKeywords(keyword);
      if (analysis) {
        setResults(JSON.parse(analysis));
      } else {
        setResults({ error: "No analysis received. Please try again." });
      }
    } catch (error) {
      console.error(error);
      setResults({ error: "Failed to parse analysis. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">Keyword <span className="text-red-600">Explorer</span></h2>
        <p className="text-gray-400 max-w-xl mx-auto">Discover high-volume, low-competition keywords to help your videos rank higher in search results.</p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <input 
          type="text" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a keyword or topic..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-6 pr-32 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-lg"
        />
        <button 
          disabled={loading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Analyzing...' : 'Explore'}
        </button>
      </form>

      {results && !results.error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Main Score */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Analysis for "{keyword}"</h3>
              <div className="px-4 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-bold border border-green-500/20">
                Excellent Potential
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Search Volume</span>
                  <span className="font-bold text-green-500">{results["Search Volume"]}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Competition</span>
                  <span className="font-bold text-yellow-500">{results["Competition"]}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[45%]"></div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <circle 
                      cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * results["Overall Score"]) / 100}
                      className="text-red-500 transition-all duration-1000" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{results["Overall Score"]}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Score</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                Content Ideas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results["Content Ideas"]?.map((idea: string, i: number) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors border border-white/5">
                    {idea}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Keywords */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6">Related Keywords</h3>
            <div className="space-y-3">
              {results["Related Keywords"]?.map((kw: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setKeyword(kw)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-red-600/10 hover:text-red-500 rounded-xl text-sm transition-all border border-white/5 flex items-center justify-between group"
                >
                  {kw}
                  <Search className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {results?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {results.error}
        </div>
      )}
    </div>
  );
}
