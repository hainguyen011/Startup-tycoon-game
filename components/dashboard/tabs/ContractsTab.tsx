import React from 'react';
import { GameState } from '../../../types';
import Button from '../../Button';
import { Search, Activity, X, Briefcase as BriefcaseIcon } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface ContractsTabProps {
  state: GameState;
  onFindContracts: () => void;
  onAcceptContract: (id: string) => void;
  onAssignEmployee: (empId: string, targetId: string | null) => void;
  isProcessing: boolean;
}

export const ContractsTab: React.FC<ContractsTabProps> = ({ state, onFindContracts, onAcceptContract, onAssignEmployee, isProcessing }) => {
  const { t } = useLanguage();

  return (
    <div className="animate-fadeIn space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('dashboard.reputation')}</div>
                <div className="text-4xl font-bold text-blue-900 font-heading">{state.reputation}/100</div>
            </div>
            <Button onClick={onFindContracts} disabled={isProcessing} className="shadow-lg shadow-blue-200">
                <Search size={18}/> {t('dashboard.contracts.findNew')}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-xs tracking-widest"><Activity size={16} className="text-orange-500"/> {t('dashboard.contracts.active')}</h3>
                {state.contracts.filter(c => c.status === 'active').map(c => (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border-l-4 border-l-orange-500 border border-slate-200 shadow-sm">
                        <div className="flex justify-between mb-3">
                            <div className="font-bold text-lg text-slate-900">{c.name}</div>
                            <div className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-md self-start">{c.deadlineWeeks} {t('dashboard.contracts.weeksLeft')}</div>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1 font-bold text-slate-500"><span>{t('dashboard.contracts.completion')}</span><span>{Math.round((c.currentEffort / c.totalEffortRequired) * 100)}%</span></div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="bg-orange-500 h-full transition-all duration-500" style={{width: `${(c.currentEffort / c.totalEffortRequired) * 100}%`}}></div></div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-4">
                             <div className="text-xs font-bold text-slate-400 uppercase shrink-0">{t('dashboard.tabs.team')}</div>
                             <select className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-700 outline-none" onChange={(e) => onAssignEmployee(e.target.value, c.id)} value="">
                                 <option value="">+ {t('dashboard.contracts.assignStaff')}</option>
                                 {state.employees.filter(e => !e.assignedContractId && !e.assignedProductId).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                             </select>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {state.employees.filter(e => e.assignedContractId === c.id).map(e => (
                                <span key={e.id} className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                    {e.name} <button onClick={() => onAssignEmployee(e.id, null)} className="hover:text-red-500"><X size={12}/></button>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
                {state.contracts.filter(c => c.status === 'active').length === 0 && <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm italic">{t('dashboard.contracts.noActive')}</div>}
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-xs tracking-widest"><BriefcaseIcon size={16} className="text-blue-500"/> {t('dashboard.contracts.available')}</h3>
                {state.contracts.filter(c => c.status === 'available').map(c => (
                    <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors group shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">{c.name}</div>
                            <div className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md text-sm border border-emerald-100 shadow-sm">+${c.reward}</div>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
                        <div className="flex gap-2 mb-4">
                            {c.reqSkills.map(s => <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wide">{s}</span>)}
                        </div>
                        <Button onClick={() => onAcceptContract(c.id)} className="w-full py-2.5 text-xs" variant="secondary">{t('dashboard.contracts.accept')}</Button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};
