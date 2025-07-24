import React, { useState } from 'react';
import type { Portfolio } from '../../pages/AdminDashboard';

interface AdminPortfoliosProps {
  portfolios: Portfolio[];
  onDelete: (portfolioId: number) => void;
  onRefresh: () => void;
}

export const AdminPortfolios: React.FC<AdminPortfoliosProps> = ({ 
  portfolios, 
  onDelete, 
  onRefresh 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleDelete = (portfolioId: number) => {
    onDelete(portfolioId);
    setShowDeleteConfirm(null);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatPercentage = (value: string) => {
    const num = parseFloat(value);
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <h2 className="text-white text-2xl font-semibold drop-shadow-lg">Portfolio Management</h2>
        <button 
          onClick={onRefresh}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Total Portfolios</h3>
          <p className="text-white text-3xl font-bold drop-shadow-lg">{portfolios.length}</p>
        </div>
        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Total Value</h3>
          <p className="text-white text-3xl font-bold drop-shadow-lg">
            {formatCurrency(portfolios.reduce((sum, p) => sum + parseFloat(p.totalValue), 0).toString())}
          </p>
        </div>
        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Total Gain/Loss</h3>
          <p className={`text-3xl font-bold drop-shadow-lg ${portfolios.reduce((sum, p) => sum + parseFloat(p.gainLoss), 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(portfolios.reduce((sum, p) => sum + parseFloat(p.gainLoss), 0).toString())}
          </p>
        </div>
        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
          <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">Average Value</h3>
          <p className="text-white text-3xl font-bold drop-shadow-lg">
            {formatCurrency((portfolios.reduce((sum, p) => sum + parseFloat(p.totalValue), 0) / portfolios.length || 0).toString())}
          </p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 shadow-xl">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">ID</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">User</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">Email</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">Total Value</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">Gain/Loss</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">Percentage</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">Stocks</th>
              <th className="px-6 py-4 text-left text-white font-semibold text-sm uppercase tracking-wide border-b border-white/10">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio) => (
              <tr key={portfolio.id} className="hover:bg-white/5 transition-all duration-300">
                <td className="px-6 py-4 text-white/90 border-b border-white/5">{portfolio.id}</td>
                <td className="px-6 py-4 text-white/90 border-b border-white/5">{portfolio.user?.fullName || 'N/A'}</td>
                <td className="px-6 py-4 text-white/90 border-b border-white/5">{portfolio.user?.email || 'N/A'}</td>
                <td className="px-6 py-4 text-white/90 border-b border-white/5">{formatCurrency(portfolio.totalValue)}</td>
                <td className={`px-6 py-4 border-b border-white/5 font-semibold ${parseFloat(portfolio.gainLoss) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(portfolio.gainLoss)}
                </td>
                <td className={`px-6 py-4 border-b border-white/5 font-semibold ${parseFloat(portfolio.gainLossPercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(portfolio.gainLossPercentage)}
                </td>
                <td className="px-6 py-4 text-white/90 border-b border-white/5">{portfolio.userStocks?.length || 0}</td>
                <td className="px-6 py-4 border-b border-white/5">
                  <button 
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium"
                    onClick={() => setShowDeleteConfirm(portfolio.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {portfolios.length === 0 && (
        <div className="text-center py-10 text-white/70 text-lg">
          <p>No portfolios found.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-xl p-8 max-w-md w-full mx-4 border border-white/30 shadow-2xl">
            <h3 className="text-gray-800 text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Are you sure you want to delete this portfolio? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                onClick={() => handleDelete(showDeleteConfirm)}
              >
                Yes, Delete
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
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
