import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  Settings, 
  BarChart2, 
  Tag, 
  Youtube, 
  LayoutDashboard,
  Zap,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Info,
  Image as ImageIcon,
  Lightbulb,
  Users,
  Edit3,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Components
import KeywordExplorer from './components/KeywordExplorer';
import VideoOptimizer from './components/VideoOptimizer';
import Dashboard from './components/Dashboard';
import TagGenerator from './components/TagGenerator';
import ThumbnailPreview from './components/ThumbnailPreview';
import TopicPlanner from './components/TopicPlanner';
import Features from './components/Features';
import CommunityManagement from './components/CommunityManagement';
import BulkEditTools from './components/BulkEditTools';
import TopNavbar from './components/TopNavbar';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import SeoGuide from './components/SeoGuide';
import MentionsLegales from './components/MentionsLegales';
import PrivacyPolicy from './components/PrivacyPolicy';

export type Tab = 'dashboard' | 'keywords' | 'optimizer' | 'tags' | 'thumbnail' | 'planner' | 'features' | 'community' | 'bulk' | 'settings' | 'seo-guide';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${import.meta.env.VITE_ADSENSE_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setView('dashboard');
      } else {
        setView('landing');
      }
    });

    return () => {
      unsubscribe();
      document.head.removeChild(script);
    };
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'keywords', label: 'Keyword Explorer', icon: Search },
    { id: 'optimizer', label: 'SEO Optimizer', icon: Zap },
    { id: 'tags', label: 'Tag Generator', icon: Tag },
    { id: 'thumbnail', label: 'Thumbnail Preview', icon: ImageIcon },
    { id: 'planner', label: 'Topic Planner', icon: Lightbulb },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'bulk', label: 'Bulk Edit', icon: Edit3 },
    { id: 'seo-guide', label: 'SEO Guide', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const aiTools = [
    { id: 'planner', label: 'Topic Planner', icon: Lightbulb },
    { id: 'optimizer', label: 'SEO Optimizer', icon: Zap },
    { id: 'tags', label: 'Tag Generator', icon: Tag },
    { id: 'thumbnail', label: 'Thumbnail Preview', icon: ImageIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-slate-900 text-white"
          >
            <TopNavbar user={user} onShowAuth={() => setShowAuthForm(true)} />
            <Hero onShowAuth={() => setShowAuthForm(true)} />
            <section className="py-24 bg-slate-900">
              <Features setActiveTab={() => setShowAuthForm(true)} />
            </section>
            <Testimonials />
            <Footer 
              onShowLegal={() => setShowLegal(true)} 
              onShowPrivacy={() => setShowPrivacy(true)} 
              onNavigate={(tab) => {
                if (user) {
                  setView('dashboard');
                  setActiveTab(tab);
                } else {
                  setShowAuthForm(true);
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-500/30"
          >
            <TopNavbar user={user} onShowAuth={() => setShowAuthForm(true)} />
            
            {/* Sidebar */}
            <aside 
              className={cn(
                "fixed left-0 top-16 h-[calc(100vh-64px)] bg-[#1a1a1a] border-r border-white/10 transition-all duration-300 z-40",
                isSidebarOpen ? "w-64" : "w-20"
              )}
            >
              <nav className="mt-8 px-3 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as Tab)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                      activeTab === item.id 
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110")} />
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                ))}
                
                {isSidebarOpen && <div className="mt-6 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">AI Tools</div>}
                {aiTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTab(tool.id as Tab)}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all group",
                      activeTab === tool.id 
                        ? "bg-white/10 text-white" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <tool.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110")} />
                    {isSidebarOpen && <span className="text-sm">{tool.label}</span>}
                  </button>
                ))}
              </nav>
  
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute bottom-6 right-[-12px] w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-[#0f0f0f] hover:scale-110 transition-transform"
              >
                <ChevronRight className={cn("w-4 h-4 transition-transform", isSidebarOpen && "rotate-180")} />
              </button>
            </aside>
  
            {/* Main Content */}
            <main className={cn(
              "transition-all duration-300 min-h-[calc(100vh-64px)] pt-16",
              isSidebarOpen ? "ml-64" : "ml-20"
            )}>
              {/* Header */}
              <header className="h-20 border-bottom border-white/5 flex items-center justify-between px-8 sticky top-16 bg-[#0f0f0f]/80 backdrop-blur-xl z-30">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search videos or keywords..." 
                      className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm"
                    />
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border-2 border-[#0f0f0f]"></span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-purple-600 border-2 border-white/10 shadow-lg"></div>
                </div>
              </header>
  
              {/* Content Area */}
              <div className="p-8 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
                    {activeTab === 'keywords' && <KeywordExplorer />}
                    {activeTab === 'optimizer' && <VideoOptimizer />}
                    {activeTab === 'tags' && <TagGenerator />}
                    {activeTab === 'thumbnail' && <ThumbnailPreview user={user} />}
                    {activeTab === 'planner' && <TopicPlanner />}
                    {activeTab === 'features' && <Features setActiveTab={setActiveTab} />}
                    {activeTab === 'community' && <CommunityManagement />}
                    {activeTab === 'bulk' && <BulkEditTools />}
                    {activeTab === 'seo-guide' && <SeoGuide />}
                    {activeTab === 'settings' && (
                      <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                        <h3 className="text-xl font-bold mb-6">Application Settings</h3>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                            <div>
                              <p className="font-medium">YouTube API Key</p>
                              <p className="text-sm text-gray-400">Required for fetching real-time video data. Get one from Google Cloud Console.</p>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="password" 
                                placeholder="Enter API Key" 
                                className="bg-[#0f0f0f] border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                                value={localStorage.getItem('YOUTUBE_API_KEY') || ''}
                                onChange={(e) => {
                                  localStorage.setItem('YOUTUBE_API_KEY', e.target.value);
                                  // Force re-render to update the input
                                  setActiveTab('settings');
                                }}
                              />
                              <button 
                                className="bg-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors"
                                onClick={() => {
                                  alert('API Key saved successfully!');
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-4">
                            <Info className="w-6 h-6 text-blue-500 shrink-0" />
                            <div className="text-sm text-blue-200/80">
                              <p className="font-bold mb-1">How to get an API Key:</p>
                              <ol className="list-decimal list-inside space-y-1">
                                <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" className="underline text-blue-400">Google Cloud Console</a>.</li>
                                <li>Create a new project.</li>
                                <li>Enable the <strong>YouTube Data API v3</strong>.</li>
                                <li>Go to <strong>Credentials</strong> and create an <strong>API Key</strong>.</li>
                                <li>Paste it here or add it to your <code>.env</code> file.</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <Footer 
                onShowLegal={() => setShowLegal(true)} 
                onShowPrivacy={() => setShowPrivacy(true)} 
                onNavigate={setActiveTab}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
        {showLegal && <MentionsLegales onClose={() => setShowLegal(false)} />}
        {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>
    </>
  );
}
