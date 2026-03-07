import React, { useState } from 'react';
import { GameState, Candidate } from '../../../types';
import Button from '../../Button';
import { Users, FileSearch, X } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface TeamTabProps {
  state: GameState;
  onFire: (id: string) => void;
  onRecruit: (jobDesc: string, budget: number) => void;
  onHireCandidate: (candidate: Candidate) => void;
  onOpenChat: (empId: string) => void;
  isProcessing: boolean;
}

export const TeamTab: React.FC<TeamTabProps> = ({ state, onFire, onRecruit, onHireCandidate, onOpenChat, isProcessing }) => {
  const { t } = useLanguage();
  const [hrSubTab, setHrSubTab] = useState<'manage' | 'recruit'>('manage');
  const [jobDescription, setJobDescription] = useState('');
  const [recruitBudget, setRecruitBudget] = useState(1500);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleHireFromModal = () => {
    if (selectedCandidate) {
      onHireCandidate(selectedCandidate);
      setSelectedCandidate(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
            <button onClick={() => setHrSubTab('manage')} className={`px-5 py-2 font-bold text-sm rounded-lg transition-all ${hrSubTab === 'manage' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>{t('dashboard.team.manage')}</button>
            <button onClick={() => setHrSubTab('recruit')} className={`px-5 py-2 font-bold text-sm rounded-lg transition-all ${hrSubTab === 'recruit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>{t('dashboard.team.recruit')}</button>
        </div>

        {hrSubTab === 'manage' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.employees.map(emp => (
                    <div key={emp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">{emp.name.charAt(0)}</div>
                                <div>
                                    <div className="font-bold text-slate-900 text-lg">{emp.name}</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">{emp.role}</div>
                                </div>
                            </div>
                            <div className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">{emp.level}</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center mb-5">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('dashboard.team.skill')}</div><div className="font-bold text-slate-800 text-lg leading-none">{emp.skill}</div></div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('dashboard.stats.morale')}</div><div className={`font-bold text-lg leading-none ${emp.morale < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{emp.morale}</div></div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('dashboard.team.wage')}</div><div className="font-bold text-slate-800 text-lg leading-none">${emp.salary}</div></div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => onOpenChat(emp.id)} className="flex-1 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">{t('dashboard.team.chat')}</button>
                            <button onClick={() => onFire(emp.id)} className="flex-1 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">{t('dashboard.team.fire')}</button>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="mb-8 space-y-4 max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-center font-bold text-slate-800 text-lg">{t('dashboard.team.recruitTitle')}</h3>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{t('dashboard.team.roleDesc')}</label>
                        <input className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder={t('dashboard.team.rolePlaceholder')} value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1"><label className="text-xs font-bold text-slate-500 uppercase">{t('dashboard.team.maxBudget')}</label><span className="font-bold text-blue-600">${recruitBudget}</span></div>
                        <input type="range" min="500" max="5000" step="100" value={recruitBudget} onChange={e => setRecruitBudget(Number(e.target.value))} className="w-full accent-blue-600"/>
                    </div>
                    <Button onClick={() => onRecruit(jobDescription, recruitBudget)} disabled={isProcessing} className="w-full py-3 shadow-md">{t('dashboard.team.findCandidates')}</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {state.candidates.map(c => (
                        <div key={c.id} className="border-2 border-slate-100 bg-white p-5 rounded-2xl hover:border-blue-400 cursor-pointer transition-all group" onClick={() => setSelectedCandidate(c)}>
                            <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{c.name}</div>
                            <div className="text-xs text-slate-500 font-medium mb-3">{c.level} {c.role}</div>
                            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                <span className="text-xs font-bold text-slate-400">{t('dashboard.team.ask')}</span>
                                <span className="text-sm font-bold text-emerald-600">${c.salary}/mo</span>
                            </div>
                            <Button className="w-full mt-3 text-xs py-2" variant="secondary">{t('dashboard.team.viewProfile')}</Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Candidate Modal */}
        {selectedCandidate && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
                 <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-slideUp my-auto border border-slate-100">
                     <div className="p-6 md:p-8">
                         <div className="flex justify-between items-start mb-6">
                             <div className="flex gap-4 items-center">
                                 <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold border border-indigo-100">{selectedCandidate.name.charAt(0)}</div>
                                 <div>
                                     <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedCandidate.name}</h2>
                                     <div className="text-slate-500 font-medium">{selectedCandidate.level} {selectedCandidate.role}</div>
                                 </div>
                             </div>
                             <button onClick={() => setSelectedCandidate(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20} className="text-slate-500"/></button>
                         </div>
                         <div className="space-y-6">
                             <div className="prose prose-slate text-sm"><p className="italic border-l-4 border-indigo-300 pl-4 py-2 bg-indigo-50/50 rounded-r-lg text-slate-700">"{selectedCandidate.bio}"</p></div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('dashboard.team.skill')}</div>
                                     <div className="text-2xl font-bold text-slate-900">{selectedCandidate.skill}</div>
                                 </div>
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('dashboard.team.wage')}</div>
                                     <div className="text-2xl font-bold text-slate-900">${selectedCandidate.salary}</div>
                                 </div>
                             </div>
                             <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 text-sm text-amber-900 font-medium">
                                 <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold uppercase text-xs tracking-wider"><FileSearch size={14}/> {t('dashboard.team.interviewNotes')}</div>
                                 {selectedCandidate.interviewNotes}
                             </div>
                             <div className="flex gap-4 pt-4 border-t border-slate-100">
                                 <Button variant="secondary" onClick={() => setSelectedCandidate(null)} className="flex-1 py-3">{t('dashboard.team.pass')}</Button>
                                 <Button variant="success" onClick={handleHireFromModal} disabled={state.cash < selectedCandidate.hireCost} className="flex-1 py-3 shadow-emerald-200 shadow-lg">{t('dashboard.team.hireNow')} (${selectedCandidate.hireCost})</Button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        )}
    </div>
  );
};
