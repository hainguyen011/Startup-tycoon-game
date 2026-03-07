import React from 'react';
import { GameState } from '../../../types';
import Button from '../../Button';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface CouncilTabProps {
  state: GameState;
  onAskAdvice: () => void;
}

export const CouncilTab: React.FC<CouncilTabProps> = ({ state, onAskAdvice }) => {
  const { t } = useLanguage();

  return (
    <div className="animate-fadeIn space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <div>
                <h2 className="text-2xl font-bold font-heading text-slate-800">{t('dashboard.council.title')}</h2>
                <p className="text-sm text-slate-500">{t('dashboard.council.subtitle')}</p>
            </div>
            <Sparkles className="text-amber-400" size={32}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.council?.map(member => (
                <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 group">
                    <div className="text-5xl mb-4 p-4 bg-slate-50 rounded-full group-hover:scale-110 transition-transform">{member.avatar}</div>
                    <h3 className="font-bold text-xl text-slate-900">{member.name}</h3>
                    <p className="text-xs text-blue-600 font-bold uppercase mb-4 tracking-widest">{member.role}</p>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 text-left">{t('dashboard.council.specialty')}</div>
                        <div className="text-sm font-medium text-slate-700 text-left line-clamp-2">{member.specialty}</div>
                    </div>
                    <Button onClick={onAskAdvice} className="w-full py-3" variant="secondary">{t('dashboard.council.requestAdvice')}</Button>
                </div>
            ))}
        </div>
    </div>
  );
};
