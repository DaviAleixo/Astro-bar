
import React from 'react';
import { Package, CheckSquare, History, User, LogOut, Beer, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string;
  userShift: string;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, onLogout, userName, userShift, isAdmin }) => {
  const tabs = [
    { id: 'stock', name: 'Estoque', icon: Package },
    { id: 'checklist', name: 'Checklist', icon: CheckSquare },
    { id: 'logs', name: 'Histórico', icon: History },
    { id: 'profile', name: 'Meu Perfil', icon: User },
  ];

  if (isAdmin) {
    tabs.push({ id: 'users', name: 'Usuários', icon: Users });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-astro-cream">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-astro-green text-white p-6 sticky top-0 h-screen shadow-xl">
        <div className="flex items-center gap-2 mb-10">
          <Beer className="text-astro-orange w-8 h-8" />
          <h1 className="text-2xl font-bold tracking-tight">Astrô <span className="text-astro-orange">Bar</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-astro-orange text-white shadow-lg' : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="mb-4">
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Logado como</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{userName}</p>
              {isAdmin && <span className="bg-astro-orange text-[8px] px-1 rounded text-white font-bold">ADM</span>}
            </div>
            <p className="text-xs text-astro-orange">Turno {userShift}</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-astro-green text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Beer className="text-astro-orange w-6 h-6" />
          <h1 className="text-xl font-bold">Astrô Bar</h1>
        </div>
        <button onClick={onLogout} className="text-red-300">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === tab.id ? 'text-astro-orange' : 'text-slate-400'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium mt-1">{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
