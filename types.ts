
export enum Industry {
  TECH = 'Technology (SaaS)',
  HEALTH = 'Health & BioTech',
  AI = 'Artificial Intelligence',
  EDTECH = 'Education Tech',
  FMCG = 'Consumer Goods (FMCG)'
}

export type Language = 'vi' | 'en';

export type LLMProvider = 'gemini' | 'openai' | 'deepseek';

export enum GameStage {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum IntelType {
  MARKET = 'MARKET',
  COMPETITOR = 'COMPETITOR',
  INTERNAL = 'INTERNAL'
}

export enum MarketCondition {
  BULL = 'BULL',
  BEAR = 'BEAR',
  NEUTRAL = 'NEUTRAL'
}

export interface AICompanion {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string; 
}

export interface IntelItem {
  id: string;
  type: IntelType;
  title: string;
  content: string;
  cost: number;
  source?: string;
  reliability?: number; // 0-100
}

// --- NEW TYPES FOR ADVANCED MANAGEMENT ---

export interface Employee {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Marketer' | 'Sales' | 'Manager' | 'Secretary' | 'Tester';
  level: 'Junior' | 'Senior' | 'Lead' | 'Expert';
  skill: number; // 0-100
  specificSkills: string[]; 
  salary: number; 
  morale: number; 
  quirk?: string; 
  education?: string;
  backgroundStory?: string;
  
  // Stats
  stress: number; 
  loyalty: number; 
  traits: string[]; 
  assignedProductId?: string | null; // Link to a product
  assignedContractId?: string | null; // Link to a contract
  
  // Big Update 1.0 - 3D Office & Culture
  personality?: string;
  position3D?: [number, number, number];
}

export interface Candidate {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Marketer' | 'Sales' | 'Manager' | 'Secretary' | 'Tester';
  level: 'Junior' | 'Senior' | 'Lead' | 'Expert';
  skill: number;
  specificSkills: string[]; 
  salary: number;
  bio: string; 
  matchAnalysis: string; 
  quirk: string; 
  hireCost: number; 
  education: string;
  experienceYears: number;
  interviewNotes: string; 
}

export enum ProductStage {
  CONCEPT = 'Concept', // Needs Design
  MVP = 'MVP Development', // Needs Dev
  ALPHA = 'Alpha Testing', // Needs Tester
  RELEASE = 'Market Release', // Needs Marketing
  GROWTH = 'Scaling', // Needs All
  MATURE = 'Mature' // Needs Maintenance
}

export interface ProductModule {
  id: string;
  name: string;
  requiredSkill: string;
  progress: number;
  quality: number;
  assignedEmployeeId: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  stage: ProductStage;
  
  // Progress & Quality
  developmentProgress: number; 
  quality: number; 
  marketFit: number; 
  bugs: number;
  techDebt: number; // New: 0-100 scale
  
  // Modules (New)
  modules: ProductModule[];
  
  // Metrics
  users: number;
  revenue: number;
  
  // Feedback
  activeFeedback: string[]; 
}

// --- CONTRACTS SYSTEM ---
export interface Contract {
  id: string;
  name: string;
  description: string;
  difficulty: number; // Required total skill points per turn to progress well
  totalEffortRequired: number; // Total points to complete
  currentEffort: number;
  deadlineWeeks: number; // Turns remaining
  reward: number;
  penalty: number; // Reputation loss or money
  reqSkills: string[]; // e.g., ["React", "Python"]
  status: 'available' | 'active' | 'completed' | 'failed';
  minEmployees: number;
}

// --- INVESTOR SYSTEM ---
export interface Investor {
  id: string;
  name: string;
  style: 'Aggressive' | 'Conservative' | 'Visionary' | 'Shark';
  description: string;
  status: 'new' | 'negotiating' | 'partner' | 'rejected';
  
  // For Negotiation
  offerAmount: number;
  equityDemanded: number; // %
  valuation: number;
  
  // Negotiation State
  patience: number; // 0-3 turns
  lastResponse?: string;
}

export interface Facility {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  description: string;
  costToUpgrade: number;
  maintenanceCost: number;
  benefit: string; 
  statEffect: 'max_employees' | 'max_users' | 'efficiency';
  value: number; 
}

export interface PlayerSkills {
  management: number; 
  tech: number; 
  charisma: number; 
}

export interface CEODetails {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  interests: string[];
  background?: string;
}

// --- EVENT SYSTEM ---

export interface EventOption {
  label: string;
  risk: string; 
}

export interface InteractiveEvent {
  title: string;
  description: string;
  type: 'opportunity' | 'crisis' | 'dilemma';
  options: EventOption[];
}

// ----------------------------------------

export enum WorkMode {
  CRUNCH = 'Crunch Mode',
  STANDARD = 'Standard',
  LEISURE = 'Leisure/Learning'
}

export enum WelfareLevel {
  MINIMAL = 'Minimal',
  STANDARD = 'Standard',
  PREMIUM = 'Premium'
}

export interface PlayerDecisions {
  rdFocus: string; 
  marketingFocus: string; 
  strategyNote: string; 
  eventChoice: string | null; 
  workMode: WorkMode; // New
  welfareLevel: WelfareLevel; // New
}

export interface SimulationResult {
  narrative: string; 
  cashChange: number;
  userChange: number;
  moraleChange: number;
  equityChange: number;
  competitorUpdate: string;
  advice: string;
  randomEvent: InteractiveEvent | null;
  skillXpEarned?: {
    management?: number;
    tech?: number;
    charisma?: number;
  }
  decisions?: PlayerDecisions;
  secretaryReport?: string;
  
  // Updates for specific products
  productUpdates: {
      productId: string;
      devProgressChange: number;
      qualityChange: number;
      bugChange: number;
      techDebtChange: number; // New
      userChange: number;
      revenueChange: number;
      moduleUpdates?: { // New
          moduleId: string;
          progressChange: number;
      }[];
      newFeedback?: string;
  }[];

  // Contract Updates
  contractResults?: {
      contractId: string;
      status: 'progress' | 'completed' | 'failed';
      message: string;
  }[];
}

export interface GameState {
  companyName: string;
  ceo: CEODetails;
  industry: Industry;
  cash: number;
  users: number; // Total across all products
  morale: number; 
  productQuality: number; // Avg across products (Brand Image)
  marketShare: number; 
  equity: number;
  turn: number;
  reputation: number; // New: 0-100 score for contracts
  
  employees: Employee[];
  candidates: Candidate[]; 
  products: Product[]; // List of products
  contracts: Contract[]; // New: Contracts list
  investors: Investor[]; // New: Investors list
  facilities: Facility[];
  playerSkills: PlayerSkills;
  
  history: SimulationResult[];
  stage: GameStage;
  marketContext: string; 
  marketCondition: MarketCondition; // New
  competitorName: string;
  gameOverReason?: string;
  council: AICompanion[]; // New
}

export interface InitialGameStoryResponse {
  marketContext: string;
  competitorName: string;
  initialFeedback: string;
  initialProductAnalysis: string;
}

export const INITIAL_CASH = 10000;

// Defined explicitly to be shared between UI and Logic if needed
export const MARKETING_COSTS: Record<string, number> = {
    'Chạy quảng cáo Facebook/Google': 1500,
    'Content Marketing (SEO)': 500,
    'Thuê Influencer/KOL': 3000,
    'Tổ chức Event/Webinar': 2000,
    'Cold Emailing/Sales': 200
};

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'office',
    name: 'Home Office / Garage',
    level: 1,
    maxLevel: 5,
    description: 'Workspace', // Generic description, will be translated in UI
    costToUpgrade: 5000,
    maintenanceCost: 100, 
    benefit: 'Max 3 Employees',
    statEffect: 'max_employees',
    value: 3
  },
  {
    id: 'server',
    name: 'Shared Hosting',
    level: 1,
    maxLevel: 5,
    description: 'Basic Server',
    costToUpgrade: 2000,
    maintenanceCost: 50,
    benefit: 'Max 1,000 Users',
    statEffect: 'max_users',
    value: 1000
  }
];

export const INITIAL_SKILLS: PlayerSkills = {
  management: 1,
  tech: 1,
  charisma: 1
};
