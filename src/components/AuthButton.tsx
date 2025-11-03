'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        alert(error.message);
      } else {
        setShowLogin(false);
        setEmail('');
        setPassword('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user.email}</span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    );
  }

  if (showLogin) {
    return (
      <form onSubmit={handleSignIn} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          {isSubmitting ? 'Connexion...' : 'Connexion'}
        </button>
        <button
          type="button"
          onClick={() => setShowLogin(false)}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowLogin(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span>Connexion</span>
    </button>
  );
}
