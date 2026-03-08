import React, { useState } from 'react';
import { GameState, Candidate, Employee } from '../../../types';
import Button from '../../Button';
import { Users, FileSearch, X, ShieldAlert, Target, Zap, TrendingUp, Search } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface TeamTabProps {
  state: GameState;
  onFire: (id: string) => void;
  onRecruit: (jobDesc: string, budget: number) => void;
  onHireCandidate: (candidate: Candidate, isTrial: boolean) => void;
  onOpenChat: (empId: string) => void;
  onTrainEmployee: (empId: string, skillType: string) => void;
  isProcessing: boolean;
}

export const TeamTab: React.FC<TeamTabProps> = ({ state, onFire, onRecruit, onHireCandidate, onOpenChat, onTrainEmployee, isProcessing }) => {
  const { t } = useLanguage();
  const [hrSubTab, setHrSubTab] = useState<'manage' | 'recruit'>('manage');
  const [jobDescription, setJobDescription] = useState('');
  const [recruitBudget, setRecruitBudget] = useState(1500);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [trainingEmployee, setTrainingEmployee] = useState<Employee | null>(null);

  const handleHireFromModal = (isTrial: boolean = false) => {
    if (selectedCandidate) {
      onHireCandidate(selectedCandidate, isTrial);
      setSelectedCandidate(null);
    }
  };

  const handleCheckReference = () => {
      // Simulate Check Reference unlocking 1 random trait
      if (selectedCandidate && state.cash >= 50 && !selectedCandidate.isReferenceChecked) {
          // Ideally this should modify the state in App.tsx via a callback, 
          // For now, we will just mutate the local object for UI or add an onCheckRef callback.
          // Since we mutate local for UI feel:
          if (selectedCandidate.hiddenTraits.length > 0) {
              selectedCandidate.revealedTraits.push(selectedCandidate.hiddenTraits[0]);
          }
          selectedCandidate.isReferenceChecked = true;
          // Force re-render
          setSelectedCandidate({ ...selectedCandidate });
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
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">{t(`dashboard.team.roles.${emp.role.toLowerCase() as 'developer' | 'designer' | 'marketer' | 'sales' | 'manager' | 'secretary' | 'tester'}`)}</div>
                                </div>
                            </div>
                            <div className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">{emp.level}</div>
                        </div>

                        {/* STATUS BADGE */}
                        <div className="mb-4">
                            {(() => {
                                const getStatus = (e: any) => {
                                    if (e.stress > 85) return 'burnout';
                                    if (e.assignedContractId) return 'contract_work';
                                    if (e.assignedProductId) {
                                        const product = state.products.find(p => p.id === e.assignedProductId);
                                        const module = product?.modules.find(m => m.assignedEmployeeId === e.id);
                                        if (module) {
                                            if (module.requiredCoreSkill === 'technical' || module.requiredCoreSkill === 'critical') return 'coding_backend';
                                            if (module.requiredCoreSkill === 'creative' || module.requiredCoreSkill === 'social') return 'designing_ui';
                                        }
                                        return 'coding_backend';
                                    }
                                    if (e.morale > 70) return 'coffee_time';
                                    return 'idle';
                                };
                                const status = getStatus(emp);
                                const statusColors: any = {
                                    coding_backend: "bg-blue-100 text-blue-700 border-blue-200",
                                    designing_ui: "bg-indigo-100 text-indigo-700 border-indigo-200",
                                    querying_db: "bg-cyan-100 text-cyan-700 border-cyan-200",
                                    contract_work: "bg-amber-100 text-amber-700 border-amber-200",
                                    coffee_time: "bg-emerald-100 text-emerald-700 border-emerald-200",
                                    burnout: "bg-rose-100 text-rose-700 border-rose-200 animate-pulse",
                                    idle: "bg-slate-100 text-slate-600 border-slate-200"
                                };
                                return (
                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border w-fit ${statusColors[status]}`}>
                                        {t(`dashboard.team.statuses.${status}`)}
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center mb-5">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('dashboard.team.skill')}</div><div className="font-bold text-slate-800 text-lg leading-none">{emp.skills?.technical || 0}</div></div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('dashboard.stats.morale')}</div><div className={`font-bold text-lg leading-none ${emp.morale < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{emp.morale}</div></div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t('dashboard.team.wage')}</div><div className="font-bold text-slate-800 text-lg leading-none">${emp.salary}</div></div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => onOpenChat(emp.id)} className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">{t('dashboard.team.chat')}</button>
                            <button onClick={() => setTrainingEmployee(emp)} className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">Train</button>
                            <button onClick={() => onFire(emp.id)} className="flex-1 py-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">{t('dashboard.team.fire')}</button>
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

        {/* Candidate Modal - Advanced HR Display */}
        {selectedCandidate && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
                 <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-slideUp my-auto border border-slate-100 flex flex-col md:flex-row">
                     {/* Left Column: Basic Info & Bio */}
                     <div className="p-6 md:p-8 bg-slate-50 border-r border-slate-100 md:w-1/3 flex flex-col justify-between">
                         <div>
                             <div className="flex justify-between items-start mb-6">
                                 <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black border border-indigo-200">{selectedCandidate.name.charAt(0)}</div>
                                 <button onClick={() => setSelectedCandidate(null)} className="p-2 bg-white rounded-full border border-slate-200 hover:bg-slate-100 md:hidden"><X size={20} className="text-slate-500"/></button>
                             </div>
                             <h2 className="text-2xl font-black text-slate-900 leading-tight mb-1">{selectedCandidate.name}</h2>
                             <div className="text-sm text-indigo-600 font-bold mb-4 uppercase tracking-wide">{selectedCandidate.level} {t(`dashboard.team.roles.${selectedCandidate.role.toLowerCase() as any}`)}</div>
                             
                             <div className="prose prose-slate text-sm mb-6"><p className="italic border-l-4 border-indigo-300 pl-4 py-2 bg-white rounded-r-lg text-slate-700 shadow-sm leading-relaxed">"{selectedCandidate.bio}"</p></div>

                             <div className="space-y-3 mb-6">
                                <div className="flex justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.team.ask')}</span>
                                    <span className="text-sm font-black text-emerald-600">${selectedCandidate.salary}/mo</span>
                                </div>
                             </div>
                             
                             <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm text-amber-900 font-semibold shadow-inner">
                                 <div className="flex items-center gap-2 mb-2 text-amber-700 font-black uppercase text-[10px] tracking-widest"><FileSearch size={14}/> {t('dashboard.team.interviewNotes')}</div>
                                 {selectedCandidate.interviewNotes}
                             </div>
                         </div>
                     </div>

                     {/* Right Column: Stats & Actions */}
                     <div className="p-6 md:p-8 md:w-2/3 bg-white flex flex-col justify-between relative">
                         <button onClick={() => setSelectedCandidate(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100 hidden md:flex"><X size={20} className="text-slate-500"/></button>
                         
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-4 md:mt-0 pt-8 md:pt-0">
                            {/* Skills Radar */}
                            <div>
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{t('dashboard.team.skill')}</h4>
                                <div className="h-48 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                                    {selectedCandidate.skills ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius={60} data={[
                                                { subject: t('dashboard.team.coreSkills.technical'), A: selectedCandidate.skills.technical, fullMark: 100 },
                                                { subject: t('dashboard.team.coreSkills.creative'), A: selectedCandidate.skills.creative, fullMark: 100 },
                                                { subject: t('dashboard.team.coreSkills.social'), A: selectedCandidate.skills.social, fullMark: 100 },
                                                { subject: t('dashboard.team.coreSkills.critical'), A: selectedCandidate.skills.critical, fullMark: 100 }
                                            ]}>
                                                <PolarGrid gridType="polygon" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Skills" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-slate-400 text-xs font-bold uppercase">Legacy Data</div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pro Stats</h4>
                                {selectedCandidate.proStats && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                                            <div className="flex items-center gap-2"><Zap size={14} className="text-amber-500"/> {t('dashboard.team.proStats.productivity')}</div>
                                            <div className="text-slate-900 font-black">{selectedCandidate.proStats.productivity}/100</div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{width: `${selectedCandidate.proStats.productivity}%`}}></div></div>
                                        
                                        <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                                            <div className="flex items-center gap-2"><Target size={14} className="text-blue-500"/> {t('dashboard.team.proStats.accuracy')}</div>
                                            <div className="text-slate-900 font-black">{selectedCandidate.proStats.accuracy}/100</div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${selectedCandidate.proStats.accuracy}%`}}></div></div>

                                        <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                                            <div className="flex items-center gap-2"><ShieldAlert size={14} className="text-indigo-500"/> {t('dashboard.team.proStats.reliability')}</div>
                                            <div className="text-slate-900 font-black">{selectedCandidate.proStats.reliability}/100</div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-1.5"><div className="bg-indigo-500 h-1.5 rounded-full" style={{width: `${selectedCandidate.proStats.reliability}%`}}></div></div>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hidden Traits</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {selectedCandidate.revealedTraits?.map((trait, i) => (
                                            <span key={i} className="px-2 py-1 text-xs font-bold text-white bg-slate-800 rounded-md">
                                                {t(`traits.${trait.toLowerCase()}`) || trait}
                                            </span>
                                        ))}
                                        {!selectedCandidate.isReferenceChecked && (
                                            <span className="px-2 py-1 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 border-dashed rounded-md flex items-center gap-1">
                                                <Search size={12}/> ???
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                         </div>

                         {/* HR Actions */}
                         <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                             <div className="flex gap-3">
                                 <Button variant="secondary" onClick={handleCheckReference} disabled={selectedCandidate.isReferenceChecked || state.cash < 50} className="flex-1 text-xs py-3 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm bg-white">
                                     <Search size={14} className="inline mr-2"/> {t('dashboard.team.hrActions.checkRef')}
                                 </Button>
                                 <Button variant="secondary" onClick={() => handleHireFromModal(true)} disabled={state.cash < Math.floor(selectedCandidate.hireCost / 2)} className="flex-1 text-xs py-3 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-sm">
                                     <Zap size={14} className="inline mr-2"/> {t('dashboard.team.hrActions.trial')}
                                 </Button>
                             </div>
                             <div className="flex gap-3 mt-1">
                                 <Button variant="secondary" onClick={() => setSelectedCandidate(null)} className="w-1/3 py-4 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-bold uppercase tracking-wider text-xs">{t('dashboard.team.pass')}</Button>
                                 <Button variant="success" onClick={() => handleHireFromModal(false)} disabled={state.cash < selectedCandidate.hireCost} className="w-2/3 py-4  shadow-xl font-black uppercase tracking-widest text-sm bg-slate-900 border-2 border-slate-800 text-white">
                                     {t('dashboard.team.hireNow')} (${selectedCandidate.hireCost})
                                 </Button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        )}

        {/* Training Center Modal */}
        {trainingEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp my-auto border border-blue-100">
                    <div className="p-6 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-blue-900">Training Center</h2>
                            <p className="text-sm text-blue-700 font-medium">Nâng cấp kỹ năng cho {trainingEmployee.name}</p>
                        </div>
                        <button onClick={() => setTrainingEmployee(null)} className="p-2 bg-white rounded-full border border-blue-200 hover:bg-blue-100"><X size={20} className="text-blue-500"/></button>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'technical', label: 'Technical Course', icon: <Zap size={18}/>, type: 'core' },
                                { id: 'creative', label: 'Design Workshop', icon: <Target size={18}/>, type: 'core' },
                                { id: 'social', label: 'Leadership Seminar', icon: <Users size={18}/>, type: 'core' },
                                { id: 'productivity', label: 'Agile Bootcamp', icon: <TrendingUp size={18}/>, type: 'pro' },
                                { id: 'accuracy', label: 'QA Certification', icon: <ShieldAlert size={18}/>, type: 'pro' }
                            ].map(course => (
                                <div key={course.id} className="border border-slate-200 p-4 rounded-xl flex flex-col items-center text-center hover:border-blue-400 transition-colors bg-slate-50">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                                        {course.icon}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-1">{course.label}</h4>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-3 text-center w-full">
                                        Current: {course.type === 'core' ? trainingEmployee.skills?.[course.id as keyof typeof trainingEmployee.skills] : trainingEmployee.proStats?.[course.id as keyof typeof trainingEmployee.proStats] || 'N/A'}
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            onTrainEmployee(trainingEmployee.id, course.id);
                                            setTrainingEmployee(null);
                                        }} 
                                        disabled={state.cash < 500}
                                        className="w-full text-xs py-2 shadow-sm"
                                    >
                                        Train ($500)
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
