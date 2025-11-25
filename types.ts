export enum AgentId {
    ROXY = 'ROXY',
    ECHO = 'ECHO',
    LEXI = 'LEXI',
    GLITCH = 'GLITCH',
    LUMI = 'LUMI'
}

export interface Agent {
    id: AgentId;
    name: string;
    title: string;
    description: string;
    color: string;
    avatar: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp?: number;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    assignee: AgentId;
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high';
    estimatedTime: string;
    createdAt: string;
    completedAt?: string;
}

export interface BusinessContext {
    founderName: string;
    companyName: string;
    industry: string;
    description: string;
    goals: string[];
    monthlyRevenue?: number;
    monthlyBurn?: number;
    currentCash?: number;
    currency?: string;
    growthRate?: number;
}

// THE CODEX (BRAND DNA)
export interface BrandTone {
    formalVsCasual: number;
    playfulVsSerious: number;
    modernVsClassic: number;
}

export interface TargetPersona {
    name: string;
    description: string;
    painPoints: string[];
}

export interface BrandDNA {
    tone: BrandTone;
    personas: TargetPersona[];
    coreValues: string[];
    bannedWords: string[];
}

// THE STALKER (COMPETITOR INTEL)
export interface CompetitorReport {
    id: string;
    competitorName: string;
    threatLevel: 'Low' | 'Medium' | 'High' | 'Existential' | 'CRITICAL';
    missionBrief: string;
    intel: string[];
    vulnerabilities: string[];
    strengths: string[];
    metrics: {
        innovation: number;
        marketPresence: number;
        ux: number;
        pricing: number;
        velocity: number;
    };
    generatedAt: string;
}

// THE WAR ROOM (DEBATE)
export interface WarRoomEntry {
    speaker: AgentId;
    text: string;
}

export interface WarRoomResponse {
    dialogue: WarRoomEntry[];
    consensus: string;
    actionPlan: string[];
}

export interface SavedWarRoomSession extends WarRoomResponse {
    id: string;
    topic: string;
    timestamp: string;
}

// THE INCINERATOR (IDEA ROAST)
export interface IncineratorResponse {
    roastSummary: string;
    survivalScore: number; // 0-100
    feedback: string[];
    rewrittenContent: string;
}

// THE SIGNAL TOWER (DAILY BRIEFING)
export interface DailyBriefing {
    date: string;
    summary: string;
    focusPoints: string[];
    threatAlerts: string[];
    motivationalQuote: string;
}

// THE FORGE (PITCH DECK)
export interface Slide {
    title: string;
    keyPoint: string;
    content: string[];
    visualIdea: string;
}

export interface PitchDeck {
    id: string;
    title: string;
    slides: Slide[];
    generatedAt: string;
}

// THE VAULT (FINANCIALS & ASSETS)
export interface FinancialContext {
    monthlyRevenue: number;
    monthlyBurn: number;
    currentCash: number;
    currency?: string;
    growthRate?: number;
}

export interface FinancialAudit {
    runwayScore: number; // 0-100
    verdict: string;
    strategicMoves: string[];
    riskFactors: string[];
}

export type ContactCategory = 'lead' | 'investor' | 'partner' | 'media' | 'vip';

export interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    notes: string;
    status?: 'Lead' | 'Contacted' | 'Negotiating' | 'Closed';
    category: ContactCategory;
    email?: string;
    lastContact?: string;
}

export interface NegotiationPrep {
    strategy: string;
    leveragePoints: string[];
    psychologicalProfile: string;
    openingLine: string;
}

// THE MATRIX (TECH STACK)
export interface TechStackAudit {
    score: number;
    verdict: string;
    pros: string[];
    cons: string[];
    recommendations: string[];
}

export interface CodeSnippet {
    language: string;
    code: string;
    explanation: string;
}

export interface SavedCodeSnippet extends CodeSnippet {
    id: string;
    title: string;
    timestamp: string;
}

// THE SIMULATOR (SCENARIO PLANNING)
export interface SimulationResult {
    id: string;
    query: string;
    timestamp: string;
    likelyCase: ScenarioOutcome;
    bestCase: ScenarioOutcome;
    worstCase: ScenarioOutcome;
    strategicAdvice: string;
}

export interface ScenarioOutcome {
    title: string;
    probability: number;
    timeline: string;
    description: string;
    keyEvents: string[];
}

// THE WATCHTOWER (LEGAL)
export type LegalDocType = 'NDA' | 'Contract' | 'Terms of Service' | 'Privacy Policy';

export interface LegalAnalysis {
    safetyScore: number; // 0-100
    verdict: string;
    criticalRisks: string[];
    suggestions: string[];
}

// THE BOARDROOM (PERFORMANCE REVIEW)
export interface DepartmentGrade {
    agentId: AgentId;
    department: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    score: number; // 0-100
    summary: string;
    keyIssue: string;
}

export interface BoardMeetingReport {
    id: string;
    date: string;
    ceoScore: number; // 0-100
    executiveSummary: string;
    grades: DepartmentGrade[];
    consensus: string;
}

// THE PIVOT (BLUE OCEAN STRATEGY)
export interface MarketGap {
    name: string;
    description: string;
    competitionScore: number; // 0-100 (Low is better)
    profitabilityScore: number; // 0-100 (High is better)
    soloFitScore: number; // 0-100 (High is better)
    whyItWorks: string;
    firstStep: string;
}

export interface PivotAnalysis {
    currentIndustry: string;
    gaps: MarketGap[];
}

// THE SANCTUARY (MENTAL OPS)
export interface MentalState {
    mood: string;
    stressLevel: number; // 0-100
    primaryBlocker: string;
}

export interface MentalCoaching {
    reframing: string;
    stoicQuote: string;
    actionableStep: string;
    breathingExercise: boolean;
}

// THE ARCHITECT (PRODUCT SPECS)
export interface ProductFeature {
    name: string;
    userStory: string; // "As a user I want..."
    acceptanceCriteria: string[];
    techNotes: string;
}

export interface ProductSpec {
    id: string;
    featureName: string;
    summary: string;
    features: ProductFeature[];
    dataModel: string[]; // Rough schema description
    generatedAt: string;
}

// THE ACADEMY (TRAINING SIM)
export interface RoleplayScenario {
    id: string;
    title: string;
    description: string;
    difficulty: 'ROOKIE' | 'VETERAN' | 'NIGHTMARE';
    opponentRole: string;
    opponentPersona: string;
    objective: string;
}

export interface RoleplayTurn {
    role: 'user' | 'opponent';
    text: string;
    timestamp?: number;
}

export interface RoleplayFeedback {
    score: number;
    strengths: string[];
    weaknesses: string[];
    proTip: string;
}

// THE TRIBE (COMMUNITY)
export interface CommunityManifesto {
    title: string;
    enemy: string; // The "Anti-Persona" or status quo
    belief: string; // The core belief
    tagline: string;
}

export interface CommunityRitual {
    name: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Onboarding';
    description: string;
    action: string;
}

export interface TribeBlueprint {
    manifesto: CommunityManifesto;
    rituals: CommunityRitual[];
    engagementLoops: string[];
    id: string;
    generatedAt: string;
}

// THE AMPLIFIER (CONTENT REPURPOSING)
export interface ContentAmplification {
    id: string;
    sourceTitle: string;
    twitterThread: string[]; // Array of tweets
    linkedinPost: string;
    tiktokScript: string; // Visual + Audio direction
    newsletterSection: string;
    generatedAt: string;
}

export interface SocialStrategy {
    id: string;
    pillars: { title: string; description: string; }[];
    cadence: string;
    personaTactics: { persona: string; tactic: string; }[];
    sampleHooks: string[];
    generatedAt: string;
}

// THE LAUNCHPAD (GTM)
export interface LaunchEvent {
    day: string; // e.g. "T-Minus 7"
    title: string;
    description: string;
    owner: AgentId;
    channel: string;
}

export interface LaunchStrategy {
    id: string;
    productName: string;
    launchDate: string;
    phases: {
        name: string; // Pre-Launch, Liftoff, Orbit
        events: LaunchEvent[];
    }[];
    generatedAt: string;
}

// THE SCOUT (HR & DELEGATION)
export interface JobDescription {
    id: string;
    roleTitle: string;
    hook: string;
    responsibilities: string[];
    requirements: string[];
    perks: string[];
    generatedAt: string;
}

export interface InterviewQuestion {
    question: string;
    whatToLookFor: string; // The "Green Flag"
    redFlag: string;
}

export interface InterviewGuide {
    id: string;
    roleTitle: string;
    questions: InterviewQuestion[];
    generatedAt: string;
}

export interface SOPStep {
    step: number;
    action: string;
    details: string;
}

export interface SOP {
    id: string;
    taskName: string;
    goal: string;
    steps: SOPStep[];
    successCriteria: string;
    generatedAt: string;
}

export interface UserProgress {
    level: number;
    currentXP: number;
    nextLevelXP: number;
    rankTitle: string;
    totalActions: number;
    achievements: string[];
}

export interface CreativeAsset {
    id: string;
    type: 'image' | 'copy' | 'video_script';
    content: string;
    prompt: string;
}

// THE ARCHITECT (PRODUCT SPECS)
export interface ProductFeature {
    name: string;
    userStory: string; // "As a user I want..."
    acceptanceCriteria: string[];
    techNotes: string;
}

export interface ProductSpec {
    id: string;
    featureName: string;
    summary: string;
    features: ProductFeature[];
    dataModel: string[]; // Rough schema description
    generatedAt: string;
}

// THE ACADEMY (TRAINING SIM)
export interface RoleplayScenario {
    id: string;
    title: string;
    description: string;
    difficulty: 'ROOKIE' | 'VETERAN' | 'NIGHTMARE';
    opponentRole: string;
    opponentPersona: string;
    objective: string;
}

export interface RoleplayTurn {
    role: 'user' | 'opponent';
    text: string;
    timestamp?: number;
}

export interface RoleplayFeedback {
    score: number;
    strengths: string[];
    weaknesses: string[];
    proTip: string;
}

// THE TRIBE (COMMUNITY)
export interface CommunityManifesto {
    title: string;
    enemy: string; // The "Anti-Persona" or status quo
    belief: string; // The core belief
    tagline: string;
}

export interface CommunityRitual {
    name: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Onboarding';
    description: string;
    action: string;
}

export interface TribeBlueprint {
    manifesto: CommunityManifesto;
    rituals: CommunityRitual[];
    engagementLoops: string[];
    id: string;
    generatedAt: string;
}

// THE AMPLIFIER (CONTENT REPURPOSING)
export interface ContentAmplification {
    id: string;
    sourceTitle: string;
    twitterThread: string[]; // Array of tweets
    linkedinPost: string;
    tiktokScript: string; // Visual + Audio direction
    newsletterSection: string;
    generatedAt: string;
}

export interface SocialStrategy {
    id: string;
    pillars: { title: string; description: string; }[];
    cadence: string;
    personaTactics: { persona: string; tactic: string; }[];
    sampleHooks: string[];
    generatedAt: string;
}

// THE LAUNCHPAD (GTM)
export interface LaunchEvent {
    day: string; // e.g. "T-Minus 7"
    title: string;
    description: string;
    owner: AgentId;
    channel: string;
}

export interface LaunchStrategy {
    id: string;
    productName: string;
    launchDate: string;
    phases: {
        name: string; // Pre-Launch, Liftoff, Orbit
        events: LaunchEvent[];
    }[];
    generatedAt: string;
}

// THE SCOUT (HR & DELEGATION)
export interface JobDescription {
    id: string;
    roleTitle: string;
    hook: string;
    responsibilities: string[];
    requirements: string[];
    perks: string[];
    generatedAt: string;
}

export interface InterviewQuestion {
    question: string;
    whatToLookFor: string; // The "Green Flag"
    redFlag: string;
}

export interface InterviewGuide {
    id: string;
    roleTitle: string;
    questions: InterviewQuestion[];
    generatedAt: string;
}

export interface SOPStep {
    step: number;
    action: string;
    details: string;
}

export interface SOP {
    id: string;
    taskName: string;
    goal: string;
    steps: SOPStep[];
    successCriteria: string;
    generatedAt: string;
}

export interface UserProgress {
    level: number;
    currentXP: number;
    nextLevelXP: number;
    rankTitle: string;
    totalActions: number;
    achievements: string[];
}

export interface CreativeAsset {
    id: string;
    type: 'image' | 'copy' | 'video_script';
    content: string;
    prompt: string;
    style?: string;
    imageBase64?: string;
    generatedAt: string;
}

export enum Type {
    STRING = "STRING",
    NUMBER = "NUMBER",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT"
}

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'xp';
    title: string;
    message: string;
    xpAmount?: number;
    newProgress?: UserProgress;
}

export interface MarketPulse {
    content: string;
    sources: { title: string; url: string }[];
}