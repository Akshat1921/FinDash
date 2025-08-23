import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debugToken, getAuthToken, isTokenValid } from '../utils/auth';

interface PortfolioStatus {
  hasPortfolio: boolean;
  canAddStocks: boolean;
  portfolioId?: number;
  totalValue?: string;
  gainLoss?: string;
  gainLossPercentage?: string;
  stockCount?: number;
  message: string;
  buttonText: string;
}

const DashboardPage: React.FC = () => {
  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolioStatus();
  }, []);

  const fetchPortfolioStatus = async () => {
    try {
      const token = getAuthToken();
      console.log('=== DASHBOARD DEBUG ===');
      debugToken(); // Debug the JWT token
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      if (!isTokenValid(token)) {
        setError('Invalid or expired token. Please log in again.');
        return;
      }

      console.log('Making request to:', 'http://localhost:8090/main/portfolio-status');
      const response = await axios.get('http://localhost:8090/main/portfolio-status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Portfolio status response:', response.data);
      setPortfolioStatus(response.data as PortfolioStatus);
    } catch (error: any) {
      console.error('Error fetching portfolio status:', error);
      
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data);
        console.error('Status code:', error.response.status);
        
        if (error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Optionally redirect to login
          // window.location.href = '/login';
        } else if (error.response.status === 403) {
          setError('Access denied. Please check your permissions.');
        } else {
          setError(`Server error: ${error.response.data?.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.request);
        setError('Network error. Please check if the server is running on port 8090.');
      } else {
        setError('Failed to load portfolio status');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount || 0);
  };

  const formatPercentage = (percentage: string) => {
    return `${parseFloat(percentage) >= 0 ? '+' : ''}${parseFloat(percentage).toFixed(2)}%`;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-8 border border-white/20">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-slate-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-300 font-medium">Loading Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-white/10 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center m-0">
              <h1 className="text-xl font-medium text-slate-300">FinDash</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login';
                }}
                className="inline-flex items-center px-4 py-2 bg-black hover:bg-gray-900 text-slate-300 font-medium rounded-lg transition-all duration-200 border border-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Your Financial Dashboard
          </h2>
          <p className="text-lg text-white/80">
            {portfolioStatus?.hasPortfolio
              ? "Track and analyze your investment portfolio with comprehensive financial data"
              : "Create your first portfolio to start tracking your investments"
            }
          </p>
          {error && (
            <p className="text-red-300 mt-2">{error}</p>
          )}
        </div>

        {/* Portfolio Status Card */}
        {portfolioStatus && (
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Portfolio Status
              </h3>
              <p className="text-lg text-white/80 mb-6">
                {portfolioStatus.message}
              </p>

              {portfolioStatus.hasPortfolio ? (
                // Existing User - Show Portfolio Summary
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4 hover:bg-white/15 transition-all duration-200 border border-white/20">
                    <h4 className="text-lg font-semibold text-blue-300">Total Value</h4>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(portfolioStatus.totalValue || '0')}
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4 hover:bg-white/15 transition-all duration-200 border border-white/20">
                    <h4 className={`text-lg font-semibold ${
                      parseFloat(portfolioStatus.gainLoss || '0') >= 0
                        ? 'text-green-300'
                        : 'text-red-300'
                    }`}>Gain/Loss</h4>
                    <p className={`text-2xl font-bold ${
                      parseFloat(portfolioStatus.gainLoss || '0') >= 0
                        ? 'text-green-300'
                        : 'text-red-300'
                    }`}>
                      {formatCurrency(portfolioStatus.gainLoss || '0')}
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4 hover:bg-white/15 transition-all duration-200 border border-white/20">
                    <h4 className={`text-lg font-semibold ${
                      parseFloat(portfolioStatus.gainLossPercentage || '0') >= 0
                        ? 'text-green-300'
                        : 'text-red-300'
                    }`}>Percentage</h4>
                    <p className={`text-2xl font-bold ${
                      parseFloat(portfolioStatus.gainLossPercentage || '0') >= 0
                        ? 'text-green-300'
                        : 'text-red-300'
                    }`}>
                      {formatPercentage(portfolioStatus.gainLossPercentage || "0")}
                    </p>
                  </div>
                  <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg p-4 hover:bg-white/15 transition-all duration-200 border border-white/20">
                    <h4 className="text-lg font-semibold text-purple-300">Total Stocks</h4>
                    <p className="text-2xl font-bold text-white">
                      {portfolioStatus.stockCount || 0}
                    </p>
                  </div>
                </div>
              ) : (
                // First-Time User - Show Welcome Message
                <div className="backdrop-blur-xl bg-white/5 rounded-2xl shadow-lg p-8 mb-6 border border-white/20">
                  <h4 className="text-xl font-semibold text-blue-300 mb-4">
                    🚀 Start Your Investment Journey
                  </h4>
                  <p className="text-white/80 mb-4">
                    Create your first portfolio to begin tracking your stock investments,
                    monitor performance, and analyze your financial growth.
                  </p>
                </div>
              )}

              <Link
                to={portfolioStatus.hasPortfolio ? "/stocks?portfolio=true" : "/stocks"}
                className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 border border-gray-800 text-lg"
              >
                <p className='text-slate-300'>{portfolioStatus.buttonText}</p>
                
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Stock Search Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white ml-3">Stock Search</h3>
            </div>
            <p className="text-white/80 mb-4">
              Search and analyze individual stocks with detailed financial information
            </p>
            <Link
              to="/stocks"
              className="inline-flex items-center px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 border border-gray-800"
            >
              <p className='text-slate-300'>Browse Stocks</p>
            </Link>
          </div>

          {/* Portfolio Management Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <svg
                  className="w-6 h-6 text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white ml-3">
                Portfolio Management
              </h3>
            </div>

            <p className="text-white/80 mb-4">
              {portfolioStatus?.hasPortfolio
                ? "Manage your investment portfolio and track performance"
                : "Create your first portfolio to start tracking investments"}
            </p>

            <div className="space-y-2">
              {portfolioStatus?.hasPortfolio ? (
                <Link
                  to="/stocks?portfolio=true"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 border border-gray-800"
                >
                  <p className='text-slate-300'>{portfolioStatus.buttonText}</p>
                </Link>
              ) : (
                <div className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-900/50 text-gray-500 font-medium rounded-lg border border-gray-700/50 cursor-not-allowed">
                  <p className='text-slate-300'>Portfolio Creation Disabled</p>
                </div>
              )}

              {portfolioStatus?.hasPortfolio && (
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 border border-gray-800"
                >
                  <p className='text-slate-300'>View Portfolio Details</p>
                </Link>
              )}
            </div>
          </div>

          {/* Market Insights Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white ml-3">Market Insights</h3>
            </div>
            <p className="text-white/80 mb-4">
              Stay updated with latest market trends and financial insights
            </p>
            
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 border border-gray-800"
                >
                  <p className='text-slate-300'>Coming soon</p>
                </Link>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-lg border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/stocks"
              className="flex items-center p-4 bg-gray-900/60 hover:bg-gray-800/80 rounded-2xl transition-all duration-200 border border-gray-700"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-white">Search Stocks</h4>
                <p className="text-sm text-slate-300">Find and analyze stock information</p>
              </div>
            </Link>

            {portfolioStatus?.hasPortfolio ? (
              <Link
                to="/portfolio"
                className="flex items-center p-4 bg-gray-900/60 hover:bg-gray-800/80 rounded-2xl transition-all duration-200 border border-gray-700"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-white">View Portfolio</h4>
                  <p className="text-sm text-slate-300">Review your investments and performance</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center p-4 bg-gray-900/40 rounded-2xl border border-gray-700/50 opacity-60 cursor-not-allowed">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-500/20 border border-gray-500/30">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-400">
                    Portfolio Creation Disabled
                  </h4>
                  <p className="text-sm text-gray-400/70">
                    Portfolio creation functionality has been removed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
