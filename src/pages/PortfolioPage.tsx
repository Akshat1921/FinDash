import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { DefaultNavbar } from '../components/Navbar/DefaultNavbar';

interface Stock {
  id: number;
  ticker: string; // Changed from stockSymbol to ticker to match backend
  companyName: string;
  quantity: string; // Changed to string to match backend
  purchasePrice: string; // Changed to string to match backend
  currentPrice: string; // Changed to string to match backend
  profitLoss: string; // Changed to string to match backend
  purchaseDate: string;
}

interface Portfolio {
  id: number;
  totalValue: string; // Changed to string to match backend
  gainLoss: string; // Changed to string to match backend
  gainLossPercentage: string; // Changed to string to match backend
  userStocks: Stock[]; // This will match the "userStocks" field in the API response
}

const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingStock, setRemovingStock] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8090/main/portfolio', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPortfolio(response.data as Portfolio);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to load portfolio');
      setLoading(false);
    }
  };

  const removeStock = async (ticker: string) => {
    if (!confirm(`Are you sure you want to remove ${ticker} from your portfolio?`)) {
      return;
    }

    setRemovingStock(ticker);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:8090/main/remove-stock', 
        { ticker },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if ((response.data as { success: boolean }).success) {
        // Refresh portfolio data
        await fetchPortfolio();
      } else {
        setError('Failed to remove stock: ' + (response.data as { error: string }).error);
      }
    } catch (error: any) {
      console.error('Error removing stock:', error);
      setError('Failed to remove stock: ' + (error.response?.data?.error || error.message));
    } finally {
      setRemovingStock(null);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount || 0);
  };

  const formatPercentage = (percentage: string | number) => {
    const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    return `${numPercentage >= 0 ? '+' : ''}${numPercentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <DefaultNavbar />
        <div className="pt-20 flex justify-center items-center h-64">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <DefaultNavbar />
        <div className="pt-20 text-center px-4 max-w-md mx-auto">
          <div className="bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/30 p-6">
            <p className="text-red-300 text-xl">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 text-white">
      <DefaultNavbar />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Portfolio Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">My Portfolio</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Total Value</h3>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(portfolio?.totalValue || '0')}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
              <h3 className={`text-lg font-semibold mb-2 ${
                parseFloat(portfolio?.gainLoss || '0') >= 0 
                  ? 'text-green-300' 
                  : 'text-red-300'
              }`}>
                Total Gain/Loss
              </h3>
              <p className={`text-2xl font-bold ${
                parseFloat(portfolio?.gainLoss || '0') >= 0 
                  ? 'text-green-300' 
                  : 'text-red-300'
              }`}>
                {formatCurrency(portfolio?.gainLoss || '0')}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-200">
              <h3 className={`text-lg font-semibold mb-2 ${
                parseFloat(portfolio?.gainLossPercentage || '0') >= 0 
                  ? 'text-green-300' 
                  : 'text-red-300'
              }`}>
                Total Return %
              </h3>
              <p className={`text-2xl font-bold ${
                parseFloat(portfolio?.gainLossPercentage || '0') >= 0 
                  ? 'text-green-300' 
                  : 'text-red-300'
              }`}>
                {formatPercentage(portfolio?.gainLossPercentage || '0')}
              </p>
            </div>
          </div>
        </div>

        {/* Add Stocks Button */}
        <div className="mb-6">
          <Link 
            to="/stocks?portfolio=true" 
            className="inline-flex items-center px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-white hover:text-white font-semibold rounded-lg transition-all duration-200 border border-red-400/50 backdrop-blur-sm shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add More Stocks
          </Link>
        </div>

        {/* Stocks List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Your Stocks</h2>
          </div>
          
          {portfolio?.userStocks && portfolio.userStocks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Purchase Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Gain/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-white/20">
                  {portfolio.userStocks.map((stock) => (
                    <tr key={stock.id} className="hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <Link 
                            to={`/stocks/${stock.ticker}`}
                            className="text-sm font-bold text-white bg-blue-500/20 px-2 py-1 rounded border border-blue-400/30 inline-block hover:bg-blue-500/30 transition-colors cursor-pointer"
                          >
                            {stock.ticker}
                          </Link>
                          <div className="text-sm text-white/80 mt-1">
                            {stock.companyName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {stock.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(parseFloat(stock.purchasePrice))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(parseFloat(stock.currentPrice))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {formatCurrency(parseFloat(stock.currentPrice) * parseFloat(stock.quantity))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          parseFloat(stock.profitLoss) >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {formatCurrency(parseFloat(stock.profitLoss))}
                        </span>
                        <div className={`text-xs ${
                          parseFloat(stock.profitLoss) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {/* Calculate percentage: (profitLoss / (purchasePrice * quantity)) * 100 */}
                          {formatPercentage(
                            (parseFloat(stock.profitLoss) / (parseFloat(stock.purchasePrice) * parseFloat(stock.quantity))) * 100
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/stocks/${stock.ticker}/analysis`}
                            className="inline-flex items-center px-3 py-1 rounded-md transition duration-200 bg-red-500/20 hover:bg-red-500/30 text-white hover:text-white"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            Analysis
                          </Link>
                          <button
                            onClick={() => removeStock(stock.ticker)}
                            disabled={removingStock === stock.ticker}
                            className={`inline-flex items-center px-3 py-1 rounded-md transition duration-200 ${
                              removingStock === stock.ticker
                                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                                : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200'
                            }`}
                          >
                            {removingStock === stock.ticker ? (
                              <>
                                <svg className="animate-spin w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Removing...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Remove
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No stocks in portfolio</h3>
              <p className="mt-1 text-sm text-white/70">
                Get started by adding your first stock to your portfolio.
              </p>
              <div className="mt-6">
                <Link
                  to="/stocks?portfolio=true"
                  className="inline-flex items-center px-6 py-3 border border-red-400/50 shadow-lg text-sm font-semibold rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white hover:text-white backdrop-blur-sm transition-all duration-200"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Stock
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
