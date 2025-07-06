export type StockInfo = [string, string, string, string, number];

export interface StocksResponse {
  items: {
    [symbol: string]: StockInfo; // map with symbol as key
  };
}
