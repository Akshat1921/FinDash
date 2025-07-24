import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const DefaultNavbar: React.FC = () => {
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

  return (
    <nav className="bg-white/10 backdrop-blur-lg fixed w-full z-20 top-0 left-0 border-b border-white/20 shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white">FinDash</span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-white/80 hover:text-white
                         px-3 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Dashboard
              </Link>
              <button 
                type="button" 
                onClick={handleAuthAction}
                className="text-white bg-red-500/30 hover:bg-red-500/40 backdrop-blur-sm border border-red-400/50 shadow-lg
                         font-semibold rounded-lg text-sm px-4 py-2 text-center transition duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login"
                className="text-white hover:text-white/80
                         px-3 py-2 rounded-md text-sm font-semibold transition duration-200"
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className="text-white bg-blue-500/30 hover:bg-blue-500/40 backdrop-blur-sm border border-blue-400/50 shadow-lg
                         font-semibold rounded-lg text-sm px-4 py-2 text-center transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};