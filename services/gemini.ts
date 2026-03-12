
import { GoogleGenAI, Type, Schema, GenerateContentResponse } from "@google/genai";
import { Language, Industry, GameState, CEODetails, SimulationResult, Employee, Candidate, Product, Contract, Investor, LLMProvider, IntelType, PlayerDecisions, WelfareLevel, WorkMode, MARKETING_COSTS, InitialGameStoryResponse as InitGameResponse, InterviewData } from "../types";

// Configuration State
let currentProvider: LLMProvider = 'gemini';
const STORAGE_KEY = 'startup_tycoon_api_key';

const getSavedApiKey = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
        return '';
    }
};

let dynamicApiKey = getSavedApiKey();

// --- CONFIGURATION METHODS ---

export const setLLMConfig = (apiKey: string, provider: LLMProvider = 'gemini') => {
    dynamicApiKey = apiKey.trim();
    currentProvider = provider;
    if (dynamicApiKey) {
        try {
            localStorage.setItem(STORAGE_KEY, dynamicApiKey);
        } catch (e) {
            console.error("Failed to save API key to localStorage", e);
        }
    }
};

export const getLLMConfig = () => ({
    apiKey: dynamicApiKey,
    provider: currentProvider
});

export const hasValidApiKey = () => !!dynamicApiKey && dynamicApiKey.length > 0;

// --- GENERIC LLM CALLER ---

interface LLMRequest {
    systemInstruction: string;
    prompt: string;
    responseSchema?: any; // For Gemini
    jsonKeys?: string[]; // For OpenAI to help with prompt engineering
}

// Helper to clean Markdown JSON
const cleanJSON = (text: string) => {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return clean;
};

async function generateContentJSON<T>(request: LLMRequest): Promise<T> {
    const { systemInstruction, prompt, responseSchema, jsonKeys } = request;

    // --- GEMINI IMPLEMENTATION ---
    if (currentProvider === 'gemini') {
        const ai = new GoogleGenAI({ apiKey: dynamicApiKey });
        const fullPrompt = `${systemInstruction}\n${prompt}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema
            }
        });
        return JSON.parse(cleanJSON(response.text || "{}")) as T;
    }

    // --- OPENAI / COMPATIBLE API IMPLEMENTATION ---
    if (currentProvider === 'openai' || currentProvider === 'deepseek') {
        const isDeepSeek = currentProvider === 'deepseek';
        const baseUrl = isDeepSeek ? 'https://api.deepseek.com' : 'https://api.openai.com/v1';
        const model = isDeepSeek ? 'deepseek-chat' : 'gpt-4o-mini';

        // OpenAI doesn't support the strict Schema object from Google SDK directly.
        // We append a schema instruction to the system prompt.
        let jsonInstruction = "Return valid JSON.";
        if (jsonKeys && jsonKeys.length > 0) {
            jsonInstruction += ` The JSON must contain keys: ${jsonKeys.join(', ')}.`;
        }
        // Simple structure hint if complex schema is needed (approximation)
        if (responseSchema && responseSchema.properties) {
            jsonInstruction += ` Structure hint: ${JSON.stringify(Object.keys(responseSchema.properties))}`;
        }

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${dynamicApiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: `${systemInstruction}\n${jsonInstruction}` },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`API Error ${response.status}: ${JSON.stringify(err)}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "{}";
        return JSON.parse(cleanJSON(text)) as T;
    }

    throw new Error("Unsupported Provider");
}

// --- Helper to get system instruction based on language ---
const getSystemInstruction = (lang: Language) => {
    const isVi = lang === 'vi';
    return isVi
        ? "Bạn là engine mô phỏng kinh doanh Startup chuyên sâu. BẮT BUỘC trả lời hoàn toàn bằng TIẾNG VIỆT. Tuyệt đối không pha trộn tiếng Anh trừ các thuật ngữ kỹ thuật không thể dịch. Phản hồi phải chuyên nghiệp, súc tích và mang tính chiến lược."
        : "You are an advanced Startup Business Simulation Engine. You MUST respond entirely in ENGLISH. Do not use any other language. Feedback should be professional, concise, and strategic.";
};

// --- RETRY LOGIC (Generic) ---

async function callAIWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 2000
): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        const msg = (error.message || JSON.stringify(error)).toLowerCase();

        // Non-retryable errors
        if (
            msg.includes('401') ||
            msg.includes('403') ||
            msg.includes('api key') ||
            msg.includes('invalid_api_key') ||
            msg.includes('insufficient_quota')
        ) {
            throw error;
        }

        const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('too many requests');
        const isServerError = msg.includes('500') || msg.includes('503') || msg.includes('overloaded');

        if (retries > 0 && (isRateLimit || isServerError)) {
            console.warn(`API Busy/Error. Retrying in ${delay}ms... (${retries} left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return callAIWithRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
}

// ==========================================
// GAME LOGIC FUNCTIONS
// ==========================================

// --- Initialization ---

// Interface moved to types.ts

export const initializeGameStory = async (
    industry: Industry,
    companyName: string,
    productName: string,
    productDesc: string,
    ceo: CEODetails,
    language: Language,
    config: { apiKey?: string, provider?: LLMProvider } = {}
): Promise<InitGameResponse> => {

    const { apiKey, provider = 'gemini' } = config;

    if (apiKey && apiKey.trim().length > 0) {
        setLLMConfig(apiKey, provider);
    } else {
        currentProvider = provider;
    }

    const systemPrompt = getSystemInstruction(language);

    const prompt = `
    Startup: "${companyName}" (${industry}).
    Product: "${productName}".
    Description: "${productDesc}".
    CEO Profile: ${ceo.name} (${ceo.gender}). Interests: ${ceo.interests.join(', ')}.
    
    Generate market context for 2024-2025.
    
    Output format (JSON):
    {
      "marketContext": "Market trends description (max 2 sentences)",
      "competitorName": "Competitor Name",
      "initialFeedback": "Advice for CEO",
      "initialProductAnalysis": "Short product market fit analysis"
    }
    
    IMPORTANT: All text fields must be in ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
  `;

    try {
        return await callAIWithRetry(() => generateContentJSON<InitGameResponse>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    marketContext: { type: Type.STRING },
                    competitorName: { type: Type.STRING },
                    initialFeedback: { type: Type.STRING },
                    initialProductAnalysis: { type: Type.STRING }
                },
                required: ['marketContext', 'competitorName', 'initialFeedback', 'initialProductAnalysis']
            },
            jsonKeys: ['marketContext', 'competitorName', 'initialFeedback', 'initialProductAnalysis']
        }));
    } catch (error: any) {
        console.error("Error initializing game:", error);
        throw error;
    }
};

// --- CONTRACTS GENERATION ---
export const generateContracts = async (industry: Industry, reputation: number, language: Language): Promise<Contract[]> => {
    const systemPrompt = getSystemInstruction(language);

    const difficultyMultiplier = 1 + (reputation / 100);
    const rewardMultiplier = 1 + (reputation / 50);

    const prompt = `
        Industry: ${industry}. Reputation: ${reputation}/100.
        Generate 3 outsourcing contracts (jobs) for this startup.
        
        Logic:
        - Higher reputation = Higher Reward, Higher Difficulty.
        - Difficulty is approximate skill points needed per week.
        - Total Effort = Difficulty * Weeks.
        - Penalty is usually 20-50% of Reward or reputation loss.
        
        Return JSON Array.
    `;

    try {
        const contracts = await callAIWithRetry(() => generateContentJSON<any[]>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        difficulty: { type: Type.INTEGER, description: "Skill points needed per week (e.g. 50-200)" },
                        deadlineWeeks: { type: Type.INTEGER, description: "1 to 8 weeks" },
                        reward: { type: Type.INTEGER },
                        penalty: { type: Type.INTEGER },
                        reqSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        minEmployees: { type: Type.INTEGER }
                    },
                    required: ["name", "description", "difficulty", "deadlineWeeks", "reward", "penalty", "reqSkills", "minEmployees"]
                }
            },
            jsonKeys: ["name", "description", "difficulty", "deadlineWeeks", "reward", "penalty"]
        }));

        if (!Array.isArray(contracts)) return [];

        return contracts.map((c, i) => ({
            ...c,
            id: `contract-${Date.now()}-${i}`,
            totalEffortRequired: c.difficulty * c.deadlineWeeks * 1.5, // Buffer
            currentEffort: 0,
            status: 'available',
            assignedEmployees: []
        }));
    } catch (e) {
        console.error("Contract gen error", e);
        return [];
    }
}

// --- INVESTOR GENERATION ---
export const generateInvestor = async (gameState: GameState, language: Language): Promise<Investor | null> => {
    const systemPrompt = getSystemInstruction(language);

    // Simple valuation logic for prompt context
    const estimatedValuation = (gameState.products.reduce((acc, p) => acc + p.revenue, 0) * 12 * 5) + (gameState.users * 10);

    const prompt = `
        Startup: ${gameState.companyName}. Industry: ${gameState.industry}.
        Stats: ${gameState.users} users, $${gameState.cash} cash.
        Est. Valuation: $${estimatedValuation}.
        
        Generate a Potential Investor persona who is interested in investing.
        They should have a style (Shark, Conservative, etc.) and an initial low-ball offer.
        
        Return JSON.
    `;

    try {
        const inv = await callAIWithRetry(() => generateContentJSON<any>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    style: { type: Type.STRING, enum: ['Aggressive', 'Conservative', 'Visionary', 'Shark'] },
                    description: { type: Type.STRING },
                    offerAmount: { type: Type.INTEGER },
                    equityDemanded: { type: Type.NUMBER },
                    valuation: { type: Type.INTEGER }
                },
                required: ["name", "style", "description", "offerAmount", "equityDemanded", "valuation"]
            },
            jsonKeys: ["name", "style", "description", "offerAmount", "equityDemanded"]
        }));

        return {
            ...inv,
            id: `inv-${Date.now()}`,
            status: 'new',
            patience: 3,
            lastResponse: "I'm listening. What's your counter?"
        };
    } catch (e) {
        return null;
    }
}

// --- NEGOTIATION ---
export const negotiateDeal = async (
    investor: Investor,
    playerMessage: string,
    language: Language
): Promise<{
    message: string,
    newOffer?: { amount: number, equity: number },
    isDeal: boolean,
    isWalkAway: boolean
}> => {
    const systemPrompt = getSystemInstruction(language);

    const prompt = `
        Roleplay Investor: ${investor.name} (${investor.style}).
        Current Offer: $${investor.offerAmount} for ${investor.equityDemanded}%.
        Startup Valuation: $${investor.valuation}.
        Patience Left: ${investor.patience} turns.
        
        Founder says: "${playerMessage}"
        
        React to the founder.
        - If the counter-offer is reasonable (within 20% of valuation), you might accept or adjust slightly.
        - If unreasonable, get angry or walk away.
        - If you agree, set isDeal = true.
        - If patience runs out or insult, set isWalkAway = true.
        
        Return JSON.
    `;

    try {
        return await callAIWithRetry(() => generateContentJSON<any>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    message: { type: Type.STRING },
                    newOffer: {
                        type: Type.OBJECT,
                        properties: { amount: { type: Type.INTEGER }, equity: { type: Type.NUMBER } },
                        nullable: true
                    },
                    isDeal: { type: Type.BOOLEAN },
                    isWalkAway: { type: Type.BOOLEAN }
                },
                required: ["message", "isDeal", "isWalkAway"]
            },
            jsonKeys: ["message", "newOffer", "isDeal", "isWalkAway"]
        }));
    } catch (e) {
        return { message: "Let's stick to the previous terms.", isDeal: false, isWalkAway: false };
    }
}

export const askInvestorAdvice = async (investors: Investor[], gameState: GameState, language: Language): Promise<string> => {
    if (investors.length === 0) return "You have no board members yet.";

    const systemPrompt = getSystemInstruction(language);
    const names = investors.map(i => i.name).join(", ");

    const prompt = `
        Board Members: ${names}.
        Company: ${gameState.companyName}. Cash: ${gameState.cash}. Users: ${gameState.users}.
        
        Give a short, strategic advice from the board's perspective to the CEO.
        Return JSON { advice: string }
    `;

    try {
        const res = await callAIWithRetry(() => generateContentJSON<{ advice: string }>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            jsonKeys: ["advice"]
        }));
        return res.advice;
    } catch {
        return "Focus on growth.";
    }
}


// --- HR ---
export const generateCandidates = async (industry: Industry, turn: number, jobDescription: string, budget: number, language: Language): Promise<Candidate[]> => {
    const systemPrompt = getSystemInstruction(language);

    const prompt = `
      Role: Witty Recruiter for ${industry}.
      Job Desc: "${jobDescription || 'Need talent'}"
      Target Monthly Salary Offer: $${budget}
      
      NAMING & PERSONALITY (CRITICAL):
      - Names should be realistic for ${language === 'vi' ? 'Vietnam' : 'International context'} but with a touch of wit or memorability.
      - Examples (VI): "Nam 'Bug-Hunter' Trần", "Linh 'Deadline-Dancer' Hoàng", "Minh 'Git-Fail' Phạm".
      - Examples (EN): "Sam 'Legacy-Code' Smith", "Sarah 'Vector' Jones", "Mike 'Deadline' Miller".
      - Trait/Quirk should be funny and startup-related.
      
      CRITICAL SKILLS & STATS RULES:
      - Core Skills (technical, creative, social, critical): 0-100.
      - Pro Stats (productivity, accuracy, reliability, growthPotential): 0-100.
      - Expected Salary should be close to $${budget} (±20%).
      - IF Salary < 1000: Junior. Average stats 20-40. High growthPotential.
      - IF Salary 1000-2500: Mid-Level. Average stats 40-70.
      - IF Salary 2500-4500: Senior. Average stats 70-85.
      - IF Salary > 4500: Expert. Average stats 85-100.
      - interviewNotes should HINT at their hidden traits (e.g., if trait is 'Toxic', note might say "A bit arrogant during technical questions.").
      
      Create 3 detailed candidate CVs adhering to these rules. All text must be in ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
      
      Output format (JSON Array of objects).
    `;

    try {
        const candidates = await callAIWithRetry(() => generateContentJSON<any[]>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING, enum: ['Developer', 'Designer', 'Marketer', 'Sales', 'Manager', 'Secretary', 'Tester'] },
                        level: { type: Type.STRING, enum: ['Junior', 'Senior', 'Lead', 'Expert'] },
                        skills: {
                            type: Type.OBJECT,
                            properties: {
                                technical: { type: Type.INTEGER },
                                creative: { type: Type.INTEGER },
                                social: { type: Type.INTEGER },
                                critical: { type: Type.INTEGER }
                            },
                            required: ['technical', 'creative', 'social', 'critical']
                        },
                        proStats: {
                           type: Type.OBJECT,
                           properties: {
                               productivity: { type: Type.INTEGER },
                               accuracy: { type: Type.INTEGER },
                               reliability: { type: Type.INTEGER },
                               growthPotential: { type: Type.INTEGER }
                           },
                           required: ['productivity', 'accuracy', 'reliability', 'growthPotential']
                        },
                        hiddenTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                        specificSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        expectedSalary: { type: Type.INTEGER },
                        hireCost: { type: Type.INTEGER },
                        bio: { type: Type.STRING },
                        quirk: { type: Type.STRING },
                        education: { type: Type.STRING },
                        experienceYears: { type: Type.INTEGER },
                        interviewNotes: { type: Type.STRING }
                    },
                    required: ['name', 'role', 'level', 'skills', 'proStats', 'hiddenTraits', 'specificSkills', 'expectedSalary', 'hireCost', 'bio', 'quirk', 'education', 'experienceYears', 'interviewNotes']
                }
            },
            jsonKeys: ['name', 'role', 'level', 'skills', 'proStats', 'expectedSalary', 'hireCost', 'bio']
        }));

        if (!Array.isArray(candidates)) return [];

        return candidates.map((c: any, index: number) => ({
            ...c,
            id: `cand-${Date.now()}-${index}`,
            salary: c.expectedSalary, // Default to expected, player can negotiate later if implemented
            revealedTraits: [],
            isReferenceChecked: false,
            education: c.education || "Self-taught",
            experienceYears: c.experienceYears !== undefined ? c.experienceYears : 1,
            interviewNotes: c.interviewNotes || "Candidate seemed eager."
        }));

    } catch (error) {
        // Fallback based on budget
        const fallbackLevel = budget < 1000 ? 'Junior' : budget > 3000 ? 'Senior' : 'Junior';
        const fallbackValue = budget < 1000 ? 35 : budget > 3000 ? 85 : 55;

        return [
            {
                id: `fallback-1`,
                name: "Dev Dave 'Fallback'",
                role: 'Developer',
                level: fallbackLevel,
                skills: { technical: fallbackValue, creative: fallbackValue, social: 30, critical: 40 },
                proStats: { productivity: fallbackValue, accuracy: fallbackValue, reliability: 50, growthPotential: 80 },
                specificSkills: ['HTML', 'CSS'],
                salary: Math.floor(budget * 0.9),
                expectedSalary: Math.floor(budget * 0.9),
                hiddenTraits: ['Team Player'],
                revealedTraits: [],
                isReferenceChecked: false,
                hireCost: 300,
                bio: "Fallback candidate. Servers are busy.",
                quirk: "Codes with 1 hand.",
                education: "Online Course",
                experienceYears: 1,
                interviewNotes: "Available immediately."
            }
        ];
    }
};

export const generateInterviewData = async (candidate: Candidate, language: Language): Promise<InterviewData> => {
    const systemPrompt = getSystemInstruction(language);
    
    // Pick an unknown trait to base the question on
    const unknownTraits = candidate.hiddenTraits.filter(t => !candidate.revealedTraits.includes(t));
    const targetTrait = unknownTraits.length > 0 ? unknownTraits[Math.floor(Math.random() * unknownTraits.length)] : candidate.hiddenTraits[0];

    const prompt = `
      Candidate: ${candidate.name} (${candidate.role}, ${candidate.level}).
      Personality Traits (Hidden): ${candidate.hiddenTraits.join(', ')}.
      Target Trait to Reveal: "${targetTrait}".
      
      TASK:
      1. Create a "Behavioral Interview Question" that an employer would ask to probe if a person has the "${targetTrait}" trait.
      2. Create a "Realistic Roleplay Response" from ${candidate.name} that HINTS at the trait "${targetTrait}" without explicitly naming it. 
         (e.g., if trait is 'Lazy', they might mention "I prefer tasks that don't require too much over-exertion.").
      3. Create 4 "Interpretations" (Interpretations) for the user to pick from. 
         - ONE interpretation must correctly identify the trait as "${targetTrait}".
         - THREE should be plausible but incorrect interpretations (based on other typical traits).
      
      OUTPUT FORMAT (JSON):
      {
        "question": "The question from employer",
        "candidateResponse": "The candidate's answer",
        "options": [
          { "trait": "Trait Name", "interpretation": "Short explanation of why this trait fits the answer" }
        ],
        "correctTrait": "The exact English trait key (camelCase) that is the correct answer"
      }
      
      CRITICAL: All text (question, response, interpretation) must be in ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
      Keep the trait keys (in "trait" and "correctTrait") in English (camelCase).
    `;

    try {
        return await callAIWithRetry(() => generateContentJSON<InterviewData>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    candidateResponse: { type: Type.STRING },
                    options: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                trait: { type: Type.STRING },
                                interpretation: { type: Type.STRING }
                            },
                            required: ["trait", "interpretation"]
                        },
                        minItems: 4,
                        maxItems: 4
                    },
                    correctTrait: { type: Type.STRING }
                },
                required: ["question", "candidateResponse", "options", "correctTrait"]
            },
            jsonKeys: ["question", "candidateResponse", "options", "correctTrait"]
        }));
    } catch (error) {
        // Fallback
        return {
            question: "Tell me about your work ethic.",
            candidateResponse: "I just do what's expected of me, nothing more, nothing less.",
            options: [
                { trait: "quietQuitter", interpretation: "Only does the bare minimum." },
                { trait: "diligent", interpretation: "Hardworking and dedicated." },
                { trait: "ambitious", interpretation: "Always seeking growth." },
                { trait: "loyal", interpretation: "Stays with the company." }
            ],
            correctTrait: "quietQuitter"
        };
    }
}

// --- Pitching Logic ---

export interface PitchResult {
    accepted: boolean;
    valuation: number;
    equityDemanded: number; // %
    investmentAmount: number;
    investorFeedback: string;
}

export const evaluatePitch = async (gameState: GameState, fundingRound: string, language: Language): Promise<PitchResult> => {
    const systemPrompt = getSystemInstruction(language);

    const portfolio = gameState.products.map(p =>
        `- ${p.name} (${p.stage}): Qual ${p.quality}/100, Users ${p.users}, Rev $${p.revenue}/mo. ${p.activeFeedback[0] || ''}`
    ).join('\n');

    const prompt = `
        Role: Tough VC (Shark Tank style).
        Startup: "${gameState.companyName}". Round: "${fundingRound}".
        
        STATS:
        - Cash: $${gameState.cash}
        - Users: ${gameState.users}
        - Team: ${gameState.employees.length}.
        
        PRODUCTS:
        ${portfolio || "No products."}
        
        Decide investment.
        Rules:
        - Concept/MVP demanding Series A/B -> Reject.
        - Low users, 0 revenue -> Low valuation.
        - Good product (>80 Qual) -> Fair deal.
        
        Output JSON object with keys: accepted, valuation, equityDemanded, investmentAmount, investorFeedback.
        IMPORTANT: 'equityDemanded' must be a NUMBER representing percentage (e.g. 10 for 10%, NOT 0.1).
    `;

    try {
        return await callAIWithRetry(() => generateContentJSON<PitchResult>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    accepted: { type: Type.BOOLEAN },
                    valuation: { type: Type.INTEGER },
                    equityDemanded: { type: Type.NUMBER },
                    investmentAmount: { type: Type.INTEGER },
                    investorFeedback: { type: Type.STRING }
                },
                required: ["accepted", "valuation", "equityDemanded", "investmentAmount", "investorFeedback"]
            },
            jsonKeys: ["accepted", "valuation", "equityDemanded", "investmentAmount", "investorFeedback"]
        }));
    } catch (e) {
        return { accepted: false, valuation: 0, equityDemanded: 0, investmentAmount: 0, investorFeedback: "Investors are busy (Connection Error)." };
    }
};

// --- Turn Processing ---

export const processTurn = async (
    gameState: GameState,
    decisions: PlayerDecisions,
    burnRate: number,
    language: Language
): Promise<SimulationResult> => {
    const systemPrompt = getSystemInstruction(language);

    // Prepare Product Context
    const productsContext = gameState.products.map(p => {
        const team = gameState.employees.filter(e => e.assignedProductId === p.id);
        const devPower = team.filter(e => e.role === 'Developer').reduce((sum, e) => sum + (e.skills?.technical || 0), 0);
        return {
            id: p.id,
            name: p.name,
            stage: p.stage,
            currentStats: { quality: p.quality, bugs: p.bugs, users: p.users },
            devPower
        };
    });

    const marketingCost = MARKETING_COSTS[decisions.marketingFocus] || 0;

    const prompt = `
    Week ${gameState.turn}. Stage: ${gameState.stage}. 
    Market Condition: ${gameState.marketCondition}. (BULL = Growth boost, BEAT = Slump, NEUTRAL = Normal).
    
    FACILITIES & PERKS (Passive Buffs):
    ${gameState.facilities.filter(f => f.level > 1).map(f => `- ${f.name} (Lvl ${f.level}): ${f.benefit}`).join('\n')}

    PRODUCTS & MODULES:
    ${gameState.products.map(p => `
      Product: ${p.name} (${p.stage})
      Stats: Quality ${p.quality}, Bugs ${p.bugs}, TechDebt ${p.techDebt}/100
      Modules: ${p.modules.map(m => `- ${m.name} (Req: ${m.requiredCoreSkill}, Progress: ${m.progress}%, Assigned: ${m.assignedEmployeeId || 'None'})`).join('\n')}
      Assigned Team: ${gameState.employees.filter(e => e.assignedProductId === p.id).map(e => `${e.name} (${e.role}, Skills: [T:${e.skills?.technical} C:${e.skills?.creative} S:${e.skills?.social} Cr:${e.skills?.critical}], ProStats: [Prod:${e.proStats?.productivity} Acc:${e.proStats?.accuracy} Rel:${e.proStats?.reliability} Gro:${e.proStats?.growthPotential}], Traits: ${e.hiddenTraits?.join('|')})`).join(', ')}
    `).join('\n')}
    
    MANAGEMENT DECISIONS:
    - Work Mode: ${decisions.workMode} (Standard/Crunch/Leisure)
    - Welfare Level: ${decisions.welfareLevel} (Minimal/Standard/Premium)
    - Mkt Focus: ${decisions.marketingFocus} (Cost: $${marketingCost})
    - R&D Focus: ${decisions.rdFocus}
    - Strategy Note: ${decisions.strategyNote}
    
    SIMULATION RULES:
    1. PROGRESS & PRO STATS: Progress depends on specific skills AND Pro Stats (Productivity, Accuracy).
       - Accuracy directly counters Bugs. Reliability counters Tech Debt.
       - Crunch Mode = +50% progress but high Tech Debt, high Stress, and -Health.
       - Leisure Mode = -30% progress but -Stress, +Health, +Skill XP.
    2. SYNERGY ENGINE (Team Dynamics):
       - Mentoring (Expert/Senior + Junior on same product) boosts Junior's stats.
       - Clashing Traits (e.g., multiple "Solo Carry") reduce team productivity and morale.
    3. HYPER-REALISM (Life Events & Headhunting):
       - Randomly trigger Life Events (e.g., "Sick leave", "Family emergency") -> sets leaveTurns: 1-2.
       - High skill, low loyalty employees might get headhuntOffer: true.
       - If Health drops < 30, force Sick Leave.
    4. GENERAL: Tech Debt > 60 reduces weekly progress. Bugs hurt growth.
    
    OUTPUT: Provide detailed updates, including \`employeeUpdates\` for specific changes to individuals (health, stress, life events, headhunting).
    Return JSON.
    
    CRITICAL: All narrative, feedback, and reports must be in ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}. Do not mix languages.
  `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            narrative: { type: Type.STRING },
            cashChange: { type: Type.INTEGER },
            userChange: { type: Type.INTEGER },
            moraleChange: { type: Type.INTEGER },
            productUpdates: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        productId: { type: Type.STRING },
                        devProgressChange: { type: Type.INTEGER },
                        qualityChange: { type: Type.INTEGER },
                        bugChange: { type: Type.INTEGER },
                        techDebtChange: { type: Type.INTEGER },
                        userChange: { type: Type.INTEGER },
                        revenueChange: { type: Type.INTEGER },
                        moduleUpdates: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    moduleId: { type: Type.STRING },
                                    progressChange: { type: Type.INTEGER }
                                },
                                required: ["moduleId", "progressChange"]
                            }
                        },
                        newFeedback: { type: Type.STRING, nullable: true }
                    },
                    required: ["productId", "devProgressChange", "qualityChange", "bugChange", "techDebtChange", "userChange", "revenueChange"]
                }
            },
            employeeUpdates: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        employeeId: { type: Type.STRING },
                        healthChange: { type: Type.INTEGER },
                        stressChange: { type: Type.INTEGER },
                        reliabilityChange: { type: Type.INTEGER },
                        productivityChange: { type: Type.INTEGER },
                        headhuntOffer: { type: Type.BOOLEAN },
                        lifeEvent: { type: Type.STRING },
                        leaveTurns: { type: Type.INTEGER }
                    },
                    required: ["employeeId"]
                }
            },
            secretaryReport: { type: Type.STRING, nullable: true },
            randomEvent: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['crisis', 'opportunity', 'dilemma'] },
                    options: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                label: { type: Type.STRING },
                                risk: { type: Type.STRING }
                            },
                            required: ['label', 'risk']
                        }
                    }
                },
                required: ["title", "description", "type", "options"],
                nullable: true
            },
            skillXpEarned: {
                type: Type.OBJECT,
                properties: {
                    management: { type: Type.INTEGER },
                    tech: { type: Type.INTEGER },
                    charisma: { type: Type.INTEGER }
                },
                nullable: true
            }
        },
        required: ["narrative", "cashChange", "userChange", "moraleChange", "productUpdates"]
    };

    try {
        return await callAIWithRetry(() => generateContentJSON<SimulationResult>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: schema,
            jsonKeys: ["narrative", "cashChange", "userChange", "moraleChange", "productUpdates"]
        }));

    } catch (error) {
        console.error("Error processing turn:", error);
        // Fallback logic on error (Assume 0 revenue if AI fails, expense logic handled in App.tsx)
        return {
            narrative: language === 'vi' ? "Hệ thống đang quá tải... (Vẫn trừ chi phí cố định)" : "System overloaded... (Fixed costs deducted)",
            cashChange: 0,
            userChange: 0,
            moraleChange: -1,
            productUpdates: [],
            equityChange: 0,
            competitorUpdate: "",
            advice: "Try again later.",
            randomEvent: null
        };
    }
};

export const chatWithEmployee = async (employee: Employee, gameState: GameState, message: string, language: Language): Promise<string> => {
    const systemPrompt = getSystemInstruction(language);
    const prompt = `Roleplay employee ${employee.name} (${employee.role}). Boss asks: "${message}". Reply short. Return JSON: { response: string }`;
    try {
        const res = await callAIWithRetry(() => generateContentJSON<{ response: string }>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            jsonKeys: ['response']
        }));
        return res.response;
    } catch { return "..."; }
};

interface IntelResponse {
    content: string;
    source: string;
    reliability: number;
}

export const getAdvisorInsight = async (gameState: GameState, type: IntelType, language: Language): Promise<IntelResponse> => {
    const systemPrompt = getSystemInstruction(language);

    // More detailed prompt for better intelligence results
    const prompt = `
        Role: Elite Business Intelligence Consultant for Startup "${gameState.companyName}" in ${gameState.industry}.
        Task: Provide a "Top Secret" ${type} report.
        Context: Week ${gameState.turn}. Competitor: ${gameState.competitorName}.
        
        Requirements:
        - Be specific and actionable.
        - If MARKET: Mention a specific trend or user demand shift.
        - If COMPETITOR: Mention a specific move by ${gameState.competitorName} (e.g. new feature, scandal, pricing).
        - If INTERNAL: Mention a hidden inefficiency or morale booster.
        - Keep it under 60 words.
        - Tone: Professional, slightly confidential.
        
        Return JSON object:
        {
            "content": "The intelligence text...",
            "source": "e.g. 'Insider', 'Intercepted Email', 'Market Analyst'",
            "reliability": 85 (integer 0-100)
        }
    `;

    try {
        const res = await callAIWithRetry(() => generateContentJSON<IntelResponse>({
            systemInstruction: systemPrompt,
            prompt: prompt,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    content: { type: Type.STRING },
                    source: { type: Type.STRING },
                    reliability: { type: Type.INTEGER }
                },
                required: ['content', 'source', 'reliability']
            },
            jsonKeys: ['content', 'source', 'reliability']
        }));
        return res;
    } catch {
        return {
            content: "Network compromised. Data unavailable.",
            source: "Unknown",
            reliability: 0
        };
    }
};
