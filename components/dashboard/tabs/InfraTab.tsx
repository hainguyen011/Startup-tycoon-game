import React from 'react';
import { GameState } from '../../../types';
import Button from '../../Button';
import { Building2, Server, Monitor, Coffee, Smile, Box } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface InfraTabProps {
  state: GameState;
  onUpgradeFacility: (id: string) => void;
}

export const InfraTab: React.FC<InfraTabProps> = ({ state, onUpgradeFacility }) => {
  const { t } = useLanguage();

  const getIcon = (id: string) => {
      switch(id) {
          case 'office': return <Building2 size={28}/>;
          case 'server': return <Server size={28}/>;
          case 'pc': return <Monitor size={28}/>;
          case 'coffee': return <Coffee size={28}/>;
          case 'chair': return <Smile size={28}/>;
          default: return <Box size={28} />;
      }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {state.facilities.map(fac => (
            <div key={fac.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-indigo-300 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {getIcon(fac.id)}
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-slate-900">{t(`dashboard.infra.${fac.id}.name`) || fac.name}</h3>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">{t('dashboard.infra.level')} {fac.level} <span className="text-slate-300 mx-1">/</span> {fac.maxLevel}</div>
                    </div>
                </div>
                <p className="text-sm text-slate-600 mb-6 flex-1 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {t(`dashboard.infra.${fac.id}.benefit`, { value: fac.value.toLocaleString() }) || fac.benefit}
                </p>
                <Button 
                    onClick={() => onUpgradeFacility(fac.id)} 
                    disabled={fac.level >= fac.maxLevel || state.cash < fac.costToUpgrade} 
                    className="w-full py-3 shadow-md border-2 border-indigo-600 !text-sm"
                    variant={fac.level >= fac.maxLevel ? 'secondary' : 'primary'}
                >
                    {fac.level >= fac.maxLevel ? t('dashboard.infra.maxed') : `${t('dashboard.infra.upgrade')} ($${fac.costToUpgrade.toLocaleString()})`}
                </Button>
            </div>
        ))}
    </div>
  );
};
