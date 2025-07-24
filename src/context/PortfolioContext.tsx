import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SelectedStock {
  stockSymbol: string;
  companyName: string;
  quantity: number;
  purchaseDate: string;
}

interface PortfolioContextType {
  selectedStocks: SelectedStock[];
  addStock: (stock: SelectedStock) => void;
  removeStock: (stockSymbol: string) => void;
  updateStock: (stockSymbol: string, updates: Partial<SelectedStock>) => void;
  clearSelections: () => void;
  isStockSelected: (stockSymbol: string) => boolean;
  getSelectedStock: (stockSymbol: string) => SelectedStock | undefined;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export const PortfolioProvider: React.FC<PortfolioProviderProps> = ({ children }) => {
  const [selectedStocks, setSelectedStocks] = useState<SelectedStock[]>([]);

  const addStock = (stock: SelectedStock) => {
    setSelectedStocks(prev => {
      const existingIndex = prev.findIndex(s => s.stockSymbol === stock.stockSymbol);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = stock;
        return updated;
      }
      return [...prev, stock];
    });
  };

  const removeStock = (stockSymbol: string) => {
    setSelectedStocks(prev => prev.filter(stock => stock.stockSymbol !== stockSymbol));
  };

  const updateStock = (stockSymbol: string, updates: Partial<SelectedStock>) => {
    setSelectedStocks(prev => 
      prev.map(stock => 
        stock.stockSymbol === stockSymbol 
          ? { ...stock, ...updates }
          : stock
      )
    );
  };

  const clearSelections = () => {
    setSelectedStocks([]);
  };

  const isStockSelected = (stockSymbol: string) => {
    return selectedStocks.some(stock => stock.stockSymbol === stockSymbol);
  };

  const getSelectedStock = (stockSymbol: string) => {
    return selectedStocks.find(stock => stock.stockSymbol === stockSymbol);
  };

  const value = {
    selectedStocks,
    addStock,
    removeStock,
    updateStock,
    clearSelections,
    isStockSelected,
    getSelectedStock
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
