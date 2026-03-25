import React from 'react';
import { Search, Zap, Image as ImageIcon, Sparkles, Users, BarChart3, Edit3, LucideIcon } from 'lucide-react';
import { Tab } from '../App';

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  tabId?: Tab;
}

const features: Feature[] = [
  { title: 'SEO and Ranking', description: 'The ultimate suite of YouTube SEO and video ranking tools', icon: Search, tabId: 'keywords' },
  { title: 'Channel Optimization', description: 'Everything you need to help manage, optimize, and evaluate your YouTube channel.', icon: Zap, tabId: 'optimizer' },
  { title: 'Video + Thumbnail', description: 'Everything you need to help manage, optimize, and evaluate your YouTube channel.', icon: ImageIcon, tabId: 'thumbnail' },
  { title: 'AI Features', description: 'Save time and watch your channel go viral with our AI tools designed to take your videos to the next level', icon: Sparkles, tabId: 'features' },
  { title: 'Community Management', description: 'Interact with your audience in unique ways to turn your viewers into subscribers.', icon: Users, tabId: 'community' },
  { title: 'Data and Analytics', description: 'Valuable YouTube video analytics and insights for your channel.', icon: BarChart3, tabId: 'dashboard' },
  { title: 'Bulk Edit Tools', description: 'Save time by editing your channel and individual videos all at once.', icon: Edit3, tabId: 'bulk' },
];

interface FeaturesProps {
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center mb-12">Features designed to help creators win</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-red-500/30 transition-all space-y-4">
            <feature.icon className="w-8 h-8 text-red-500" />
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
            {feature.tabId && (
              <button 
                onClick={() => setActiveTab(feature.tabId!)}
                className="inline-block text-red-500 font-medium text-sm hover:text-red-400"
              >
                Learn more →
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
