import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameStage, Industry, PlayerDecisions, INITIAL_CASH, SimulationResult, IntelType, IntelItem, INITIAL_FACILITIES, INITIAL_SKILLS, Employee, Candidate, Product, ProductStage, LLMProvider, MARKETING_COSTS, Contract, Investor, WorkMode, WelfareLevel, InteractiveEvent } from '../types';
import StatCard from './StatCard';
import Button from './Button';
import { DollarSign, Users, TrendingUp, Zap, Activity, PieChart, Send, AlertTriangle, ShieldAlert, Lock, Search, Eye, FileText, BrainCircuit, Landmark, Briefcase, Server, User, UserPlus, XCircle, ChevronUp, Sparkles, Smile, Frown, CheckCircle, Tag, Trophy, Target, ClipboardList, Bell, AlertOctagon, HelpCircle, GraduationCap, History, FileSearch, Quote, Coffee, MessageSquare, Heart, BatteryWarning, MessageCircle, Loader2, Package, Plus, Bug, Gem, Megaphone, TrendingDown, Wallet, CreditCard, BarChart3, Menu, X, FileLock, Radio, Signal, ArrowRight, Laptop, HandCoins, ScrollText, Handshake, LayoutDashboard, Building2, Briefcase as BriefcaseIcon, Settings2, Rocket } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { useLanguage } from '../LanguageContext';
import { DirectiveSelector } from './DirectiveSelector';

interface GameDashboardProps {
  state: GameState;
  currentIntel: IntelItem[];
  onTurnSubmit: (decisions: PlayerDecisions) => void;
  onBuyIntel: (type: IntelType, cost: number) => void;
  onDismissIntel: (id: string) => void; 
  onRecruit: (jobDesc: string, budget: number) => void; 
  onHireCandidate: (candidate: Candidate) => void;
  onFire: (id: string) => void;
  onUpgradeFacility: (facilityId: string) => void;
  isProcessing: boolean;
  onRestart: () => void;
  onEventDecision: (decision: string) => void;
  onChatWithEmployee?: (empId: string, message: string) => Promise<string>;
  onAssignEmployee: (empId: string, targetId: string | null) => void;
  onAssignToModule: (empId: string, productId: string, moduleId: string | null) => void;
  onCreateProduct: (name: string, desc: string) => void;
  onPitch: (round: string) => Promise<{success: boolean, message: string}>;
  onFindContracts: () => void;
  onAcceptContract: (id: string) => void;
  onFindInvestor: () => void;
  onNegotiate: (investorId: string, message: string) => void;
  onAskAdvice: () => void;
}

export const GameDashboard: React.FC<GameDashboardProps> = ({ 
    state, currentIntel, onTurnSubmit, onBuyIntel, onDismissIntel, onRecruit, onHireCandidate, onFire, onUpgradeFacility, isProcessing, onRestart, onEventDecision, onChatWithEmployee,    onAssignEmployee,
    onAssignToModule,
    onCreateProduct,
 onPitch, onFindContracts, onAcceptContract, onFindInvestor, onNegotiate, onAskAdvice
}) => {
  const { t, language } = useLanguage();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'contracts' | 'investment' | 'team' | 'infra' | 'report' | 'founder'>('overview');
  
  // Mobile UI State
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Sub-states
  const [hrSubTab, setHrSubTab] = useState<'manage' | 'recruit'>('manage');
  const [rdFocus, setRdFocus] = useState('Nâng cấp tính năng cốt lõi');
  const [marketingFocus, setMarketingFocus] = useState('Không làm gì / Tạm dừng');
  const [fundingRound, setFundingRound] = useState('Seed Round ($200k)');
  const [strategyNote, setStrategyNote] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>(WorkMode.STANDARD);
  const [welfareLevel, setWelfareLevel] = useState<WelfareLevel>(WelfareLevel.STANDARD);
  
  // Modals & Popups State
  const [activeEvent, setActiveEvent] = useState<InteractiveEvent | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [recruitBudget, setRecruitBudget] = useState(1500);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [chatEmployeeId, setChatEmployeeId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'bot', text: string}[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [activeNegotiationId, setActiveNegotiationId] = useState<string | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [pitchResult, setPitchResult] = useState<{success: boolean, message: string} | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const secretary = state.employees.find(e => e.role === 'Secretary');
  const hasSecretary = !!secretary;

  // --- Derived Metrics ---
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
  
  // --- Effects ---
  useEffect(() => {
    if (state.history.length > 0) {
        const lastResult = state.history[state.history.length - 1];
        if (lastResult.randomEvent) setActiveEvent(lastResult.randomEvent);
    }
  }, [state.history]);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatHistory, chatEmployeeId]);

  // --- Actions ---
  const handleEventChoice = (choiceLabel: string) => { onEventDecision(choiceLabel); setActiveEvent(null); };
  const openChat = (emp: Employee) => { setChatEmployeeId(emp.id); setChatHistory([{sender: 'bot', text: `Chào sếp, tôi là ${emp.name}.`}]); };
  const sendChat = async () => {
      if (!chatMessage.trim() || !chatEmployeeId || !onChatWithEmployee) return;
      const msg = chatMessage;
      setChatMessage('');
      setChatHistory(prev => [...prev, {sender: 'user', text: msg}]);
      setIsChatting(true);
      const response = await onChatWithEmployee(chatEmployeeId, msg);
      setChatHistory(prev => [...prev, {sender: 'bot', text: response}]);
      setIsChatting(false);
  };
  const handleNegotiationSubmit = () => { if (activeNegotiationId && negotiationMessage) { onNegotiate(activeNegotiationId, negotiationMessage); setNegotiationMessage(''); } };
  const handleCreateProductSubmit = () => { if(newProdName && newProdDesc) { onCreateProduct(newProdName, newProdDesc); setIsCreatingProduct(false); setNewProdName(''); setNewProdDesc(''); } };
  const handlePitchClick = async () => { if(isProcessing) return; const res = await onPitch(fundingRound); setPitchResult(res); setTimeout(() => setPitchResult(null), 8000); };
  const handleHireFromModal = () => { if (selectedCandidate) { onHireCandidate(selectedCandidate); setSelectedCandidate(null); } };

  // --- Render Helpers ---
  const activeChatEmployee = state.employees.find(e => e.id === chatEmployeeId);
  const activeNegotiation = state.investors.find(i => i.id === activeNegotiationId);
  
  // Game Over Screen
  if (state.stage === GameStage.GAME_OVER || state.stage === GameStage.VICTORY) {
     return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 bg-grid-pattern p-4">
          <div className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 max-w-lg w-full text-center animate-fadeIn">
            <div className="mb-6 inline-flex p-6 bg-slate-50 rounded-full shadow-inner">
                {state.stage === GameStage.VICTORY ? <Trophy size={60} className="text-yellow-500" /> : <AlertTriangle size={60} className="text-rose-500" />}
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 font-heading">{t('gameover.victory')}</h2>
            <p className="text-slate-600 mb-8 text-lg">{state.stage === GameStage.VICTORY ? `Congrats! ${state.companyName} is now a Unicorn!` : `${state.gameOverReason || t('gameover.reason')}`}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><div className="text-xs text-slate-500 uppercase font-bold">Final Users</div><div className="text-2xl font-bold text-slate-900">{state.users.toLocaleString()}</div></div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200"><div className="text-xs text-slate-500 uppercase font-bold">Equity Kept</div><div className="text-2xl font-bold text-yellow-600">{state.equity}%</div></div>
            </div>
            <Button onClick={onRestart} className="w-full py-4 text-lg shadow-xl" variant={state.stage === GameStage.VICTORY ? 'success' : 'primary'}>{t('gameover.restart')}</Button>
          </div>
        </div>
      );
  }

  // --- Layout Components ---

  const SidebarItem = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
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

  const MobileNavItem = ({ id, label, icon }: { id: typeof activeTab, label: string, icon: React.ReactNode }) => (
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
    <div className="fixed inset-0 bg-[#f1f5f9] flex flex-col md:flex-row overflow-hidden text-slate-900 font-sans">
        
        {/* === TOP HUD (Global Stats) === */}
        <div className="fixed top-0 left-0 right-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shadow-sm">
            <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold font-heading shadow-lg shadow-blue-200/50">
                    {state.companyName.charAt(0)}
                </div>
                <div className="hidden md:block">
                    <h1 className="font-bold text-slate-900 leading-tight">{state.companyName}</h1>
                    <div className="text-xs text-slate-500 font-medium">{state.industry}</div>
                </div>
                <div className="md:hidden flex flex-col">
                    <span className="text-sm font-bold">{t('dashboard.week')} {state.turn}</span>
                    <span className="text-xs text-slate-500">${state.cash.toLocaleString()}</span>
                </div>
            </div>

            {/* Desktop Stats Bar */}
            <div className="hidden md:flex items-center gap-6">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="text-xs text-slate-500 font-bold uppercase">{t('dashboard.week')}</span>
                     <span className="font-mono font-bold text-slate-800 text-lg">{state.turn.toString().padStart(2, '0')}</span>
                 </div>
                 <div className="h-8 w-px bg-slate-200"></div>
                 <div className="flex gap-6">
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('dashboard.stats.funds')}</span>
                         <span className={`font-heading font-bold text-lg ${state.cash < 2000 ? 'text-rose-600' : 'text-slate-900'}`}>${state.cash.toLocaleString()}</span>
                     </div>
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t('dashboard.stats.users')}</span>
                         <span className="font-heading font-bold text-lg text-blue-600">{state.users.toLocaleString()}</span>
                     </div>
                     <div className="flex flex-col items-end">
                         <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Reputation</span>
                         <span className="font-heading font-bold text-lg text-purple-600">{state.reputation}</span>
                     </div>
                 </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
                 <button 
                    onClick={() => setIsCommandOpen(true)} 
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors relative"
                 >
                     <BrainCircuit size={20}/>
                     <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                 </button>
            </div>
        </div>

        {/* === SIDEBAR (Desktop) === */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 pt-20 pb-4 px-3 gap-1 shrink-0 z-10 overflow-y-auto custom-scrollbar">
            <div className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider mb-1">Operations</div>
            <SidebarItem id="overview" label={t('dashboard.tabs.overview')} icon={<LayoutDashboard/>} />
            <SidebarItem id="products" label={t('dashboard.tabs.products')} icon={<Package/>} />
            <SidebarItem id="contracts" label={t('dashboard.tabs.contracts')} icon={<ScrollText/>} />
            <SidebarItem id="investment" label={t('dashboard.tabs.investment')} icon={<Handshake/>} />
            
            <div className="h-px bg-slate-100 my-3 mx-4"></div>
            <div className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider mb-1">Administration</div>
            <SidebarItem id="team" label={t('dashboard.tabs.team')} icon={<Users/>} />
            <SidebarItem id="founder" label={t('dashboard.tabs.founder')} icon={<User/>} />
            <SidebarItem id="infra" label={t('dashboard.tabs.infra')} icon={<Server/>} />
            <SidebarItem id="report" label={t('dashboard.tabs.report')} icon={<ClipboardList/>} />
            
            {hasSecretary && (
                <>
                <div className="h-px bg-slate-100 my-3 mx-4"></div>
                <button onClick={() => openChat(secretary)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition-colors group mt-auto">
                    <div className="relative p-1 bg-pink-100 rounded-lg text-pink-600 group-hover:bg-pink-200 transition-colors">
                        <MessageSquare size={18}/>
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white"></span>
                    </div>
                    <span className="font-bold text-sm">Secretary</span>
                </button>
                </>
            )}
        </div>

        {/* === MAIN CONTENT === */}
        <div className="flex-1 flex flex-col h-full pt-16 pb-20 md:pb-0 relative overflow-hidden bg-[#f8fafc]">
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
                 <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-24">
                     
                     {/* OVERVIEW TAB */}
                     {activeTab === 'overview' && (
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
                                 <h3 className="text-slate-500 text-xs font-bold uppercase mb-4 flex items-center gap-2 tracking-wider"><TrendingUp size={16} className="text-emerald-500"/> User Growth</h3>
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
                                     <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Company Health</h3>
                                     <div className="space-y-6">
                                         <div>
                                             <div className="flex justify-between text-sm mb-2 font-medium">
                                                 <span className="text-slate-500">Avg Stress</span>
                                                 <span className={`font-bold ${avgStress > 70 ? 'text-rose-500' : 'text-emerald-600'}`}>{avgStress}%</span>
                                             </div>
                                             <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                                 <div className={`h-full ${avgStress > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${avgStress}%`}}></div>
                                             </div>
                                         </div>
                                         <div>
                                             <div className="flex justify-between text-sm mb-2 font-medium">
                                                 <span className="text-slate-500">Avg Skill</span>
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
                                          <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Current Stage</div>
                                      </div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* PRODUCTS TAB */}
                     {activeTab === 'products' && (
                         <div className="animate-fadeIn space-y-6">
                             <div className="flex justify-between items-center">
                                 <h2 className="text-2xl font-bold font-heading text-slate-800">Product Portfolio</h2>
                                 <Button onClick={() => setIsCreatingProduct(!isCreatingProduct)} variant="primary">
                                     {isCreatingProduct ? 'Cancel' : 'New Product'}
                                 </Button>
                             </div>

                             {isCreatingProduct && (
                                 <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-lg ring-4 ring-indigo-50 animate-slideUp">
                                     <h3 className="font-bold text-lg mb-4 text-indigo-700 flex items-center gap-2"><Rocket size={20}/> Launch New Product</h3>
                                     <div className="space-y-4">
                                         <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Product Name" value={newProdName} onChange={e => setNewProdName(e.target.value)} />
                                         <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="One-line Description" value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} />
                                         <Button onClick={handleCreateProductSubmit} className="w-full py-3" variant="primary">Start Development</Button>
                                     </div>
                                 </div>
                             )}

                             <div className="grid grid-cols-1 gap-5">
                                 {state.products.map(p => (
                                     <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                                         <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                                         <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 pl-4">
                                             <div>
                                                 <h3 className="text-2xl font-bold text-slate-900 leading-tight">{p.name}</h3>
                                                 <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wide border border-blue-100">{p.stage}</span>
                                             </div>
                                             <div className="text-right">
                                                 <div className="text-3xl font-bold text-emerald-600 font-heading tracking-tight">${p.revenue.toLocaleString()}</div>
                                                 <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Monthly Revenue</div>
                                             </div>
                                         </div>
                                         
                                         <div className="pl-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                             <div className="col-span-1 md:col-span-1">
                                                 <div className="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>Dev Progress</span><span>{p.developmentProgress}%</span></div>
                                                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-700" style={{width: `${p.developmentProgress}%`}}></div></div>
                                             </div>
                                             <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                 <div className="text-xs font-bold text-slate-500 uppercase">Users</div>
                                                 <div className="font-bold text-slate-800 text-lg">{p.users.toLocaleString()}</div>
                                             </div>
                                             <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                                                 <div className="text-xs font-bold text-slate-500 uppercase">Quality</div>
                                                 <div className={`font-bold text-lg ${p.quality > 80 ? 'text-emerald-600' : 'text-slate-800'}`}>{p.quality}/100</div>
                                             </div>
                                             <div className="flex justify-between items-center bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">
                                                 <div className="text-xs font-bold text-rose-500 uppercase flex items-center gap-1"><ShieldAlert size={14}/> {t('dashboard.products.techDebt')}</div>
                                                 <div className={`font-bold text-lg ${p.techDebt > 60 ? 'text-rose-600' : 'text-slate-800'}`}>{p.techDebt}%</div>
                                             </div>
                                         </div>

                                         <div className="mt-8 pt-6 border-t border-slate-100">
                                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                 <Package size={16} className="text-blue-500"/> {t('dashboard.products.modulesTitle')}
                                             </h4>
                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                 {p.modules.map(mod => {
                                                     const assignedEmp = state.employees.find(e => e.id === mod.assignedEmployeeId);
                                                     return (
                                                         <div key={mod.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative overflow-hidden">
                                                             <div className="flex justify-between items-start mb-2">
                                                                 <div className="font-bold text-sm text-slate-800">{mod.name}</div>
                                                                 <div className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase">{mod.requiredSkill}</div>
                                                             </div>
                                                             <div className="mb-3">
                                                                 <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1"><span>Progress</span><span>{mod.progress}%</span></div>
                                                                 <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${mod.progress}%`}}></div></div>
                                                             </div>
                                                             
                                                             <select 
                                                                 className="w-full text-[10px] bg-white border border-slate-200 rounded-lg p-1.5 font-bold text-slate-700 outline-none"
                                                                 onChange={(e) => onAssignToModule(e.target.value, p.id, mod.id)}
                                                                 value={mod.assignedEmployeeId || ""}
                                                             >
                                                                 <option value="">Unassigned</option>
                                                                 {state.employees.filter(e => e.assignedProductId === p.id).map(e => (
                                                                     <option key={e.id} value={e.id}>{e.name} ({e.skill})</option>
                                                                 ))}
                                                             </select>
                                                         </div>
                                                     );
                                                 })}
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}

                     {/* CONTRACTS TAB */}
                     {activeTab === 'contracts' && (
                         <div className="animate-fadeIn space-y-6">
                             <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                 <div>
                                     <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Corporate Reputation</div>
                                     <div className="text-4xl font-bold text-blue-900 font-heading">{state.reputation}/100</div>
                                 </div>
                                 <Button onClick={onFindContracts} disabled={isProcessing} className="shadow-lg shadow-blue-200">
                                     <Search size={18}/> Find New Contracts
                                 </Button>
                             </div>

                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 <div className="space-y-4">
                                     <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-xs tracking-widest"><Activity size={16} className="text-orange-500"/> Active Contracts</h3>
                                     {state.contracts.filter(c => c.status === 'active').map(c => (
                                         <div key={c.id} className="bg-white p-5 rounded-2xl border-l-4 border-l-orange-500 border border-slate-200 shadow-sm">
                                             <div className="flex justify-between mb-3">
                                                 <div className="font-bold text-lg text-slate-900">{c.name}</div>
                                                 <div className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-md self-start">{c.deadlineWeeks} wks left</div>
                                             </div>
                                             <div className="mb-4">
                                                 <div className="flex justify-between text-xs mb-1 font-bold text-slate-500"><span>Completion</span><span>{Math.round((c.currentEffort / c.totalEffortRequired) * 100)}%</span></div>
                                                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="bg-orange-500 h-full transition-all duration-500" style={{width: `${(c.currentEffort / c.totalEffortRequired) * 100}%`}}></div></div>
                                             </div>
                                             <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-4">
                                                  <div className="text-xs font-bold text-slate-400 uppercase shrink-0">Team</div>
                                                  <select className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-700 outline-none" onChange={(e) => onAssignEmployee(e.target.value, c.id)} value="">
                                                      <option value="">+ Assign Staff</option>
                                                      {state.employees.filter(e => !e.assignedContractId && !e.assignedProductId).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                                  </select>
                                             </div>
                                             <div className="flex flex-wrap gap-2 mt-3">
                                                 {state.employees.filter(e => e.assignedContractId === c.id).map(e => (
                                                     <span key={e.id} className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                         {e.name} <button onClick={() => onAssignEmployee(e.id, null)} className="hover:text-red-500"><X size={12}/></button>
                                                     </span>
                                                 ))}
                                             </div>
                                         </div>
                                     ))}
                                     {state.contracts.filter(c => c.status === 'active').length === 0 && <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm italic">No active contracts</div>}
                                 </div>

                                 <div className="space-y-4">
                                     <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-xs tracking-widest"><BriefcaseIcon size={16} className="text-blue-500"/> Available Opportunities</h3>
                                     {state.contracts.filter(c => c.status === 'available').map(c => (
                                         <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors group shadow-sm">
                                             <div className="flex justify-between items-start mb-2">
                                                 <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">{c.name}</div>
                                                 <div className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md text-sm border border-emerald-100 shadow-sm">+${c.reward}</div>
                                             </div>
                                             <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{c.description}</p>
                                             <div className="flex gap-2 mb-4">
                                                 {c.reqSkills.map(s => <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wide">{s}</span>)}
                                             </div>
                                             <Button onClick={() => onAcceptContract(c.id)} className="w-full py-2.5 text-xs" variant="secondary">Accept Contract</Button>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* INVESTMENT TAB */}
                     {activeTab === 'investment' && (
                         <div className="animate-fadeIn space-y-6">
                              <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                                      <div>
                                          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Valuation</div>
                                          <div className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">${(totalRevenue * 12 * 5 || 10000).toLocaleString()}</div>
                                      </div>
                                      <div className="flex gap-3">
                                          <Button onClick={onAskAdvice} className="bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md">Board Advice</Button>
                                          <Button onClick={onFindInvestor} className="bg-white text-black hover:bg-slate-100 border-none shadow-lg">Find Investors</Button>
                                      </div>
                                  </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {state.investors.map(inv => (
                                      <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                          <div className="p-6 flex-1">
                                              <div className="flex items-center gap-4 mb-4">
                                                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm">{inv.name.charAt(0)}</div>
                                                  <div>
                                                      <div className="font-bold text-slate-900 text-lg leading-tight">{inv.name}</div>
                                                      <div className="text-xs text-slate-500 font-bold uppercase">{inv.style} Investor</div>
                                                  </div>
                                              </div>
                                              <p className="text-sm text-slate-600 italic mb-6 leading-relaxed relative pl-4 border-l-2 border-slate-200">"{inv.description}"</p>
                                              
                                              {inv.status !== 'partner' && inv.status !== 'rejected' && (
                                                  <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                                                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Offer</span><span className="font-bold text-emerald-600">${inv.offerAmount.toLocaleString()}</span></div>
                                                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Equity</span><span className="font-bold text-slate-900">{inv.equityDemanded}%</span></div>
                                                  </div>
                                              )}
                                              {inv.status === 'partner' && <div className="text-center py-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm border border-emerald-100">PARTNER</div>}
                                              {inv.status === 'rejected' && <div className="text-center py-4 bg-rose-50 text-rose-700 font-bold rounded-xl text-sm border border-rose-100">REJECTED</div>}
                                          </div>
                                          
                                          {inv.status !== 'partner' && inv.status !== 'rejected' && (
                                              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                                  <Button onClick={() => setActiveNegotiationId(inv.id)} className="w-full">Negotiate Deal</Button>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                         </div>
                     )}

                     {/* TEAM (HR) TAB */}
                     {activeTab === 'team' && (
                         <div className="space-y-6 animate-fadeIn">
                             <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
                                 <button onClick={() => setHrSubTab('manage')} className={`px-5 py-2 font-bold text-sm rounded-lg transition-all ${hrSubTab === 'manage' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Manage Team</button>
                                 <button onClick={() => setHrSubTab('recruit')} className={`px-5 py-2 font-bold text-sm rounded-lg transition-all ${hrSubTab === 'recruit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Recruit</button>
                             </div>

                             {hrSubTab === 'manage' ? (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {state.employees.map(emp => (
                                         <div key={emp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors">
                                             <div className="flex justify-between items-start mb-4">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-100">{emp.name.charAt(0)}</div>
                                                     <div>
                                                         <div className="font-bold text-slate-900 text-lg">{emp.name}</div>
                                                         <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">{emp.role}</div>
                                                     </div>
                                                 </div>
                                                 <div className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">{emp.level}</div>
                                             </div>
                                             
                                             <div className="grid grid-cols-3 gap-2 text-center mb-5">
                                                 <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Skill</div><div className="font-bold text-slate-800 text-lg leading-none">{emp.skill}</div></div>
                                                 <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Morale</div><div className={`font-bold text-lg leading-none ${emp.morale < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>{emp.morale}</div></div>
                                                 <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Wage</div><div className="font-bold text-slate-800 text-lg leading-none">${emp.salary}</div></div>
                                             </div>

                                             <div className="flex gap-3">
                                                 <button onClick={() => openChat(emp)} className="flex-1 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">Chat</button>
                                                 <button onClick={() => onFire(emp.id)} className="flex-1 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors">Fire</button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                     <div className="mb-8 space-y-4 max-w-lg mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                         <h3 className="text-center font-bold text-slate-800 text-lg">Headhunting Params</h3>
                                         <div>
                                             <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Role Description</label>
                                             <input className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior React Dev" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                                         </div>
                                         <div>
                                             <div className="flex justify-between mb-1"><label className="text-xs font-bold text-slate-500 uppercase">Max Budget</label><span className="font-bold text-blue-600">${recruitBudget}</span></div>
                                             <input type="range" min="500" max="5000" step="100" value={recruitBudget} onChange={e => setRecruitBudget(Number(e.target.value))} className="w-full accent-blue-600"/>
                                         </div>
                                         <Button onClick={() => onRecruit(jobDescription, recruitBudget)} disabled={isProcessing} className="w-full py-3 shadow-md">Find Candidates</Button>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                         {state.candidates.map(c => (
                                             <div key={c.id} className="border-2 border-slate-100 bg-white p-5 rounded-2xl hover:border-blue-400 cursor-pointer transition-all group" onClick={() => setSelectedCandidate(c)}>
                                                 <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{c.name}</div>
                                                 <div className="text-xs text-slate-500 font-medium mb-3">{c.level} {c.role}</div>
                                                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                                                     <span className="text-xs font-bold text-slate-400">Ask</span>
                                                     <span className="text-sm font-bold text-emerald-600">${c.salary}/mo</span>
                                                 </div>
                                                 <Button className="w-full mt-3 text-xs py-2" variant="secondary">View Profile</Button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                         </div>
                     )}

                     {/* FOUNDER TAB */}
                     {activeTab === 'founder' && (
                         <div className="animate-fadeIn space-y-8">
                              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                  <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
                                      <div className="w-40 h-40 rounded-full bg-white shadow-xl border-4 border-white overflow-hidden flex items-center justify-center mb-6 relative group">
                                          <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <Sparkles className="text-blue-600" size={32}/>
                                          </div>
                                          {state.ceo.gender === 'Female' ? (
                                              <div className="w-full h-full bg-pink-100 flex items-center justify-center text-pink-500">
                                                  <User size={80}/>
                                              </div>
                                          ) : (
                                              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500">
                                                  <User size={80}/>
                                              </div>
                                          )}
                                      </div>
                                      <h2 className="text-2xl font-bold text-slate-900 mb-1">{state.ceo.name}</h2>
                                      <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">Chief Executive Officer</div>
                                      
                                      <div className="flex gap-2 mt-2">
                                          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"><TrendingUp size={18}/></div>
                                          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"><Zap size={18}/></div>
                                          <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-purple-500 transition-colors cursor-pointer"><Heart size={18}/></div>
                                      </div>
                                  </div>

                                  <div className="flex-1 p-8 md:p-10 space-y-8">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                           <div className="space-y-1">
                                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</div>
                                               <div className="text-2xl font-bold text-slate-900">{state.playerSkills.management} <span className="text-sm font-medium text-slate-400">/ 100</span></div>
                                               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{width: `${state.playerSkills.management}%`}}></div></div>
                                           </div>
                                           <div className="space-y-1">
                                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical</div>
                                               <div className="text-2xl font-bold text-slate-900">{state.playerSkills.tech} <span className="text-sm font-medium text-slate-400">/ 100</span></div>
                                               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full" style={{width: `${state.playerSkills.tech}%`}}></div></div>
                                           </div>
                                           <div className="space-y-1">
                                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Charisma</div>
                                               <div className="text-2xl font-bold text-slate-900">{state.playerSkills.charisma} <span className="text-sm font-medium text-slate-400">/ 100</span></div>
                                               <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="bg-purple-600 h-full" style={{width: `${state.playerSkills.charisma}%`}}></div></div>
                                           </div>
                                      </div>

                                      <div className="space-y-4">
                                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Heart size={14} className="text-rose-500"/> Personal Interests</h3>
                                          <div className="flex flex-wrap gap-2">
                                              {state.ceo.interests.map(interest => (
                                                  <span key={interest} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-2xl border border-slate-200">
                                                      #{interest}
                                                  </span>
                                              ))}
                                              {state.ceo.interests.length === 0 && <span className="text-slate-400 italic text-sm">No interests listed</span>}
                                          </div>
                                      </div>

                                      <div className="space-y-4 pt-4 border-t border-slate-100">
                                           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Founder Narrative</h4>
                                           <p className="text-slate-600 leading-relaxed text-sm italic">
                                               {language === 'vi' 
                                                 ? `Là người sáng lập ${state.companyName}, ${state.ceo.name} mang theo tầm nhìn thay đổi ngành ${state.industry}. Với đam mê dành cho ${state.ceo.interests.slice(0, 2).join(' và ')}, mục tiêu là xây dựng một đế chế kỳ lân bền vững.`
                                                 : `As the founder of ${state.companyName}, ${state.ceo.name} brings a vision to disrupt the ${state.industry} industry. With a passion for ${state.ceo.interests.slice(0, 2).join(' and ')}, the goal is to build a sustainable unicorn empire.`
                                               }
                                           </p>
                                      </div>
                                  </div>
                              </div>
                         </div>
                     )}

                     {/* INFRA TAB */}
                     {activeTab === 'infra' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                             {state.facilities.map(fac => (
                                 <div key={fac.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                                     <div className="flex items-center gap-4 mb-4">
                                         <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                                             {fac.id === 'office' ? <Building2 size={28}/> : <Server size={28}/>}
                                         </div>
                                         <div>
                                             <h3 className="font-bold text-xl text-slate-900">{fac.name}</h3>
                                             <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Level {fac.level} <span className="text-slate-300 mx-1">/</span> {fac.maxLevel}</div>
                                         </div>
                                     </div>
                                     <p className="text-sm text-slate-600 mb-6 flex-1">{fac.benefit}</p>
                                     <Button 
                                         onClick={() => onUpgradeFacility(fac.id)} 
                                         disabled={fac.level >= fac.maxLevel || state.cash < fac.costToUpgrade} 
                                         className="w-full py-3"
                                         variant={fac.level >= fac.maxLevel ? 'secondary' : 'primary'}
                                     >
                                         {fac.level >= fac.maxLevel ? "Maxed Out" : `Upgrade ($${fac.costToUpgrade.toLocaleString()})`}
                                     </Button>
                                 </div>
                             ))}
                         </div>
                     )}
                     
                     {/* REPORT TAB */}
                     {activeTab === 'report' && (
                         <div className="space-y-4 animate-fadeIn">
                             {state.history.slice().reverse().map((h, i) => (
                                 <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                     <div className="flex justify-between items-start mb-2">
                                         <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">Week {state.turn - i - 1}</span>
                                         <span className={`font-mono text-sm font-bold ${h.cashChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                             {h.cashChange > 0 ? '+' : ''}{h.cashChange.toLocaleString()}$
                                         </span>
                                     </div>
                                     <p className="text-slate-800 text-sm leading-relaxed">{h.narrative}</p>
                                 </div>
                             ))}
                         </div>
                     )}

                 </div>
            </div>
        </div>

        {/* === RIGHT SIDEBAR (Command Center - Desktop) / DRAWER (Mobile) === */}
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
                                // Map back to enum
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
                             CEO Note
                          </label>
                          <textarea 
                            value={strategyNote} 
                            onChange={e => setStrategyNote(e.target.value)} 
                            className="w-full h-24 text-xs p-3 bg-white border border-slate-200 rounded-xl resize-none outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all font-medium shadow-sm" 
                            placeholder="E.g. Focus on quality over speed..."
                          />
                      </div>
                  </div>

                  {/* Funding */}
                 <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 space-y-3">
                     <div className="flex items-center gap-2 text-amber-900 font-bold text-sm"><Landmark size={16}/> External Funding</div>
                     <select value={fundingRound} onChange={e => setFundingRound(e.target.value)} className="w-full text-xs p-2.5 bg-white/80 border border-amber-200 rounded-lg font-medium outline-none text-amber-900">
                         <option>Seed Round ($200k)</option>
                         <option>Series A ($1M)</option>
                         <option>Series B ($5M)</option>
                     </select>
                     <Button onClick={handlePitchClick} className="w-full text-xs bg-amber-600 hover:bg-amber-700 text-white border-none shadow-amber-200">Pitch Investors</Button>
                     {pitchResult && <div className={`text-xs p-2 rounded ${pitchResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{pitchResult.message}</div>}
                 </div>
             </div>

             <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                 <Button onClick={() => onTurnSubmit({ rdFocus, marketingFocus, strategyNote, eventChoice: null, workMode, welfareLevel })} disabled={isProcessing} isLoading={isProcessing} className="w-full py-4 text-sm shadow-blue-300/50 shadow-lg hover:scale-[1.02]">
                     {activeEvent ? 'Resolve Event' : 'End Week'} <ArrowRight size={18}/>
                 </Button>
             </div>
        </div>

        {/* === BOTTOM NAV (Mobile Only) === */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 pb-safe-bottom pt-2 flex justify-between z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
             <MobileNavItem id="overview" label="Home" icon={<LayoutDashboard/>}/>
             <MobileNavItem id="products" label="Prod" icon={<Package/>}/>
             <MobileNavItem id="contracts" label="Jobs" icon={<ScrollText/>}/>
             <MobileNavItem id="team" label="Team" icon={<Users/>}/>
             <MobileNavItem id="investment" label="Invest" icon={<Handshake/>}/>
        </div>

        {/* === MODALS (Chat, Candidate, Negotiation, Intel) === */}
        {/* Chat Modal */}
        {activeChatEmployee && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-[500px] animate-fadeIn">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <div className="font-bold text-slate-800 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div>{activeChatEmployee.name}</div>
                        <button onClick={() => setChatEmployeeId(null)}><XCircle size={24} className="text-slate-400 hover:text-slate-600"/></button>
                    </div>
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                        {chatHistory.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[80%] shadow-sm ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>{m.text}</div>
                            </div>
                        ))}
                        {isChatting && <div className="text-xs text-slate-400 italic ml-4">Typing...</div>}
                    </div>
                    <div className="p-3 border-t border-slate-200 flex gap-2 bg-white">
                        <input className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Type a message..." />
                        <button onClick={sendChat} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-blue-200 shadow-md"><Send size={20}/></button>
                    </div>
                </div>
            </div>
        )}

        {/* Candidate Modal */}
        {selectedCandidate && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
                 <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-slideUp my-auto border border-slate-100">
                     <div className="p-6 md:p-8">
                         <div className="flex justify-between items-start mb-6">
                             <div className="flex gap-4 items-center">
                                 <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold border border-indigo-100">{selectedCandidate.name.charAt(0)}</div>
                                 <div>
                                     <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedCandidate.name}</h2>
                                     <div className="text-slate-500 font-medium">{selectedCandidate.level} {selectedCandidate.role}</div>
                                 </div>
                             </div>
                             <button onClick={() => setSelectedCandidate(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100"><X size={20} className="text-slate-500"/></button>
                         </div>
                         <div className="space-y-6">
                             <div className="prose prose-slate text-sm"><p className="italic border-l-4 border-indigo-300 pl-4 py-2 bg-indigo-50/50 rounded-r-lg text-slate-700">"{selectedCandidate.bio}"</p></div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Skill</div>
                                     <div className="text-2xl font-bold text-slate-900">{selectedCandidate.skill}</div>
                                 </div>
                                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Salary</div>
                                     <div className="text-2xl font-bold text-slate-900">${selectedCandidate.salary}</div>
                                 </div>
                             </div>
                             <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 text-sm text-amber-900 font-medium">
                                 <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold uppercase text-xs tracking-wider"><FileSearch size={14}/> Interview Notes</div>
                                 {selectedCandidate.interviewNotes}
                             </div>
                             <div className="flex gap-4 pt-4 border-t border-slate-100">
                                 <Button variant="secondary" onClick={() => setSelectedCandidate(null)} className="flex-1 py-3">Pass</Button>
                                 <Button variant="success" onClick={handleHireFromModal} disabled={state.cash < selectedCandidate.hireCost} className="flex-1 py-3 shadow-emerald-200 shadow-lg">Hire Now (${selectedCandidate.hireCost})</Button>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        )}

        {/* Negotiation Modal */}
        {activeNegotiation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                 <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden flex flex-col h-[600px] animate-fadeIn">
                     <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center font-bold text-slate-900 border-4 border-white/20 text-xl">{activeNegotiation.name.charAt(0)}</div>
                             <div>
                                 <div className="font-bold text-lg">{activeNegotiation.name}</div>
                                 <div className="text-xs opacity-70 font-mono uppercase tracking-wide">{activeNegotiation.style} Investor</div>
                             </div>
                         </div>
                         <button onClick={() => setActiveNegotiationId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
                     </div>
                     <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center shrink-0">
                         <div><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current Offer</div><div className="text-2xl font-bold text-emerald-600 font-heading">${activeNegotiation.offerAmount.toLocaleString()}</div></div>
                         <div className="text-right"><div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Equity</div><div className="text-2xl font-bold text-slate-900 font-heading">{activeNegotiation.equityDemanded}%</div></div>
                         <div className="text-right bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm"><div className="text-[10px] font-bold text-slate-400 uppercase">Patience</div><div className="text-lg font-bold text-rose-600 leading-none">{activeNegotiation.patience}</div></div>
                     </div>
                     <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4">
                         <div className="flex justify-start"><div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] text-sm font-medium text-slate-700 leading-relaxed">"{activeNegotiation.lastResponse}"</div></div>
                     </div>
                     <div className="p-5 bg-white border-t border-slate-200 shrink-0">
                         {activeNegotiation.status === 'negotiating' || activeNegotiation.status === 'new' ? (
                             <div className="flex gap-3">
                                 <input className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="E.g. I want $2M for 10%..." value={negotiationMessage} onChange={(e) => setNegotiationMessage(e.target.value)} />
                                 <Button onClick={handleNegotiationSubmit} disabled={isProcessing || !negotiationMessage} className="px-5 shadow-lg shadow-blue-200"><Send size={18}/></Button>
                             </div>
                         ) : (
                             <div className="text-center font-bold p-4 rounded-xl ${activeNegotiation.status === 'partner' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">{activeNegotiation.status === 'partner' ? "DEAL CLOSED" : "NEGOTIATION FAILED"}</div>
                         )}
                     </div>
                 </div>
            </div>
        )}

        {/* Event Modal */}
        {activeEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp ring-8 ring-black/5">
                    <div className={`p-8 text-white relative overflow-hidden ${activeEvent.type === 'crisis' ? 'bg-rose-600' : activeEvent.type === 'opportunity' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex items-center gap-2 mb-3 font-bold uppercase tracking-widest text-xs opacity-90 relative z-10">
                            {activeEvent.type === 'crisis' ? <AlertOctagon size={16}/> : <Sparkles size={16}/>} Priority Alert
                        </div>
                        <h2 className="text-3xl font-bold font-heading leading-tight relative z-10">{activeEvent.title}</h2>
                    </div>
                    <div className="p-8">
                        <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">{activeEvent.description}</p>
                        <div className="space-y-3">
                            {activeEvent.options?.map((opt, idx) => (
                                <button key={idx} onClick={() => handleEventChoice(opt.label)} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-center relative z-10">
                                        <span className="font-bold text-slate-800 group-hover:text-blue-700">{opt.label}</span>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-200 text-slate-600 uppercase tracking-wide group-hover:bg-white">{opt.risk}</span>
                                    </div>
                                </button>
                            ))}
                            <button onClick={() => handleEventChoice("Ignore")} className="w-full text-center p-3 text-slate-400 hover:text-slate-600 text-sm font-bold transition-colors mt-4">Ignore & Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Intel Modal */}
        {currentIntel.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
              <div className="w-full max-w-lg bg-[#fcfbf7] rounded shadow-2xl overflow-hidden border-8 border-slate-200 relative transform rotate-1">
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")'}}></div>
                   <div className="absolute top-6 right-6 border-4 border-red-600/20 text-red-600/20 font-black text-5xl p-2 rounded-lg transform rotate-12 pointer-events-none uppercase">Confidential</div>
                   <div className="p-8 relative z-10">
                       <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
                           <div>
                               <div className="flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-2 py-1 mb-2 w-fit uppercase tracking-widest">Top Secret</div>
                               <h2 className="text-3xl font-bold text-slate-900 font-heading uppercase tracking-tighter leading-none">Intel Report</h2>
                               <p className="text-xs font-mono text-slate-500 uppercase mt-2">Source: {currentIntel[0].source || "Unknown"} // Reliability: {currentIntel[0].reliability}%</p>
                           </div>
                       </div>
                       <div className="prose prose-slate max-w-none font-serif text-lg leading-relaxed text-slate-800 mb-8 pl-4 border-l-4 border-slate-300">
                           <p>{currentIntel[0].content}</p>
                       </div>
                       <div className="pt-6 border-t border-slate-300 flex justify-between items-center">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase"><FileLock size={14}/> Eyes Only</div>
                           <Button onClick={() => onDismissIntel(currentIntel[0].id)} className="bg-slate-900 text-white hover:bg-slate-800 rounded-none px-8 font-mono uppercase tracking-widest text-xs">Burn After Reading</Button>
                       </div>
                   </div>
              </div>
          </div>
        )}

    </div>
  );
};
