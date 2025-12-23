
import React from 'react';
import { History, User as UserIcon, Clock, ArrowRight } from 'lucide-react';
import { Log } from '../types';

interface LogsViewProps {
  logs: Log[];
}

const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Histórico de Ações</h2>
          <p className="text-slate-500">Log completo de todas as movimentações do sistema.</p>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <History className="text-purple-500 w-6 h-6" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${log.userShift === 'Noite' ? 'bg-indigo-100 text-indigo-600' : log.userShift === 'Tarde' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{log.userName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">
                          {log.userShift}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium">
                      {log.action}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Nenhum registro encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsView;
