import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { DefaultNavbar } from '../components/Navbar/DefaultNavbar';
import type { FinancialMetrics } from '../types/FinancialAnalysis';

const StockAnalysisPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table');

  useEffect(() => {
    if (symbol) {
      fetchFinancialMetrics();
    }
  }, [symbol]);

  const fetchFinancialMetrics = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:8082/api/get_metrics/${symbol}/3`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMetrics(response.data as FinancialMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      setError('Failed to load financial analysis');
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

  const formatPercentage = (percentage: number | string) => {
    const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    if (isNaN(num)) return 'N/A';
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
  };

  const formatValue = (value: string | number, isPercentage: boolean = false, isCurrency: boolean = false) => {
    if (value === null || value === undefined || value === 'nan' || value === 'N/A') return 'N/A';
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'N/A';
    
    if (isCurrency) return formatCurrency(num);
    if (isPercentage) return formatPercentage(num);
    return num.toLocaleString();
  };

  const prepareChartData = () => {
    if (!metrics) return { revenueData: [], profitabilityData: [], cagrData: [] };
    
    // Revenue and key metrics chart data
    const revenueData: any[] = [];
    const years = Object.keys(metrics.statementMetrics.Revenue || {}).sort();
    
    years.forEach(year => {
      const revenue = parseFloat(metrics.statementMetrics.Revenue?.[year] || '0') / 1e9;
      const income = parseFloat(metrics.statementMetrics.Income?.[year] || '0') / 1e9;
      const freeCashflow = parseFloat(metrics.statementMetrics.FreeCashflow?.[year] || '0') / 1e9;
      
      revenueData.push({
        year: year.split('-')[0],
        revenue,
        income,
        freeCashflow,
      });
    });
    
    // Profitability metrics chart data
    const profitabilityData: any[] = [];
    years.forEach(year => {
      const grossMargin = parseFloat(metrics.profitability['Gross Margin (%)']?.[year] || '0');
      const operatingMargin = parseFloat(metrics.profitability['Operating Margin (%)']?.[year] || '0');
      const netMargin = parseFloat(metrics.profitability['Net Profit Margin (%)']?.[year] || '0');
      
      profitabilityData.push({
        year: year.split('-')[0],
        grossMargin,
        operatingMargin,
        netMargin,
      });
    });
    
    // CAGR data for bar chart
    const cagrData = Object.entries(metrics.cagrData)
      .filter(([_, value]) => value !== null && !isNaN(value as number))
      .map(([key, value]) => ({
        metric: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()),
        value: value as number,
        color: (value as number) >= 0 ? '#10B981' : '#EF4444'
      }));
    
    return { revenueData, profitabilityData, cagrData };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <DefaultNavbar />
        <div className="pt-20 flex justify-center items-center h-64">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading financial analysis...</p>
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

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
      <DefaultNavbar />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 flex-1 mr-4">
            <h1 className="text-3xl font-bold text-white">
              {symbol} Financial Analysis
            </h1>
            <p className="text-lg text-white/70 mt-1">
              Comprehensive Financial Metrics & Trends
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

        {/* Tab Navigation */}
        <div className="flex mb-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-2">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex-1 px-6 py-3 font-medium transition duration-200 rounded-lg ${
              activeTab === 'table'
                ? 'text-white bg-white/20 border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            📊 Financial Data Tables
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`flex-1 px-6 py-3 font-medium transition duration-200 rounded-lg ${
              activeTab === 'charts'
                ? 'text-white bg-white/20 border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            📈 Charts & Trends
          </button>
        </div>

        {activeTab === 'table' && (
          <div className="space-y-8">
            {/* CAGR Summary */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">CAGR (Compound Annual Growth Rate)</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(metrics?.cagrData || {})
                  .filter(([_, value]) => value !== null)
                  .map(([key, value]) => (
                    <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white/70 text-sm capitalize mb-2">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                      </p>
                      <p className={`text-xl font-bold ${
                        (value as number) >= 0 ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {formatPercentage(value as number)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Financial Metrics Tables */}
            {[
              { name: 'Liquidity Metrics', data: metrics?.liquidity, isPercentage: true },
              { name: 'Leverage Metrics', data: metrics?.leverage, isPercentage: true },
              { name: 'Profitability Metrics', data: metrics?.profitability, isPercentage: true },
              { name: 'Efficiency Metrics', data: metrics?.efficiency, isPercentage: false },
              { name: 'Statement Metrics', data: metrics?.statementMetrics, isCurrency: true }
            ].map((category) => (
              <div key={category.name} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-semibold">Metric</th>
                        {Object.keys(metrics?.statementMetrics?.Revenue || {})
                          .sort()
                          .reverse()
                          .map(year => (
                            <th key={year} className="px-6 py-4 text-left text-white font-semibold">
                              {year.split('-')[0]}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(category.data || {}).map(([metric, yearData]) => (
                        <tr key={metric} className="border-b border-white/10 hover:bg-white/5">
                          <td className="px-6 py-4 text-white/90 font-medium">
                            {metric.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}
                          </td>
                          {Object.keys(metrics?.statementMetrics?.Revenue || {})
                            .sort()
                            .reverse()
                            .map(year => (
                              <td key={year} className="px-6 py-4 text-white">
                                {formatValue(
                                  (yearData as Record<string, string>)[year], 
                                  category.isPercentage, 
                                  category.isCurrency
                                )}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
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
                  <BarChart data={chartData.cagrData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="value" stroke="rgba(255,255,255,0.7)" />
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
  );
};

export default StockAnalysisPage;
