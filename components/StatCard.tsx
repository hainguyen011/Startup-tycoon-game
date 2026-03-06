import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number; 
  colorClass?: string;
  suffix?: string;
  compact?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, change, colorClass = "text-slate-800", suffix = "", compact = false }) => {
  if (compact) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 p-2 rounded-xl shadow-sm flex flex-col justify-center items-center min-w-[80px] flex-1">
        <div className={`p-1 rounded-full bg-slate-50 mb-1 ${colorClass}`}>
           {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14 }) : icon}
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide leading-none mb-0.5">{label}</div>
        <div className="text-xs font-bold text-slate-900 font-heading leading-tight truncate w-full text-center">{value}{suffix}</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors ${colorClass}`}>
            {React.isValidElement(icon) ? 
              React.cloneElement(icon as React.ReactElement<any>, { size: 20 }) 
              : icon
            }
        </div>
        {change !== undefined && change !== 0 && (
          <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {change > 0 ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
            {Math.abs(change)}
          </div>
        )}
      </div>
      
      <div>
        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</div>
        <div className="text-2xl font-bold text-slate-800 font-heading tracking-tight leading-none">
          {value}<span className="text-lg text-slate-400 font-normal ml-0.5">{suffix}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;