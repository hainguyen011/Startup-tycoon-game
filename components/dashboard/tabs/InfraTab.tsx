import React from 'react';
import { GameState } from '../../../types';
import Button from '../../Button';
import { Building2, Server } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface InfraTabProps {
  state: GameState;
  onUpgradeFacility: (id: string) => void;
}

export const InfraTab: React.FC<InfraTabProps> = ({ state, onUpgradeFacility }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        {state.facilities.map(fac => (
            <div key={fac.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        {fac.id === 'office' ? <Building2 size={28}/> : <Server size={28}/>}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-900">{fac.name}</h3>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">{t('dashboard.infra.level')} {fac.level} <span className="text-slate-300 mx-1">/</span> {fac.maxLevel}</div>
                    </div>
                </div>
                <p className="text-sm text-slate-600 mb-6 flex-1">{fac.benefit}</p>
                <Button 
                    onClick={() => onUpgradeFacility(fac.id)} 
                    disabled={fac.level >= fac.maxLevel || state.cash < fac.costToUpgrade} 
                    className="w-full py-3"
                    variant={fac.level >= fac.maxLevel ? 'secondary' : 'primary'}
                >
                    {fac.level >= fac.maxLevel ? t('dashboard.infra.maxed') : `${t('dashboard.infra.upgrade')} ($${fac.costToUpgrade.toLocaleString()})`}
                </Button>
            </div>
        ))}
    </div>
  );
};
