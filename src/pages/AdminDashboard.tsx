import React, { useState, useEffect } from 'react';
import { AdminPortfolios, AdminStocks, AdminPerformance, AdminNavbar } from '../components/Admin';
import { AdminUsers } from '../components/Admin/AdminUsers';
import { AdminAPI } from '../api/AdminAPI';

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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'portfolios' | 'stocks' | 'performance' | 'users'>('portfolios');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadPortfolios(),
        loadStocks(),
        loadPerformanceMetrics()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please check if you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolios = async () => {
    try {
      const response = await AdminAPI.getAllPortfolios();
      setPortfolios(response.portfolios);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      throw error;
    }
  };

  const loadStocks = async () => {
    try {
      const response = await AdminAPI.getAllStocks();
      setStocks(response.stocks);
    } catch (error) {
      console.error('Error loading stocks:', error);
      throw error;
    }
  };

  const loadPerformanceMetrics = async () => {
    try {
      const metrics = await AdminAPI.getPerformanceMetrics();
      setPerformance(metrics);
    } catch (error) {
      console.error('Error loading performance metrics:', error);
      throw error;
    }
  };

  const handlePortfolioDelete = async (portfolioId: number) => {
    try {
      await AdminAPI.deletePortfolio(portfolioId);
      setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
      setStocks(prev => prev.filter(s => s.portfolio.id !== portfolioId));
      // Reload performance metrics after deletion
      loadPerformanceMetrics();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      alert('Failed to delete portfolio. Please try again.');
    }
  };

  const handleStockDelete = async (stockId: number) => {
    try {
      await AdminAPI.deleteStock(stockId);
      setStocks(prev => prev.filter(s => s.id !== stockId));
      // Reload portfolios and performance metrics after stock deletion
      loadPortfolios();
      loadPerformanceMetrics();
    } catch (error) {
      console.error('Error deleting stock:', error);
      alert('Failed to delete stock. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-8 border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-300 mx-auto mb-4"></div>
          <p className="text-lg text-white font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 text-center max-w-md border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Access Error</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black hover:bg-gray-900 text-slate-300 px-6 py-2 rounded-lg font-medium transition-all duration-200 border border-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      <div className="p-5 pb-0 flex-shrink-0">
        <AdminNavbar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex-1 m-4 mt-2 flex flex-col overflow-hidden">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-4 flex flex-col h-full overflow-hidden shadow-xl">
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'portfolios' && (
              <AdminPortfolios 
                portfolios={portfolios}
                onDelete={handlePortfolioDelete}
                onRefresh={loadPortfolios}
              />
            )}
            
            {activeTab === 'stocks' && (
              <AdminStocks 
                stocks={stocks}
                portfolios={portfolios}
                onDelete={handleStockDelete}
                onRefresh={loadStocks}
              />
            )}
            
            {activeTab === 'performance' && (
              <AdminPerformance 
                metrics={performance}
                onRefresh={loadPerformanceMetrics}
              />
            )}
            
            {activeTab === 'users' && (
              <AdminUsers 
                onRefresh={loadDashboardData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


