
import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Users } from 'lucide-react';
import { Task, Shift } from '../types';

interface ChecklistViewProps {
  tasks: Task[];
  userShift: Shift;
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const ChecklistView: React.FC<ChecklistViewProps> = ({ tasks, userShift, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const shiftTasks = tasks.filter(t => t.shift === userShift);
  const completedCount = shiftTasks.filter(t => t.completed).length;
  const progress = shiftTasks.length > 0 ? (completedCount / shiftTasks.length) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask(newTaskText);
    setNewTaskText('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-astro-green text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-astro-orange w-5 h-5" />
            <span className="text-astro-orange font-black text-xs uppercase tracking-widest">Lista Compartilhada</span>
          </div>
          <h2 className="text-3xl font-bold mb-1">Checklist: Turno {userShift}</h2>
          <p className="text-slate-300 text-sm font-medium">Todas as ações feitas aqui são vistas por seus colegas de turno.</p>
          
          <div className="mt-8 flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-4xl font-black text-astro-orange">{completedCount}</span>
              <span className="text-white/60 font-bold uppercase tracking-tighter ml-2 text-sm">de {shiftTasks.length} tarefas</span>
            </div>
            <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-astro-orange transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] p-8 opacity-[0.05]">
          <CheckCircle2 className="w-64 h-64" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          placeholder="Nova tarefa para o turno..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          className="w-full pl-6 pr-16 py-5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-astro-green/5 focus:border-astro-green transition-all shadow-sm bg-white"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-astro-orange text-white p-3 rounded-xl shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-3">
        {shiftTasks.length > 0 ? (
          shiftTasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                task.completed ? 'bg-white/50 border-transparent opacity-50 grayscale' : 'bg-white border-slate-200 shadow-sm hover:border-astro-green/30'
              }`}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={`transition-colors ${task.completed ? 'text-astro-green' : 'text-slate-300 hover:text-astro-orange'}`}
              >
                {task.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
              </button>
              
              <span className={`flex-1 font-semibold text-lg ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {task.text}
              </span>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-slate-200 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-slate-300">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400 font-bold">Nenhuma tarefa compartilhada para este turno.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistView;
