import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { DefaultNavbar } from '../components/Navbar/DefaultNavbar';

interface StockAnalysis {
  stockSymbol: string;
  companyName: string;
  currentPrice: number;
  purchasePrice: number;
  quantity: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  purchaseDate: string;
  marketCap: number;
  peRatio: number;
  eps: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  priceChange: number;
  priceChangePercentage: number;
}

const StockAnalysisPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [analysis, setAnalysis] = useState<StockAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (symbol) {
      fetchStockAnalysis();
    }
  }, [symbol]);

  const fetchStockAnalysis = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8090/api/stocks/analysis/${symbol}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAnalysis(response.data as StockAnalysis);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stock analysis:', error);
      setError('Failed to load stock analysis');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <DefaultNavbar />
        <div className="pt-20 flex justify-center items-center h-64">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading stock analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <DefaultNavbar />
        <div className="pt-20 text-center">
          <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-8 border border-red-400/30 max-w-md mx-auto">
            <p className="text-red-300 text-xl mb-4">{error}</p>
            <Link to="/portfolio" className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg border border-white/20 transition duration-200">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
      <DefaultNavbar />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 flex-1 mr-4">
            <h1 className="text-3xl font-bold text-white">
              {analysis?.stockSymbol} Analysis
            </h1>
            <p className="text-lg text-white/70 mt-1">
              {analysis?.companyName}
            </p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 backdrop-blur-sm transition duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>
        </div>

        {/* Stock Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Performance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Your Position</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">Quantity Owned</span>
                <span className="font-medium text-white">{analysis?.quantity}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">Purchase Price</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.purchasePrice || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">Current Price</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.currentPrice || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">Total Value</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.totalValue || 0)}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">Profit/Loss</span>
                <div className="text-right">
                  <div className={`font-medium ${
                    (analysis?.profitLoss || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {formatCurrency(analysis?.profitLoss || 0)}
                  </div>
                  <div className={`text-sm ${
                    (analysis?.profitLossPercentage || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {formatPercentage(analysis?.profitLossPercentage || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Data */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Market Data</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">Market Cap</span>
                <span className="font-medium text-white">
                  {analysis?.marketCap ? formatCurrency(analysis.marketCap) : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">P/E Ratio</span>
                <span className="font-medium text-white">
                  {analysis?.peRatio || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">EPS</span>
                <span className="font-medium text-white">
                  {analysis?.eps ? formatCurrency(analysis.eps) : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="text-white/70">Volume</span>
                <span className="font-medium text-white">
                  {analysis?.volume ? formatNumber(analysis.volume) : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">Day's Change</span>
                <div className="text-right">
                  <div className={`font-medium ${
                    (analysis?.priceChange || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {formatCurrency(analysis?.priceChange || 0)}
                  </div>
                  <div className={`text-sm ${
                    (analysis?.priceChangePercentage || 0) >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {formatPercentage(analysis?.priceChangePercentage || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Ranges */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Price Ranges</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Today's Range</h3>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">Low</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.dayLow || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">High</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.dayHigh || 0)}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">52-Week Range</h3>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">Low</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.yearLow || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/70">High</span>
                <span className="font-medium text-white">
                  {formatCurrency(analysis?.yearHigh || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Actions</h2>
          
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/stocks/${symbol}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/30 backdrop-blur-sm transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Company Details
            </Link>
            
            <button className="inline-flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg border border-green-500/30 backdrop-blur-sm transition duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buy More
            </button>
            
            <button className="inline-flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 backdrop-blur-sm transition duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Sell Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAnalysisPage;
