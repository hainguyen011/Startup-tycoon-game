import React from 'react';
import { GameState } from '../../../types';
import { User, Sparkles, TrendingUp, Zap, Heart } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface FounderTabProps {
  state: GameState;
}

export const FounderTab: React.FC<FounderTabProps> = ({ state }) => {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fadeIn space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                <div className="w-40 h-40 rounded-full bg-white shadow-xl border-4 border-white overflow-hidden flex items-center justify-center mb-6 relative group">
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Sparkles className="text-blue-600" size={32}/>
                    </div>
                    {state.ceo.gender === 'Female' ? (
                        <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-500">
                            <User size={80}/>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
                            <User size={80}/>
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{state.ceo.name}</h2>
                <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">Chief Executive Officer</div>
                
                <div className="flex gap-2 mt-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"><TrendingUp size={18}/></div>
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"><Zap size={18}/></div>
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-purple-500 transition-colors cursor-pointer"><Heart size={18}/></div>
                </div>
            </div>

            <div className="flex-1 p-8 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-1">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.founder.management')}</div>
                         <div className="text-2xl font-bold text-slate-900">{state.playerSkills.management} <span className="text-sm font-medium text-slate-400">/ 100</span></div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{width: `${state.playerSkills.management}%`}}></div></div>
                     </div>
                     <div className="space-y-1">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.founder.technical')}</div>
                         <div className="text-2xl font-bold text-slate-900">{state.playerSkills.tech} <span className="text-sm font-medium text-slate-400">/ 100</span></div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full" style={{width: `${state.playerSkills.tech}%`}}></div></div>
                     </div>
                     <div className="space-y-1">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('dashboard.founder.charisma')}</div>
                         <div className="text-2xl font-bold text-slate-900">{state.playerSkills.charisma} <span className="text-sm font-medium text-slate-400">/ 100</span></div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-purple-600 h-full" style={{width: `${state.playerSkills.charisma}%`}}></div></div>
                     </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Heart size={14} className="text-rose-500"/> {t('dashboard.founder.interests')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {state.ceo.interests.map(interest => (
                            <span key={interest} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-2xl border border-slate-200">
                                #{interest}
                            </span>
                        ))}
                        {state.ceo.interests.length === 0 && <span className="text-slate-400 italic text-sm">{t('dashboard.founder.noInterests')}</span>}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.tabs.founder')}</h4>
                     <p className="text-slate-600 leading-relaxed text-sm italic">
                         {language === 'vi' 
                           ? `Là người sáng lập ${state.companyName}, ${state.ceo.name} mang theo tầm nhìn thay đổi ngành ${state.industry}. Với đam mê dành cho ${state.ceo.interests.slice(0, 2).join(' và ')}, mục tiêu là xây dựng một đế chế kỳ lân bền vững.`
                           : `As the founder of ${state.companyName}, ${state.ceo.name} brings a vision to disrupt the ${state.industry} industry. With a passion for ${state.ceo.interests.slice(0, 2).join(' and ')}, the goal is to build a sustainable unicorn empire.`
                         }
                     </p>
                </div>
            </div>
        </div>
    </div>
  );
};
