// CompanyPageNavbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const CompanyPageNavbar: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authToken');

  const handleAuthAction = () => {
    if (isAuthenticated) {
      localStorage.removeItem('authToken');
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "balance-sheet", label: "Balance Sheet" },
    { key: "income-statement", label: "Income Statement" },
    { key: "cash-flow", label: "Cash Flow" }
  ];

  return (
    <nav className="bg-white/10 backdrop-blur-xl fixed w-full z-20 top-0 left-0 border-b border-white/20 shadow-2xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
            FinDash
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-white hover:text-purple-200 
                         px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Dashboard
              </Link>
              <button 
                type="button" 
                onClick={handleAuthAction}
                className="text-white bg-red-500/30 hover:bg-red-600/40 focus:ring-4 focus:outline-none focus:ring-red-300/50 
                         font-medium rounded-lg text-sm px-4 py-2 text-center backdrop-blur-sm border border-red-500/30 transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login"
                className="text-white hover:text-purple-200 
                         px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="text-white bg-purple-500/30 hover:bg-purple-600/40 focus:ring-4 focus:outline-none focus:ring-purple-300/50 
                         font-medium rounded-lg text-sm px-4 py-2 text-center backdrop-blur-sm border border-purple-500/30 transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-white/20 rounded-lg bg-white/10 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent backdrop-blur-sm">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={`block py-2 px-4 rounded-lg md:bg-transparent md:p-2 transition-all duration-200 ${
                    selectedTab === tab.key 
                      ? "text-white font-bold bg-white/20 backdrop-blur-sm border border-white/30" 
                      : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                  }`}
                  onClick={() => setSelectedTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CompanyPageNavbar;
