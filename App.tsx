import React, { useState, useEffect } from 'react';
import SetupGame from './components/SetupGame';
import { GameDashboard } from './components/GameDashboard';
import { GameState, GameStage, Industry, PlayerDecisions, INITIAL_CASH, SimulationResult, IntelType, IntelItem, INITIAL_FACILITIES, INITIAL_SKILLS, Employee, Candidate, Product, ProductStage, LLMProvider, MARKETING_COSTS, Contract, Investor } from './types';
import { initializeGameStory, processTurn, getAdvisorInsight, generateCandidates, chatWithEmployee, evaluatePitch, setLLMConfig, hasValidApiKey, generateContracts, generateInvestor, negotiateDeal, askInvestorAdvice } from './services/gemini';
import { Loader2 } from 'lucide-react';
import { LanguageProvider, useLanguage } from './LanguageContext';

const GameContainer: React.FC = () => {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [currentIntel, setCurrentIntel] = useState<IntelItem[]>([]);
  const [lastEventChoice, setLastEventChoice] = useState<string | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    companyName: '',
    industry: Industry.TECH,
    cash: INITIAL_CASH,
    users: 0,
    morale: 80,
    productQuality: 50,
    marketShare: 0,
    equity: 100, 
    turn: 1,
    reputation: 10,
    history: [],
    stage: GameStage.SETUP,
    marketContext: '',
    competitorName: '',
    employees: [],
    candidates: [], 
    products: [],
    contracts: [],
    investors: [],
    facilities: JSON.parse(JSON.stringify(INITIAL_FACILITIES)), 
    playerSkills: { ...INITIAL_SKILLS }
  });

  const [systemError, setSystemError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  const handleStartGame = async (
      name: string, 
      industry: Industry, 
      productName: string, 
      productDesc: string, 
      userApiKey?: string,
      provider: LLMProvider = 'gemini'
    ) => {
    
    // Config API Key & Provider
    if (userApiKey && userApiKey.trim() !== '') {
        setLLMConfig(userApiKey, provider);
    } else {
        // Just set provider if key is empty (relying on env)
        setLLMConfig('', provider);
    }
    
    // Clear previous errors
    setSetupError(null);
    setSystemError(null);

    // Initial check (falls back to env if userApiKey is empty)
    if (!hasValidApiKey()) {
        const msg = language === 'vi' ? "Vui lòng nhập API Key để bắt đầu!" : "Please enter API Key to start!";
        setSetupError(msg);
        return;
    }

    setLoading(true);
    try {
      // Initialize story with explicit overrides to ensure they are used immediately
      const initData = await initializeGameStory(industry, name, productName, productDesc, language, userApiKey, provider);
      
      // Create initial product
      const initialProduct: Product = {
          id: `prod-${Date.now()}`,
          name: productName,
          description: productDesc,
          stage: ProductStage.CONCEPT,
          developmentProgress: 0,
          quality: 50,
          marketFit: 50, // Average start
          bugs: 0,
          users: 0,
          revenue: 0,
          activeFeedback: [initData.initialProductAnalysis]
      };

      setGameState(prev => ({
        ...prev,
        companyName: name,
        industry: industry,
        stage: GameStage.PLAYING,
        marketContext: initData.marketContext,
        competitorName: initData.competitorName,
        products: [initialProduct],
        history: [{
            narrative: `${initData.marketContext}. ${initData.initialFeedback}`,
            cashChange: 0,
            equityChange: 0,
            userChange: 0,
            moraleChange: 0,
            productUpdates: [],
            competitorUpdate: "",
            advice: initData.initialFeedback,
            randomEvent: null,
            skillXpEarned: {},
            decisions: undefined 
        }]
      }));
    } catch (e: any) {
      console.error(e);
      let errMsg = "System Error. Please check API Key or Network.";
      const msg = e.message || '';
      
      if (msg.includes('insufficient_quota')) {
          errMsg = language === 'vi' 
            ? "API Key đã hết hạn mức sử dụng (Quota). Vui lòng kiểm tra billing hoặc nạp thêm credit." 
            : "API Key quota exceeded (Insufficient Quota). Please check billing/credits.";
      } else if (msg.includes('401') || msg.includes('403') || msg.includes('API key')) {
          errMsg = language === 'vi' ? "API Key không hợp lệ." : "Invalid API Key.";
      } else if (msg.includes('429') || msg.includes('quota')) {
          errMsg = language === 'vi' ? "Yêu cầu quá nhanh hoặc hết hạn mức (429)." : "Too many requests or quota exceeded (429).";
      }
      
      // If error happens during setup, keep user on setup screen to fix it
      if (gameState.stage === GameStage.SETUP) {
          setSetupError(errMsg);
      } else {
          setSystemError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuyIntel = async (type: IntelType, cost: number) => {
    if (gameState.cash < cost) return;
    setLoading(true);
    try {
        // Fetch Insight FIRST
        const insightData = await getAdvisorInsight(gameState, type, language);
        
        // If successful, Deduct Cash and Show Data
        setGameState(prev => ({ ...prev, cash: prev.cash - cost }));
        
        const newIntel: IntelItem = {
            id: Date.now().toString(),
            type,
            title: type === IntelType.MARKET ? "Market Report" : type === IntelType.COMPETITOR ? "Spy Report" : "Internal Audit",
            content: insightData.content,
            source: insightData.source,
            reliability: insightData.reliability,
            cost
        };
        setCurrentIntel(prev => [...prev, newIntel]);
    } catch (e) { 
        console.error("Intel purchase failed:", e); 
        // Note: Cash is NOT deducted if API fails here
    } finally { 
        setLoading(false); 
    }
  };
  
  const handleDismissIntel = (id: string) => {
      setCurrentIntel(prev => prev.filter(i => i.id !== id));
  };

  const handleRecruit = async (jobDesc: string, budget: number) => {
      const recruitmentCost = 500;
      if (gameState.cash < recruitmentCost) {
          alert(language === 'vi' ? "Không đủ tiền ($500)!" : "Not enough funds ($500)!");
          return;
      }
      setLoading(true);
      try {
          const candidates = await generateCandidates(gameState.industry, gameState.turn, jobDesc, budget, language);
          setGameState(prev => ({
              ...prev,
              cash: prev.cash - recruitmentCost,
              candidates: candidates
          }));
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const handleHireCandidate = (candidate: Candidate) => {
      const office = gameState.facilities.find(f => f.id === 'office');
      if (office && gameState.employees.length >= office.value) {
          alert(language === 'vi' ? "Văn phòng đã đầy!" : "Office is full!");
          return;
      }
      if (gameState.cash < candidate.hireCost) {
          alert(language === 'vi' ? "Không đủ tiền tuyển dụng!" : "Not enough funds to hire!");
          return;
      }

      const possibleTraits = ["Siêng năng", "Lười biếng", "Trung thành", "Dễ tự ái", "Tham vọng", "Hòa đồng", "Lập dị"];
      const randomTraits = [possibleTraits[Math.floor(Math.random() * possibleTraits.length)]];
      if (Math.random() > 0.5) randomTraits.push(possibleTraits[Math.floor(Math.random() * possibleTraits.length)]);

      const newEmp: Employee = {
          id: candidate.id,
          name: candidate.name,
          role: candidate.role,
          level: candidate.level,
          skill: candidate.skill,
          specificSkills: candidate.specificSkills,
          salary: candidate.salary,
          morale: 80 + Math.floor(Math.random() * 20), 
          quirk: candidate.quirk,
          education: candidate.education,
          backgroundStory: candidate.bio,
          stress: 0,
          loyalty: 50 + Math.floor(Math.random() * 50),
          traits: randomTraits,
          assignedProductId: null,
          assignedContractId: null
      };

      setGameState(prev => ({
          ...prev,
          cash: prev.cash - candidate.hireCost,
          employees: [...prev.employees, newEmp],
          candidates: prev.candidates.filter(c => c.id !== candidate.id)
      }));
  };

  const handleFire = (id: string) => {
      setGameState(prev => ({
          ...prev,
          employees: prev.employees.filter(e => e.id !== id),
          morale: Math.max(0, prev.morale - 10) 
      }));
  };

  // --- PRODUCT MANAGEMENT HANDLERS ---

  const handleAssignEmployee = (empId: string, targetId: string | null) => {
      setGameState(prev => {
          // Check if target is product or contract
          const isContract = prev.contracts.find(c => c.id === targetId);
          const isProduct = prev.products.find(p => p.id === targetId);
          
          return {
              ...prev,
              employees: prev.employees.map(e => {
                  if (e.id === empId) {
                      return { 
                          ...e, 
                          assignedProductId: isProduct ? targetId : null,
                          assignedContractId: isContract ? targetId : null
                      };
                  }
                  return e;
              })
          };
      });
  };

  const handleCreateProduct = (name: string, desc: string) => {
      const newProduct: Product = {
          id: `prod-${Date.now()}`,
          name,
          description: desc,
          stage: ProductStage.CONCEPT,
          developmentProgress: 0,
          quality: 50,
          marketFit: 50,
          bugs: 0,
          users: 0,
          revenue: 0,
          activeFeedback: []
      };
      setGameState(prev => ({
          ...prev,
          products: [...prev.products, newProduct]
      }));
  };

  // --- CONTRACTS & INVESTORS ---

  const handleFindContracts = async () => {
      setLoading(true);
      const newContracts = await generateContracts(gameState.industry, gameState.reputation, language);
      setGameState(prev => ({
          ...prev,
          contracts: [...prev.contracts.filter(c => c.status === 'active'), ...newContracts]
      }));
      setLoading(false);
  };

  const handleAcceptContract = (id: string) => {
      setGameState(prev => ({
          ...prev,
          contracts: prev.contracts.map(c => c.id === id ? { ...c, status: 'active' } : c)
      }));
  };

  const handleFindInvestor = async () => {
      if (gameState.investors.some(i => i.status === 'negotiating' || i.status === 'new')) return; // One at a time
      setLoading(true);
      const inv = await generateInvestor(gameState, language);
      if (inv) {
          setGameState(prev => ({
              ...prev,
              investors: [...prev.investors, inv]
          }));
      }
      setLoading(false);
  };

  const handleNegotiate = async (investorId: string, message: string) => {
      const investor = gameState.investors.find(i => i.id === investorId);
      if (!investor) return;

      setLoading(true);
      const result = await negotiateDeal(investor, message, language);
      
      setGameState(prev => {
          let updatedInvestors = prev.investors.map(inv => {
              if (inv.id === investorId) {
                  let status = inv.status;
                  if (result.isDeal) status = 'partner';
                  if (result.isWalkAway) status = 'rejected';
                  
                  return {
                      ...inv,
                      status: status as any,
                      patience: inv.patience - 1,
                      lastResponse: result.message,
                      offerAmount: result.newOffer ? result.newOffer.amount : inv.offerAmount,
                      equityDemanded: result.newOffer ? result.newOffer.equity : inv.equityDemanded
                  };
              }
              return inv;
          });

          // Apply Deal Effects
          if (result.isDeal) {
              const updatedInv = updatedInvestors.find(i => i.id === investorId)!;
              return {
                  ...prev,
                  investors: updatedInvestors,
                  cash: prev.cash + updatedInv.offerAmount,
                  equity: Math.max(0, prev.equity - updatedInv.equityDemanded),
                  history: [...prev.history, {
                      narrative: `Investment Deal Closed! ${updatedInv.name} invested $${updatedInv.offerAmount.toLocaleString()} for ${updatedInv.equityDemanded}% equity.`,
                      cashChange: updatedInv.offerAmount,
                      equityChange: -updatedInv.equityDemanded,
                      userChange: 0,
                      moraleChange: 10,
                      productUpdates: [],
                      competitorUpdate: "",
                      advice: "Expand aggressively.",
                      randomEvent: null
                  }]
              };
          }

          return { ...prev, investors: updatedInvestors };
      });
      setLoading(false);
  };

  const handleAskAdvice = async () => {
      const partners = gameState.investors.filter(i => i.status === 'partner');
      if (partners.length === 0) return;
      
      setLoading(true);
      const advice = await askInvestorAdvice(partners, gameState, language);
      alert(`Board Advice: ${advice}`);
      setLoading(false);
  };

  // --- CHAT & PITCH (Deprecated pitch but kept for compatibility) ---

  const handleChatWithEmployee = async (empId: string, message: string): Promise<string> => {
      const emp = gameState.employees.find(e => e.id === empId);
      if (!emp) return "N/A";
      const response = await chatWithEmployee(emp, gameState, message, language);
      if (emp.stress < 70) {
          setGameState(prev => ({
              ...prev,
              employees: prev.employees.map(e => e.id === empId ? { ...e, morale: Math.min(100, e.morale + 2) } : e)
          }));
      }
      return response;
  };

  const handlePitchInvestors = async (roundName: string): Promise<{success: boolean, message: string}> => {
      setLoading(true);
      try {
          const result = await evaluatePitch(gameState, roundName, language);
          
          if (result.accepted) {
              setGameState(prev => ({
                  ...prev,
                  cash: prev.cash + result.investmentAmount,
                  equity: Math.max(0, Number((prev.equity - result.equityDemanded).toFixed(1))),
                  history: [...prev.history, {
                      narrative: `FUNDING SECURED! ${result.investorFeedback}`,
                      cashChange: result.investmentAmount,
                      equityChange: -result.equityDemanded,
                      userChange: 0,
                      moraleChange: 10,
                      productUpdates: [],
                      competitorUpdate: "",
                      advice: "Spend wisely.",
                      randomEvent: null
                  }]
              }));
              return { success: true, message: `Deal! $${result.investmentAmount.toLocaleString()} for ${result.equityDemanded}% equity. Valuation: $${result.valuation.toLocaleString()}` };
          } else {
              setGameState(prev => ({
                  ...prev,
                  morale: Math.max(0, prev.morale - 5), // Rejected hurts morale
                  history: [...prev.history, {
                      narrative: `PITCH REJECTED. ${result.investorFeedback}`,
                      cashChange: 0,
                      equityChange: 0,
                      userChange: 0,
                      moraleChange: -5,
                      productUpdates: [],
                      competitorUpdate: "",
                      advice: "Improve stats and try again.",
                      randomEvent: null
                  }]
              }));
              return { success: false, message: `Rejected: ${result.investorFeedback}` };
          }
      } finally {
          setLoading(false);
      }
  };

  // --- TURN PROCESSING ---

  const handleUpgradeFacility = (facilityId: string) => {
      const facility = gameState.facilities.find(f => f.id === facilityId);
      if (!facility) return;
      if (facility.level >= facility.maxLevel) return;
      if (gameState.cash < facility.costToUpgrade) return;

      setGameState(prev => ({
          ...prev,
          cash: prev.cash - facility.costToUpgrade,
          facilities: prev.facilities.map(f => {
              if (f.id === facilityId) {
                  return {
                      ...f,
                      level: f.level + 1,
                      costToUpgrade: f.costToUpgrade * 2,
                      value: f.value * 3,
                      description: `Level ${f.level + 1} Facility`
                  };
              }
              return f;
          })
      }));
  };
  
  const handleEventDecision = (decision: string) => {
      setLastEventChoice(decision);
  };

  const handleTurnSubmit = async (decisions: PlayerDecisions) => {
    setLoading(true);
    try {
      const fullDecisions: PlayerDecisions = { ...decisions, eventChoice: lastEventChoice };

      const salaryBurn = gameState.employees.reduce((acc, emp) => acc + emp.salary, 0);
      const facilityBurn = gameState.facilities.reduce((acc, fac) => acc + fac.maintenanceCost, 0);
      
      const marketingCost = MARKETING_COSTS[decisions.marketingFocus] || 0;
      const weeklyFixedExpenses = Math.round((salaryBurn + facilityBurn) / 4);
      const totalTurnExpenses = weeklyFixedExpenses + marketingCost;

      // 1. Process Contract Logic (Local Calculation for Reliability)
      let contractRevenue = 0;
      let contractPenalty = 0;
      let reputationChange = 0;
      const updatedContracts: Contract[] = gameState.contracts.map(contract => {
          if (contract.status !== 'active') return contract;

          const team = gameState.employees.filter(e => e.assignedContractId === contract.id);
          const weeklyProgress = team.reduce((acc, e) => acc + (e.skill / 2), 0); // Skill points contribution
          
          let newEffort = contract.currentEffort + weeklyProgress;
          let newDeadline = contract.deadlineWeeks - 1;
          let newStatus: Contract['status'] = contract.status;

          if (newEffort >= contract.totalEffortRequired) {
              newStatus = 'completed';
              contractRevenue += contract.reward;
              reputationChange += 5;
          } else if (newDeadline <= 0) {
              newStatus = 'failed';
              contractPenalty += contract.penalty;
              reputationChange -= 10;
          }

          return {
              ...contract,
              currentEffort: newEffort,
              deadlineWeeks: newDeadline,
              status: newStatus
          };
      });

      // 2. Call AI for Core Logic
      const result = await processTurn(gameState, fullDecisions, totalTurnExpenses, language);
      result.decisions = fullDecisions;
      setLastEventChoice(null);

      setGameState(prev => {
        // Unassign employees from finished contracts
        const finishedContractIds = updatedContracts.filter(c => c.status === 'completed' || c.status === 'failed').map(c => c.id);
        const updatedEmployees = prev.employees.map(e => {
            if (e.assignedContractId && finishedContractIds.includes(e.assignedContractId)) {
                return { ...e, assignedContractId: null };
            }
            // Stress logic
            let s = e.stress + ((result.cashChange - totalTurnExpenses) < 0 ? 5 : 0);
            if (e.assignedProductId || e.assignedContractId) s += 2;
            s -= (prev.playerSkills.management * 0.5); 
            s = Math.max(0, Math.min(100, s));
            return { ...e, stress: s, morale: s > 80 ? Math.max(0, e.morale - 5) : e.morale };
        });

        // Financials
        const netCashChange = result.cashChange - totalTurnExpenses + contractRevenue - contractPenalty;
        const newCash = prev.cash + netCashChange;
        const newEquity = Math.max(0, Math.min(100, prev.equity + (result.equityChange || 0)));
        const newReputation = Math.max(0, Math.min(100, prev.reputation + reputationChange));

        // Save detailed history
        if (contractRevenue > 0) result.narrative += ` [Contract Completed: +$${contractRevenue}]`;
        if (contractPenalty > 0) result.narrative += ` [Contract Failed: -$${contractPenalty}]`;

        result.cashChange = netCashChange;

        // Products
        const totalUserChange = result.productUpdates.reduce((acc, p) => acc + p.userChange, 0);
        const newUsers = Math.max(0, prev.users + totalUserChange);
        let newMorale = Math.min(100, Math.max(0, prev.morale + result.moraleChange));
        
        const updatedProducts = prev.products.map(prod => {
            const update = result.productUpdates.find(u => u.productId === prod.id);
            if (!update) return prod;

            let newProgress = prod.developmentProgress + update.devProgressChange;
            let newStage = prod.stage;
            
            if (newProgress >= 100) {
                if (prod.stage === ProductStage.CONCEPT) { newStage = ProductStage.MVP; newProgress = 0; }
                else if (prod.stage === ProductStage.MVP) { newStage = ProductStage.ALPHA; newProgress = 0; }
                else if (prod.stage === ProductStage.ALPHA) { newStage = ProductStage.RELEASE; newProgress = 0; }
                else if (prod.stage === ProductStage.RELEASE) { newStage = ProductStage.GROWTH; newProgress = 50; }
                else { newProgress = 100; }
            }

            const newFeedback = update.newFeedback ? [update.newFeedback, ...prod.activeFeedback].slice(0, 5) : prod.activeFeedback;

            return {
                ...prod,
                stage: newStage,
                developmentProgress: newProgress,
                quality: Math.min(100, Math.max(0, prod.quality + update.qualityChange)),
                bugs: Math.max(0, prod.bugs + update.bugChange),
                users: Math.max(0, prod.users + update.userChange),
                revenue: Math.max(0, prod.revenue + update.revenueChange),
                activeFeedback: newFeedback
            };
        });

        // Game Over Check
        let newStage = prev.stage;
        let gameOverReason = undefined;
        if (newCash < -10000) { 
            newStage = GameStage.GAME_OVER;
            gameOverReason = language === 'vi' ? "Phá sản (Nợ > $10k)." : "Bankrupt (Debt > $10k).";
        }

        return {
          ...prev,
          cash: newCash,
          equity: newEquity,
          users: newUsers,
          morale: newMorale,
          reputation: newReputation,
          products: updatedProducts,
          contracts: updatedContracts,
          employees: updatedEmployees,
          turn: prev.turn + 1,
          history: [...prev.history, result],
          stage: newStage,
          gameOverReason
        };
      });

      setCurrentIntel([]);

    } catch (e) {
      console.error(e);
      setSystemError("Error processing turn. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    window.location.reload(); 
  };

  if (systemError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-slate-800 bg-grid-pattern">
        <div className="bg-white border border-red-200 p-8 rounded-xl max-w-md text-center shadow-xl">
            <h2 className="text-xl font-bold text-red-600 mb-2">System Failure</h2>
            <p className="text-slate-600">{systemError}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700">Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 bg-grid-pattern overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full px-2 md:px-6 lg:px-8 py-2 md:py-6 min-h-screen flex flex-col">
        {gameState.stage === GameStage.SETUP && (
            <div className="flex-1 flex justify-center items-start md:items-center">
                <SetupGame onStart={handleStartGame} isLoading={loading} error={setupError} />
            </div>
        )}

        {(gameState.stage === GameStage.PLAYING || gameState.stage === GameStage.GAME_OVER || gameState.stage === GameStage.VICTORY) && (
            <GameDashboard 
                state={gameState}
                currentIntel={currentIntel}
                onTurnSubmit={handleTurnSubmit}
                onBuyIntel={handleBuyIntel}
                onDismissIntel={handleDismissIntel}
                onRecruit={handleRecruit}
                onHireCandidate={handleHireCandidate}
                onFire={handleFire}
                onUpgradeFacility={handleUpgradeFacility}
                isProcessing={loading} 
                onRestart={handleRestart}
                onEventDecision={handleEventDecision}
                onChatWithEmployee={handleChatWithEmployee}
                onAssignEmployee={handleAssignEmployee}
                onCreateProduct={handleCreateProduct}
                onPitch={handlePitchInvestors}
                onFindContracts={handleFindContracts}
                onAcceptContract={handleAcceptContract}
                onFindInvestor={handleFindInvestor}
                onNegotiate={handleNegotiate}
                onAskAdvice={handleAskAdvice}
            />
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center flex-col transition-all">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-200 blur-xl opacity-50 animate-pulse"></div>
                <Loader2 size={64} className="text-blue-600 animate-spin mb-4 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 animate-pulse font-heading tracking-widest">
                {t('setup.analyzing')}
            </h3>
            <p className="text-slate-500 mt-2 text-sm font-mono uppercase tracking-widest">AI Simulation Running</p>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
    return (
        <LanguageProvider>
            <GameContainer />
        </LanguageProvider>
    )
}