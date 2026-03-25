import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, PlayCircle, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { searchVideos } from '../services/youtubeService';
import AdUnit from './AdUnit';

const data = [
  { name: 'Mon', views: 4000, subs: 240 },
  { name: 'Tue', views: 3000, subs: 139 },
  { name: 'Wed', views: 2000, subs: 980 },
  { name: 'Thu', views: 2780, subs: 390 },
  { name: 'Fri', views: 1890, subs: 480 },
  { name: 'Sat', views: 2390, subs: 380 },
  { name: 'Sun', views: 3490, subs: 430 },
];

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-red-600/10 rounded-2xl group-hover:bg-red-600/20 transition-colors">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {change}
      </div>
    </div>
    <p className="text-gray-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold mt-1">{value}</h3>
  </div>
);

import { Tab } from '../App';

export default function Dashboard({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<Tab>> }) {
  const [trendingVideos, setTrendingVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("trending tech 2024");

  const fetchTrending = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchVideos(query);
      if (results.length > 0) {
        setTrendingVideos(results);
      } else {
        setError("No videos found for this search term.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos from YouTube API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending(searchTerm);
  }, [searchTerm]);

  return (
    <main className="space-y-8">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Statistiques clés">
        <StatCard title="Total Views" value="1.2M" change="+12.5%" icon={Eye} trend="up" />
        <StatCard title="Subscribers" value="45.2K" change="+5.2%" icon={Users} trend="up" />
        <StatCard title="Watch Time" value="12.4K hrs" change="-2.1%" icon={PlayCircle} trend="down" />
        <StatCard title="Avg. CTR" value="8.4%" change="+1.4%" icon={TrendingUp} trend="up" />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8" aria-label="Analyses et tendances">
        <article className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl">
          <header className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Views Over Time</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </header>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="bg-white/5 border border-white/10 p-8 rounded-3xl">
          <header className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold">Trending Topics</h3>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-red-500 w-32"
              placeholder="Search..."
            />
          </header>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
              <p className="text-sm text-gray-400">Fetching YouTube data...</p>
            </div>
          ) : error && trendingVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-yellow-500/50" />
              <p className="text-sm text-gray-400 px-4">{error}</p>
              <button 
                className="text-xs text-red-500 underline"
                onClick={() => setActiveTab('settings')}
              >
                Configure API Key
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {(trendingVideos.length > 0 ? trendingVideos : [1, 2, 3, 4]).map((video, i) => (
                <div key={video.id?.videoId || i} className="flex gap-4 group cursor-pointer">
                  <div className="w-24 aspect-video bg-white/10 rounded-lg overflow-hidden relative">
                    {video.snippet?.thumbnails?.default?.url ? (
                      <img 
                        src={video.snippet.thumbnails.default.url} 
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
                      {video.snippet?.title || "How to grow your YouTube channel in 2024"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {video.snippet?.channelTitle || "Vidan Academy"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm font-medium">
            View All Trends
          </button>
        </article>
      </section>
      
      <aside className="bg-white/5 border border-white/10 p-8 rounded-3xl" aria-label="Publicité">
        <AdUnit slot="1234567890" />
      </aside>
    </main>
  );
}
