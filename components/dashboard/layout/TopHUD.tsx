import React from 'react';
import { GameState } from '../../../types';
import { BrainCircuit, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface MarketTickerProps {
    condition: string;
}

const MarketTicker: React.FC<MarketTickerProps> = ({ condition }) => {
    const { t } = useLanguage();
    
    let config = { color: 'text-slate-500 bg-slate-50 border-slate-200', icon: <Activity size={14}/>, label: t('market.stable') };
    
    if (condition === 'BULL') {
        config = { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <TrendingUp size={14}/>, label: t('market.bull') };
    } else if (condition === 'BEAR') {
        config = { color: 'text-rose-600 bg-rose-50 border-rose-200', icon: <TrendingDown size={14}/>, label: t('market.bear') };
    }

    return (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.color} animate-pulse shadow-sm`}>
            {config.icon}
            <span className="text-[10px] font-black tracking-tighter uppercase whitespace-nowrap">{config.label}</span>
        </div>
    );
};


interface TopHUDProps {
  state: GameState;
  onOpenCommand: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({ state, onOpenCommand }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed top-0 left-0 right-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold font-heading shadow-lg shadow-blue-200/50">
                {state.companyName.charAt(0)}
            </div>
            <div className="hidden md:block">
                <h1 className="font-bold text-slate-900 leading-tight">{state.companyName}</h1>
                <div className="text-xs text-slate-500 font-medium">{state.industry}</div>
            </div>
            <div className="md:hidden flex flex-col">
                <span className="text-sm font-bold">{t('dashboard.week')} {state.turn}</span>
                <span className="text-xs text-slate-500">${state.cash.toLocaleString()}</span>
            </div>
        </div>

        {/* Desktop Stats Bar */}
        <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="text-xs text-slate-500 font-bold uppercase">{t('dashboard.week')}</span>
                 <span className="font-mono font-bold text-slate-800 text-lg">{state.turn.toString().padStart(2, '0')}</span>
              </div>
              <MarketTicker condition={state.marketCondition} />
              <div className="h-8 w-px bg-slate-200"></div>
             <div className="flex gap-6">
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('dashboard.stats.funds')}</span>
                     <span className={`font-heading font-bold text-lg ${state.cash < 2000 ? 'text-rose-600' : 'text-slate-900'}`}>${state.cash.toLocaleString()}</span>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('dashboard.stats.users')}</span>
                     <span className="font-heading font-bold text-lg text-blue-600">{state.users.toLocaleString()}</span>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('dashboard.reputation')}</span>
                     <span className="font-heading font-bold text-lg text-purple-600">{state.reputation}</span>
                 </div>
             </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
             <button 
                onClick={onOpenCommand} 
                className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors relative"
             >
                 <BrainCircuit size={20}/>
                 <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
             </button>
        </div>
    </div>
  );
};
