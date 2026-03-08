
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

export interface EmployeeSkills {
  technical: number; // 0-100
  creative: number;  // 0-100
  social: number;    // 0-100
  critical: number;  // 0-100
}

export interface EmployeeProStats {
  productivity: number; // 0-100. Năng suất
  accuracy: number;     // 0-100. Độ chính xác (giảm bug)
  reliability: number;  // 0-100. Khả năng giữ phong độ
  growthPotential: number; // 0-100. Tiềm năng học hỏi
}

export interface Employee {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Marketer' | 'Sales' | 'Manager' | 'Secretary' | 'Tester';
  level: 'Junior' | 'Senior' | 'Lead' | 'Expert';
  
  // NEW: Multi-dimensional skills & stats
  skills: EmployeeSkills;
  proStats: EmployeeProStats;
  specificSkills: string[];
  
  salary: number;
  morale: number; // 0-100
  health: number; // 0-100 (New for Hyper-Realism)
  stress: number; // 0-100
  loyalty: number; // 0-100
  
  // NEW: Gen Z / Realism Vibe
  quirk?: string;
  education?: string;
  backgroundStory?: string;
  hiddenTraits: string[]; // Vd: 'Fast Learner', 'Toxic', 'Bug Crusher'
  headhuntStatus: 'none' | 'offered' | 'considering' | 'leaving';
  isOnLeave: boolean;
  leaveTurnsLeft: number;
  trialTurnsLeft?: number; // >0 means still on trial
  
  assignedProductId?: string | null;
  assignedContractId?: string | null;

  // 3D Office & Culture
  personality?: string;
  position3D?: [number, number, number];

  // Status & Assignments
  status?: 'idle' | 'working' | 'resting' | 'on_leave';
  assignedTo?: {
    type: 'product' | 'contract' | 'training';
    productId?: string;
    contractId?: string;
    moduleId?: string;
  } | null;
}

export interface Candidate {
  id: string;
  name: string;
  role: 'Developer' | 'Designer' | 'Marketer' | 'Sales' | 'Manager' | 'Secretary' | 'Tester';
  level: 'Junior' | 'Senior' | 'Lead' | 'Expert';
  
  skills: EmployeeSkills;
  proStats: EmployeeProStats;
  specificSkills: string[];
  
  salary: number;
  expectedSalary: number; // New for negotiation
  bio: string;
  quirk: string;
  hireCost: number;
  education: string;
  experienceYears: number;
  interviewNotes: string; // Hints about hidden traits
  
  // HR Gameplay
  hiddenTraits: string[];
  revealedTraits: string[]; // Traits discovered via Check Reference
  isReferenceChecked: boolean;
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
  requiredCoreSkill: 'technical' | 'creative' | 'social' | 'critical'; // Ràng buộc Kỹ năng chính
  minProStat?: { stat: 'productivity' | 'accuracy' | 'reliability' | 'growthPotential'; value: number }; // Ràng buộc Pro Stat
  progress: number;
  quality: number;
  bugs: number; // Tracking bugs per module
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
  statEffect: 'max_employees' | 'max_users' | 'efficiency' | 'productivity_boost' | 'reliability_boost' | 'stress_reduction'; // Thêm hiệu ứng thực tế
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

  // NEW: Thêm mảng update cho từng nhân viên từ AI (Synergy, Life Events, Headhunt)
  employeeUpdates?: {
      employeeId: string;
      healthChange?: number;
      stressChange?: number;
      reliabilityChange?: number;
      productivityChange?: number;
      headhuntOffer?: boolean;
      lifeEvent?: string; // e.g: "Sick leave", "Family emergency"
      leaveTurns?: number;
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

export const INITIAL_CASH = 50000;

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
    maxLevel: 10,
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
    maxLevel: 10,
    description: 'Basic Server',
    costToUpgrade: 2000,
    maintenanceCost: 50,
    benefit: 'Max 1,000 Users',
    statEffect: 'max_users',
    value: 1000
  },
  {
    id: 'pc',
    name: 'Standard Laptop',
    level: 1,
    maxLevel: 5,
    description: 'Developer PC',
    costToUpgrade: 1000,
    maintenanceCost: 20,
    benefit: 'PC Productivity',
    statEffect: 'productivity_boost',
    value: 0
  },
  {
    id: 'chair',
    name: 'Plastic Chair',
    level: 1,
    maxLevel: 5,
    description: 'Ergonomic Chair',
    costToUpgrade: 500,
    maintenanceCost: 10,
    benefit: 'Chair Reliability',
    statEffect: 'reliability_boost',
    value: 0
  },
  {
    id: 'coffee',
    name: 'Instant Coffee',
    level: 1,
    maxLevel: 5,
    description: 'Coffee Machine',
    costToUpgrade: 800,
    maintenanceCost: 15,
    benefit: 'Coffee Stress Reduction',
    statEffect: 'stress_reduction',
    value: 0
  }
];

export const INITIAL_SKILLS: PlayerSkills = {
  management: 1,
  tech: 1,
  charisma: 1
};
