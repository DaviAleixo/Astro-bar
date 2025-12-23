
import React, { useState } from 'react';
import { UserPlus, Trash2, User as UserIcon, ShieldCheck, Edit3, X } from 'lucide-react';
import { User, Shift } from '../types';

interface UsersViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser: (userId: string) => void;
  currentUserId: string;
}

const UsersView: React.FC<UsersViewProps> = ({ users, onAddUser, onUpdateUser, onDeleteUser, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState<'add' | 'edit' | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    shift: Shift.MORNING,
    isAdmin: false
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', username: '', password: '', shift: Shift.MORNING, isAdmin: false });
    setIsModalOpen('add');
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: '',
      shift: user.shift,
      isAdmin: user.isAdmin || false
    });
    setIsModalOpen('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) return;

    if (isModalOpen === 'add') {
      if (!formData.password) return;
      onAddUser(formData);
    } else if (isModalOpen === 'edit' && editingUser) {
      const updates: Partial<User> = {
        name: formData.name,
        username: formData.username,
        shift: formData.shift,
        isAdmin: formData.isAdmin
      };
      if (formData.password) updates.password = formData.password;
      onUpdateUser(editingUser.id, updates);
    }
    
    setIsModalOpen(null);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-astro-green">Equipe Astrô</h2>
          <p className="text-slate-500 text-sm font-medium">Gerenciamento de acessos e perfis.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-astro-green text-white px-5 py-3.5 rounded-2xl shadow-md active:scale-95 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-bold text-sm">Novo Perfil</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead className="bg-slate-50 hidden md:table-header-group">
              <tr>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Funcionário</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Turno</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0 last:border-b-0">
                  <td className="md:p-4 mb-3 md:mb-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${user.isAdmin ? 'bg-astro-orange/10 text-astro-orange' : 'bg-astro-green/10 text-astro-green'}`}>
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-black text-slate-800 leading-tight">{user.name}</p>
                        <p className="text-[11px] text-slate-400 font-bold">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="md:p-4 mb-2 md:mb-0">
                    <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase">
                      {user.shift}
                    </span>
                  </td>
                  <td className="md:p-4 mb-4 md:mb-0">
                    {user.isAdmin ? (
                      <div className="flex items-center gap-1.5 text-astro-orange font-black text-[10px] uppercase">
                        <ShieldCheck className="w-4 h-4" />
                        Admin
                      </div>
                    ) : (
                      <span className="text-slate-400 font-bold text-[10px] uppercase">Bartender</span>
                    )}
                  </td>
                  <td className="md:p-4">
                    <div className="flex justify-end items-center gap-4 md:gap-2">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="p-3 md:p-2 bg-slate-50 md:bg-transparent rounded-xl text-slate-400 hover:text-astro-green active:text-astro-green transition-colors"
                      >
                        <Edit3 className="w-6 h-6 md:w-5 md:h-5" />
                      </button>
                      
                      {user.id !== currentUserId && user.id !== 'admin' && (
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="p-3 md:p-2 bg-red-50 md:bg-transparent rounded-xl text-red-300 hover:text-red-500 active:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-6 h-6 md:w-5 md:h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-astro-green/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[70]">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-slide-up sm:animate-none overflow-y-auto max-h-[90vh]">
            <button 
              onClick={() => setIsModalOpen(null)}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-astro-green mb-6 pr-8">
              {isModalOpen === 'add' ? 'Novo Funcionário' : 'Editar Funcionário'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none font-bold"
                  placeholder="Ex: David Bowie"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuário</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Senha {isModalOpen === 'edit' && '(opcional)'}
                  </label>
                  <input
                    type="password"
                    required={isModalOpen === 'add'}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none font-bold"
                    placeholder={isModalOpen === 'edit' ? "Manter atual" : "••••••"}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Turno Padrão</label>
                <select
                  value={formData.shift}
                  onChange={e => setFormData({...formData, shift: e.target.value as Shift})}
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none bg-white font-bold"
                >
                  {Object.values(Shift).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <input
                  type="checkbox"
                  id="isAdminCheck"
                  checked={formData.isAdmin}
                  disabled={editingUser?.id === 'admin'}
                  onChange={e => setFormData({...formData, isAdmin: e.target.checked})}
                  className="w-6 h-6 rounded-lg border-slate-300 text-astro-green focus:ring-astro-green disabled:opacity-50"
                />
                <label htmlFor="isAdminCheck" className={`text-sm font-black text-slate-600 cursor-pointer ${editingUser?.id === 'admin' ? 'opacity-50' : ''}`}>
                  Definir como Administrador
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-4 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(null)}
                  className="w-full py-4 rounded-2xl border border-slate-200 font-bold text-slate-400 active:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-astro-green text-white font-black shadow-lg active:scale-95 transition-all"
                >
                  {isModalOpen === 'add' ? 'Cadastrar' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
