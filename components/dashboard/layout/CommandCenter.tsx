import React, { useState } from 'react';
import { GameState, InteractiveEvent, IntelType, PlayerDecisions, WorkMode, WelfareLevel } from '../../../types';
import Button from '../../Button';
import CustomSelect from '../../CustomSelect';
import { DirectiveSelector } from '../../DirectiveSelector';
import { BrainCircuit, X, TrendingUp, Eye, Settings2, Megaphone, Zap, Coffee, FileText, Landmark, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface CommandCenterProps {
  state: GameState;
  isCommandOpen: boolean;
  setIsCommandOpen: (open: boolean) => void;
  onBuyIntel: (type: IntelType, cost: number) => void;
  rdFocus: string;
  setRdFocus: (val: string) => void;
  marketingFocus: string;
  setMarketingFocus: (val: string) => void;
  workMode: WorkMode;
  setWorkMode: (val: WorkMode) => void;
  welfareLevel: WelfareLevel;
  setWelfareLevel: (val: WelfareLevel) => void;
  strategyNote: string;
  setStrategyNote: (val: string) => void;
  onPitch: (round: string) => Promise<{success: boolean, message: string}>;
  onTurnSubmit: (decisions: PlayerDecisions) => void;
  isProcessing: boolean;
  activeEvent: InteractiveEvent | null;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ 
  state, isCommandOpen, setIsCommandOpen, onBuyIntel, 
  rdFocus, setRdFocus, marketingFocus, setMarketingFocus, 
  workMode, setWorkMode, welfareLevel, setWelfareLevel, 
  strategyNote, setStrategyNote, onPitch, onTurnSubmit, isProcessing, activeEvent 
}) => {
  const { t } = useLanguage();
  const [fundingRound, setFundingRound] = useState('seed');
  const [pitchResult, setPitchResult] = useState<{success: boolean, message: string} | null>(null);

  const handlePitchClick = async () => { 
      if(isProcessing) return; 
      const res = await onPitch(fundingRound); 
      setPitchResult(res); 
      setTimeout(() => setPitchResult(null), 8000); 
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full z-40 md:relative md:inset-auto md:z-10 md:translate-x-0 md:w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 flex flex-col shadow-2xl md:shadow-none
        ${isCommandOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
         <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 backdrop-blur-md h-16">
             <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
                 <BrainCircuit className="text-blue-600"/> {t('dashboard.command.title')}
             </div>
             <button onClick={() => setIsCommandOpen(false)} className="md:hidden p-2 rounded-full hover:bg-slate-200"><X size={24}/></button>
         </div>

         <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar bg-white">
             
             {/* Intel Section */}
             <div className="space-y-3">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('dashboard.command.intel')}</h4>
                 <div className="grid grid-cols-1 gap-3">
                     <button onClick={() => onBuyIntel(IntelType.MARKET, 500)} disabled={state.cash < 500} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left disabled:opacity-50">
                         <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={18}/></div>
                         <div className="flex-1"><div className="text-sm font-bold text-slate-800">{t('dashboard.intel.market')}</div><div className="text-xs text-slate-500 font-mono">$500</div></div>
                     </button>
                     <button onClick={() => onBuyIntel(IntelType.COMPETITOR, 1200)} disabled={state.cash < 1200} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-left disabled:opacity-50">
                         <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Eye size={18}/></div>
                         <div className="flex-1"><div className="text-sm font-bold text-slate-800">{t('dashboard.intel.competitor')}</div><div className="text-xs text-slate-500 font-mono">$1200</div></div>
                     </button>
                 </div>
             </div>

             {/* Strategy Section */}
              <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('dashboard.command.strategy')}</h4>
                    <div className="h-1 w-12 bg-blue-100 rounded-full"></div>
                  </div>
                  
                  <DirectiveSelector 
                    label={t('dashboard.command.rdFocus')}
                    icon={<Settings2 size={12}/>}
                    value={rdFocus}
                    onChange={setRdFocus}
                    options={[
                        t('dashboard.command.rdOptions.core'),
                        t('dashboard.command.rdOptions.stability'),
                        t('dashboard.command.rdOptions.research'),
                        t('dashboard.command.rdOptions.none')
                    ]}
                  />

                   <DirectiveSelector 
                    label={t('dashboard.command.mktFocus')}
                    icon={<Megaphone size={12}/>}
                    value={marketingFocus}
                    onChange={setMarketingFocus}
                    options={[
                        t('dashboard.command.mktOptions.ads'),
                        t('dashboard.command.mktOptions.content'),
                        t('dashboard.command.mktOptions.influencer'),
                        t('dashboard.command.mktOptions.none')
                    ]}
                  />

                  <div className="grid grid-cols-2 gap-4">
                      <DirectiveSelector 
                        label={t('dashboard.command.workMode')}
                        icon={<Zap size={12}/>}
                        value={t(`dashboard.command.workModes.${workMode.toLowerCase()}`)}
                        onChange={(val) => {
                            if (val === t('dashboard.command.workModes.standard')) setWorkMode(WorkMode.STANDARD);
                            if (val === t('dashboard.command.workModes.crunch')) setWorkMode(WorkMode.CRUNCH);
                            if (val === t('dashboard.command.workModes.leisure')) setWorkMode(WorkMode.LEISURE);
                        }}
                        options={[
                            t('dashboard.command.workModes.standard'),
                            t('dashboard.command.workModes.crunch'),
                            t('dashboard.command.workModes.leisure')
                        ]}
                      />
                      <DirectiveSelector 
                        label={t('dashboard.command.welfare')}
                        icon={<Coffee size={12}/>}
                        value={t(`dashboard.command.welfareLevels.${welfareLevel.toLowerCase()}`)}
                        onChange={(val) => {
                            if (val === t('dashboard.command.welfareLevels.minimal')) setWelfareLevel(WelfareLevel.MINIMAL);
                            if (val === t('dashboard.command.welfareLevels.standard')) setWelfareLevel(WelfareLevel.STANDARD);
                            if (val === t('dashboard.command.welfareLevels.premium')) setWelfareLevel(WelfareLevel.PREMIUM);
                        }}
                        options={[
                            t('dashboard.command.welfareLevels.minimal'),
                            t('dashboard.command.welfareLevels.standard'),
                            t('dashboard.command.welfareLevels.premium')
                        ]}
                      />
                  </div>

                  <div className="space-y-3 group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
                         <span className="p-1 bg-slate-100 rounded text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <FileText size={12}/>
                         </span>
                         {t('dashboard.command.ceoNote')}
                      </label>
                      <textarea 
                        value={strategyNote} 
                        onChange={e => setStrategyNote(e.target.value)} 
                        className="w-full h-24 text-xs p-3 bg-white border border-slate-200 rounded-xl resize-none outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all font-medium shadow-sm" 
                        placeholder={t('dashboard.command.ceoNotePlaceholder')}
                      />
                  </div>
              </div>

              {/* Funding */}
             <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 space-y-3">
                 <div className="flex items-center gap-2 text-amber-900 font-bold text-sm"><Landmark size={16}/> {t('dashboard.funding.title')}</div>
                 <CustomSelect 
                     value={fundingRound} 
                     onChange={setFundingRound}
                     options={[
                        { id: 'seed', name: t('dashboard.funding.seed') },
                        { id: 'seriesA', name: t('dashboard.funding.seriesA') },
                        { id: 'seriesB', name: t('dashboard.funding.seriesB') }
                     ]}
                     className="w-full"
                 />
                 <Button onClick={handlePitchClick} className="w-full text-xs bg-amber-600 hover:bg-amber-700 text-white border-none shadow-amber-200">{t('dashboard.funding.pitch')}</Button>
                 {pitchResult && <div className={`text-xs p-2 rounded ${pitchResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{pitchResult.message}</div>}
             </div>
         </div>

         <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <Button onClick={() => onTurnSubmit({ rdFocus, marketingFocus, strategyNote, eventChoice: null, workMode, welfareLevel })} disabled={isProcessing} isLoading={isProcessing} className="w-full py-4 text-sm shadow-blue-300/50 shadow-lg hover:scale-[1.02]">
                 {activeEvent ? t('dashboard.actions.resolveEvent') : t('dashboard.actions.endTurn')} <ArrowRight size={18}/>
             </Button>
         </div>
    </div>
  );
};
