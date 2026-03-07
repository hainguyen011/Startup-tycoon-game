import React from 'react';
import { GameState } from '../../../types';
import { LayoutDashboard, Package, ScrollText, Handshake, BrainCircuit, Users, User, Server, ClipboardList, MessageSquare, Building } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface SidebarDesktopProps {
  state: GameState;
  activeTab: string;
  setActiveTab: (id: any) => void;
  onOpenChat: (empId: string) => void;
}

export const SidebarDesktop: React.FC<SidebarDesktopProps> = ({ state, activeTab, setActiveTab, onOpenChat }) => {
  const { t, language, setLanguage } = useLanguage();
  const secretary = state.employees.find(e => e.role === 'Secretary');
  const hasSecretary = !!secretary;

  const SidebarItem = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
      <button 
          onClick={() => setActiveTab(id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative font-medium
          ${activeTab === id ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
      >
          {React.cloneElement(icon as React.ReactElement<any>, { size: 20, className: activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-blue-500' })}
          <span className="text-sm tracking-wide">{label}</span>
          {id === 'contracts' && state.contracts.filter(c => c.status === 'active').length > 0 && (
             <span className="absolute right-3 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white"></span>
          )}
      </button>
  );

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 pt-20 pb-4 px-3 gap-1 shrink-0 z-10 overflow-y-auto custom-scrollbar">
        <div className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider mb-1">{t('dashboard.ops')}</div>
        <SidebarItem id="overview" label={t('dashboard.tabs.overview')} icon={<LayoutDashboard/>} />
        <SidebarItem id="office3d" label="3D Office" icon={<Building/>} />
        <SidebarItem id="products" label={t('dashboard.tabs.products')} icon={<Package/>} />
        <SidebarItem id="contracts" label={t('dashboard.tabs.contracts')} icon={<ScrollText/>} />
        <SidebarItem id="investment" label={t('dashboard.tabs.investment')} icon={<Handshake/>} />
        <SidebarItem id="council" label={t('dashboard.tabs.council')} icon={<BrainCircuit/>} />
        
        <div className="h-px bg-slate-100 my-3 mx-4"></div>
        <div className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider mb-1">{t('dashboard.admin')}</div>
        <SidebarItem id="team" label={t('dashboard.tabs.team')} icon={<Users/>} />
        <SidebarItem id="founder" label={t('dashboard.tabs.founder')} icon={<User/>} />
        <SidebarItem id="infra" label={t('dashboard.tabs.infra')} icon={<Server/>} />
        <SidebarItem id="report" label={t('dashboard.tabs.report')} icon={<ClipboardList/>} />
        
        {hasSecretary && (
            <>
            <div className="h-px bg-slate-100 my-3 mx-4"></div>
            <button onClick={() => onOpenChat(secretary!.id)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition-colors group">
                <div className="relative p-1 bg-pink-100 rounded-lg text-pink-600 group-hover:bg-pink-200 transition-colors">
                    <MessageSquare size={18}/>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
                </div>
                <span className="font-bold text-sm">{t('dashboard.tabs.secretary')}</span>
            </button>
            </>
        )}

        {/* Language Switcher in Sidebar */}
        <div className="mt-auto pt-6 px-4">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                <button 
                    onClick={() => setLanguage('vi')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${language === 'vi' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Tiếng Việt
                </button>
                <button 
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${language === 'en' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    English
                </button>
            </div>
        </div>
    </div>
  );
};
