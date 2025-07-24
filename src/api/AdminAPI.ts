// AdminAPI.ts - Real API calls for admin dashboard
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090';

// Get auth token from localStorage or your auth context
const getAuthToken = () => {
  return localStorage.getItem('jwt') || localStorage.getItem('authToken') || '';
};

// Configure axios with default headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Portfolio {
  id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
  };
  totalValue: string;
  gainLoss: string;
  gainLossPercentage: string;
  userStocks: Stock[];
}

export interface Stock {
  id: number;
  portfolio: {
    id: number;
    user: {
      fullName: string;
    };
  };
  ticker: string;
  companyName: string;
  quantity: string;
  purchasePrice: string;
  currentPrice: string;
  profitLoss: string;
  purchaseDate: string;
}

export interface PerformanceMetrics {
  totalPortfolios: number;
  totalStocks: number;
  totalValue: number;
  totalGainLoss: number;
  averagePortfolioValue: number;
  topPerformingStock: string;
  worstPerformingStock: string;
  mostActiveUser: string;
}

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  hasPortfolio: boolean;
  portfolio?: {
    id: number;
    totalValue: string;
    stockCount: number;
  };
}

export class AdminAPI {
  
  // Get all portfolios (Admin only)
  static async getAllPortfolios(): Promise<{
    portfolios: Portfolio[];
    totalCount: number;
    totalValue: number;
    totalGainLoss: number;
    averageValue: number;
  }> {
    try {
      const response = await api.get('/main/admin/portfolios');
      return response.data as {
        portfolios: Portfolio[];
        totalCount: number;
        totalValue: number;
        totalGainLoss: number;
        averageValue: number;
      };
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      throw error;
    }
  }

  // Get all stocks from all portfolios (Admin only)
  static async getAllStocks(): Promise<{
    stocks: Stock[];
    totalCount: number;
    totalValue: number;
    totalProfitLoss: number;
    uniqueTickers: number;
  }> {
    try {
      const response = await api.get('/main/admin/stocks');
      return response.data as {
        stocks: Stock[];
        totalCount: number;
        totalValue: number;
        totalProfitLoss: number;
        uniqueTickers: number;
      };
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error;
    }
  }

  // Get performance metrics (Admin only)
  static async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await api.get('/main/admin/performance');
      return response.data as PerformanceMetrics;
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  // Delete portfolio (Admin only)
  static async deletePortfolio(portfolioId: number): Promise<void> {
    try {
      await api.delete(`/main/admin/portfolios/${portfolioId}`);
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }

  // Delete stock (Admin only)
  static async deleteStock(stockId: number): Promise<void> {
    try {
      await api.delete(`/main/admin/stocks/${stockId}`);
    } catch (error) {
      console.error('Error deleting stock:', error);
      throw error;
    }
  }

  // Get all users (Admin only)
  static async getAllUsers(): Promise<{
    users: AdminUser[];
    totalCount: number;
    usersWithPortfolios: number;
    adminUsers: number;
    regularUsers: number;
  }> {
    try {
      const response = await api.get('/main/admin/users');
      return response.data as {
        users: AdminUser[];
        totalCount: number;
        usersWithPortfolios: number;
        adminUsers: number;
        regularUsers: number;
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}

// Usage Example:
/*
// In your AdminDashboard component, replace the fake API calls with:

const loadPortfolios = async () => {
  try {
    const portfolios = await AdminAPI.getAllPortfolios();
    setPortfolios(portfolios);
  } catch (error) {
    console.error('Failed to load portfolios:', error);
    // Handle error (show toast, etc.)
  }
};

const loadStocks = async () => {
  try {
    const stocks = await AdminAPI.getAllStocks();
    setStocks(stocks);
  } catch (error) {
    console.error('Failed to load stocks:', error);
    // Handle error
  }
};

const loadPerformanceMetrics = async () => {
  try {
    const metrics = await AdminAPI.getPerformanceMetrics();
    setPerformance(metrics);
  } catch (error) {
    console.error('Failed to load performance metrics:', error);
    // Handle error
  }
};

const handlePortfolioUpdate = async (portfolioId: number, updatedData: Partial<Portfolio>) => {
  try {
    const updatedPortfolio = await AdminAPI.updatePortfolio(portfolioId, updatedData);
    setPortfolios(prev => 
      prev.map(p => p.id === portfolioId ? updatedPortfolio : p)
    );
  } catch (error) {
    console.error('Failed to update portfolio:', error);
    // Handle error
  }
};

const handlePortfolioDelete = async (portfolioId: number) => {
  try {
    await AdminAPI.deletePortfolio(portfolioId);
    setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
    setStocks(prev => prev.filter(s => s.portfolioId !== portfolioId));
  } catch (error) {
    console.error('Failed to delete portfolio:', error);
    // Handle error
  }
};
*/
