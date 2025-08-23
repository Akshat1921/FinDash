import React, { useState } from 'react';
import type { Stock, Portfolio } from '../../pages/AdminDashboard';

interface AdminStocksProps {
  stocks: Stock[];
  portfolios: Portfolio[];
  onDelete: (stockId: number) => void;
  onRefresh: () => void;
}

export const AdminStocks: React.FC<AdminStocksProps> = ({ 
  stocks, 
  portfolios, 
  onDelete, 
  onRefresh 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [filterPortfolio, setFilterPortfolio] = useState<string>('all');
  const [searchTicker, setSearchTicker] = useState<string>('');

  const handleDelete = (stockId: number) => {
    onDelete(stockId);
    setShowDeleteConfirm(null);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatPercentage = (stock: Stock) => {
    const purchase = parseFloat(stock.purchasePrice);
    const current = parseFloat(stock.currentPrice);
    const percentage = ((current - purchase) / purchase) * 100;
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  // Filter stocks based on selected filters
  const filteredStocks = stocks.filter(stock => {
    const matchesPortfolio = filterPortfolio === 'all' || stock.portfolio.id.toString() === filterPortfolio;
    const matchesTicker = searchTicker === '' || stock.ticker.toLowerCase().includes(searchTicker.toLowerCase());
    return matchesPortfolio && matchesTicker;
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <h2 className="text-white text-2xl font-semibold drop-shadow-lg">Stock Management</h2>
        <button 
          onClick={onRefresh}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Total Stocks</h3>
          <p className="text-white text-3xl font-bold drop-shadow-lg">{stocks.length}</p>
        </div>
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Total Value</h3>
          <p className="text-white text-3xl font-bold drop-shadow-lg">
            {formatCurrency(
              stocks.reduce((sum, s) => sum + (parseFloat(s.currentPrice) * parseFloat(s.quantity)), 0).toString()
            )}
          </p>
        </div>
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Total P&L</h3>
          <p className={`text-3xl font-bold drop-shadow-lg ${stocks.reduce((sum, s) => sum + parseFloat(s.profitLoss), 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(stocks.reduce((sum, s) => sum + parseFloat(s.profitLoss), 0).toString())}
          </p>
        </div>
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 shadow-xl">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Unique Tickers</h3>
          <p className="text-white text-3xl font-bold drop-shadow-lg">{new Set(stocks.map(s => s.ticker)).size}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-5 mb-5 border border-white/20 shadow-xl flex gap-5 items-end flex-wrap">
        <div className="flex flex-col gap-1">
          <label htmlFor="portfolio-filter" className="text-white/80 text-sm font-medium">Portfolio:</label>
          <select 
            id="portfolio-filter"
            value={filterPortfolio} 
            onChange={(e) => setFilterPortfolio(e.target.value)}
            className="backdrop-blur-xl bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300"
          >
            <option value="all" className="bg-gray-800 text-white">All Portfolios</option>
            {portfolios.map(portfolio => (
              <option key={portfolio.id} value={portfolio.id.toString()} className="bg-gray-800 text-white">
                {portfolio.user.fullName} (ID: {portfolio.id})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="ticker-search" className="text-white/80 text-sm font-medium">Search Ticker:</label>
          <input
            id="ticker-search"
            type="text"
            value={searchTicker}
            onChange={(e) => setSearchTicker(e.target.value)}
            placeholder="Enter ticker symbol..."
            className="backdrop-blur-xl bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all duration-300 placeholder-white/50 w-48"
          />
        </div>

        <button 
          className="bg-black hover:bg-gray-900 border border-white/20 text-slate-300 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium h-fit"
          onClick={() => {
            setFilterPortfolio('all');
            setSearchTicker('');
          }}
        >
          🗑️ Clear Filters
        </button>
      </div>

      <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="backdrop-blur-xl bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Portfolio Owner</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Ticker</th>
                <th className="px-6 py-4 text-center text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Company</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Quantity</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Purchase Price</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Current Price</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">P&L</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">% Change</th>
                <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Purchase Date</th>
                <th className="px-6 py-4 pr-8 text-center text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.map((stock) => (
                <tr key={stock.id} className="hover:bg-white/5 transition-all duration-300">
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{stock.id}</td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{stock.portfolio?.user?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 font-mono font-bold whitespace-nowrap">
                    {stock.ticker}
                  </td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{stock.companyName}</td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{stock.quantity}</td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{formatCurrency(stock.purchasePrice)}</td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{formatCurrency(stock.currentPrice)}</td>
                  <td className={`px-6 py-4 border-b border-white/5 font-semibold whitespace-nowrap ${parseFloat(stock.profitLoss) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(stock.profitLoss)}
                  </td>
                  <td className={`px-6 py-4 border-b border-white/5 font-semibold whitespace-nowrap ${parseFloat(stock.profitLoss) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(stock)}
                  </td>
                  <td className="px-6 py-4 text-white/90 border-b border-white/5 whitespace-nowrap">{stock.purchaseDate}</td>
                  <td className="px-6 py-4 pr-8 border-b border-white/5 whitespace-nowrap">
                    <button 
                      className="bg-red-600 hover:bg-red-700 border border-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-lg whitespace-nowrap"
                      onClick={() => setShowDeleteConfirm(stock.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStocks.length === 0 && (
        <div className="text-center py-10 text-white/70 text-lg">
          <p>No stocks found matching the current filters.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/30 shadow-2xl">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Are you sure you want to delete this stock? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
                onClick={() => handleDelete(showDeleteConfirm!)}
              >
                Yes, Delete
              </button>
              <button 
                className="bg-black hover:bg-gray-900 text-slate-300 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
