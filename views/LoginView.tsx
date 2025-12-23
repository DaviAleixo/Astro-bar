
import React, { useState, useEffect } from 'react';
import { Beer, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';

interface LoginViewProps {
  onLogin: (username: string, pass: string) => boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = StorageService.getRememberedUsername();
    if (saved) {
      setUsername(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (rememberMe) {
      StorageService.saveRememberedUsername(username);
    } else {
      StorageService.clearRememberedUsername();
    }

    const success = onLogin(username, password);
    if (!success) {
      setError('Credenciais inválidas. Verifique usuário e senha.');
    }
  };

  return (
    <div className="min-h-screen bg-astro-green flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-astro-orange opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-astro-cream opacity-5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-[400px] space-y-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-astro-orange rounded-[2rem] md:rounded-[2.5rem] shadow-2xl rotate-3 mb-2">
          <Beer className="w-10 h-10 md:w-12 md:h-12 text-white -rotate-3" />
        </div>
        
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">Astrô <span className="text-astro-orange">Bar</span></h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Gestão & Estoque Colaborativo</p>
        </div>

        <div className="bg-astro-cream p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl text-left border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-astro-green/40 uppercase tracking-widest ml-1">Usuário</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-astro-green/30" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-astro-green/5 focus:border-astro-green transition-all font-bold text-astro-green text-sm md:text-base"
                  placeholder="Seu usuário"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-astro-green/40 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-astro-green/30" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-astro-green/5 focus:border-astro-green transition-all font-bold text-astro-green text-sm md:text-base"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-astro-green focus:ring-astro-green cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs font-bold text-astro-green/60 uppercase tracking-wide cursor-pointer select-none">
                Lembrar meu usuário
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold border border-red-100 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 md:py-5 rounded-2xl bg-astro-green text-white font-black text-base md:text-lg shadow-xl hover:bg-opacity-95 active:scale-[0.97] transition-all"
            >
              Acessar Painel
            </button>
          </form>
        </div>
      </div>
      
      <p className="mt-8 md:mt-12 text-white/20 text-[9px] font-black uppercase tracking-widest text-center">
        Sistema Exclusivo para Funcionários
      </p>
    </div>
  );
};

export default LoginView;
