import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Heart, Loader2, BarChart2, RefreshCw, Youtube, LogIn, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export default function CommunityManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [channelData, setChannelData] = useState<{name: string, logo: string, id: string} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchChannel();
      } else {
        setIsConnected(false);
        setChannelData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchChannel = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/channel');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(true);
        setChannelData({
          name: data.snippet.title,
          logo: data.snippet.thumbnails.default.url,
          id: data.id
        });
        setLastSynced(new Date().toLocaleTimeString());
      } else if (response.status === 401) {
        setIsConnected(false);
        setChannelData(null);
      } else {
        throw new Error('Failed to fetch channel');
      }
    } catch (error) {
      console.error('Failed to fetch channel', error);
      setIsConnected(false);
    } finally {
      setSyncing(false);
    }
  };

  const toggleAutoReply = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/community/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !autoReplyEnabled }),
      });
      if (!response.ok) throw new Error('Failed to toggle auto-reply');
      const data = await response.json();
      setAutoReplyEnabled(data.enabled);
    } catch (error) {
      console.error('Failed to toggle auto-reply', error);
      alert('Failed to update auto-reply settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalytics = () => {
    if (channelData?.id) {
      window.open(`https://studio.youtube.com/channel/${channelData.id}/analytics`, '_blank');
    } else {
      alert('Channel ID not found. Please sync your channel first.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // After Google sign in, we still need to trigger the YouTube OAuth flow
      // to get the YouTube-specific tokens.
      const response = await fetch('/api/auth/url');
      const { url } = await response.json();
      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          fetchChannel();
          window.removeEventListener('message', handleMessage);
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST' });
    await signOut(auth);
  };

  const handleSync = async () => {
    setSyncing(true);
    await fetchChannel();
    setSyncing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Sync Section */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {isConnected && channelData ? (
            <img src={channelData.logo} alt={channelData.name} className="w-16 h-16 rounded-full border-2 border-red-500" />
          ) : (
            <div className="p-4 bg-red-600/20 rounded-2xl">
              <Youtube className="w-8 h-8 text-red-500" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-lg">{isConnected && channelData ? channelData.name : 'Connect YouTube Channel'}</h3>
            <p className="text-sm text-gray-400">
              {user ? (isConnected 
                ? (lastSynced ? `Last synced at ${lastSynced}` : 'Connected') 
                : 'Connect your channel to manage community features.') : 'Please sign in to continue.'}
            </p>
          </div>
        </div>
        
        {user ? (
          <div className="flex items-center gap-2">
            {isConnected && (
              <button 
                onClick={handleSync}
                disabled={syncing}
                className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              </button>
            )}
            <button 
              onClick={handleSignOut}
              className="bg-white/10 hover:bg-red-900/50 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleGoogleSignIn}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
        )}
      </div>

      <div className={cn("bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6 transition-opacity", !isConnected && "opacity-50 pointer-events-none")}>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold">Community Management</h3>
        </div>
        <p className="text-gray-400">
          Interact with your audience in unique ways to turn your viewers into subscribers.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auto-reply */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-red-500" />
              <h4 className="font-bold">Auto-reply</h4>
            </div>
            <p className="text-sm text-gray-400">Automatically respond to new comments.</p>
            <button 
              onClick={toggleAutoReply}
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                autoReplyEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : autoReplyEnabled ? 'Enabled' : 'Enable Auto-reply'}
            </button>
          </div>

          {/* Engagement Analytics */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500" />
              <h4 className="font-bold">Engagement Analytics</h4>
            </div>
            <p className="text-sm text-gray-400">View real-time audience interaction data.</p>
            <button 
              onClick={handleViewAnalytics}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              <BarChart2 className="w-5 h-5" /> View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
