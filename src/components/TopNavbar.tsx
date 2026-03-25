import React from 'react';
import { Youtube, LogOut, User } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function TopNavbar({ user, onShowAuth }: { user: any, onShowAuth: () => void }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // Refresh to reset state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Vidan <span className="text-red-600">AI</span></span>
      </div>

      <div className="flex items-center gap-4">
        {auth.currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{auth.currentUser.email}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        ) : (
          <button 
            onClick={onShowAuth}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            <User className="w-4 h-4" />
            Connexion
          </button>
        )}
      </div>
    </header>
  );
}
