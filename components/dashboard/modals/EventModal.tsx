import React from 'react';
import { InteractiveEvent } from '../../../types';
import { AlertOctagon, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface EventModalProps {
  activeEvent: InteractiveEvent;
  handleEventChoice: (choice: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ activeEvent, handleEventChoice }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp ring-8 ring-black/5">
            <div className={`p-8 text-white relative overflow-hidden ${activeEvent.type === 'crisis' ? 'bg-rose-600' : activeEvent.type === 'opportunity' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex items-center gap-2 mb-3 font-bold uppercase tracking-widest text-xs opacity-90 relative z-10">
                    {activeEvent.type === 'crisis' ? <AlertOctagon size={16}/> : <Sparkles size={16}/>} {t('dashboard.event.priorityAlert')}
                </div>
                <h2 className="text-3xl font-bold font-heading leading-tight relative z-10">{activeEvent.title}</h2>
            </div>
            <div className="p-8">
                <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">{activeEvent.description}</p>
                <div className="space-y-3">
                    {activeEvent.options?.map((opt, idx) => (
                        <button key={idx} onClick={() => handleEventChoice(opt.label)} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-center relative z-10">
                                <span className="font-bold text-slate-800 group-hover:text-blue-700">{opt.label}</span>
                                <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-200 text-slate-600 uppercase tracking-wide group-hover:bg-white">{opt.risk}</span>
                            </div>
                        </button>
                    ))}
                    <button onClick={() => handleEventChoice("Ignore")} className="w-full text-center p-3 text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors mt-4">{t('dashboard.event.ignore')}</button>
                </div>
            </div>
        </div>
    </div>
  );
};
