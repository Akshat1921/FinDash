import React from 'react';
import type { PerformanceMetrics } from '../../pages/AdminDashboard';

interface AdminPerformanceProps {
  metrics: PerformanceMetrics | null;
  onRefresh: () => void;
}

export const AdminPerformance: React.FC<AdminPerformanceProps> = ({ metrics, onRefresh }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading performance metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
        <div className="flex gap-3">
          <button 
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-500/30 backdrop-blur-sm flex items-center gap-2" 
            onClick={onRefresh}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">💼</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Total Portfolios</h3>
              <p className="text-2xl font-bold text-white">{metrics.totalPortfolios}</p>
              <span className="text-xs text-white/50">Active portfolios</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📈</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Total Stocks</h3>
              <p className="text-2xl font-bold text-white">{metrics.totalStocks}</p>
              <span className="text-xs text-white/50">Individual holdings</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">💰</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Total Value</h3>
              <p className="text-2xl font-bold text-green-300">{formatCurrency(metrics.totalValue)}</p>
              <span className="text-xs text-white/50">Combined portfolio value</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📊</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Total P&L</h3>
              <p className={`text-2xl font-bold ${metrics.totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {formatCurrency(metrics.totalGainLoss)}
              </p>
              <span className="text-xs text-white/50">Overall profit/loss</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📈</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Average Portfolio</h3>
              <p className="text-2xl font-bold text-blue-300">{formatCurrency(metrics.averagePortfolioValue)}</p>
              <span className="text-xs text-white/50">Per portfolio average</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">🏆</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Top Performer</h3>
              <p className="text-lg font-bold text-green-300 truncate">{metrics.topPerformingStock}</p>
              <span className="text-xs text-white/50">Best performing stock</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📉</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Worst Performer</h3>
              <p className="text-lg font-bold text-red-300 truncate">{metrics.worstPerformingStock}</p>
              <span className="text-xs text-white/50">Underperforming stock</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className="text-3xl">👤</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/70 mb-1">Most Active User</h3>
              <p className="text-lg font-bold text-white truncate">{metrics.mostActiveUser}</p>
              <span className="text-xs text-white/50">User with most stocks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Portfolio Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 text-sm font-semibold text-white/70">Metric</th>
                  <th className="text-left py-3 text-sm font-semibold text-white/70">Value</th>
                  <th className="text-left py-3 text-sm font-semibold text-white/70">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-white/10">
                  <td className="py-3 text-white/80">Total Return</td>
                  <td className="py-3 text-white font-mono">{formatCurrency(metrics.totalGainLoss)}</td>
                  <td className={`py-3 font-medium ${metrics.totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {metrics.totalGainLoss >= 0 ? '📈 Positive' : '📉 Negative'}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 text-white/80">Return Rate</td>
                  <td className="py-3 text-white font-mono">{((metrics.totalGainLoss / (metrics.totalValue - metrics.totalGainLoss)) * 100).toFixed(2)}%</td>
                  <td className={`py-3 font-medium ${metrics.totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {metrics.totalGainLoss >= 0 ? '🟢 Good' : '🔴 Poor'}
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 text-white/80">Diversification</td>
                  <td className="py-3 text-white font-mono">{metrics.totalStocks} stocks</td>
                  <td className="py-3 text-yellow-300 font-medium">⚖️ Moderate</td>
                </tr>
                <tr>
                  <td className="py-3 text-white/80">Average Portfolio Size</td>
                  <td className="py-3 text-white font-mono">{(metrics.totalStocks / metrics.totalPortfolios).toFixed(1)} stocks</td>
                  <td className="py-3 text-blue-300 font-medium">📊 Balanced</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Portfolio Count:</span>
              <span className="text-white font-medium">{metrics.totalPortfolios} active</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Stock Holdings:</span>
              <span className="text-white font-medium">{metrics.totalStocks} positions</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Market Exposure:</span>
              <span className="text-green-300 font-medium">{formatCurrency(metrics.totalValue)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/70">Overall Performance:</span>
              <span className={`font-medium ${metrics.totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {metrics.totalGainLoss >= 0 ? '🟢 Profitable' : '🔴 Loss'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Admin Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button 
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-blue-500/30 flex items-center justify-center gap-2" 
            onClick={onRefresh}
          >
            🔄 Refresh Data
          </button>
          <button className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-green-500/30 flex items-center justify-center gap-2">
            📊 Export Report
          </button>
          <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-purple-500/30 flex items-center justify-center gap-2">
            📧 Send Summary
          </button>
          <button className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-orange-500/30 flex items-center justify-center gap-2">
            📈 View Details
          </button>
        </div>
      </div>
    </div>
  );
};
