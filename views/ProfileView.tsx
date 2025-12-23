
import React, { useState } from 'react';
import { User, Shield, Moon, Sun, Sunrise, History } from 'lucide-react';
import { User as UserType, Log, Shift } from '../types';

interface ProfileViewProps {
  user: UserType;
  personalLogs: Log[];
  onUpdateUser: (updates: Partial<UserType>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, personalLogs, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const getShiftIcon = (shift: Shift) => {
    switch (shift) {
      case Shift.MORNING: return <Sunrise className="w-8 h-8 text-blue-400" />;
      case Shift.AFTERNOON: return <Sun className="w-8 h-8 text-orange-400" />;
      case Shift.NIGHT: return <Moon className="w-8 h-8 text-indigo-400" />;
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<UserType> = { name };
    if (password) updates.password = password;
    onUpdateUser(updates);
    setIsEditing(false);
    setPassword('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
          <User className="w-12 h-12" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800">{user.name}</h2>
          <p className="text-slate-400 font-medium mb-4">@{user.username}</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            {getShiftIcon(user.shift)}
            <span className="font-bold text-slate-600">Turno {user.shift}</span>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            Configurações da Conta
          </h3>
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nome de Exibição</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Nova Senha (opcional)</label>
              <input
                type="password"
                placeholder="Deixe em branco para manter"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <History className="w-5 h-5 text-purple-500" />
          Minhas Atividades Recentes
        </h3>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {personalLogs.length > 0 ? (
            personalLogs.map(log => (
              <div key={log.id} className="p-5 flex items-center justify-between">
                <p className="text-slate-600 font-medium">{log.action}</p>
                <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 font-medium">
              Você ainda não realizou nenhuma ação neste turno.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
