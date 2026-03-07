import React from 'react';
import { GameState, GameStage, MARKETING_COSTS } from '../../../types';
import StatCard from '../../StatCard';
import { Wallet, CreditCard, Zap, PieChart, TrendingUp, Activity, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { useLanguage } from '../../../LanguageContext';

interface OverviewTabProps {
  state: GameState;
  marketingFocus: string;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ state, marketingFocus }) => {
  const { t } = useLanguage();

  const totalRevenue = state.products.reduce((acc, p) => acc + p.revenue, 0);
  const totalSalaries = state.employees.reduce((acc, e) => acc + e.salary, 0);
  const facilityCosts = state.facilities.reduce((acc, f) => acc + f.maintenanceCost, 0);
  const marketingCost = MARKETING_COSTS[marketingFocus] || 0;
  const totalWeeklyExpenses = Math.round((totalSalaries + facilityCosts) / 4) + marketingCost;
  const netIncome = totalRevenue - totalWeeklyExpenses;
  const burnRate = netIncome < 0 ? Math.abs(netIncome) : 0;
  const runway = burnRate > 0 ? Math.floor(state.cash / burnRate) : 999;
  
  const avgStress = state.employees.length > 0 ? Math.round(state.employees.reduce((acc, e) => acc + e.stress, 0) / state.employees.length) : 0;
  const avgSkill = state.employees.length > 0 ? Math.round(state.employees.reduce((acc, e) => acc + e.skill, 0) / state.employees.length) : 0;
  const latestResult = state.history.length > 0 ? state.history[state.history.length - 1] : undefined;

  const chartData = state.history.reduce((acc, h, i) => {
      const prevUsers = acc.length > 0 ? acc[acc.length - 1].users : 0;
      acc.push({ name: `W${i + 1}`, users: Math.max(0, prevUsers + h.userChange) });
      return acc;
  }, [] as { name: string, users: number }[]);

  return (
    <div className="grid grid-cols-1 gap-6 animate-fadeIn">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            <StatCard label={t('dashboard.stats.netProfit')} value={Math.abs(netIncome).toLocaleString()} icon={<Wallet/>} suffix="$" change={0} colorClass={netIncome >= 0 ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"}/>
            <StatCard label={t('dashboard.stats.runway')} value={runway === 999 ? "∞" : runway} icon={<CreditCard/>} suffix=" mo" colorClass="text-purple-600 bg-purple-50"/>
            <StatCard label={t('dashboard.stats.morale')} value={state.morale} icon={<Zap/>} suffix="%" change={latestResult?.moraleChange} colorClass="text-amber-500 bg-amber-50"/>
            <StatCard label={t('dashboard.stats.marketShare')} value={state.marketShare.toFixed(1)} icon={<PieChart/>} suffix="%" colorClass="text-blue-600 bg-blue-50"/>
        </div>

        {/* Growth Chart */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
            <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-wider"><TrendingUp size={16} className="text-emerald-500"/> {t('dashboard.stats.growth')}</h3>
            <div className="flex-1 w-full min-h-0 -ml-2">
               <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData}>
                       <defs>
                           <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                           </linearGradient>
                       </defs>
                       <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontFamily: 'Inter' }}
                           itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                       />
                       <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fill="url(#colorUsers)" />
                   </AreaChart>
               </ResponsiveContainer>
            </div>
        </div>

        {/* Company Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> {t('dashboard.stats.health')}</h3>
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-slate-500">{t('dashboard.stats.avgStress')}</span>
                            <span className={`font-bold ${avgStress > 70 ? 'text-rose-500' : 'text-emerald-600'}`}>{avgStress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${avgStress > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${avgStress}%`}}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-slate-500">{t('dashboard.stats.avgSkill')}</span>
                            <span className="font-bold text-blue-600">{avgSkill}/100</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{width: `${avgSkill}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-50"></div>
                 <div className="relative z-10">
                     <div className="w-20 h-20 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center mb-4 mx-auto">
                         <Target size={36} className="text-indigo-500"/>
                     </div>
                     <div className="text-3xl font-bold font-heading text-slate-900 mb-1">{state.stage}</div>
                     <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">{t('dashboard.stats.stage')}</div>
                 </div>
            </div>
        </div>
    </div>
  );
};
