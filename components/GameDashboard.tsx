import React, { useState } from 'react';
import { GameState, GameStage, PlayerDecisions, WorkMode, WelfareLevel, InteractiveEvent, IntelItem, IntelType } from '../types';

// Layout
import { TopHUD } from './dashboard/layout/TopHUD';
import { SidebarDesktop } from './dashboard/layout/SidebarDesktop';
import { BottomNavMobile } from './dashboard/layout/BottomNavMobile';
import { CommandCenter } from './dashboard/layout/CommandCenter';

// Tabs
import { OverviewTab } from './dashboard/tabs/OverviewTab';
import { OfficeScene } from './dashboard/office3d/OfficeScene';
import { ProductsTab } from './dashboard/tabs/ProductsTab';
import { ContractsTab } from './dashboard/tabs/ContractsTab';
import { InvestmentTab } from './dashboard/tabs/InvestmentTab';
import { TeamTab } from './dashboard/tabs/TeamTab';
import { FounderTab } from './dashboard/tabs/FounderTab';
import { CouncilTab } from './dashboard/tabs/CouncilTab';
import { InfraTab } from './dashboard/tabs/InfraTab';
import { ReportTab } from './dashboard/tabs/ReportTab';

// Modals
import { ChatModal } from './dashboard/modals/ChatModal';
import { EventModal } from './dashboard/modals/EventModal';
import { IntelModal } from './dashboard/modals/IntelModal';
import { GameOverScreen } from './dashboard/modals/GameOverScreen';

interface GameDashboardProps {
  state: GameState;
  onTurnSubmit: (decisions: PlayerDecisions) => void;
  isProcessing: boolean;
  onRestart: () => void;
  onCreateProduct: (name: string, desc: string) => void;
  onFire: (id: string) => void;
  onRecruit: (jobDesc: string, budget: number) => void;
  onHireCandidate: (candidate: any) => void;
  onAskAdvice: () => void;
  onAcceptContract: (id: string) => void;
  onAssignEmployee: (empId: string, targetId: string | null) => void;
  onAssignToModule: (empId: string, productId: string, moduleId: string | null) => void;
  onFindContracts: () => void;
  onFindInvestor: () => void;
  onNegotiate: (investorId: string, message: string) => void;
  onPitch: (round: string) => Promise<{success: boolean, message: string}>;
  onChatWithEmployee: (empId: string, message: string) => Promise<string>;
  onBuyIntel: (type: IntelType, cost: number) => void;
  onUpgradeFacility: (id: string) => void;
  activeEvent: InteractiveEvent | null;
  handleEventChoice: (choice: string) => void;
  currentIntel: IntelItem[];
  onDismissIntel: (id: string) => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({
  state, onTurnSubmit, isProcessing, onRestart, onCreateProduct,
  onFire, onRecruit, onHireCandidate, onAskAdvice, onAcceptContract, onAssignEmployee, onAssignToModule,
  onFindContracts, onFindInvestor, onNegotiate, onPitch, onChatWithEmployee,
  onBuyIntel, onUpgradeFacility, activeEvent, handleEventChoice,
  currentIntel, onDismissIntel
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  
  // CommandCenter states
  const [rdFocus, setRdFocus] = useState('Core Features');
  const [marketingFocus, setMarketingFocus] = useState('Social Media Ads');
  const [workMode, setWorkMode] = useState<WorkMode>(WorkMode.STANDARD);
  const [welfareLevel, setWelfareLevel] = useState<WelfareLevel>(WelfareLevel.STANDARD);
  const [strategyNote, setStrategyNote] = useState('');
  
  // Modals state
  const [activeChatEmployeeId, setActiveChatEmployeeId] = useState<string | null>(null);

  if (state.stage === GameStage.GAME_OVER || state.stage === GameStage.VICTORY) {
     return <GameOverScreen state={state} onRestart={onRestart} />;
  }

  const activeChatEmployee = state.employees.find(e => e.id === activeChatEmployeeId);

  return (
    <div className="fixed inset-0 bg-slate-50 flex overflow-hidden font-sans">
        <TopHUD state={state} onOpenCommand={() => setIsCommandOpen(true)} />

        <div className="flex-1 flex mt-16 md:mt-0 relative">
            <SidebarDesktop 
              state={state} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onOpenChat={setActiveChatEmployeeId} 
            />

            <div className={`flex-1 overflow-y-auto pb-24 md:pb-8 pt-6 md:pt-24 px-4 md:px-8 custom-scrollbar ${isCommandOpen ? 'hidden md:block' : 'block'}`}>
                {activeTab === 'overview' && <OverviewTab state={state} marketingFocus={marketingFocus} />}
                {activeTab === 'office3d' && <div className="h-[calc(100vh-140px)]"><OfficeScene state={state} onEmployeeClick={setActiveChatEmployeeId} /></div>}
                {activeTab === 'products' && <ProductsTab state={state} onCreateProduct={onCreateProduct} onAssignToModule={onAssignToModule} />}
                {activeTab === 'contracts' && <ContractsTab state={state} onFindContracts={onFindContracts} onAcceptContract={onAcceptContract} onAssignEmployee={onAssignEmployee} isProcessing={isProcessing} />}
                {activeTab === 'investment' && <InvestmentTab state={state} onAskAdvice={onAskAdvice} onFindInvestor={onFindInvestor} onNegotiate={onNegotiate} isProcessing={isProcessing} />}
                {activeTab === 'team' && <TeamTab state={state} onFire={onFire} onRecruit={onRecruit} onHireCandidate={onHireCandidate} onOpenChat={setActiveChatEmployeeId} isProcessing={isProcessing} />}
                {activeTab === 'founder' && <FounderTab state={state} />}
                {activeTab === 'council' && <CouncilTab state={state} onAskAdvice={onAskAdvice} />}
                {activeTab === 'infra' && <InfraTab state={state} onUpgradeFacility={onUpgradeFacility} />}
                {activeTab === 'report' && <ReportTab state={state} />}
            </div>

            <CommandCenter 
                state={state} 
                isCommandOpen={isCommandOpen} 
                setIsCommandOpen={setIsCommandOpen}
                onBuyIntel={onBuyIntel}
                rdFocus={rdFocus} setRdFocus={setRdFocus}
                marketingFocus={marketingFocus} setMarketingFocus={setMarketingFocus}
                workMode={workMode} setWorkMode={setWorkMode}
                welfareLevel={welfareLevel} setWelfareLevel={setWelfareLevel}
                strategyNote={strategyNote} setStrategyNote={setStrategyNote}
                onPitch={onPitch}
                onTurnSubmit={onTurnSubmit}
                isProcessing={isProcessing}
                activeEvent={activeEvent}
            />
        </div>

        <BottomNavMobile activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global Modals */}
        {activeEvent && <EventModal activeEvent={activeEvent} handleEventChoice={handleEventChoice} />}
        {currentIntel && currentIntel.length > 0 && <IntelModal currentIntel={currentIntel} onDismissIntel={onDismissIntel} />}
        {activeChatEmployee && (
            <ChatModal 
                employee={activeChatEmployee} 
                onClose={() => setActiveChatEmployeeId(null)} 
                onChatWithEmployee={onChatWithEmployee} 
            />
        )}
    </div>
  );
};
