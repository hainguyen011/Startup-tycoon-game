import React, { useState } from 'react';
import { GameState } from '../../../types';
import Button from '../../Button';
import { Landmark, Send, X } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface InvestmentTabProps {
  state: GameState;
  onAskAdvice: () => void;
  onFindInvestor: () => void;
  onNegotiate: (investorId: string, message: string) => void;
  isProcessing: boolean;
}

export const InvestmentTab: React.FC<InvestmentTabProps> = ({ state, onAskAdvice, onFindInvestor, onNegotiate, isProcessing }) => {
  const { t } = useLanguage();
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');

  const totalRevenue = state.products.reduce((acc, p) => acc + p.revenue, 0);
  const activeNegotiation = state.investors.find(i => i.id === activeNegotiationId);

  const handleNegotiationSubmit = () => {
    if (activeNegotiationId && negotiationMessage) {
      onNegotiate(activeNegotiationId, negotiationMessage);
      setNegotiationMessage('');
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{t('dashboard.investment.valuation')}</div>
                    <div className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">${(totalRevenue * 12 * 5 || 10000).toLocaleString()}</div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={onAskAdvice} className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md">{t('dashboard.investment.boardAdvice')}</Button>
                    <Button onClick={onFindInvestor} disabled={isProcessing} className="bg-white text-black hover:bg-slate-100 border-none shadow-lg">{t('dashboard.investment.findInvestors')}</Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.investors.map(inv => (
                <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-6 flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm">{inv.name.charAt(0)}</div>
                            <div>
                                <div className="font-bold text-slate-900 text-lg leading-tight">{inv.name}</div>
                                <div className="text-xs text-slate-500 font-bold uppercase">{inv.style} {t('dashboard.investment.investor')}</div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 italic mb-6 leading-relaxed relative pl-4 border-l-2 border-slate-200">"{inv.description}"</p>
                        
                        {inv.status !== 'partner' && inv.status !== 'rejected' && (
                            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">{t('dashboard.investment.offer')}</span><span className="font-bold text-emerald-600">${inv.offerAmount.toLocaleString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">{t('dashboard.investment.equity')}</span><span className="font-bold text-slate-900">{inv.equityDemanded}%</span></div>
                            </div>
                        )}
                        {inv.status === 'partner' && <div className="text-center py-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm border border-emerald-100">{t('dashboard.investment.partner')}</div>}
                        {inv.status === 'rejected' && <div className="text-center py-4 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm border border-rose-100">{t('dashboard.investment.rejected')}</div>}
                    </div>
                    
                    {inv.status !== 'partner' && inv.status !== 'rejected' && (
                        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button onClick={() => setActiveNegotiationId(inv.id)} className="w-full">{t('dashboard.investment.negotiate')}</Button>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Negotiation Modal */}
        {activeNegotiation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                 <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col h-[600px] animate-fadeIn">
                     <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center font-bold text-slate-900 border-4 border-white/20 text-xl">{activeNegotiation.name.charAt(0)}</div>
                             <div>
                                 <div className="font-bold text-lg">{activeNegotiation.name}</div>
                                 <div className="text-xs opacity-70 font-mono uppercase tracking-wide">{activeNegotiation.style} {t('dashboard.investment.investor')}</div>
                             </div>
                         </div>
                         <button onClick={() => setActiveNegotiationId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
                     </div>
                     <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center shrink-0">
                         <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('dashboard.investment.offer')}</div><div className="text-2xl font-bold text-emerald-600 font-heading">${activeNegotiation.offerAmount.toLocaleString()}</div></div>
                         <div className="text-right"><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('dashboard.investment.equity')}</div><div className="text-2xl font-bold text-slate-900 font-heading">{activeNegotiation.equityDemanded}%</div></div>
                         <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm"><div className="text-[10px] font-bold text-slate-400 uppercase">{t('dashboard.investment.patience')}</div><div className="text-lg font-bold text-rose-600 leading-none">{activeNegotiation.patience}</div></div>
                     </div>
                     <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                         <div className="flex justify-start"><div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] text-sm font-medium text-slate-700 leading-relaxed">"{activeNegotiation.lastResponse}"</div></div>
                     </div>
                     <div className="p-5 bg-white border-t border-slate-200 shrink-0">
                         {activeNegotiation.status === 'negotiating' || activeNegotiation.status === 'new' ? (
                             <div className="flex gap-3">
                                 <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder={t('dashboard.investment.negotiationPlaceholder')} value={negotiationMessage} onChange={(e) => setNegotiationMessage(e.target.value)} />
                                 <Button onClick={handleNegotiationSubmit} disabled={isProcessing || !negotiationMessage} className="px-5 shadow-lg shadow-blue-200"><Send size={18}/></Button>
                             </div>
                         ) : (
                             <div className={`text-center font-bold p-4 rounded-xl ${activeNegotiation.status === 'partner' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{activeNegotiation.status === 'partner' ? t('dashboard.investment.dealClosed') : t('dashboard.investment.dealFailed')}</div>
                         )}
                     </div>
                 </div>
            </div>
        )}
    </div>
  );
};
