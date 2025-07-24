import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  activeTab: 'portfolios' | 'stocks' | 'performance' | 'users';
  onTabChange: (tab: 'portfolios' | 'stocks' | 'performance' | 'users') => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };
  
  return (
    <nav className="bg-white/15 backdrop-blur-lg rounded-2xl p-5 mb-5 border border-white/20">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <h1 className="text-white text-3xl font-bold drop-shadow-lg">Admin Dashboard</h1>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            🔄 Refresh
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
          >
            📤 Logout
          </button>
        </div>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <button 
          className={`px-6 py-3 rounded-full transition-all duration-300 font-medium flex items-center gap-2 ${
            activeTab === 'portfolios' 
              ? 'bg-white/25 border border-white/30 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
          }`}
          onClick={() => onTabChange('portfolios')}
        >
          <span>💼</span>
          Portfolios
        </button>
        
        <button 
          className={`px-6 py-3 rounded-full transition-all duration-300 font-medium flex items-center gap-2 ${
            activeTab === 'stocks' 
              ? 'bg-white/25 border border-white/30 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
          }`}
          onClick={() => onTabChange('stocks')}
        >
          <span>📈</span>
          All Stocks
        </button>
        
        <button 
          className={`px-6 py-3 rounded-full transition-all duration-300 font-medium flex items-center gap-2 ${
            activeTab === 'users' 
              ? 'bg-white/25 border border-white/30 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
          }`}
          onClick={() => onTabChange('users')}
        >
          <span>👥</span>
          Users
        </button>
        
        <button 
          className={`px-6 py-3 rounded-full transition-all duration-300 font-medium flex items-center gap-2 ${
            activeTab === 'performance' 
              ? 'bg-white/25 border border-white/30 text-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
          }`}
          onClick={() => onTabChange('performance')}
        >
          <span>📊</span>
          Performance
        </button>
      </div>
    </nav>
  );
};
