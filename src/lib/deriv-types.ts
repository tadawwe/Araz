
export type MarketSymbol = {
  display_name: string;
  symbol: string;
  market_display_name: string;
  submarket_display_name: string;
  market?: string;
};

export type Tick = {
  quote: number;
  epoch: number;
  id: string;
};

export type TradeHistoryItem = {
  id: string;
  symbol: string;
  type: string;
  contract_type: string;
  entry_tick: number;
  exit_tick?: number;
  profit?: number;
  stake: number;
  status: 'open' | 'won' | 'lost' | 'nil';
  timestamp: number;
  entry_epoch: number;
  barrier?: number;
  martingale_level: number;
  dynamic_payout?: number;
  is_simulated?: boolean;
  is_virtual_trade?: boolean;
  contract_id?: string | number;
};

export type DerivAccount = {
  account_id: string;
  account_type: string;
  currency: string;
  balance: number;
  is_virtual: boolean;
  token?: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  accounts: DerivAccount[];
  activeAccountIndex: number;
  balance?: number;
  currency?: string;
  email?: string;
  crNumber?: string;
  isSimulated?: boolean;
  isVirtual?: boolean;
  token?: string;
  mode?: 'pat' | 'api';
};

export type StrategyType = 'even_odd' | 'over_under' | 'digit_match';

export type RobotId = 'ai_analyzer' | 'ai_trade' | 'over_under_magic' | 'digit_match' | 'continuity' | 'magic_box' | 'calculation_dex';

export type DiscoveredPattern = {
  sequence: string;
  occurrences: number;
  evenProb: number;
  oddProb: number;
  overProb: number;
  underProb: number;
  bestOutcome: string;
  confidence: number;
};

export type StrategyParams = {
  overBarrier: string;
  underBarrier: string;
  matchDigit: string;
  differDigit: string;
  differStrategy: 'static' | 'last_digit';
  differDigitsToTrade: string;
  differEntryTriggers: string;
  continuityContract: 'even_odd' | 'over_under';
  continuityStrategy: 'continuous' | 'pattern';
  continuityPattern1: string;
  continuityDirection1: string;
  continuityPattern2: string;
  continuityDirection2: string;
  matchStrategy: 'scanner' | 'input' | 'exit_digit';
  matchDigitsToTrade: string;
  matchEntryDigits: string;
  matchEntryCount: string;
  aiMissingDigitsCount: string;
  aiScannerMode: 'over_under' | 'even_odd';
  aiGreaterCount: string;
  aiLesserCount: string;
  magicMultiMarketEnabled: boolean;
  magicSelectedMarkets: string[];
  magicDominanceDiffThreshold: string;
  isN3MasterEnabled: boolean;
  dexTickCount: string;
  dexAnalysisMode: 'even_odd' | 'over_under';
  dexPatternMinLen: string;
  dexPatternMaxLen: string;
  dexTargetStreak: string;
  dexMatchDigit: string;
  dexDirection: 'even' | 'odd' | 'over' | 'under';
  dexBarrier: string;
  dexMatchPeakDigits: string;
};

export type ExecutionSettings = {
  stake: string;
  ticks: string;
  martingale: string;
  takeProfit: string;
  stopLoss: string;
  maxMartingale: string;
  virtualHook: string;
  lossHook: string;
  isVirtualHookEnabled: boolean;
  isLossHookEnabled: boolean;
  tradeOver: boolean;
  tradeUnder: boolean;
  consecutiveCount: string;
  delayTicks: string;
  virtualLoss: string;
  tickSample: string;
  digitsToAnalyze: string;
  singleMartingale: boolean;
  doubleMartingale?: boolean;
  isHedgeAdd_upEnabled: boolean;
  isHedgeAddUpEnabled?: boolean;
  isAddUpEnabled: boolean;
  isAddUpBothEnabled: boolean;
  isPartialAddUpEnabled: boolean;
  addUpSteps: string;
  addUpPercentage: string;
  isDivideMartingaleEnabled: boolean;
  isStepMartingaleEnabled: boolean;
  divideMartingaleSteps: string;
  entryDigits: string;
  continuityDiffThreshold: string;
  isAutoMartingaleEnabled: boolean;
  isHunterCountEnabled: boolean;
  hunterCount: string;
  isRecoveryDigitEnabled: boolean;
  overRecoveryBarrier: string;
  underRecoveryBarrier: string;
  isRecoveryBarrierEnabled: boolean;
  recoveryBarrierDirection: 'over' | 'under';
  recoveryBarrierValue: string;
};

export type BalanceOverride = {
  id: string;
  emailOrCr: string;
  balance: number;
  isSimulated: boolean;
};

export interface SessionProtocolSettings {
  isSaveSettingsEnabled: boolean;
  isAutoRefreshEnabled: boolean;
  refreshInterval: string;
  refreshUnit: 'min' | 'hour';
  cumulativeProfit: number;
  cumulativeLoss: number;
  sessionCount: number;
  isDailyTargetEnabled: boolean;
  dailyTargetAmount: string;
}

export interface HistoricalAnalysisResult {
  totalSamples: number;
  discoveredPatterns: DiscoveredPattern[];
  lastDiscoveryEpoch: number;
}

export type SavedToken = {
  label: string;
  token: string;
  mode: 'pat' | 'api';
};

export interface DerivContextType {
  authState: AuthState;
  markets: MarketSymbol[];
  currentTicks: Tick[];
  history: TradeHistoryItem[];
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  strategyType: StrategyType;
  setStrategyType: (type: StrategyType) => void;
  strategyParams: StrategyParams;
  setStrategyParams: (params: Partial<StrategyParams>) => void;
  executionSettings: ExecutionSettings;
  setExecutionSettings: (settings: Partial<ExecutionSettings>) => void;
  sessionProtocol: SessionProtocolSettings;
  setSessionProtocol: (settings: Partial<SessionProtocolSettings>) => void;
  login: (token: string, mode: 'pat' | 'api', remember?: boolean) => Promise<void>;
  adminLogin: (email: string, pass: string) => boolean;
  logout: () => void;
  placeTrade: (params: any) => Promise<void>;
  clearHistory: () => void;
  isAutoTrading: boolean;
  isBotEnabled: boolean;
  setIsBotEnabled: (enabled: boolean) => void;
  isHunterEnabled: boolean;
  setIsHunterEnabled: (enabled: boolean) => void;
  isMonitoring: boolean;
  setIsMonitoring: (enabled: boolean) => void;
  stopBotSession: () => void;
  switchAccount: (index: number) => void;
  isInitializing: boolean;
  isAuthorizing: boolean;
  overrides: BalanceOverride[];
  updateOverride: (override: BalanceOverride) => void;
  deleteOverride: (id: string) => void;
  dynamicPayout: number | null;
  dynamicOverPayout: number | null;
  dynamicUnderPayout: number | null;
  dynamicOverPayouts: Record<number, number>;
  dynamicUnderPayouts: Record<number, number>;
  fetchProposal: (type: string, barrier?: number) => void;
  terminalMessage: any;
  setTerminalMessage: (msg: any) => void;
  acknowledgeTerminalMessage: () => void;
  sessionStartingBalance: null;
  sessionStartTime: null;
  currentMartingaleLevel: number;
  isWaitingForSignal: boolean;
  activeRobotId: RobotId;
  setActiveRobotId: (id: RobotId) => void;
  matchedDigits: number[];
  protocolStatus: { message?: string; splitProgress?: string };
  isConnected: boolean;
  isReconnecting: boolean;
  networkGlitch: boolean;
  aiGaps: { over: number[]; under: number[] };
  refreshCountdown: number | null;
  fetchHistoricalData: (count: number) => void;
  historicalAnalysis: HistoricalAnalysisResult | null;
  isAnalyzingDex: boolean;
  isMonitoringDex: boolean;
  setIsMonitoringDex: (val: boolean) => void;
  highestPeakValue: number;
  resetDexPeak: () => void;
  addUpStep: number;
  magicSignal: { type: string, text: string } | null;
  savedTokens: SavedToken[];
  removeSavedToken: (token: string) => void;
}
