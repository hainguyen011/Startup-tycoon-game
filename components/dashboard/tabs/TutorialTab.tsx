import React from 'react';
import { GameState } from '../../../types';
import { useLanguage } from '../../../LanguageContext';
import { 
  BookOpen, 
  RefreshCw, 
  Rocket, 
  ShieldCheck, 
  BrainCircuit, 
  Lightbulb, 
  Zap,
  LucideIcon
} from 'lucide-react';

interface TutorialTabProps {
  state: GameState;
}

export const TutorialTab: React.FC<TutorialTabProps> = ({ state }) => {
  const { t } = useLanguage();

  const TutorialSection = ({ 
    icon: Icon, 
    title, 
    description, 
    colorClass 
  }: { 
    icon: LucideIcon, 
    title: string, 
    description: string, 
    colorClass: string 
  }) => (
    <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-90 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
          <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('dashboard.tabs.tutorial')}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto italic">
          Master the art of startup management with AI-driven insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TutorialSection 
          icon={Rocket}
          title={t('dashboard.tutorial.welcome.title')}
          description={t('dashboard.tutorial.welcome.desc')}
          colorClass="bg-blue-500"
        />
        <TutorialSection 
          icon={RefreshCw}
          title={t('dashboard.tutorial.loop.title')}
          description={t('dashboard.tutorial.loop.desc')}
          colorClass="bg-purple-500"
        />
        <TutorialSection 
          icon={Zap}
          title={t('dashboard.tutorial.ops.title')}
          description={t('dashboard.tutorial.ops.desc')}
          colorClass="bg-orange-500"
        />
        <TutorialSection 
          icon={ShieldCheck}
          title={t('dashboard.tutorial.admin.title')}
          description={t('dashboard.tutorial.admin.desc')}
          colorClass="bg-emerald-500"
        />
      </div>

      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white shadow-xl group">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-500"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-blue-500/20 rounded-2xl border border-white/10 shrink-0">
            <BrainCircuit size={48} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Lightbulb size={24} className="text-yellow-400" />
              {t('dashboard.tutorial.ai.title')}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {t('dashboard.tutorial.ai.desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <p className="text-blue-700 font-medium">
          💡 Tip: Small team, high morale makes for the most stable growth.
        </p>
      </div>
    </div>
  );
};
