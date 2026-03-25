import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Check, Tag as TagIcon, Type, AlignLeft } from 'lucide-react';
import { generateOptimizedMetadata } from '../services/geminiService';
import { motion } from 'motion/react';

export default function TagGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      // Reuse the metadata generator which also returns tags
      const analysis = await generateOptimizedMetadata(topic, "", []);
      const result = JSON.parse(analysis);
      if (result.Tags) {
        setTags(result.Tags);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyTags = () => {
    navigator.clipboard.writeText(tags.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <TagIcon className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold">AI Tag Generator</h3>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400 font-medium">Video Topic / Title</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How to bake a chocolate cake" 
            className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-red-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? 'Generating tags...' : 'Generate Tags'}
        </button>
      </div>

      {tags.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-red-500">Generated Tags</h4>
            <button 
              onClick={copyTags}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy all'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1.5 bg-white/5 rounded-full text-sm text-gray-300 border border-white/5 hover:border-red-500/30 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
