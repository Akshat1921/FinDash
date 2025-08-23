import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DefaultNavbar } from '../components/Navbar/DefaultNavbar';
import { usePortfolio } from '../context/PortfolioContext';

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const CartPage: React.FC = () => {
  const { selectedStocks, removeStock, clearSelections, updateStock } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = (stockSymbol: string, quantity: number) => {
    if (quantity < 1) return;
    updateStock(stockSymbol, { quantity });
  };

  const handleDateChange = (stockSymbol: string, purchaseDate: string) => {
    updateStock(stockSymbol, { purchaseDate });
  };

  const handleSaveAllToPortfolio = async () => {
    if (selectedStocks.length === 0) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Save all stocks to portfolio
      const savePromises = selectedStocks.map(stock => {
        const stockDto = {
          ticker: stock.stockSymbol.toUpperCase(),
          companyName: stock.companyName,
          quantity: stock.quantity.toString(),
          purchaseDate: stock.purchaseDate
        };

        return axios.post<ApiResponse>(
          'http://localhost:8090/main/add-stock',
          stockDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      });

      const results = await Promise.allSettled(savePromises);
      
      // Check for any failures
      const failures = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.data.success)
      );

      if (failures.length === 0) {
        setSuccess(`Successfully added ${selectedStocks.length} stocks to your portfolio!`);
        clearSelections();
        
        // Navigate to portfolio page after delay
        setTimeout(() => {
          navigate('/portfolio');
        }, 2000);
      } else {
        throw new Error(`Failed to add ${failures.length} out of ${selectedStocks.length} stocks`);
      }
    } catch (error: any) {
      console.error('Error saving stocks to portfolio:', error);
      setError(error.message || 'Failed to save stocks to portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (selectedStocks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <DefaultNavbar />
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-8 text-center shadow-xl">
            <svg className="mx-auto h-16 w-16 text-white/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 1.8M7 13l1.8-1.8m4.4 4.4a.9.9 0 11-1.8 0 .9.9 0 011.8 0zm6.2 0a.9.9 0 11-1.8 0 .9.9 0 011.8 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h1>
            <p className="text-white/70 mb-6">
              Add some stocks to your cart from the stocks page to get started.
            </p>
            <Link
              to="/stocks?portfolio=true"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-900 text-slate-300 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-800 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Browse Stocks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <DefaultNavbar />
      
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        {/* Cart Header */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Stock Cart</h1>
              <p className="text-white/70">
                Review and modify your selected stocks before adding them to your portfolio
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{selectedStocks.length}</p>
              <p className="text-white/70 text-sm">stocks selected</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 backdrop-blur-xl bg-red-500/10 rounded-2xl border border-red-400/30 shadow-xl">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 backdrop-blur-xl bg-green-500/10 rounded-2xl border border-green-400/30 shadow-xl">
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Cart Items */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Selected Stocks</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/20">
              <thead className="backdrop-blur-xl bg-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/80 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/20">
                {selectedStocks.map((stock) => (
                  <tr key={stock.stockSymbol} className="hover:bg-white/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {stock.stockSymbol}
                        </div>
                        <div className="text-sm text-white/80">
                          {stock.companyName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={stock.quantity}
                        onChange={(e) => handleQuantityChange(stock.stockSymbol, parseInt(e.target.value) || 1)}
                        className="w-20 px-2 py-1 backdrop-blur-xl bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={stock.purchaseDate}
                        onChange={(e) => handleDateChange(stock.stockSymbol, e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="px-2 py-1 backdrop-blur-xl bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => removeStock(stock.stockSymbol)}
                        className="inline-flex items-center px-3 py-1 rounded-md transition-all duration-200 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between">
          <div className="flex gap-4">
            <Link
              to="/stocks?portfolio=true"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-900 text-slate-300 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-800 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add More Stocks
            </Link>
            
            <button
              onClick={clearSelections}
              className="inline-flex items-center px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-400/30 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          </div>

          <button
            onClick={handleSaveAllToPortfolio}
            disabled={loading || selectedStocks.length === 0}
            className="inline-flex items-center px-8 py-3 bg-green-500/10 hover:bg-green-500/20 disabled:bg-gray-900/50 text-green-300 disabled:text-slate-500 rounded-lg transition-all duration-200 backdrop-blur-sm border border-green-400/30 font-semibold disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-300 mr-2"></div>
                Saving to Portfolio...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save All to Portfolio ({selectedStocks.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
