import React from 'react';
import { Search, Zap, Image as ImageIcon, Sparkles, Users, BarChart3, Edit3, LucideIcon, Target, LayoutDashboard } from 'lucide-react';
import { Tab } from '../App';
import AdUnit from './AdUnit';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  tabId?: Tab;
}

const features: Feature[] = [
  { title: 'Keyword Explorer', description: 'Find high-volume, low-competition keywords to rank your videos higher in search results.', icon: Search, tabId: 'keywords' },
  { title: 'SEO Optimizer', description: 'Analyze your video metadata and get actionable suggestions to improve your click-through rate.', icon: Zap, tabId: 'optimizer' },
  { title: 'Thumbnail Preview', description: 'Visualize how your thumbnails look in YouTube search and suggested video feeds.', icon: ImageIcon, tabId: 'thumbnail' },
  { title: 'AI Topic Planner', description: 'Generate viral video ideas and content plans using our advanced AI models.', icon: Sparkles, tabId: 'planner' },
  { title: 'Community Management', description: 'Engage with your audience, manage comments, and build a loyal subscriber base.', icon: Users, tabId: 'community' },
  { title: 'Analytics Dashboard', description: 'Track your channel performance, audience growth, and video engagement metrics.', icon: BarChart3, tabId: 'dashboard' },
  { title: 'Bulk Edit Tools', description: 'Save hours by applying changes to multiple videos simultaneously.', icon: Edit3, tabId: 'bulk' },
  { title: 'Tag Generator', description: 'Automatically generate relevant tags to boost your video discoverability.', icon: Target, tabId: 'tags' },
];

interface FeaturesProps {
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Vidan AI Toolkit</h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Unleash the full potential of your YouTube channel with our comprehensive suite of AI-powered tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-red-500/30 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <feature.icon className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            {feature.tabId && (
              <button 
                onClick={() => setActiveTab(feature.tabId!)}
                className="inline-block text-red-500 font-medium text-sm hover:text-red-400"
              >
                Use Tool →
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
        <AdUnit slot="0987654321" />
      </div>
    </div>
  );
}
