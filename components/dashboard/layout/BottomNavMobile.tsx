import React from 'react';
import { LayoutDashboard, Package, ScrollText, Users, Handshake, Building } from 'lucide-react';
import { useLanguage } from '../../../LanguageContext';

interface BottomNavMobileProps {
  activeTab: string;
  setActiveTab: (id: any) => void;
}

export const BottomNavMobile: React.FC<BottomNavMobileProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const MobileNavItem = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
      <button 
          onClick={() => setActiveTab(id)}
          className={`flex-1 flex flex-col items-center justify-center py-2 transition-all duration-200
          ${activeTab === id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
          {React.cloneElement(icon as React.ReactElement<any>, { size: 22, className: activeTab === id ? 'text-blue-600' : 'text-slate-400' })}
          <span className="text-[10px] font-bold mt-1">{label}</span>
      </button>
  );

  return (
     <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 pb-safe-bottom pt-2 flex justify-between z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
         <MobileNavItem id="overview" label={t('dashboard.tabs.overview')} icon={<LayoutDashboard/>}/>
         <MobileNavItem id="office3d" label="3D" icon={<Building/>}/>
         <MobileNavItem id="products" label={t('dashboard.tabs.products')} icon={<Package/>}/>
         <MobileNavItem id="contracts" label={t('dashboard.tabs.contracts')} icon={<ScrollText/>}/>
         <MobileNavItem id="team" label={t('dashboard.tabs.team')} icon={<Users/>}/>
         <MobileNavItem id="investment" label={t('dashboard.tabs.investment')} icon={<Handshake/>}/>
    </div>
  );
};
