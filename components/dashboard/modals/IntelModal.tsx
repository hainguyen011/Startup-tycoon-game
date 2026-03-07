import React from 'react';
import { IntelItem } from '../../../types';
import Button from '../../Button';
import { FileLock } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface IntelModalProps {
  currentIntel: IntelItem[];
  onDismissIntel: (id: string) => void;
}

export const IntelModal: React.FC<IntelModalProps> = ({ currentIntel, onDismissIntel }) => {
  const { t } = useLanguage();

  if (currentIntel.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-lg bg-[#fcfbf7] rounded shadow-2xl overflow-hidden border-8 border-slate-200 relative transform rotate-1">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")'}}></div>
             <div className="absolute top-6 right-6 border-4 border-red-600/20 text-red-600/20 font-black text-5xl p-2 rounded-lg transform rotate-12 pointer-events-none uppercase">{t('dashboard.intel.confidential')}</div>
             <div className="p-8 relative z-10">
                 <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
                     <div>
                         <div className="flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-2 py-1 mb-2 w-fit uppercase tracking-widest">{t('dashboard.intel.briefing')}</div>
                         <h2 className="text-3xl font-bold text-slate-900 font-heading uppercase tracking-tighter leading-none">{t('dashboard.intel.title')}</h2>
                         <p className="text-xs font-mono text-slate-500 uppercase mt-2">{t('dashboard.intel.source')}: {currentIntel[0].source || "Unknown"} // {t('dashboard.intel.reliability')}: {currentIntel[0].reliability}%</p>
                     </div>
                 </div>
                 <div className="prose prose-slate max-w-none font-serif text-lg leading-relaxed text-slate-800 mb-8 pl-4 border-l-4 border-slate-300">
                     <p>{currentIntel[0].content}</p>
                 </div>
                 <div className="pt-6 border-t border-slate-300 flex justify-between items-center">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase"><FileLock size={14}/> {t('dashboard.intel.eyesOnly')}</div>
                     <Button onClick={() => onDismissIntel(currentIntel[0].id)} className="bg-slate-900 text-white hover:bg-slate-800 rounded-none px-8 font-mono uppercase tracking-widest text-xs">{t('dashboard.intel.burnAfterReading')}</Button>
                 </div>
             </div>
        </div>
    </div>
  );
};
