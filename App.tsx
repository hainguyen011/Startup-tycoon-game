import React, { useState, useEffect } from 'react';
import SetupGame from './components/SetupGame';
import { GameDashboard } from './components/GameDashboard';
import { GameState, GameStage, Industry, PlayerDecisions, INITIAL_CASH, SimulationResult, IntelType, IntelItem, INITIAL_FACILITIES, INITIAL_SKILLS, Employee, Candidate, Product, ProductStage, LLMProvider, MARKETING_COSTS, Contract, Investor, MarketCondition, AICompanion } from './types';
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
        ceo: { name: '', gender: 'Male', interests: [] },
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
        marketCondition: MarketCondition.NEUTRAL,
        competitorName: '',
        employees: [],
        candidates: [],
        products: [],
        contracts: [],
        investors: [],
        facilities: JSON.parse(JSON.stringify(INITIAL_FACILITIES)),
        playerSkills: { ...INITIAL_SKILLS },
        council: [
            { id: 'council-1', name: 'Monica Hall', role: 'Finance Advisor', specialty: 'Investment & Valuation', avatar: '💼' },
            { id: 'council-2', name: 'Bertram Gilfoyle', role: 'System Architect', specialty: 'Infrastructure & Security', avatar: '💻' },
            { id: 'council-3', name: 'Dinesh Chugtai', role: 'Senior Developer', specialty: 'High-speed Coding', avatar: '🚀' }
        ]
    });

    const [systemError, setSystemError] = useState<string | null>(null);
    const [setupError, setSetupError] = useState<string | null>(null);

    const handleStartGame = async (
        name: string,
        industry: Industry,
        productName: string,
        productDesc: string,
        ceo: { name: string, gender: 'Male' | 'Female' | 'Other', interests: string[] },
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
            setSetupError(t('alerts.apiKeyRequired'));
            return;
        }

        setLoading(true);
        try {
            // Initialize story with explicit overrides to ensure they are used immediately
            const initData = await initializeGameStory(industry, name, productName, productDesc, ceo, language, { apiKey: userApiKey, provider });

            // Create initial product with modules
            const initialProduct: Product = {
                id: `prod-${Date.now()}`,
                name: productName,
                description: productDesc,
                stage: ProductStage.CONCEPT,
                developmentProgress: 0,
                quality: 50,
                marketFit: 50,
                bugs: 0,
                techDebt: 0,
                modules: [
                    { id: 'mod-1', name: 'Database Architecture', requiredCoreSkill: 'technical', progress: 0, quality: 50, assignedEmployeeId: null, bugs: 0 },
                    { id: 'mod-2', name: 'Backend API', requiredCoreSkill: 'technical', progress: 0, quality: 50, assignedEmployeeId: null, bugs: 0 },
                    { id: 'mod-3', name: 'Frontend App', requiredCoreSkill: 'creative', progress: 0, quality: 50, assignedEmployeeId: null, bugs: 0 }
                ],
                users: 0,
                revenue: 0,
                activeFeedback: [initData.initialProductAnalysis]
            };

            setGameState(prev => ({
                ...prev,
                companyName: name,
                ceo: ceo,
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
            let errMsg = t('alerts.systemError');
            const msg = e.message || '';

            if (msg.includes('insufficient_quota')) {
                errMsg = t('alerts.quotaExceeded');
            } else if (msg.includes('401') || msg.includes('403') || msg.includes('API key')) {
                errMsg = t('alerts.invalidKey');
            } else if (msg.includes('429') || msg.includes('quota')) {
                errMsg = t('alerts.tooManyRequests');
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
                title: type === IntelType.MARKET ? t('dashboard.intel.market_report') : type === IntelType.COMPETITOR ? t('dashboard.intel.spy_report') : t('dashboard.intel.audit_report'),
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
        setCurrentIntel(prev => prev.filter(i => i.id === id));
    };

    const handleRecruit = async (jobDesc: string, budget: number) => {
        const recruitmentCost = 500;
        if (gameState.cash < recruitmentCost) {
            alert(t('alerts.noFundsRecruit'));
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

    const handleHireCandidate = (candidate: Candidate, isTrial: boolean = false) => {
        const office = gameState.facilities.find(f => f.id === 'office');
        const currentEmployeesCount = gameState.employees.length;
        const maxCapacity = office ? office.value : 5; // Default if somehow missing

        if (currentEmployeesCount >= maxCapacity) {
            alert(t('alerts.officeFull'));
            return;
        }

        const cost = isTrial ? Math.floor(candidate.hireCost / 2) : candidate.hireCost;
        if (gameState.cash < cost) {
            alert(t('alerts.noFundsHire'));
            return;
        }

        const newEmp: Employee = {
            id: candidate.id,
            name: candidate.name,
            role: candidate.role,
            level: candidate.level,
            skills: candidate.skills,
            proStats: candidate.proStats,
            specificSkills: candidate.specificSkills,
            salary: isTrial ? Math.floor(candidate.salary * 0.5) : candidate.salary,
            morale: 80 + Math.floor(Math.random() * 20),
            health: 100, // Thể lực đầy đủ
            stress: 0,
            loyalty: 50 + Math.floor(Math.random() * 50),
            quirk: candidate.quirk,
            education: candidate.education,
            backgroundStory: candidate.bio,
            hiddenTraits: candidate.hiddenTraits,
            headhuntStatus: 'none',
            isOnLeave: false,
            leaveTurnsLeft: 0,
            trialTurnsLeft: isTrial ? 2 : 0, // 2 tuần thử việc
            assignedProductId: null,
            assignedContractId: null
        };

        setGameState(prev => ({
            ...prev,
            cash: prev.cash - cost,
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
                }),
                // Also clear module assignment if unassigning from product
                products: prev.products.map(p => {
                    if (p.id !== targetId) {
                        return {
                            ...p,
                            modules: p.modules.map(m => m.assignedEmployeeId === empId ? { ...m, assignedEmployeeId: null } : m)
                        };
                    }
                    return p;
                })
            };
        });
    };

    const handleAssignToModule = (empId: string, productId: string, moduleId: string | null) => {
        setGameState(prev => ({
            ...prev,
            // 1. Update Employee state to link them to this product
            employees: prev.employees.map(e => {
                if (e.id === empId) {
                    return {
                        ...e,
                        assignedProductId: empId ? productId : null,
                        assignedContractId: null // Clear contract if assigned to product
                    };
                }
                return e;
            }),
            // 2. Update Product state to link them to the module
            products: prev.products.map(p => {
                if (p.id === productId) {
                    return {
                        ...p,
                        modules: p.modules.map(m => {
                            if (m.id === moduleId) return { ...m, assignedEmployeeId: empId || null };
                            if (m.assignedEmployeeId === empId) return { ...m, assignedEmployeeId: null };
                            return m;
                        })
                    };
                } else {
                    // If they were assigned to another product's module, clear it
                    return {
                        ...p,
                        modules: p.modules.map(m => m.assignedEmployeeId === empId ? { ...m, assignedEmployeeId: null } : m)
                    };
                }
            })
        }));
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
            techDebt: 0,
            modules: [
                { id: `mod-${Date.now()}-1`, name: 'Core Engine', requiredCoreSkill: 'technical', progress: 0, quality: 50, assignedEmployeeId: null, bugs: 0 },
                { id: `mod-${Date.now()}-2`, name: 'User Interface', requiredCoreSkill: 'creative', progress: 0, quality: 50, assignedEmployeeId: null, bugs: 0 },
                { id: `mod-${Date.now()}-3`, name: 'Marketing Tool', requiredCoreSkill: 'social', progress: 0, quality: 50, assignedEmployeeId: null, bugs: 0 }
            ],
            users: 0,
            revenue: 0,
            activeFeedback: []
        };
        setGameState(prev => ({
            ...prev,
            products: [...prev.products, newProduct]
        }));
    };

    // --- TRAINING ---
    const handleTrainEmployee = (empId: string, skillType: string) => {
        const TRAINING_COST = 500;
        if (gameState.cash < TRAINING_COST) {
            alert(t('alerts.noFundsHire') || "Not enough funds for training.");
            return;
        }

        setGameState(prev => {
            const updatedEmployees = prev.employees.map(emp => {
                if (emp.id === empId) {
                    const growthMulti = emp.proStats?.growthPotential ? (emp.proStats.growthPotential / 100) + 1 : 1;
                    const gain = Math.floor((Math.random() * 4 + 2) * growthMulti); // Gain 2-5 * GrowthMultiplier
                    let newSkills = { ...emp.skills };
                    
                    if (skillType in newSkills) {
                        newSkills[skillType as keyof typeof newSkills] = Math.min(100, (newSkills[skillType as keyof typeof newSkills] || 0) + gain);
                    } else if (emp.proStats && skillType in emp.proStats) {
                        // For Pro Stats training
                        emp.proStats[skillType as keyof typeof emp.proStats] = Math.min(100, (emp.proStats[skillType as keyof typeof emp.proStats] || 0) + gain);
                    }

                    return {
                        ...emp,
                        skills: newSkills,
                        morale: Math.min(100, emp.morale + 10)
                    };
                }
                return emp;
            });

            return {
                ...prev,
                cash: prev.cash - TRAINING_COST,
                employees: updatedEmployees
            };
        });
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
                        narrative: t('history.investmentDeal', { name: updatedInv.name, amount: updatedInv.offerAmount.toLocaleString(), equity: updatedInv.equityDemanded }),
                        cashChange: updatedInv.offerAmount,
                        equityChange: -updatedInv.equityDemanded,
                        userChange: 0,
                        moraleChange: 10,
                        productUpdates: [],
                        competitorUpdate: "",
                        advice: t('history.expandAggressively'),
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
        alert(t('history.boardAdvice', { advice }));
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

    const handlePitchInvestors = async (roundName: string): Promise<{ success: boolean, message: string }> => {
        setLoading(true);
        try {
            const result = await evaluatePitch(gameState, roundName, language);

            if (result.accepted) {
                setGameState(prev => ({
                    ...prev,
                    cash: prev.cash + result.investmentAmount,
                    equity: Math.max(0, Number((prev.equity - result.equityDemanded).toFixed(1))),
                    history: [...prev.history, {
                        narrative: `${t('history.pitchSecured')} ${result.investorFeedback}`,
                        cashChange: result.investmentAmount,
                        equityChange: -result.equityDemanded,
                        userChange: 0,
                        moraleChange: 10,
                        productUpdates: [],
                        competitorUpdate: "",
                        advice: t('history.spendWisely'),
                        randomEvent: null
                    }]
                }));
                return { success: true, message: `Deal! $${result.investmentAmount.toLocaleString()} for ${result.equityDemanded}% equity. Valuation: $${result.valuation.toLocaleString()}` };
            } else {
                setGameState(prev => ({
                    ...prev,
                    morale: Math.max(0, prev.morale - 5), // Rejected hurts morale
                    history: [...prev.history, {
                        narrative: `${t('history.pitchRejected')} ${result.investorFeedback}`,
                        cashChange: 0,
                        equityChange: 0,
                        userChange: 0,
                        moraleChange: -5,
                        productUpdates: [],
                        competitorUpdate: "",
                        advice: t('history.improveStats'),
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
                    const nextLevel = f.level + 1;
                    let newValue = f.value;
                    if (f.id === 'office') newValue = nextLevel === 2 ? 8 : nextLevel === 3 ? 15 : nextLevel === 4 ? 30 : 60;
                    else if (f.id === 'server') newValue = nextLevel === 2 ? 5000 : nextLevel === 3 ? 15000 : nextLevel === 4 ? 50000 : 100000;
                    else if (f.id === 'pc') newValue += 5; // +5% Productivity
                    else if (f.id === 'chair') newValue += 5; // +5% Reliability
                    else if (f.id === 'coffee') newValue += 2; // -2 Stress

                    return {
                        ...f,
                        level: nextLevel,
                        costToUpgrade: f.costToUpgrade * 2.5,
                        value: newValue,
                        benefit: t(`dashboard.infra.${f.id}.benefit`, { value: newValue.toLocaleString() }) || f.benefit,
                        description: `${t('dashboard.infra.level')} ${nextLevel}`
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

            // Welfare Multiplier
            let welfareCostMultiplier = 1;
            if (decisions.welfareLevel === 'Premium') welfareCostMultiplier = 2;
            if (decisions.welfareLevel === 'Minimal') welfareCostMultiplier = 0.5;

            const marketingCost = MARKETING_COSTS[decisions.marketingFocus] || 0;
            const weeklyFixedExpenses = Math.round((salaryBurn + (facilityBurn * welfareCostMultiplier)) / 4);
            const totalTurnExpenses = weeklyFixedExpenses + marketingCost;

            // 1. Process Contract Logic (Local Calculation for Reliability)
            let contractRevenue = 0;
            let contractPenalty = 0;
            let reputationChange = 0;
            const updatedContracts: Contract[] = gameState.contracts.map(contract => {
                if (contract.status !== 'active') return contract;

                const team = gameState.employees.filter(e => e.assignedContractId === contract.id);
                const weeklyProgress = team.reduce((acc, e) => acc + ((e.skills?.technical || 0) / 2), 0); // Skill points contribution

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
                    let updatedE = { ...e };
                    
                    if (updatedE.assignedContractId && finishedContractIds.includes(updatedE.assignedContractId)) {
                        updatedE.assignedContractId = null;
                    }

                    // Trial Period Check
                    if (updatedE.trialTurnsLeft && updatedE.trialTurnsLeft > 0) {
                        updatedE.trialTurnsLeft -= 1;
                        if (updatedE.trialTurnsLeft === 0 && updatedE.salary) {
                            // End of trial, restore full salary
                            updatedE.salary = updatedE.salary * 2;
                        }
                    }
                    
                    // Leave Period Check
                    if (updatedE.leaveTurnsLeft && updatedE.leaveTurnsLeft > 0) {
                        updatedE.leaveTurnsLeft -= 1;
                        if (updatedE.leaveTurnsLeft === 0) {
                            updatedE.isOnLeave = false;
                        }
                    }

                    // Apply AI EmployeeUpdates (Synergy, Health, Events)
                    const eUpdate = result.employeeUpdates?.find(eu => eu.employeeId === updatedE.id);
                    if (eUpdate) {
                        if (eUpdate.healthChange) updatedE.health = Math.max(0, Math.min(100, updatedE.health + eUpdate.healthChange));
                        if (eUpdate.stressChange) updatedE.stress = Math.max(0, Math.min(100, updatedE.stress + eUpdate.stressChange));
                        if (eUpdate.reliabilityChange && updatedE.proStats) updatedE.proStats.reliability = Math.max(0, Math.min(100, updatedE.proStats.reliability + eUpdate.reliabilityChange));
                        if (eUpdate.productivityChange && updatedE.proStats) updatedE.proStats.productivity = Math.max(0, Math.min(100, updatedE.proStats.productivity + eUpdate.productivityChange));
                        if (eUpdate.leaveTurns && eUpdate.leaveTurns > 0) {
                            updatedE.isOnLeave = true;
                            updatedE.leaveTurnsLeft = eUpdate.leaveTurns;
                        }
                        if (eUpdate.headhuntOffer) {
                            updatedE.headhuntStatus = 'offered';
                        }
                    }

                    // Base Stress logic & Buffs
                    let s = updatedE.stress + ((result.cashChange - totalTurnExpenses) < 0 ? 5 : 0);
                    if (updatedE.assignedProductId || updatedE.assignedContractId) s += 2;
                    s -= (prev.playerSkills.management * 0.5);
                    
                    const coffeeMachine = prev.facilities.find(fac => fac.id === 'coffee');
                    if (coffeeMachine) s -= coffeeMachine.value;

                    s = Math.max(0, Math.min(100, s));
                    updatedE.stress = s;
                    updatedE.morale = s > 80 ? Math.max(0, updatedE.morale - 5) : updatedE.morale;
                    
                    return updatedE;
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

                    // Updated Module progress
                    const updatedModules = prod.modules.map(mod => {
                        const modUpdate = update.moduleUpdates?.find(mu => mu.moduleId === mod.id);
                        if (!modUpdate) return mod;
                        return { ...mod, progress: Math.min(100, mod.progress + modUpdate.progressChange) };
                    });

                    return {
                        ...prod,
                        stage: newStage,
                        developmentProgress: newProgress,
                        quality: Math.min(100, Math.max(0, prod.quality + update.qualityChange)),
                        bugs: Math.max(0, prod.bugs + update.bugChange),
                        techDebt: Math.min(100, Math.max(0, prod.techDebt + update.techDebtChange)),
                        modules: updatedModules,
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
                    gameOverReason = t('alerts.bankrupt');
                }

                // Market Condition Logic
                let newMarketCondition = prev.marketCondition;
                if (prev.turn % 5 === 0 && Math.random() > 0.5) {
                    const conditions = [MarketCondition.BULL, MarketCondition.BEAR, MarketCondition.NEUTRAL];
                    newMarketCondition = conditions[Math.floor(Math.random() * conditions.length)];
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
                    marketCondition: newMarketCondition,
                    gameOverReason
                };
            });

            setCurrentIntel([]);

        } catch (e) {
            console.error(e);
            setSystemError(t('alerts.errorTurn'));
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
                    <h2 className="text-xl font-bold text-red-600 mb-2">{t('alerts.systemFailure')}</h2>
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
                        activeEvent={gameState.history[gameState.history.length - 1]?.randomEvent || null}
                        onTurnSubmit={handleTurnSubmit}
                        onBuyIntel={handleBuyIntel}
                        onDismissIntel={handleDismissIntel}
                        onRecruit={handleRecruit}
                        onHireCandidate={handleHireCandidate}
                        onFire={handleFire}
                        onUpgradeFacility={handleUpgradeFacility}
                        isProcessing={loading}
                        onRestart={handleRestart}
                        handleEventChoice={handleEventDecision}
                        onChatWithEmployee={handleChatWithEmployee}
                        onAssignEmployee={handleAssignEmployee}
                        onAssignToModule={handleAssignToModule}
                        onCreateProduct={handleCreateProduct}
                        onPitch={handlePitchInvestors}
                        onFindContracts={handleFindContracts}
                        onAcceptContract={handleAcceptContract}
                        onFindInvestor={handleFindInvestor}
                        onNegotiate={handleNegotiate}
                        onAskAdvice={handleAskAdvice}
                        onTrainEmployee={handleTrainEmployee}
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