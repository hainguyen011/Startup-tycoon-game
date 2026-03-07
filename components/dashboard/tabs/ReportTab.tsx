import React from 'react';
import { GameState } from '../../../types';
import { useLanguage } from '../../../LanguageContext';

interface ReportTabProps {
  state: GameState;
}

export const ReportTab: React.FC<ReportTabProps> = ({ state }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 animate-fadeIn">
        {state.history.slice().reverse().map((h, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{t('dashboard.week')} {state.turn - i - 1}</span>
                    <span className={`font-mono text-sm font-bold ${h.cashChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {h.cashChange > 0 ? '+' : ''}{h.cashChange.toLocaleString()}$
                    </span>
                </div>
                <p className="text-slate-800 text-sm leading-relaxed">{h.narrative}</p>
            </div>
        ))}
    </div>
  );
};
