export interface FinancialMetrics {
  ticker: string;
  liquidity: {
    [key: string]: {
      [year: string]: string;
    };
  };
  leverage: {
    [key: string]: {
      [year: string]: string;
    };
  };
  profitability: {
    [key: string]: {
      [year: string]: string;
    };
  };
  efficiency: {
    [key: string]: {
      [year: string]: string;
    };
  };
  statementMetrics: {
    [key: string]: {
      [year: string]: string;
    };
  };
  cagrData: {
    [key: string]: number | null;
  };
}

export interface ChartDataPoint {
  year: string;
  value: number;
  category: string;
}

export interface TableRow {
  metric: string;
  category: string;
  [year: string]: string | number;
}
