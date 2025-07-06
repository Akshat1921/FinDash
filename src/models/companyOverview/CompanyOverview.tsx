import type { BalanceSheetEntry } from "./BalanceSheet";
import type { CashFlowEntry } from "./Cashflow";
import type { IncomeStatementEntry } from "./IncomeStatement";

export interface CompanyInfo {
  address1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  industry: string;
  industryKey: string;
  industryDisp: string;
  sector: string;
  sectorKey: string;
  sectorDisp: string;
  longBusinessSummary: string;
  fullTimeEmployees: number;
  symbol: string;
  shortName: string;
  longName: string;
  exchange: string;
  typeDisp: string;
  displayName: string;
  irWebsite: string;
}

export interface QuoteInfo {
  currentPrice: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  previousClose: number;
  bid: number;
  bidSize: number;
  ask: number;
  askSize: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPrice: number;
  regularMarketDayRange: string;
  regularMarketVolume: number;
  regularMarketTime: number;
  postMarketPrice: number;
  postMarketTime: number;
  postMarketChange: number;
  postMarketChangePercent: number;
  marketState: string;
}

export interface ValuationMetrics {
  marketCap: number;
  enterpriseValue: number;
  trailingPE: number;
  forwardPE: number;
  priceToBook: number;
  priceToSalesTrailing12Months: number;
  enterpriseToRevenue: number;
  enterpriseToEbitda: number;
  trailingPegRatio: number;
}

export interface DividendInfo {
  dividendRate: number;
  dividendYield: number;
  exDividendDate: number;
  payoutRatio: number;
  fiveYearAvgDividendYield: number;
  trailingAnnualDividendRate: number;
  trailingAnnualDividendYield: number;
  lastDividendValue: number;
  lastDividendDate: number;
  dividendDate: number;
}

export interface MarketStats {
  volume: number;
  averageVolume: number;
  averageVolume10days: number;
  averageDailyVolume10Day: number;
  averageDailyVolume3Month: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekRange: string;
  fiftyTwoWeekLowChange: number;
  fiftyTwoWeekLowChangePercent: number;
  fiftyTwoWeekHighChange: number;
  fiftyTwoWeekHighChangePercent: number;
  fiftyTwoWeekChange: number;
  fiftyTwoWeekChangePercent: number;
  twoHundredDayAverage: number;
  fiftyDayAverage: number;
  twoHundredDayAverageChange: number;
  twoHundredDayAverageChangePercent: number;
  fiftyDayAverageChange: number;
  fiftyDayAverageChangePercent: number;
}

export interface GovernanceInfo {
  auditRisk: number;
  boardRisk: number;
  compensationRisk: number;
  shareHolderRightsRisk: number;
  overallRisk: number;
  governanceEpochDate: number;
  compensationAsOfEpochDate: number;
}

export interface FinancialInfo {
  ebitda: number;
  totalRevenue: number;
  grossProfits: number;
  netIncomeToCommon: number;
  earningsGrowth: number;
  revenueGrowth: number;
  freeCashflow: number;
  operatingCashflow: number;
  totalCash: number;
  totalCashPerShare: number;
  totalDebt: number;
  bookValue: number;
  debtToEquity: number;
  returnOnAssets: number;
  returnOnEquity: number;
  profitMargins: number;
  grossMargins: number;
  ebitdaMargins: number;
  operatingMargins: number;
  currentRatio: number;
  quickRatio: number;
}

export interface AnalystRatings {
  targetHighPrice: number;
  targetLowPrice: number;
  targetMeanPrice: number;
  targetMedianPrice: number;
  recommendationMean: number;
  recommendationKey: string;
  numberOfAnalystOpinions: number;
  averageAnalystRating: string;
}

export interface MetaInfo {
  currency: string;
  financialCurrency: string;
  region: string;
  language: string;
  quoteSourceName: string;
  quoteType: string;
  exchangeTimezoneName: string;
  exchangeTimezoneShortName: string;
  gmtOffSetMilliseconds: number;
  market: string;
  messageBoardId: string;
  lastSplitFactor: string;
  lastSplitDate: number;
  firstTradeDateMilliseconds: number;
  earningsTimestamp: number;
  earningsTimestampStart: number;
  earningsTimestampEnd: number;
  earningsCallTimestampStart: number;
  earningsCallTimestampEnd: number;
  isEarningsDateEstimate: boolean;
  earningsQuarterlyGrowth: number;
  epsTrailingTwelveMonths: number;
  epsForward: number;
  epsCurrentYear: number;
  priceEpsCurrentYear: number;
}

export interface CompanyOverview {
  companyInfo: CompanyInfo;
  quoteInfo: QuoteInfo;
  valuationMetrics: ValuationMetrics;
  dividendInfo: DividendInfo;
  marketStats: MarketStats;
  governance: GovernanceInfo;
  financials: FinancialInfo;
  analystRatings: AnalystRatings;
  meta: MetaInfo;
  
}

export interface ComapanyFinancials{
  companyOverview: CompanyOverview;
  balanceSheets: BalanceSheetEntry[];
  cashflow: CashFlowEntry[];
  incomeStatements: IncomeStatementEntry[];
}
