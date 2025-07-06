// Field lists for CompanyOverview tables

export const companyInfoFields = [
    "address", // combined field
    "phone","website","industry","industryKey","industryDisp","sector","sectorKey","sectorDisp","longBusinessSummary","fullTimeEmployees","symbol","shortName","longName","exchange","typeDisp","displayName","irWebsite"
];

export const quoteInfoFields = [
    "currentPrice","open","dayLow","dayHigh","previousClose","bid","bidSize","ask","askSize","regularMarketChange","regularMarketChangePercent","regularMarketPrice","regularMarketDayRange","regularMarketVolume","regularMarketTime","postMarketPrice","postMarketTime","postMarketChange","postMarketChangePercent","marketState"
];

export const valuationMetricsFields = [
    "marketCap","enterpriseValue","trailingPE","forwardPE","priceToBook","priceToSalesTrailing12Months","enterpriseToRevenue","enterpriseToEbitda","trailingPegRatio"
];

export const dividendInfoFields = [
    "dividendRate","dividendYield","exDividendDate","payoutRatio","fiveYearAvgDividendYield","trailingAnnualDividendRate","trailingAnnualDividendYield","lastDividendValue","lastDividendDate","dividendDate"
];

export const marketStatsFields = [
    "volume","averageVolume","averageVolume10days","averageDailyVolume10Day","averageDailyVolume3Month","fiftyTwoWeekLow","fiftyTwoWeekHigh","fiftyTwoWeekRange","fiftyTwoWeekLowChange","fiftyTwoWeekLowChangePercent","fiftyTwoWeekHighChange","fiftyTwoWeekHighChangePercent","fiftyTwoWeekChange","fiftyTwoWeekChangePercent","twoHundredDayAverage","fiftyDayAverage","twoHundredDayAverageChange","twoHundredDayAverageChangePercent","fiftyDayAverageChange","fiftyDayAverageChangePercent"
];

export const governanceFields = [
    "auditRisk","boardRisk","compensationRisk","shareHolderRightsRisk","overallRisk","governanceEpochDate","compensationAsOfEpochDate"
];

export const financialsFields = [
    "ebitda","totalRevenue","grossProfits","netIncomeToCommon","earningsGrowth","revenueGrowth","freeCashflow","operatingCashflow","totalCash","totalCashPerShare","totalDebt","bookValue","debtToEquity","returnOnAssets","returnOnEquity","profitMargins","grossMargins","ebitdaMargins","operatingMargins","currentRatio","quickRatio"
];

export const analystRatingsFields = [
    "targetHighPrice","targetLowPrice","targetMeanPrice","targetMedianPrice","recommendationMean","recommendationKey","numberOfAnalystOpinions","averageAnalystRating"
];

export const metaFields = [
    "currency","financialCurrency","region","language","quoteSourceName","quoteType","exchangeTimezoneName","exchangeTimezoneShortName","gmtOffSetMilliseconds","market","messageBoardId","lastSplitFactor","lastSplitDate","firstTradeDateMilliseconds","earningsTimestamp","earningsTimestampStart","earningsTimestampEnd","earningsCallTimestampStart","earningsCallTimestampEnd","isEarningsDateEstimate","earningsQuarterlyGrowth","epsTrailingTwelveMonths","epsForward","epsCurrentYear","priceEpsCurrentYear"
];


export const balanceSheet = [
  "Treasury Shares Number",
  "Ordinary Shares Number",
  "Share Issued",
  "Net Debt",
  "Total Debt",
  "Tangible Book Value",
  "Invested Capital",
  "Working Capital",
  "Net Tangible Assets",
  "Capital Lease Obligations",
  "Common Stock Equity",
  "Total Capitalization",
  "Total Equity Gross Minority Interest",
  "Stockholders Equity",
  "Gains Losses Not Affecting Retained Earnings",
  "Other Equity Adjustments",
  "Treasury Stock",
  "Retained Earnings",
  "Additional Paid In Capital",
  "Capital Stock",
  "Common Stock",
  "Preferred Stock",
  "Total Liabilities Net Minority Interest",
  "Total Non Current Liabilities Net Minority Interest",
  "Other Non Current Liabilities",
  "Employee Benefits",
  "Tradeand Other Payables Non Current",
  "Non Current Deferred Liabilities",
  "Non Current Deferred Revenue",
  "Non Current Deferred Taxes Liabilities",
  "Long Term Debt And Capital Lease Obligation",
  "Long Term Capital Lease Obligation",
  "Long Term Debt",
  "Current Liabilities",
  "Other Current Liabilities",
  "Current Deferred Liabilities",
  "Current Deferred Revenue",
  "Current Debt And Capital Lease Obligation",
  "Current Capital Lease Obligation",
  "Current Debt",
  "Other Current Borrowings",
  "Current Provisions",
  "Payables And Accrued Expenses",
  "Current Accrued Expenses",
  "Interest Payable",
  "Payables",
  "Total Tax Payable",
  "Accounts Payable",
  "Total Assets",
  "Total Non Current Assets",
  "Other Non Current Assets",
  "Non Current Prepaid Assets",
  "Non Current Deferred Assets",
  "Non Current Deferred Taxes Assets",
  "Non Current Accounts Receivable",
  "Investments And Advances",
  "Other Investments",
  "Investmentin Financial Assets",
  "Available For Sale Securities",
  "Goodwill And Other Intangible Assets",
  "Other Intangible Assets",
  "Goodwill",
  "Net PPE",
  "Accumulated Depreciation",
  "Gross PPE",
  "Leases",
  "Construction In Progress",
  "Other Properties",
  "Machinery Furniture Equipment",
  "Buildings And Improvements",
  "Land And Improvements",
  "Properties",
  "Current Assets",
  "Other Current Assets",
  "Prepaid Assets",
  "Inventory",
  "Finished Goods",
  "Work In Process",
  "Raw Materials",
  "Receivables",
  "Accounts Receivable",
  "Allowance For Doubtful Accounts Receivable",
  "Gross Accounts Receivable",
  "Cash Cash Equivalents And Short Term Investments",
  "Other Short Term Investments",
  "Cash And Cash Equivalents"
];

export const incomeStatement = [
  "Tax Effect Of Unusual Items",
  "Tax Rate For Calcs",
  "Normalized EBITDA",
  "Total Unusual Items",
  "Total Unusual Items Excluding Goodwill",
  "Net Income From Continuing Operation Net Minority Interest",
  "Reconciled Depreciation",
  "Reconciled Cost Of Revenue",
  "EBITDA",
  "EBIT",
  "Net Interest Income",
  "Interest Expense",
  "Interest Income",
  "Normalized Income",
  "Net Income From Continuing And Discontinued Operation",
  "Total Expenses",
  "Total Operating Income As Reported",
  "Diluted Average Shares",
  "Basic Average Shares",
  "Diluted EPS",
  "Basic EPS",
  "Diluted NI Availto Com Stockholders",
  "Net Income Common Stockholders",
  "Net Income",
  "Net Income Including Noncontrolling Interests",
  "Net Income Continuous Operations",
  "Tax Provision",
  "Pretax Income",
  "Other Income Expense",
  "Other Non Operating Income Expenses",
  "Special Income Charges",
  "Restructuring And Mergern Acquisition",
  "Net Non Operating Interest Income Expense",
  "Interest Expense Non Operating",
  "Interest Income Non Operating",
  "Operating Income",
  "Operating Expense",
  "Research And Development",
  "Selling General And Administration",
  "Gross Profit",
  "Cost Of Revenue",
  "Total Revenue",
  "Operating Revenue"
];

export const cashflow = [
  "Free Cash Flow",
  "Repurchase Of Capital Stock",
  "Repayment Of Debt",
  "Issuance Of Debt",
  "Capital Expenditure",
  "Interest Paid Supplemental Data",
  "Income Tax Paid Supplemental Data",
  "End Cash Position",
  "Beginning Cash Position",
  "Changes In Cash",
  "Financing Cash Flow",
  "Cash Flow From Continuing Financing Activities",
  "Net Other Financing Charges",
  "Proceeds From Stock Option Exercised",
  "Cash Dividends Paid",
  "Common Stock Dividend Paid",
  "Net Common Stock Issuance",
  "Common Stock Payments",
  "Net Issuance Payments Of Debt",
  "Net Long Term Debt Issuance",
  "Long Term Debt Payments",
  "Long Term Debt Issuance",
  "Investing Cash Flow",
  "Cash Flow From Continuing Investing Activities",
  "Net Other Investing Changes",
  "Net Investment Purchase And Sale",
  "Sale Of Investment",
  "Purchase Of Investment",
  "Net Business Purchase And Sale",
  "Purchase Of Business",
  "Net PPE Purchase And Sale",
  "Purchase Of PPE",
  "Capital Expenditure Reported",
  "Operating Cash Flow",
  "Cash Flow From Continuing Operating Activities",
  "Change In Working Capital",
  "Change In Other Working Capital",
  "Change In Other Current Liabilities",
  "Change In Payables And Accrued Expense",
  "Change In Accrued Expense",
  "Change In Payable",
  "Change In Account Payable",
  "Change In Prepaid Assets",
  "Change In Inventory",
  "Change In Receivables",
  "Changes In Account Receivables",
  "Other Non Cash Items",
  "Stock Based Compensation",
  "Deferred Tax",
  "Deferred Income Tax",
  "Depreciation Amortization Depletion",
  "Depreciation And Amortization",
  "Amortization Cash Flow",
  "Amortization Of Intangibles",
  "Depreciation",
  "Operating Gains Losses",
  "Gain Loss On Investment Securities",
  "Net Income From Continuing Operations"
];
