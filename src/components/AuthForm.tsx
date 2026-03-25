import React, { useState } from 'react';
import { Youtube, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';

export default function AuthForm({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue avec Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isResetMode) {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Un email de réinitialisation a été envoyé à ' + email);
        setIsResetMode(false);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError('La connexion par email/mot de passe n\'est pas activée dans la console Firebase.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Aucun utilisateur trouvé avec cet email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé par un autre compte.');
      } else {
        setError(err.message || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Youtube className="w-9 h-9 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          {isResetMode ? 'Réinitialisation' : (isLogin ? 'Connexion' : 'Créer un compte')}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isResetMode ? 'Entrez votre email pour recevoir un lien' : (isLogin ? 'Accédez à vos outils de croissance' : 'Rejoignez Vidan AI')}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-500" 
            required
          />
          
          {!isResetMode && (
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-500" 
              required
            />
          )}

          {isLogin && !isResetMode && (
            <div className="text-right">
              <button 
                type="button"
                onClick={() => setIsResetMode(true)}
                className="text-xs text-gray-500 hover:text-red-500 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isResetMode ? 'Envoyer le lien' : (isLogin ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        {!isResetMode && (
          <div className="mt-4">
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-gray-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Connexion avec Google
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          {isResetMode ? (
            <button onClick={() => setIsResetMode(false)} className="text-red-500 hover:underline font-medium">
              Retour à la connexion
            </button>
          ) : (
            <button onClick={() => setIsLogin(!isLogin)} className="text-red-500 hover:underline font-medium">
              {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
