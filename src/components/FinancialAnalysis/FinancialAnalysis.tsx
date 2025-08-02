import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import type { FinancialMetrics, ChartDataPoint, TableRow } from '../../types/FinancialAnalysis';

interface FinancialAnalysisProps {
  symbol: string;
  onClose: () => void;
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ symbol, onClose }) => {
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table');

  useEffect(() => {
    fetchFinancialMetrics();
  }, [symbol]);

  const fetchFinancialMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8082/api/get_metrics/${symbol}/3`);
      setMetrics(response.data as FinancialMetrics);
      setError('');
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      setError('Failed to load financial analysis data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatPercentage = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    return `${num.toFixed(2)}%`;
  };

  const formatValue = (value: string | number, isPercentage: boolean = false, isCurrency: boolean = false) => {
    if (value === null || value === undefined || value === 'nan') return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    
    if (isCurrency) return formatCurrency(num);
    if (isPercentage) return formatPercentage(num);
    return num.toLocaleString();
  };

  const prepareTableData = (): TableRow[] => {
    if (!metrics) return [];
    
    const rows: TableRow[] = [];
    
    // Process each category
    const categories = [
      { name: 'Liquidity', data: metrics.liquidity, isPercentage: true },
      { name: 'Leverage', data: metrics.leverage, isPercentage: true },
      { name: 'Profitability', data: metrics.profitability, isPercentage: true },
      { name: 'Efficiency', data: metrics.efficiency, isPercentage: false },
      { name: 'Statement Metrics', data: metrics.statementMetrics, isCurrency: true }
    ];
    
    categories.forEach(category => {
      Object.entries(category.data).forEach(([metric, yearData]) => {
        const row: TableRow = {
          metric,
          category: category.name,
        };
        
        Object.entries(yearData as Record<string, string>).forEach(([year, value]) => {
          row[year] = formatValue(value, category.isPercentage, category.isCurrency);
        });
        
        rows.push(row);
      });
    });
    
    return rows;
  };

  const prepareChartData = () => {
    if (!metrics) return { revenueData: [], profitabilityData: [], cagrData: [] };
    
    // Revenue and key metrics chart data
    const revenueData: ChartDataPoint[] = [];
    const years = Object.keys(metrics.statementMetrics.Revenue || {}).sort();
    
    years.forEach(year => {
      const revenue = parseFloat(metrics.statementMetrics.Revenue?.[year] || '0') / 1e9; // Convert to billions
      const income = parseFloat(metrics.statementMetrics.Income?.[year] || '0') / 1e9;
      const freeCashflow = parseFloat(metrics.statementMetrics.FreeCashflow?.[year] || '0') / 1e9;
      
      revenueData.push({
        year,
        revenue,
        income,
        freeCashflow,
      } as any);
    });
    
    // Profitability metrics chart data
    const profitabilityData: ChartDataPoint[] = [];
    years.forEach(year => {
      const grossMargin = parseFloat(metrics.profitability['Gross Margin (%)']?.[year] || '0');
      const operatingMargin = parseFloat(metrics.profitability['Operating Margin (%)']?.[year] || '0');
      const netMargin = parseFloat(metrics.profitability['Net Profit Margin (%)']?.[year] || '0');
      
      profitabilityData.push({
        year,
        grossMargin,
        operatingMargin,
        netMargin,
      } as any);
    });
    
    // CAGR data for bar chart
    const cagrData = Object.entries(metrics.cagrData)
      .filter(([_, value]) => value !== null && !isNaN(value as number))
      .map(([key, value]) => ({
        metric: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: value as number,
        color: (value as number) >= 0 ? '#10B981' : '#EF4444'
      }));
    
    return { revenueData, profitabilityData, cagrData };
  };

  const tableData = prepareTableData();
  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading financial analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center max-w-md">
          <p className="text-red-300 text-xl mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-500/20 via-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Financial Analysis</h2>
            <p className="text-white/70">{symbol} - Comprehensive Financial Metrics</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/20 bg-white/5">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-6 py-3 font-medium transition duration-200 ${
              activeTab === 'table'
                ? 'text-white border-b-2 border-blue-400 bg-white/10'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            📊 Data Tables
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-6 py-3 font-medium transition duration-200 ${
              activeTab === 'charts'
                ? 'text-white border-b-2 border-blue-400 bg-white/10'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            📈 Charts & Trends
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'table' && (
            <div className="space-y-6">
              {/* CAGR Summary */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">CAGR (Compound Annual Growth Rate)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(metrics?.cagrData || {})
                    .filter(([_, value]) => value !== null)
                    .map(([key, value]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/70 text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className={`text-lg font-semibold ${
                          (value as number) >= 0 ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {formatPercentage(value as number)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Financial Metrics Table */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <div className="p-4 border-b border-white/20">
                  <h3 className="text-xl font-semibold text-white">Financial Metrics by Year</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-white font-semibold">Category</th>
                        <th className="px-4 py-3 text-left text-white font-semibold">Metric</th>
                        {Object.keys(metrics?.statementMetrics?.Revenue || {})
                          .sort()
                          .reverse()
                          .map(year => (
                            <th key={year} className="px-4 py-3 text-left text-white font-semibold">
                              {year.split('-')[0]}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="px-4 py-3 text-white/80 font-medium">{row.category}</td>
                          <td className="px-4 py-3 text-white/90">
                            {row.metric.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                          </td>
                          {Object.keys(metrics?.statementMetrics?.Revenue || {})
                            .sort()
                            .reverse()
                            .map(year => (
                              <td key={year} className="px-4 py-3 text-white">
                                {row[year] || 'N/A'}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'charts' && (
            <div className="space-y-8">
              {/* Revenue and Key Metrics Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Revenue, Income & Free Cash Flow (Billions)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} name="Revenue" />
                      <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Net Income" />
                      <Line type="monotone" dataKey="freeCashflow" stroke="#F59E0B" strokeWidth={2} name="Free Cash Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Profitability Margins Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">Profitability Margins (%)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.profitabilityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.7)" />
                      <YAxis stroke="rgba(255,255,255,0.7)" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="grossMargin" stroke="#8B5CF6" strokeWidth={2} name="Gross Margin" />
                      <Line type="monotone" dataKey="operatingMargin" stroke="#06B6D4" strokeWidth={2} name="Operating Margin" />
                      <Line type="monotone" dataKey="netMargin" stroke="#EC4899" strokeWidth={2} name="Net Margin" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CAGR Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-4">CAGR by Metric (%)</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.cagrData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
                      <YAxis dataKey="metric" type="category" stroke="rgba(255,255,255,0.7)" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;
